import assert from 'node:assert/strict';
import { createServer, request, type Server } from 'node:http';
import { once } from 'node:events';
import { deflateSync } from 'node:zlib';
import { after, before, test } from 'node:test';
import { ApiError } from '@google/genai';
import { chapters } from '../src/game/story.ts';
import {
  createGeminiClassifier, createOpenAIClassifier, resolveDrawingProvider, createRecognitionMiddleware, MAX_BODY_BYTES,
  REQUEST_TIMEOUT_MS, validateModelResult, validatePng, isUnconfiguredApiKey,
  type ClassificationInput, type Classifier,
} from './recognition.ts';

// A real, tiny white PNG keeps validation tests independent of app assets.
function png(width = 8, height = 8) {
  function chunk(type: string, data: Buffer) {
    const bytes = Buffer.concat([Buffer.from(type), data]);
    let crc = 0xffffffff;
    for (const byte of bytes) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
    const result = Buffer.alloc(data.length + 12);
    result.writeUInt32BE(data.length);
    bytes.copy(result, 4);
    result.writeUInt32BE((crc ^ 0xffffffff) >>> 0, result.length - 4);
    return result;
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  const pixels = Buffer.alloc(8 * (1 + 8 * 4), 255);
  for (let y = 0; y < 8; y++) pixels[y * 33] = 0;
  return `data:image/png;base64,${Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header), chunk('IDAT', deflateSync(pixels)), chunk('IEND', Buffer.alloc(0)),
  ]).toString('base64')}`;
}

const chapter = chapters[0];
const choices = chapter.choices.map(({ id, object, label }) => ({ id, object, label }));
const validBody = { chapterId: chapter.id, image: png() };
let classifier: Classifier;
let calls: ClassificationInput[];
let server: Server;
let url: string;

before(async () => {
  const middleware = createRecognitionMiddleware({ classify: (input) => {
    calls.push(input);
    return classifier(input);
  } });
  server = createServer((req, res) => middleware(req, res, () => { res.writeHead(404); res.end(); }));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert(address && typeof address !== 'string');
  url = `http://127.0.0.1:${address.port}/api/recognize-drawing`;
});
after(() => new Promise<void>((resolve) => { server.closeAllConnections(); server.close(() => resolve()); }));

async function post(body: unknown = validBody, headers: Record<string, string> = {}) {
  return fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

test('API uses only authored chapter choices and validated PNG data', async () => {
  calls = [];
  classifier = async () => ({ choiceId: choices[0].id, confidence: 0.94 });
  const response = await post();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), { choiceId: choices[0].id, confidence: 0.94 });
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].choices, choices);
  assert.equal(calls[0].image, validBody.image.split(',')[1]);
});

test('low confidence and blank/unrecognized model results have no fallback', async () => {
  for (const output of [
    { choiceId: choices[0].id, confidence: 0.549 },
    { choiceId: null, confidence: 0 },
    { choiceId: null, confidence: 0.99 },
  ]) {
    classifier = async () => output;
    const response = await post();
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ...output, choiceId: null });
  }
  assert.deepEqual(validateModelResult({ choiceId: choices[0].id, confidence: 0.55 }, choices),
    { choiceId: choices[0].id, confidence: 0.55 });
});

test('malformed or client-selected inputs never reach the provider', async () => {
  calls = [];
  const invalidBodies = [
    '{', 'null', '[]', {}, { ...validBody, chapterId: 1 },
    { ...validBody, chapterId: 'missing' }, { ...validBody, choiceId: choices[0].id },
    { ...validBody, choices }, { ...validBody, image: 42 },
    { ...validBody, image: validBody.image.replace('image/png', 'image/jpeg') },
    { ...validBody, image: 'data:image/png;base64,aGVsbG8=' },
    { ...validBody, image: validBody.image.slice(0, -8) },
    { ...validBody, image: validBody.image + '\n' },
    { ...validBody, image: png(2049, 8) }, { ...validBody, image: png(8, 2049) },
    { ...validBody, image: png(0, 8) },
  ];
  for (const body of invalidBodies) {
    const response = await post(body);
    assert.equal(response.status, 400, JSON.stringify(body).slice(0, 80));
    const result = await response.json();
    assert.equal(result.code, 'INVALID_REQUEST');
    assert.equal(typeof result.error, 'string');
  }
  assert.equal(calls.length, 0);
});

test('PNG header format, boundaries, base64 and terminator are validated', () => {
  assert.equal(validatePng(validBody.image), validBody.image.split(',')[1]);
  for (const [offset, value] of [[0, 0], [24, 3], [25, 1], [26, 1], [27, 1], [28, 2]] as const) {
    const bytes = Buffer.from(validBody.image.split(',')[1], 'base64');
    bytes[offset] = value;
    assert.throws(() => validatePng(`data:image/png;base64,${bytes.toString('base64')}`));
  }
  assert.throws(() => validatePng('data:image/png;base64,===='));
  assert.throws(() => validatePng('data:image/png;base64,' + 'a'.repeat(MAX_BODY_BYTES)));
});

test('wrong method, media type and oversized content-length are JSON errors', async () => {
  calls = [];
  const get = await fetch(url);
  assert.equal(get.status, 405);
  assert.equal(get.headers.get('allow'), 'POST');
  assert.equal((await get.json()).code, 'METHOD_NOT_ALLOWED');
  const mediaHeaders: Record<string, string>[] = [{ 'Content-Type': 'text/plain' }, { 'Content-Encoding': 'gzip' }];
  for (const headers of mediaHeaders) {
    const response = await post(validBody, headers);
    assert.equal(response.status, 415);
    assert.equal((await response.json()).code, 'UNSUPPORTED_MEDIA_TYPE');
  }
  const response = await post(' '.repeat(MAX_BODY_BYTES + 1));
  assert.equal(response.status, 413);
  assert.equal((await response.json()).code, 'PAYLOAD_TOO_LARGE');
  assert.equal(calls.length, 0);
  assert.equal((await fetch(url.replace('/api/recognize-drawing', '/other'))).status, 404);
});

test('streamed bodies are capped without relying on Content-Length', async () => {
  const response = await new Promise<{ status: number; body: string }>((resolve, reject) => {
    const req = request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode!, body }));
    });
    req.on('error', reject);
    for (let i = 0; i < 33; i++) req.write(Buffer.alloc(65536, 32));
    req.end();
  });
  assert.equal(response.status, 413);
  assert.equal(JSON.parse(response.body).code, 'PAYLOAD_TOO_LARGE');
});

test('invalid provider responses and raw exceptions are sanitized', async () => {
  for (const output of [
    { choiceId: 'arbitrary-choice', confidence: 0.9 },
    { choiceId: choices[0].id, confidence: '0.9' },
    { choiceId: choices[0].id, confidence: -1 },
    { choiceId: choices[0].id, confidence: 1.1 },
    { choiceId: choices[0].id, confidence: NaN },
    { choiceId: choices[0].id, confidence: Infinity },
    { choiceId: choices[0].id, confidence: 0.9, extra: true },
    { confidence: 0.9 }, { choiceId: false, confidence: 0.9 }, null, [], 'not json',
  ]) {
    classifier = async () => output;
    const response = await post();
    assert.equal(response.status, 502);
    assert.equal((await response.json()).code, 'RECOGNITION_FAILED');
  }
  classifier = async () => { throw new Error('provider-url?key=private-test-value'); };
  const response = await post();
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), {
    error: 'Could not recognize the drawing. Please try again.', code: 'RECOGNITION_FAILED',
  });
});

test('SDK call is image-only with authored labels, constrained schema and no thinking', async () => {
  const signal = new AbortController().signal;
  const classify = createGeminiClassifier(async (params) => {
    assert.equal(params.model, 'gemini-2.5-flash');
    assert.deepEqual(params.contents, [{ role: 'user', parts: [
      { text: `Allowed objects: ${JSON.stringify(choices)}` },
      { inlineData: { mimeType: 'image/png', data: validBody.image.split(',')[1] } },
    ] }]);
    assert.equal(params.config?.temperature, 0);
    assert.deepEqual(params.config?.thinkingConfig, { thinkingBudget: 0 });
    assert.equal(params.config?.abortSignal, signal);
    assert.equal(params.config?.httpOptions?.timeout, REQUEST_TIMEOUT_MS);
    assert.deepEqual(params.config?.httpOptions?.retryOptions, { attempts: 1 });
    assert.equal(params.config?.responseMimeType, 'application/json');
    const schema = params.config?.responseJsonSchema as any;
    assert.deepEqual(schema.properties.choiceId.anyOf[0].enum, choices.map(({ id }) => id));
    assert.deepEqual(schema.properties.choiceId.anyOf[1], { type: 'null' });
    assert.equal(schema.additionalProperties, false);
    return { text: JSON.stringify({ choiceId: choices[0].id, confidence: 0.9 }) };
  }, 'gemini-2.5-flash');
  assert.deepEqual(await classify({ choices, image: validBody.image.split(',')[1], signal }),
    { choiceId: choices[0].id, confidence: 0.9 });
  const otherModel = createGeminiClassifier(async (params) => {
    assert.equal(params.config?.thinkingConfig, undefined);
    return { text: '{"choiceId":null,"confidence":0}' };
  }, 'gemini-2.5-pro');
  await otherModel({ choices, image: '', signal });
  const broken = createGeminiClassifier(async () => ({ text: 'not json' }), 'gemini-2.5-flash');
  await assert.rejects(broken({ choices, image: '', signal }));
});

test('provider auth, model, quota, config and service failures have safe actionable codes', async () => {
  const cases = [
    { providerStatus: 400, message: 'API key expired. Please renew the API key.', code: 'PROVIDER_AUTH_FAILED', status: 503 },
    { providerStatus: 400, message: 'API key not valid. Please pass a valid API key.', code: 'PROVIDER_AUTH_FAILED', status: 503 },
    { providerStatus: 400, message: 'API_KEY_INVALID', code: 'PROVIDER_AUTH_FAILED', status: 503 },
    { providerStatus: 401, message: 'Unauthenticated', code: 'PROVIDER_AUTH_FAILED', status: 503 },
    { providerStatus: 403, message: 'Permission denied', code: 'PROVIDER_AUTH_FAILED', status: 503 },
    { providerStatus: 404, message: 'This model is no longer available to new users.', code: 'MODEL_UNAVAILABLE', status: 503 },
    { providerStatus: 429, message: 'Your prepayment credits are depleted.', code: 'PROVIDER_QUOTA_EXCEEDED', status: 503 },
    { providerStatus: 429, message: 'Rate limit exceeded.', code: 'PROVIDER_QUOTA_EXCEEDED', status: 503 },
    { providerStatus: 400, message: 'Unsupported generation config.', code: 'PROVIDER_CONFIGURATION_ERROR', status: 503 },
    { providerStatus: 408, message: 'Timed out.', code: 'RECOGNITION_TIMEOUT', status: 504 },
    { providerStatus: 504, message: 'Deadline exceeded.', code: 'RECOGNITION_TIMEOUT', status: 504 },
    { providerStatus: 500, message: 'Internal server error.', code: 'PROVIDER_UNAVAILABLE', status: 503 },
    { providerStatus: 503, message: 'Overloaded.', code: 'PROVIDER_UNAVAILABLE', status: 503 },
  ];
  for (const entry of cases) {
    // Exercise the real SDK error shape via the injectable generateContent boundary.
    classifier = createGeminiClassifier(async () => {
      throw new ApiError({ status: entry.providerStatus, message: JSON.stringify({ error: {
        code: entry.providerStatus,
        message: `${entry.message} https://provider.invalid?key=private-test-value`,
      } }) });
    }, 'gemini-2.5-flash');
    const response = await post();
    assert.equal(response.status, entry.status);
    const result = await response.json();
    assert.equal(result.code, entry.code);
    assert.equal(typeof result.error, 'string');
    assert.deepEqual(Object.keys(result).sort(), ['code', 'error']);
    assert.doesNotMatch(JSON.stringify(result), /private-test-value|provider\.invalid|https?:|ApiError/);
  }
});

test('network and SDK timeouts remain distinct from provider configuration failures', async () => {
  const cases = [
    { error: new TypeError('fetch failed', { cause: Object.assign(new Error('DNS lookup failed'), { code: 'ENOTFOUND' }) }),
      status: 502, code: 'PROVIDER_NETWORK_ERROR' },
    { error: Object.assign(new Error('socket closed'), { code: 'ECONNRESET' }),
      status: 502, code: 'PROVIDER_NETWORK_ERROR' },
    { error: new Error('fetch failed', { cause: { code: 'UND_ERR_CONNECT_TIMEOUT' } }),
      status: 504, code: 'RECOGNITION_TIMEOUT' },
    { error: new DOMException('Request timed out', 'TimeoutError'), status: 504, code: 'RECOGNITION_TIMEOUT' },
    { error: new DOMException('Request aborted', 'AbortError'), status: 504, code: 'RECOGNITION_TIMEOUT' },
  ];
  for (const entry of cases) {
    classifier = async () => { throw entry.error; };
    const response = await post();
    assert.equal(response.status, entry.status);
    assert.equal((await response.json()).code, entry.code);
  }
});

test('common literal key placeholders are rejected without imposing a key format', () => {
  for (const key of [undefined, '', '  ', 'MY_GEMINI_API_KEY', 'your_api_key', '<YOUR-GEMINI-API-KEY>',
    'YOUR_OPENAI_API_KEY', 'MY_OPENAI_API_KEY', 'placeholder', 'changeme', 'replace_me', 'replace_with_your_api_key']) {
    assert.equal(isUnconfiguredApiKey(key), true);
  }
  assert.equal(isUnconfiguredApiKey('a-non-placeholder-test-key'), false);
});

test('missing key is a sanitized 503 without a provider call', async () => {
  const previous = process.env.GEMINI_API_KEY;
  const previousProvider = process.env.DRAWING_AI_PROVIDER;
  process.env.DRAWING_AI_PROVIDER = 'gemini';
  delete process.env.GEMINI_API_KEY;
  const middleware = createRecognitionMiddleware();
  const local = createServer((req, res) => middleware(req, res, () => res.end()));
  try {
    local.listen(0, '127.0.0.1');
    await once(local, 'listening');
    const address = local.address();
    assert(address && typeof address !== 'string');
    const response = await fetch(`http://127.0.0.1:${address.port}/api/recognize-drawing`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(validBody),
    });
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), {
      code: 'KEY_NOT_CONFIGURED', error: 'Drawing recognition is not configured on the server.',
    });
  } finally {
    if (previousProvider === undefined) delete process.env.DRAWING_AI_PROVIDER;
    else process.env.DRAWING_AI_PROVIDER = previousProvider;
    if (previous === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previous;
    local.closeAllConnections();
    await new Promise<void>((resolve) => local.close(() => resolve()));
  }
});

test('inference deadline responds even if a provider ignores cancellation', async () => {
  let providerSignal: AbortSignal | undefined;
  const middleware = createRecognitionMiddleware({ timeoutMs: 40, classify: async ({ signal }) => {
    providerSignal = signal;
    return new Promise(() => {});
  } });
  const local = createServer((req, res) => middleware(req, res, () => res.end()));
  try {
    local.listen(0, '127.0.0.1');
    await once(local, 'listening');
    const address = local.address();
    assert(address && typeof address !== 'string');
    const response = await fetch(`http://127.0.0.1:${address.port}/api/recognize-drawing`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(validBody),
    });
    assert.equal(response.status, 504);
    assert.equal((await response.json()).code, 'RECOGNITION_TIMEOUT');
    assert.equal(providerSignal?.aborted, true);
  } finally {
    local.closeAllConnections();
    await new Promise<void>((resolve) => local.close(() => resolve()));
  }
});

test('client disconnect aborts the in-flight provider request', async () => {
  let markStarted: () => void;
  let markAborted: () => void;
  const started = new Promise<void>((resolve) => { markStarted = resolve; });
  const aborted = new Promise<void>((resolve) => { markAborted = resolve; });
  classifier = async ({ signal }) => {
    markStarted();
    return new Promise((_, reject) => signal.addEventListener('abort', () => {
      markAborted();
      reject(new Error('aborted'));
    }, { once: true }));
  };
  const req = request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
  req.on('error', () => {});
  req.end(JSON.stringify(validBody));
  await started;
  req.destroy();
  await aborted;
});

test('incomplete request bodies time out before inference', async () => {
  let invoked = false;
  const middleware = createRecognitionMiddleware({ timeoutMs: 40, classify: async () => {
    invoked = true;
    return null;
  } });
  const local = createServer((req, res) => middleware(req, res, () => res.end()));
  try {
    local.listen(0, '127.0.0.1');
    await once(local, 'listening');
    const address = local.address();
    assert(address && typeof address !== 'string');
    const result = await new Promise<{ status: number; body: string }>((resolve, reject) => {
      const req = request(`http://127.0.0.1:${address.port}/api/recognize-drawing`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': '100' },
      }, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => { resolve({ status: res.statusCode!, body }); req.destroy(); });
      });
      req.on('error', reject);
      req.write('{');
    });
    assert.equal(result.status, 408);
    assert.equal(JSON.parse(result.body).code, 'REQUEST_TIMEOUT');
    assert.equal(invoked, false);
  } finally {
    local.closeAllConnections();
    await new Promise<void>((resolve) => local.close(() => resolve()));
  }
});

test('provider selection is explicit with a Gemini default and rejects unsupported settings', () => {
  assert.equal(resolveDrawingProvider(''), 'gemini');
  assert.equal(resolveDrawingProvider('gemini'), 'gemini');
  assert.equal(resolveDrawingProvider(' OPENAI '), 'openai');
  assert.throws(() => resolveDrawingProvider('automatic'), /DRAWING_AI_PROVIDER/);
});

test('OpenAI receives actual ink, matching schema, abort signal, and disables response storage', async () => {
  const signal = new AbortController().signal;
  const classify = createOpenAIClassifier('test-openai-key', 'test-vision-model', async (url, init) => {
    assert.equal(url, 'https://api.openai.com/v1/responses');
    assert.equal(init?.method, 'POST');
    assert.equal(new Headers(init?.headers).get('Authorization'), 'Bearer test-openai-key');
    assert.equal(init?.signal, signal);
    const body = JSON.parse(String(init?.body));
    assert.equal(body.model, 'test-vision-model');
    assert.equal(body.store, false);
    assert.deepEqual(body.input[0].content, [
      { type: 'input_text', text: `Allowed objects: ${JSON.stringify(choices)}` },
      { type: 'input_image', image_url: validBody.image, detail: 'low' },
    ]);
    assert.equal(body.text.format.strict, true);
    assert.equal(body.text.format.schema.additionalProperties, false);
    assert.deepEqual(body.text.format.schema.properties.choiceId.anyOf[0].enum, choices.map(choice => choice.id));
    assert.match(body.instructions, /Never guess a default/);
    return Response.json({ status: 'completed', output: [{ type: 'message', content: [
      { type: 'output_text', text: JSON.stringify({ choiceId: choices[1].id, confidence: 0.97 }) },
    ] }] });
  });
  assert.deepEqual(await classify({ image: validBody.image.split(',')[1], choices, signal }),
    { choiceId: choices[1].id, confidence: 0.97 });
});

test('OpenAI errors are sanitized and refusals/incomplete outputs cannot become story choices', async () => {
  for (const [status, code] of [[401, 'PROVIDER_AUTH_FAILED'], [429, 'PROVIDER_QUOTA_EXCEEDED'], [404, 'MODEL_UNAVAILABLE']] as const) {
    classifier = createOpenAIClassifier('test-secret', 'test', async () => Response.json(
      { error: { message: 'secret-provider-detail test-secret', code: 'private-error' } }, { status },
    ));
    const response = await post();
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.equal(body.code, code);
    assert.doesNotMatch(JSON.stringify(body), /test-secret|secret-provider-detail|private-error/);
  }
  for (const result of [
    { status: 'incomplete', output: [] },
    { status: 'completed', output: [{ type: 'message', content: [{ type: 'refusal', refusal: 'No' }] }] },
    { status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: 'not JSON' }] }] },
    { status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: '{"choiceId":"invented","confidence":0.9}' }] }] },
  ]) {
    classifier = createOpenAIClassifier('test-secret', 'test', async () => Response.json(result));
    const response = await post();
    assert.equal(response.status, 502);
    assert.equal((await response.json()).code, 'RECOGNITION_FAILED');
  }
});

test('an unconfigured OpenAI selection never silently falls back to Gemini', async () => {
  const previous = { provider: process.env.DRAWING_AI_PROVIDER, openai: process.env.OPENAI_API_KEY, gemini: process.env.GEMINI_API_KEY };
  process.env.DRAWING_AI_PROVIDER = 'openai';
  delete process.env.OPENAI_API_KEY;
  process.env.GEMINI_API_KEY = 'nonempty-test-key-that-must-not-be-used';
  const middleware = createRecognitionMiddleware();
  const local = createServer((req, res) => middleware(req, res, () => res.end()));
  try {
    local.listen(0, '127.0.0.1');
    await once(local, 'listening');
    const address = local.address();
    assert(address && typeof address !== 'string');
    const response = await fetch(`http://127.0.0.1:${address.port}/api/recognize-drawing`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(validBody),
    });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, 'KEY_NOT_CONFIGURED');
  } finally {
    for (const [name, value] of [['DRAWING_AI_PROVIDER', previous.provider], ['OPENAI_API_KEY', previous.openai], ['GEMINI_API_KEY', previous.gemini]] as const) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
    local.closeAllConnections();
    await new Promise<void>(resolve => local.close(() => resolve()));
  }
});
