import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Sparkles,
  Pause,
  Play,
  Clock,
  Feather,
  CheckCircle2,
  HelpCircle,
  DoorOpen,
  PhoneCall,
  MessageSquare,
  Octagon,
  Search,
  Headphones,
  HeartHandshake,
  ShieldAlert,
  Flame,
  Key,
} from 'lucide-react';
import { DrawOption, PlayMode } from '../types';

interface SketchCanvasProps {
  options: DrawOption[];
  selectedOption: DrawOption;
  onSelectOption: (option: DrawOption) => void;
  onCompleteDrawing: (option: DrawOption) => void;
  onTimeout: () => void;
  mode: PlayMode;
}

export const SketchCanvas: React.FC<SketchCanvasProps> = ({
  options,
  selectedOption,
  onSelectOption,
  onCompleteDrawing,
  onTimeout,
  mode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasStartedTracing, setHasStartedTracing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(8);
  const [strokePoints, setStrokePoints] = useState<{ x: number; y: number }[]>([]);

  // Icon mapping
  const renderOptionIcon = (iconName: string) => {
    switch (iconName) {
      case 'DoorOpen':
        return <DoorOpen className="w-5 h-5" />;
      case 'PhoneCall':
        return <PhoneCall className="w-5 h-5" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5" />;
      case 'Octagon':
        return <Octagon className="w-5 h-5" />;
      case 'Search':
        return <Search className="w-5 h-5" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'Key':
        return <Key className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  // Reset canvas when changing option
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setProgress(0);
    setStrokePoints([]);
  }, []);

  useEffect(() => {
    clearCanvas();
  }, [selectedOption, clearCanvas]);

  // Handle 8-second countdown in challenge mode
  useEffect(() => {
    if (mode !== 'challenge' || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, isPaused, onTimeout]);

  // Check progress and trigger completion if reached
  const checkCompletion = useCallback(
    (newPointCount: number) => {
      // Generous threshold: 22 points sampled gives 100% coverage feel
      const calcProgress = Math.min(100, Math.round((newPointCount / 22) * 100));
      setProgress(calcProgress);

      if (calcProgress >= 90) {
        setTimeout(() => {
          onCompleteDrawing(selectedOption);
        }, 300);
      }
    },
    [selectedOption, onCompleteDrawing]
  );

  // Drawing mouse/touch handlers
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPaused) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setHasStartedTracing(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#182b22'; // Deep ink color
    ctx.stroke();

    const updated = [...strokePoints, { x, y }];
    setStrokePoints(updated);
    checkCompletion(updated.length);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isPaused) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();

    // Sample points every few distance units
    const lastPoint = strokePoints[strokePoints.length - 1];
    if (!lastPoint || Math.hypot(lastPoint.x - x, lastPoint.y - y) > 10) {
      const updated = [...strokePoints, { x, y }];
      setStrokePoints(updated);
      checkCompletion(updated.length);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Instant Magic Ink completion for accessibility
  const triggerMagicInk = () => {
    setProgress(100);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#2d5e46';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        // Trace outline glow
        ctx.arc(canvas.width / 2, canvas.height / 2, 70, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    setTimeout(() => {
      onCompleteDrawing(selectedOption);
    }, 350);
  };

  return (
    <div className="w-full bg-[#ffffff] rounded-2xl border-2 border-[#dfd8cb] p-4 sm:p-6 shadow-sm flex flex-col gap-5">
      {/* Option Cards Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#697870] flex items-center justify-between">
          <span>Choose what Bob sketches:</span>
          <span className="text-[11px] font-medium text-[#8c6727]">
            {options.length} safe pathways available
          </span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {options.map((opt) => {
            const isSelected = opt.id === selectedOption.id;
            return (
              <button
                key={opt.id}
                id={`option-card-${opt.id}`}
                onClick={() => {
                  if (opt.id !== selectedOption.id) {
                    onSelectOption(opt);
                  }
                }}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#294c39] bg-[#f0f6f2] ring-2 ring-[#294c39]/20 shadow-xs'
                    : 'border-[#ded7c8] bg-[#fbf9f4] hover:bg-[#f3ede0] hover:border-[#cfc5b3]'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#294c39] text-[#fbf9f4]'
                        : 'bg-[#ede5d4] text-[#42544a]'
                    }`}
                  >
                    {renderOptionIcon(opt.icon)}
                  </div>
                  <span className="font-bold text-sm text-[#1b2a22]">
                    {opt.name}
                  </span>
                </div>
                <p className="text-xs text-[#526359] leading-snug">
                  {opt.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Countdown and Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#ede6d6]">
        {/* Timer status */}
        <div className="flex items-center gap-2">
          {mode === 'challenge' ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#fcf5e8] border border-[#e8d7ba] text-xs font-bold text-[#805a1d]">
              <Clock className="w-4 h-4 text-[#8c6727]" />
              <span>Time to respond:</span>
              <span
                className={`font-mono text-sm px-1.5 py-0.5 rounded-md ${
                  timeLeft <= 3 ? 'bg-[#ffdede] text-[#b91c1c] animate-pulse' : 'bg-[#faebd0] text-[#785117]'
                }`}
              >
                {timeLeft}s
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#edf6f0] border border-[#cbe3d3] text-xs font-semibold text-[#29543d]">
              <Feather className="w-4 h-4 text-[#29543d]" />
              <span>Untimed mode: sketch comfortably</span>
            </div>
          )}

          {/* Pause button for challenge mode */}
          {mode === 'challenge' && (
            <button
              id="pause-timer-button"
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-lg border border-[#ded5c4] bg-[#fbf9f4] hover:bg-[#ede5d4] text-[#34483e] text-xs font-medium flex items-center gap-1 cursor-pointer"
              title={isPaused ? 'Resume countdown' : 'Pause countdown'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          )}
        </div>

        {/* Tracing Progress Bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#617167] font-medium">Ink Coverage:</span>
          <div className="w-24 h-2.5 rounded-full bg-[#ebe3d3] overflow-hidden">
            <div
              className="h-full bg-[#274c38] transition-all duration-150 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-[#274c38]">
            {progress}%
          </span>
        </div>
      </div>

      {/* Drawing Canvas Area with Guide Outline */}
      <div className="relative w-full aspect-[16/9] max-h-[260px] rounded-xl border-2 border-dashed border-[#cfc4b0] bg-[#fcfbf7] overflow-hidden flex items-center justify-center select-none">
        {/* Semi-transparent Guide Outline Behind Canvas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
          <svg
            viewBox={selectedOption.viewBox}
            className="w-full h-full max-w-[200px] max-h-[190px] opacity-35"
          >
            <path
              d={selectedOption.outlinePath}
              fill="none"
              stroke="#80968b"
              strokeWidth="4"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        {/* Touch/Mouse HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          width={460}
          height={260}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          className="drawing-canvas relative z-10 w-full h-full"
        />

        {/* Hint text if haven't started tracing */}
        {!hasStartedTracing && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-[#ffffff]/90 text-[11px] font-medium text-[#65756c] border border-[#dcd3c3] shadow-xs">
              Trace along the dotted lines with mouse, finger, or stylus
            </span>
          </div>
        )}

        {/* Paused Overlay */}
        {isPaused && (
          <div className="absolute inset-0 z-20 bg-[#fdfaf3]/95 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
            <Pause className="w-8 h-8 text-[#8c6727]" />
            <p className="font-serif-display text-lg text-[#253930]">Countdown Paused</p>
            <p className="text-xs text-[#5f6e66] max-w-xs text-center">
              Take all the time you need to think through your choice.
            </p>
            <button
              onClick={() => setIsPaused(false)}
              className="px-4 py-2 rounded-lg bg-[#274c38] text-[#f7f4ec] text-xs font-semibold hover:bg-[#1b3426] cursor-pointer"
            >
              Resume Story
            </button>
          </div>
        )}
      </div>

      {/* Accessibility & Canvas Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Left: Clear/Reset */}
        <button
          id="clear-sketch-button"
          onClick={clearCanvas}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#ded5c4] bg-[#fbf9f4] hover:bg-[#ede5d4] text-xs font-semibold text-[#485b51] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Sketch</span>
        </button>

        {/* Right: Quick Ink Accessibility Button */}
        <div className="flex items-center gap-2">
          <button
            id="quick-ink-accessibility-button"
            onClick={triggerMagicInk}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#f4eee1] hover:bg-[#ebe2d0] border border-[#d6cbba] text-xs font-semibold text-[#324b3e] cursor-pointer"
            title="Assisted mode: Complete the trace instantly"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#a87a2c]" />
            <span>Magic Ink (Instant Sketch)</span>
          </button>

          <button
            id="bring-to-life-button"
            onClick={() => onCompleteDrawing(selectedOption)}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#274c38] hover:bg-[#1d3829] text-[#fbf8f2] text-xs sm:text-sm font-semibold shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-[#eeddb7]" />
            <span>Bring Object to Life</span>
          </button>
        </div>
      </div>
    </div>
  );
};
