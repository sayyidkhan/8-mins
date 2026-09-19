import { DrawOption } from '../types';

export interface SketchAnalysis {
  strokeCount: number;
  totalPoints: number;
  boundingBox: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
    aspectRatio: number; // width / height
  };
  density: number;
}

export interface AIRecognitionResult {
  matchedOption: DrawOption;
  recognizedConcept: string;
  confidence: number;
  commentary: string;
  source: 'gemini-ai' | 'local-matcher' | 'instant-trace';
}

/**
 * Extract basic geometric shape metrics from an array of stroke points
 */
export function analyzeStrokes(
  strokes: Array<Array<{ x: number; y: number }>>
): SketchAnalysis {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let totalPoints = 0;

  strokes.forEach((stroke) => {
    stroke.forEach((pt) => {
      totalPoints++;
      if (pt.x < minX) minX = pt.x;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.y > maxY) maxY = pt.y;
    });
  });

  if (totalPoints === 0) {
    return {
      strokeCount: 0,
      totalPoints: 0,
      boundingBox: { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0, aspectRatio: 1 },
      density: 0,
    };
  }

  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  const aspectRatio = width / height;

  return {
    strokeCount: strokes.length,
    totalPoints,
    boundingBox: { minX, maxX, minY, maxY, width, height, aspectRatio },
    density: totalPoints / (width * height || 1),
  };
}

/**
 * Intelligent local geometric heuristic matcher as instant client-side fallback
 */
export function matchSketchLocally(
  analysis: SketchAnalysis,
  candidates: DrawOption[]
): { option: DrawOption; concept: string; confidence: number; commentary: string } {
  if (candidates.length === 0) {
    throw new Error('No candidate options provided');
  }

  const { strokeCount, totalPoints, boundingBox } = analysis;
  const { aspectRatio } = boundingBox;

  // Score each candidate based on geometric profile
  let bestScore = -1;
  let bestCandidate = candidates[0];
  let recognizedConcept = bestCandidate.name;

  candidates.forEach((cand) => {
    let score = 50;

    switch (cand.id) {
      // Chapter 1
      case 'opt-door':
        // Doors are tall (aspectRatio < 0.8) and have fewer closed strokes
        if (aspectRatio < 0.85) score += 40;
        if (aspectRatio < 0.6) score += 20;
        break;
      case 'opt-phone':
        // Phones are rectangular (0.4 < aspectRatio < 0.8) with moderate points
        if (aspectRatio > 0.4 && aspectRatio < 0.9) score += 35;
        if (strokeCount >= 2) score += 15;
        break;
      case 'opt-words':
        // Speech bubbles are wide/round (0.9 < aspectRatio < 1.6)
        if (aspectRatio >= 0.85 && aspectRatio <= 1.8) score += 45;
        break;

      // Chapter 2
      case 'opt-stop':
        // Stop sign is roughly 1:1 square/round
        if (aspectRatio >= 0.75 && aspectRatio <= 1.35) score += 45;
        break;
      case 'opt-lens':
        // Lens has a handle (tilted or taller)
        if (aspectRatio < 0.75 || aspectRatio > 1.35) score += 40;
        break;

      // Chapter 3
      case 'opt-headphones':
        // Headphones are roughly square with high stroke count or arc
        if (aspectRatio >= 0.8 && aspectRatio <= 1.4) score += 40;
        if (strokeCount >= 2) score += 20;
        break;
      case 'opt-chat':
        // Chat bubbles or phone
        if (aspectRatio < 0.8 || aspectRatio > 1.4) score += 35;
        break;

      // Chapter 4
      case 'opt-995':
        // 995 numbers / cross
        if (strokeCount >= 3 || aspectRatio > 1.1) score += 40;
        break;
      case 'opt-beacon':
        // Lantern / beacon is tall
        if (aspectRatio < 0.85) score += 40;
        break;

      // Chapter 5
      case 'opt-key':
        // Key is elongated (wide or tall)
        if (aspectRatio > 1.4 || aspectRatio < 0.5) score += 45;
        break;
      case 'opt-bridge':
        // Bridge is wide (aspectRatio > 1.3)
        if (aspectRatio > 1.2) score += 50;
        break;

      default:
        score += Math.random() * 10;
        break;
    }

    if (score > bestScore) {
      bestScore = score;
      bestCandidate = cand;
      recognizedConcept = cand.name;
    }
  });

  return {
    option: bestCandidate,
    concept: recognizedConcept,
    confidence: Math.min(0.95, Math.max(0.72, bestScore / 100)),
    commentary: `Bob observes your sketched lines and recognizes: ${bestCandidate.name}!`,
  };
}

/**
 * Call server-side Gemini API with fallback to local heuristic
 */
export async function recognizeSketchWithAI(
  canvas: HTMLCanvasElement,
  strokes: Array<Array<{ x: number; y: number }>>,
  chapterId: number,
  candidateOptions: DrawOption[]
): Promise<AIRecognitionResult> {
  const analysis = analyzeStrokes(strokes);

  // If no strokes were drawn, pick the first option
  if (analysis.totalPoints < 5) {
    const defaultOpt = candidateOptions[0];
    return {
      matchedOption: defaultOpt,
      recognizedConcept: defaultOpt.name,
      confidence: 0.7,
      commentary: `Bob channels his focus into ${defaultOpt.name}.`,
      source: 'local-matcher',
    };
  }

  // Get base64 PNG data URL from canvas
  let dataUrl = '';
  try {
    dataUrl = canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Could not read canvas image data', err);
  }

  // Try calling the server-side Gemini endpoint
  if (dataUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const res = await fetch('/api/recognize-sketch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: dataUrl,
          chapterId,
          candidateOptions: candidateOptions.map((opt) => ({
            id: opt.id,
            name: opt.name,
            subtitle: opt.subtitle,
            takeaway: opt.takeaway,
          })),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const matched = candidateOptions.find((opt) => opt.id === json.matchedOptionId);
        if (matched) {
          return {
            matchedOption: matched,
            recognizedConcept: json.recognizedConcept || matched.name,
            confidence: json.confidence || 0.9,
            commentary: json.commentary || `Bob identifies your sketch as ${matched.name}!`,
            source: 'gemini-ai',
          };
        }
      }
    } catch (err) {
      console.info('Server AI call timed out or failed, using intelligent local matcher', err);
    }
  }

  // Fallback to local geometric matcher
  const localMatch = matchSketchLocally(analysis, candidateOptions);
  return {
    matchedOption: localMatch.option,
    recognizedConcept: localMatch.concept,
    confidence: localMatch.confidence,
    commentary: localMatch.commentary,
    source: 'local-matcher',
  };
}
