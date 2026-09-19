import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import './sketch.css';

export interface SceneSketchHandle {
  getImage: () => string | null;
  clear: () => void;
  undo: () => void;
}

export interface SceneSketchProps {
  enabled: boolean;
  /** Whether there is enough drawn line to submit (taps do not count). */
  onInkChange?: (hasInk: boolean) => void;
}

type Point = { x: number; y: number };
type Stroke = { segments: Point[][]; length: number };
type ActivePointer = { id: number; stroke: Stroke; segment: Point[] | null };

const WIDTH = 1000;
const HEIGHT = 660;
const MIN_INK_LENGTH = 40;
const INK_WIDTH = 8;

function hasMeaningfulInk(strokes: Stroke[]) {
  return strokes.reduce((length, stroke) => length + stroke.length, 0) >= MIN_INK_LENGTH;
}

function drawableSegments(strokes: Stroke[]) {
  return strokes.flatMap(stroke => stroke.segments.filter(segment => segment.length > 1));
}

/** Render ink alone, including the active gesture, without reading the scene art. */
function exportInk(strokes: Stroke[]): string | null {
  if (!hasMeaningfulInk(strokes)) return null;
  const segments = drawableSegments(strokes);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const segment of segments) {
    for (const point of segment) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }
  }

  // Padding may extend beyond the scene so strokes at an edge are never clipped.
  const padding = Math.max(32, Math.max(maxX - minX, maxY - minY) * 0.15) + INK_WIDTH / 2;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;
  const scale = 768 / Math.max(width, height);
  const canvas = document.createElement('canvas');
  canvas.width = Math.min(768, Math.ceil(width * scale));
  canvas.height = Math.min(768, Math.ceil(height * scale));
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  // One scale for both axes preserves the sketch's proportions in the crop.
  context.setTransform(scale, 0, 0, scale, (padding - minX) * scale, (padding - minY) * scale);
  context.strokeStyle = '#000000';
  context.lineWidth = INK_WIDTH;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.beginPath();
  for (const segment of segments) {
    context.moveTo(segment[0].x, segment[0].y);
    for (const point of segment.slice(1)) context.lineTo(point.x, point.y);
  }
  context.stroke();
  return canvas.toDataURL('image/png');
}

/** Place inside the position-relative story-art container. Timing belongs to the parent. */
const SceneSketch = forwardRef<SceneSketchHandle, SceneSketchProps>(function SceneSketch(
  { enabled, onInkChange }, ref,
) {
  const svgRef = useRef<SVGSVGElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const pointer = useRef<ActivePointer | null>(null);
  const callbacks = useRef({ enabled, onInkChange });
  const lastHasInk = useRef(false);
  const [inkPath, setInkPath] = useState('');

  function releasePointer() {
    const active = pointer.current;
    pointer.current = null;
    const svg = svgRef.current;
    if (active && svg?.hasPointerCapture(active.id)) svg.releasePointerCapture(active.id);
    // An isolated tap has no visible ink and should not occupy an undo step.
    if (active?.stroke.length === 0) {
      strokes.current = strokes.current.filter(stroke => stroke !== active.stroke);
    }
  }

  function publishInk() {
    setInkPath(drawableSegments(strokes.current).map(segment => segment.map((point, index) =>
      `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)},${point.y.toFixed(2)}`,
    ).join(' ')).join(' '));
    const hasInk = hasMeaningfulInk(strokes.current);
    if (lastHasInk.current !== hasInk) {
      lastHasInk.current = hasInk;
      callbacks.current.onInkChange?.(hasInk);
    }
  }

  useLayoutEffect(() => {
    callbacks.current = { enabled, onInkChange };
    if (!enabled) releasePointer();
  }, [enabled, onInkChange]);

  useLayoutEffect(() => {
    onInkChange?.(lastHasInk.current);
  }, [onInkChange]);

  useLayoutEffect(() => {
    // A window switch must not leave a gesture live when the pointer returns.
    const stop = () => releasePointer();
    window.addEventListener('blur', stop);
    return () => {
      window.removeEventListener('blur', stop);
      releasePointer();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    getImage: () => exportInk(strokes.current),
    clear: () => {
      releasePointer();
      strokes.current = [];
      publishInk();
    },
    undo: () => {
      releasePointer();
      strokes.current.pop();
      publishInk();
    },
  }), []);

  function toPoint(event: Pick<PointerEvent, 'clientX' | 'clientY'>): Point | null {
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y) ||
      point.x < 0 || point.x > WIDTH || point.y < 0 || point.y > HEIGHT) return null;
    return { x: point.x, y: point.y };
  }

  function begin(event: ReactPointerEvent<SVGSVGElement>) {
    if (!callbacks.current.enabled || !event.isPrimary || event.button !== 0 || pointer.current) return;
    const point = toPoint(event.nativeEvent);
    if (!point) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const segment = [point];
    const stroke: Stroke = { segments: [segment], length: 0 };
    strokes.current.push(stroke);
    pointer.current = { id: event.pointerId, stroke, segment };
  }

  function draw(event: ReactPointerEvent<SVGSVGElement>, ending = false) {
    const active = pointer.current;
    if (!callbacks.current.enabled || !active || event.pointerId !== active.id) return;
    if (!ending && (event.buttons & 1) === 0) {
      releasePointer();
      return;
    }
    event.preventDefault();
    const native = event.nativeEvent;
    const samples = native.getCoalescedEvents?.() ?? [];
    let changed = false;
    for (const sample of [...samples, native]) {
      const point = toPoint(sample);
      if (!point) {
        // Start a fresh subpath on reentry rather than bridging an off-scene excursion.
        active.segment = null;
        continue;
      }
      if (!active.segment) {
        active.segment = [point];
        active.stroke.segments.push(active.segment);
        continue;
      }
      const previous = active.segment[active.segment.length - 1];
      const length = Math.hypot(point.x - previous.x, point.y - previous.y);
      if (length < 0.5) continue;
      active.segment.push(point);
      active.stroke.length += length;
      changed = true;
    }
    if (changed) publishInk();
  }

  return (
    <svg ref={svgRef} className="scene-sketch" viewBox="0 0 1000 660" preserveAspectRatio="none"
      role="img" aria-label="Draw on the story scene" aria-disabled={!enabled}
      onPointerDown={begin} onPointerMove={draw}
      onPointerUp={event => {
        if (pointer.current?.id !== event.pointerId) return;
        draw(event, true);
        releasePointer();
      }}
      onPointerCancel={event => { if (pointer.current?.id === event.pointerId) releasePointer(); }}
      onLostPointerCapture={event => { if (pointer.current?.id === event.pointerId) releasePointer(); }}>
      <g aria-hidden="true">
        <path className="scene-sketch__halo" d={inkPath} />
        <path className="scene-sketch__ink" d={inkPath} strokeWidth={INK_WIDTH} />
      </g>
    </svg>
  );
});

export default SceneSketch;
