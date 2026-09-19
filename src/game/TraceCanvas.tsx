import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import './trace.css';

export type TraceShape = 'door' | 'phone' | 'speech' | 'stop' | 'headphones' | 'signal' | 'bridge';

/** Single, continuous silhouettes; coordinates are always in the 320 × 240 viewBox. */
export const TRACE_PATHS: Readonly<Record<TraceShape, string>> = {
  door: 'M 108 196 L 108 56 Q 108 44 120 44 L 200 44 Q 212 44 212 56 L 212 196 Z',
  phone: 'M 126 36 L 194 36 Q 210 36 210 52 L 210 188 Q 210 204 194 204 L 126 204 Q 110 204 110 188 L 110 52 Q 110 36 126 36 Z',
  speech: 'M 100 54 L 220 54 Q 250 54 250 84 L 250 142 Q 250 170 220 170 L 150 170 L 108 200 L 112 170 L 100 170 Q 70 170 70 142 L 70 84 Q 70 54 100 54 Z',
  stop: 'M 126 38 L 194 38 L 242 86 L 242 154 L 194 202 L 126 202 L 78 154 L 78 86 Z',
  headphones: 'M 78 138 L 78 116 C 78 14 242 14 242 116 L 242 180 Q 242 192 230 192 L 210 192 L 210 130 L 226 130 L 226 116 C 226 36 94 36 94 116 L 94 130 L 110 130 L 110 192 L 90 192 Q 78 192 78 180 Z',
  signal: 'M 82 100 L 132 100 L 232 54 L 232 174 L 158 142 L 174 194 L 142 194 L 124 140 L 82 140 Q 72 140 72 130 L 72 110 Q 72 100 82 100 Z',
  bridge: 'M 62 188 L 62 110 Q 62 98 74 98 L 84 98 L 84 120 Q 160 44 236 120 L 236 98 L 246 98 Q 258 98 258 110 L 258 188 L 232 188 L 232 152 Q 160 92 88 152 L 88 188 Z',
};

export const TRACE_RULES = {
  sampleSpacing: 4,
  tolerance: 12,
  relaxedTolerance: 16,
  maxSegmentLength: 48,
  completionCoverage: 0.8,
} as const;

const SHAPE_NAMES: Record<TraceShape, string> = {
  door: 'doorway', phone: 'phone', speech: 'speech bubble', stop: 'stop sign',
  headphones: 'headphones', signal: 'help signal', bridge: 'bridge',
};

export function ObjectGlyph({ shape, size = 48, className }: {
  shape: TraceShape;
  size?: number;
  className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 320 240" fill="none"
      className={className} aria-hidden="true" focusable="false">
      <path d={TRACE_PATHS[shape]} stroke="currentColor" strokeWidth="10"
        strokeLinecap="round" strokeLinejoin="round" />
      {shape === 'phone' && <path d="M145 55h30M153 184h14" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />}
      {shape === 'door' && <circle cx="187" cy="124" r="6" fill="currentColor" />}
    </svg>
  );
}

export type TraceCanvasProps = {
  shape: TraceShape;
  enabled: boolean;
  relaxed: boolean;
  onComplete: () => void;
  onProgress?: (progress: number) => void;
};

type Point = { x: number; y: number };
type TraceView = { progress: number; ink: string; covered: Point[]; complete: boolean };

function distanceToSegmentSquared(point: Point, from: Point, to: Point) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1,
    ((point.x - from.x) * dx + (point.y - from.y) * dy) / lengthSquared));
  return (point.x - from.x - t * dx) ** 2 + (point.y - from.y - t * dy) ** 2;
}

/** A shape change gets fresh local state; callback changes and pauses do not reset an attempt. */
export default function TraceCanvas(props: TraceCanvasProps) {
  return <TraceAttempt key={props.shape} {...props} />;
}

function TraceAttempt({ shape, enabled, relaxed, onComplete, onProgress }: TraceCanvasProps) {
  const descriptionId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const outlineRef = useRef<SVGPathElement>(null);
  const samples = useRef<Point[]>([]);
  const covered = useRef(new Set<number>());
  const inkSegments = useRef<string[]>([]);
  const pointer = useRef<{ id: number; previous: Point | null } | null>(null);
  const completed = useRef(false);
  const mounted = useRef(false);
  const callbacks = useRef({ onComplete, onProgress, enabled });
  const [view, setView] = useState<TraceView>({ progress: 0, ink: '', covered: [], complete: false });

  useLayoutEffect(() => {
    callbacks.current = { onComplete, onProgress, enabled };
  }, [onComplete, onProgress, enabled]);

  useLayoutEffect(() => {
    mounted.current = true;
    const path = outlineRef.current;
    if (path) {
      const length = path.getTotalLength();
      const count = Math.max(1, Math.ceil(length / TRACE_RULES.sampleSpacing));
      samples.current = Array.from({ length: count }, (_, index) => {
        const point = path.getPointAtLength(index * length / count);
        return { x: point.x, y: point.y };
      });
    }
    callbacks.current.onProgress?.(0);
    return () => {
      mounted.current = false;
      const active = pointer.current;
      pointer.current = null;
      const svg = svgRef.current;
      if (active && svg?.hasPointerCapture(active.id)) svg.releasePointerCapture(active.id);
    };
  }, [shape]);

  useLayoutEffect(() => {
    if (enabled) return;
    const active = pointer.current;
    pointer.current = null;
    const svg = svgRef.current;
    if (active && svg?.hasPointerCapture(active.id)) svg.releasePointerCapture(active.id);
  }, [enabled]);

  function releasePointer() {
    const active = pointer.current;
    pointer.current = null;
    const svg = svgRef.current;
    if (active && svg?.hasPointerCapture(active.id)) svg.releasePointerCapture(active.id);
  }

  function finish() {
    if (completed.current || !mounted.current || !callbacks.current.enabled) return;
    completed.current = true; // Lock before notifying the parent, including synchronous callbacks.
    releasePointer();
    setView(previous => ({ ...previous, progress: 1, complete: true }));
    callbacks.current.onProgress?.(1);
    if (mounted.current && callbacks.current.enabled) callbacks.current.onComplete();
  }

  function toLocalPoint(event: Pick<PointerEvent, 'clientX' | 'clientY'>): Point | null {
    const svg = svgRef.current;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return null;
    // The inverse CTM handles responsive scaling, letterboxing, and transformed parents.
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y) ||
      point.x < 0 || point.x > 320 || point.y < 0 || point.y > 240) return null;
    return { x: point.x, y: point.y };
  }

  function beginTrace(event: ReactPointerEvent<SVGSVGElement>) {
    if (!enabled || completed.current || !event.isPrimary || event.button !== 0 || pointer.current) return;
    const point = toLocalPoint(event.nativeEvent);
    if (!point) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    // Pointer-down never awards coverage: tapping and stationary holds cannot finish.
    pointer.current = { id: event.pointerId, previous: point };
  }

  function trace(event: ReactPointerEvent<SVGSVGElement>, ending = false) {
    const active = pointer.current;
    if (!enabled || completed.current || !active || active.id !== event.pointerId) return;
    if (!ending && (event.buttons & 1) === 0) {
      releasePointer();
      return;
    }
    event.preventDefault();
    const native = event.nativeEvent;
    const coalesced = native.getCoalescedEvents?.() ?? [];
    const events = coalesced.length ? [...coalesced, native] : [native];
    const before = covered.current.size;
    const tolerance = relaxed ? TRACE_RULES.relaxedTolerance : TRACE_RULES.tolerance;
    let drew = false;

    for (const sampleEvent of events) {
      const point = toLocalPoint(sampleEvent);
      const previous = active.previous;
      if (!point || !previous) {
        active.previous = point;
        continue;
      }
      const length = Math.hypot(point.x - previous.x, point.y - previous.y);
      if (length < 0.8) continue;
      active.previous = point;
      // Never interpolate a teleport, an off-canvas excursion, or a long missing event gap.
      if (length > TRACE_RULES.maxSegmentLength) continue;
      drew = true;
      inkSegments.current.push(`M${previous.x.toFixed(1)},${previous.y.toFixed(1)}L${point.x.toFixed(1)},${point.y.toFixed(1)}`);
      samples.current.forEach((sample, index) => {
        if (!covered.current.has(index) && distanceToSegmentSquared(sample, previous, point) <= tolerance ** 2) {
          covered.current.add(index);
        }
      });
    }

    if (!drew) return;
    // Bound ink history in long relaxed sessions; earned coverage is never discarded.
    if (inkSegments.current.length > 1600) inkSegments.current.splice(0, inkSegments.current.length - 1600);
    const coverage = samples.current.length ? covered.current.size / samples.current.length : 0;
    const progress = Math.min(1, coverage / TRACE_RULES.completionCoverage);
    setView({ progress, ink: inkSegments.current.join(' '), complete: false,
      covered: [...covered.current].map(index => samples.current[index]) });
    if (progress >= 1) finish();
    else if (covered.current.size !== before) callbacks.current.onProgress?.(progress);
  }

  const percent = Math.round(view.progress * 100);
  const canTrace = enabled && !view.complete;

  return (
    <div className={`trace-canvas${view.complete ? ' trace-canvas--complete' : ''}${!enabled ? ' trace-canvas--disabled' : ''}`}
      data-trace-shape={shape}>
      <div className="trace-canvas__heading">
        <span className="trace-canvas__eyebrow">Your sketchbook</span>
        <span className="trace-canvas__badge">{relaxed ? 'At your own pace' : 'Follow the outline'}</span>
      </div>
      <div className="trace-canvas__paper">
        <span className="trace-canvas__paper-corner" aria-hidden="true">✦</span>
        <svg ref={svgRef} className="trace-canvas__surface" viewBox="0 0 320 240"
          data-trace-surface="true" role="img" aria-label={`Trace the ${SHAPE_NAMES[shape]} outline`}
          aria-describedby={descriptionId} aria-disabled={!canTrace}
          onPointerDown={beginTrace} onPointerMove={trace}
          onPointerUp={event => {
            if (pointer.current?.id !== event.pointerId) return;
            trace(event, true);
            releasePointer();
          }}
          onPointerCancel={event => { if (pointer.current?.id === event.pointerId) releasePointer(); }}
          onLostPointerCapture={event => { if (pointer.current?.id === event.pointerId) pointer.current = null; }}>
          <path className="trace-canvas__halo" d={TRACE_PATHS[shape]} />
          <path ref={outlineRef} data-trace-outline="true" className="trace-canvas__guide" d={TRACE_PATHS[shape]} />
          <path className="trace-canvas__ink" d={view.ink} />
          <g className="trace-canvas__coverage" aria-hidden="true">
            {view.covered.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="2.5" />)}
          </g>
          {view.complete && <path className="trace-canvas__finished" d={TRACE_PATHS[shape]} />}
        </svg>
        <span className="trace-canvas__paper-caption" aria-hidden="true">a little ink. a way forward.</span>
      </div>
      <div className="trace-canvas__progress-row">
        <span className="trace-canvas__status" aria-live="polite" aria-atomic="true">
          {view.complete ? 'Ready to come to life!' : !enabled ? 'Drawing paused' : 'Every line brings it closer'}
        </span>
        <span className="trace-canvas__percent" aria-hidden="true">{percent}%</span>
      </div>
      <div className="trace-canvas__progress" role="progressbar" aria-label="Drawing progress"
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <span style={{ width: `${percent}%` }} />
      </div>
      <p id={descriptionId} className="trace-canvas__hint">
        {view.complete ? 'Your drawing is ready for the story.' :
          'Start anywhere. Hold and trace the dotted outline with your finger, mouse or pen.'}
        {relaxed && !view.complete && ' Or use the button below.'}
      </p>
      {relaxed && <button type="button" className="trace-canvas__bring-to-life"
        disabled={!canTrace} onClick={finish}>Bring drawing to life <span aria-hidden="true">✦</span></button>}
    </div>
  );
}
