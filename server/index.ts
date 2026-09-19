import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadServerEnv } from './env.ts';
import { createRecognitionMiddleware } from './recognition.ts';

loadServerEnv();
const app = express();
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
app.disable('x-powered-by');
// Keep the API before static/SPA handling and do not parse its body twice.
app.use(createRecognitionMiddleware());
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found.', code: 'NOT_FOUND' });
});
app.use(express.static(dist));
app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}
const server = app.listen(port, '0.0.0.0', () => {
  console.info(`Server listening on port ${port}`);
});
server.requestTimeout = 20_000;
server.headersTimeout = 20_000;
