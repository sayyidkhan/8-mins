import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Clock,
  Feather,
  RotateCcw,
  Pause,
  Play,
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
  Wand2,
  Lightbulb,
  Eye,
  EyeOff,
  Cpu,
} from 'lucide-react';
import { Chapter, DrawOption, PlayMode } from '../types';
import {
  recognizeSketchWithAI,
  analyzeStrokes,
  matchSketchLocally,
  AIRecognitionResult,
} from '../utils/sketchMatcher';

interface StorybookEncounterProps {
  chapter: Chapter;
  selectedOption: DrawOption;
  onSelectOption: (option: DrawOption) => void;
  onCompleteDrawing: (option: DrawOption, aiResult?: AIRecognitionResult) => void;
  onTimeout: () => void;
  materializedOption: DrawOption | null;
  mode: PlayMode;
}

export const StorybookEncounter: React.FC<StorybookEncounterProps> = ({
  chapter,
  selectedOption,
  onSelectOption,
  onCompleteDrawing,
  onTimeout,
  materializedOption,
  mode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasStartedDrawing, setHasStartedDrawing] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(8);
  const [showHintOutline, setShowHintOutline] = useState<boolean>(false);
  const [activeHintOption, setActiveHintOption] = useState<DrawOption | null>(null);

  // Stroke history for AI analysis
  const [strokes, setStrokes] = useState<Array<Array<{ x: number; y: number }>>>([]);
  const currentStrokeRef = useRef<Array<{ x: number; y: number }>>([]);

  // AI Recognition states
  const [isAIAnalyzing, setIsAIAnalyzing] = useState<boolean>(false);
  const [liveGuess, setLiveGuess] = useState<{ concept: string; option: DrawOption; confidence: number } | null>(null);
  const [finalAIResult, setFinalAIResult] = useState<AIRecognitionResult | null>(null);

  // Render option icon
  const renderOptionIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'DoorOpen':
        return <DoorOpen className={className} />;
      case 'PhoneCall':
        return <PhoneCall className={className} />;
      case 'MessageSquare':
        return <MessageSquare className={className} />;
      case 'Octagon':
        return <Octagon className={className} />;
      case 'Search':
        return <Search className={className} />;
      case 'Headphones':
        return <Headphones className={className} />;
      case 'HeartHandshake':
        return <HeartHandshake className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Key':
        return <Key className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  // Synchronize Canvas resolution to its bounding rect
  const syncCanvasResolution = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      if (canvas.width !== Math.round(rect.width) || canvas.height !== Math.round(rect.height)) {
        // Save current contents if resizing
        canvas.width = Math.round(rect.width);
        canvas.height = Math.round(rect.height);
      }
    }
  }, []);

  useEffect(() => {
    syncCanvasResolution();
    window.addEventListener('resize', syncCanvasResolution);
    return () => window.removeEventListener('resize', syncCanvasResolution);
  }, [syncCanvasResolution]);

  // Clear ink from canvas and reset strokes
  const clearInk = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
    currentStrokeRef.current = [];
    setHasStartedDrawing(false);
    setLiveGuess(null);
    setFinalAIResult(null);
  }, []);

  // Update live heuristic guess as strokes are added
  const updateLiveAIGuess = useCallback(
    (allStrokes: Array<Array<{ x: number; y: number }>>) => {
      const analysis = analyzeStrokes(allStrokes);
      if (analysis.totalPoints > 8) {
        const match = matchSketchLocally(analysis, chapter.options);
        setLiveGuess({
          concept: match.concept,
          option: match.option,
          confidence: Math.round(match.confidence * 100),
        });
      } else {
        setLiveGuess(null);
      }
    },
    [chapter.options]
  );

  // Trigger AI Recognition & Materialization
  const handleRecognizeAndMaterialize = useCallback(async () => {
    if (isAIAnalyzing || materializedOption || finalAIResult) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const analysis = analyzeStrokes(strokes);
    if (analysis.totalPoints < 4) {
      // If nothing sketched, pick default option
      const defaultOpt = chapter.options[0];
      const fallbackResult: AIRecognitionResult = {
        matchedOption: defaultOpt,
        recognizedConcept: defaultOpt.name,
        confidence: 0.75,
        commentary: `Bob instinctively reaches for ${defaultOpt.name} to stay safe.`,
        source: 'local-matcher',
      };
      setFinalAIResult(fallbackResult);
      onSelectOption(defaultOpt);
      setTimeout(() => {
        onCompleteDrawing(defaultOpt, fallbackResult);
      }, 1400);
      return;
    }

    setIsAIAnalyzing(true);
    try {
      const aiResult = await recognizeSketchWithAI(
        canvas,
        strokes,
        chapter.id,
        chapter.options
      );

      setFinalAIResult(aiResult);
      onSelectOption(aiResult.matchedOption);

      setTimeout(() => {
        onCompleteDrawing(aiResult.matchedOption, aiResult);
      }, 1600);
    } catch (err) {
      console.error('Recognition error', err);
      const fallback = chapter.options[0];
      onCompleteDrawing(fallback);
    } finally {
      setIsAIAnalyzing(false);
    }
  }, [
    isAIAnalyzing,
    materializedOption,
    finalAIResult,
    strokes,
    chapter.options,
    chapter.id,
    onSelectOption,
    onCompleteDrawing,
  ]);

  // 8-second countdown in challenge mode: safely decrement timeLeft
  useEffect(() => {
    if (mode !== 'challenge' || isPaused || materializedOption !== null || finalAIResult !== null) return;
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, isPaused, materializedOption, finalAIResult, timeLeft]);

  // Handle countdown expiration safely in a side-effect hook
  useEffect(() => {
    if (mode !== 'challenge' || isPaused || materializedOption !== null || finalAIResult !== null) return;

    if (timeLeft === 0) {
      if (strokes.length > 0 && analyzeStrokes(strokes).totalPoints >= 5) {
        handleRecognizeAndMaterialize();
      } else {
        onTimeout();
      }
    }
  }, [
    timeLeft,
    mode,
    isPaused,
    materializedOption,
    finalAIResult,
    strokes,
    handleRecognizeAndMaterialize,
    onTimeout,
  ]);

  // Pointer drawing handlers for direct storybook inking
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPaused || materializedOption || isAIAnalyzing || finalAIResult) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setHasStartedDrawing(true);

    const initialPoint = { x, y };
    currentStrokeRef.current = [initialPoint];

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 5.5;
    ctx.strokeStyle = '#16281e'; // Deep storybook black-forest ink
    ctx.stroke();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isPaused || materializedOption || isAIAnalyzing || finalAIResult) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    currentStrokeRef.current.push({ x, y });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (currentStrokeRef.current.length > 0) {
      const nextStrokes = [...strokes, [...currentStrokeRef.current]];
      setStrokes(nextStrokes);
      updateLiveAIGuess(nextStrokes);
      currentStrokeRef.current = [];
    }
  };

  // Instant Magic Ink for accessibility or quick draw
  const triggerMagicInk = () => {
    if (materializedOption || isAIAnalyzing || finalAIResult) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw an artistic arched door / shield curve on the canvas
    ctx.strokeStyle = '#1d3829';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const cx = (canvas.width / 500) * 310;
    const cy = (canvas.height / 320) * 160;
    const w = (canvas.width / 500) * 60;
    const h = (canvas.height / 320) * 80;

    // Draw doorway / protective arch
    ctx.beginPath();
    ctx.rect(cx - w / 2, cy - h / 2, w, h);
    ctx.arc(cx, cy - h / 2, w / 2, Math.PI, 0);
    ctx.stroke();

    const magicStrokes = [
      [
        { x: cx - w / 2, y: cy + h / 2 },
        { x: cx - w / 2, y: cy - h / 2 },
        { x: cx + w / 2, y: cy - h / 2 },
        { x: cx + w / 2, y: cy + h / 2 },
      ],
    ];

    setStrokes(magicStrokes);
    setHasStartedDrawing(true);
    setLiveGuess({
      concept: 'Protective Doorway',
      option: chapter.options[0],
      confidence: 95,
    });

    setTimeout(() => {
      handleRecognizeAndMaterialize();
    }, 400);
  };

  // Choose an inspiration hint (optional visual outline)
  const handleInspirationClick = (option: DrawOption) => {
    if (activeHintOption?.id === option.id && showHintOutline) {
      setShowHintOutline(false);
      setActiveHintOption(null);
    } else {
      setActiveHintOption(option);
      setShowHintOutline(true);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* THE HARDCOVER STORYBOOK FOLIO */}
      <div className="relative rounded-3xl border-8 sm:border-12 border-[#3d2b1f] bg-[#fbf9f4] shadow-2xl overflow-hidden">
        {/* Gold Corner Corner Ornaments */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#d4af37] z-20 pointer-events-none rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#d4af37] z-20 pointer-events-none rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#d4af37] z-20 pointer-events-none rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#d4af37] z-20 pointer-events-none rounded-br-lg" />

        {/* Center Spine Crease shadow on desktop open book view */}
        <div className="hidden lg:block absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 pointer-events-none z-20 bg-gradient-to-r from-black/10 via-black/5 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          {/* ========================================================= */}
          {/* LEFT PAGE: STORY SITUATION & INSPIRATION SEEDS (NO DROPDOWN) */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#ded4c3] bg-[#fcfaf5]">
            <div className="space-y-5">
              {/* Header Ribbon / Chapter Tag */}
              <div className="flex items-center justify-between border-b border-[#ebd0b0] pb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#8c6727] flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5 text-[#8c6727]" />
                  <span>{chapter.kicker}</span>
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#eee5d3] text-[#71501b]">
                  Page {chapter.id} of 5
                </span>
              </div>

              {/* Chapter Title */}
              <h2 className="text-2xl sm:text-3xl font-serif-display text-[#1b2821] leading-tight">
                {chapter.title}
              </h2>

              {/* Situation Narrative */}
              <p className="text-sm sm:text-base text-[#34463d] leading-relaxed font-sans-ui">
                {chapter.situation}
              </p>

              {/* Dialogue Callout */}
              {chapter.dialogueQuote && (
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#f6eee0] border-l-4 border-[#8c6727] shadow-2xs space-y-1">
                  <p className="text-xs sm:text-sm font-serif-display italic text-[#2d3f35] leading-snug">
                    {chapter.dialogueQuote}
                  </p>
                  {chapter.dialogueSpeaker && (
                    <span className="text-[11px] font-bold text-[#805f24] uppercase tracking-wider block text-right">
                      — {chapter.dialogueSpeaker}
                    </span>
                  )}
                </div>
              )}

              {/* AI SKETCHBOOK CHALLENGE EXPLANATION */}
              <div className="p-4 rounded-2xl bg-[#f5efe2] border border-[#ded3be] space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#264b38]">
                  <Cpu className="w-4 h-4 text-[#264b38]" />
                  <span>Freehand AI Sketching</span>
                </div>
                <p className="text-xs text-[#44564c] leading-relaxed">
                  You don’t need to select from a dropdown. <strong>Sketch freely</strong> on the storybook page. The AI will look at your drawing and match it to the closest safe action for Bob!
                </p>

                {/* Inspiration Idea Badges (NOT dropdowns, purely idea starters) */}
                <div className="pt-2 border-t border-[#ded3be]/60">
                  <span className="text-[11px] font-semibold text-[#80642f] block mb-1.5 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-[#80642f]" />
                    <span>Ideas you can sketch (click for ghost guide):</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {chapter.options.map((opt) => {
                      const isHintActive = activeHintOption?.id === opt.id && showHintOutline;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleInspirationClick(opt)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                            isHintActive
                              ? 'bg-[#294c39] text-[#fdfaf5] border-[#294c39] shadow-xs'
                              : 'bg-[#ffffff] hover:bg-[#ede5d3] text-[#2c3d33] border-[#ded5c5]'
                          }`}
                          title={opt.subtitle}
                        >
                          {renderOptionIcon(opt.icon, 'w-3.5 h-3.5')}
                          <span>{opt.name}</span>
                          {isHintActive ? (
                            <EyeOff className="w-3 h-3 text-[#eeddb7]" />
                          ) : (
                            <Eye className="w-3 h-3 text-[#8b7960] opacity-70" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown / Untimed status & Pause control */}
            <div className="pt-4 mt-6 border-t border-[#ebd9c1] flex items-center justify-between gap-3 text-xs">
              {mode === 'challenge' ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#faebd4] border border-[#e4cca3] text-[#785117] font-bold">
                  <Clock className="w-4 h-4 text-[#8c6727]" />
                  <span>Pressure Window:</span>
                  <span
                    className={`font-mono text-sm px-1.5 py-0.5 rounded-md ${
                      timeLeft <= 3
                        ? 'bg-[#fed7d7] text-[#b91c1c] animate-pulse'
                        : 'bg-[#f4debe] text-[#714d17]'
                    }`}
                  >
                    {timeLeft}s
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#edf6f0] border border-[#cbe3d3] text-[#245239] font-medium">
                  <Feather className="w-4 h-4 text-[#245239]" />
                  <span>Untimed Mode (Sketch at your pace)</span>
                </div>
              )}

              {mode === 'challenge' && (
                <button
                  id="encounter-pause-button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="px-3 py-1.5 rounded-xl border border-[#ded5c4] bg-[#ffffff] hover:bg-[#ede5d4] text-[#34483e] font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-3.5 h-3.5 text-[#294c39]" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3.5 h-3.5 text-[#8c6727]" />
                      <span>Pause</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT PAGE: DIRECT STORYBOOK CANVAS & AI RECOGNITION      */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between bg-[#fbf8f2] relative">
            {/* Page Top Bar: Live AI Feedback Status */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#e9dfce]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1f2f26]">
                <Sparkles className="w-4 h-4 text-[#a87a2c]" />
                <span className="font-serif-display text-sm sm:text-base">
                  Bob’s Living Storybook Page
                </span>
              </div>

              {/* Real-Time AI Badge */}
              <div className="flex items-center gap-1.5">
                {liveGuess ? (
                  <div className="px-2.5 py-1 rounded-full bg-[#eef7f2] border border-[#b7dfc8] text-[#1c4932] text-xs font-semibold flex items-center gap-1.5 shadow-2xs animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-[#276749] animate-ping" />
                    <span>AI matches closest to: <strong>{liveGuess.concept}</strong></span>
                    <span className="text-[10px] bg-[#276749] text-white px-1.5 py-0.2 rounded font-mono">
                      {liveGuess.confidence}%
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#f4ebd9] text-[#785923] flex items-center gap-1">
                    <span>🖌️ Sketch directly on the world</span>
                  </span>
                )}
              </div>
            </div>

            {/* THE LIVING ILLUSTRATION + DIRECT DRAWING CANVAS */}
            <div className="relative my-3 rounded-2xl overflow-hidden border-2 border-[#ded5c5] bg-[#ebd8bc] shadow-inner aspect-[500/320] w-full select-none">
              {/* Underneath: Living Storybook Vector Scenery */}
              <svg
                viewBox="0 0 500 320"
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="skyEvening" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2c3e50" />
                    <stop offset="45%" stopColor="#4a6984" />
                    <stop offset="75%" stopColor="#c28b58" />
                    <stop offset="100%" stopColor="#d9a566" />
                  </linearGradient>
                  <linearGradient id="skyNight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#111827" />
                    <stop offset="60%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
                  <linearGradient id="groundColor" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#223026" />
                    <stop offset="100%" stopColor="#16201a" />
                  </linearGradient>
                  <linearGradient id="pavement" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#57635a" />
                    <stop offset="100%" stopColor="#3c463f" />
                  </linearGradient>
                  <radialGradient id="magicAura" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fffdfa" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#f7eedb" stopOpacity="0.75" />
                    <stop offset="85%" stopColor="#eedcb6" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#eedcb6" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Sky */}
                <rect
                  width="500"
                  height="320"
                  fill={
                    chapter.sceneTheme === 'street' || chapter.sceneTheme === 'bench'
                      ? 'url(#skyNight)'
                      : 'url(#skyEvening)'
                  }
                />

                {/* Distant building silhouettes with warm windows */}
                <g fill="#1e252a" opacity="0.75">
                  <rect x="15" y="115" width="65" height="125" />
                  <polygon points="10,115 47,85 85,115" />
                  <rect x="95" y="95" width="75" height="145" />
                  <rect x="190" y="135" width="55" height="105" />
                  <rect x="110" y="115" width="10" height="14" fill="#fef08a" opacity="0.75" />
                  <rect x="135" y="115" width="10" height="14" fill="#fef08a" opacity="0.6" />
                  <rect x="110" y="145" width="10" height="14" fill="#fef08a" opacity="0.8" />
                  <rect x="35" y="140" width="12" height="16" fill="#fef08a" opacity="0.6" />
                </g>

                {/* Ground */}
                <rect x="0" y="220" width="500" height="100" fill="url(#groundColor)" />

                {/* Road / Sidewalk */}
                <path
                  d="M 0,265 Q 220,235 500,250 L 500,320 L 0,320 Z"
                  fill="url(#pavement)"
                />

                {/* Streetlamp on left side */}
                <g transform="translate(15, 155)">
                  <line x1="20" y1="110" x2="20" y2="15" stroke="#1a241d" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 20,25 C 26,18 34,20 34,26 L 34,45" fill="none" stroke="#1a241d" strokeWidth="2" />
                  <polygon points="26,28 42,28 44,44 24,44" fill="#1a241d" />
                  <polygon points="28,30 40,30 42,42 26,42" fill="#fef08a" />
                  <circle cx="34" cy="36" r="28" fill="#fef08a" opacity="0.3" filter="blur(4px)" />
                </g>

                {/* Bob Character standing in scene looking forward */}
                <g transform="translate(110, 175)">
                  {/* Shadow */}
                  <ellipse cx="25" cy="98" rx="15" ry="4" fill="#17241c" opacity="0.45" />

                  {/* Legs */}
                  <line x1="20" y1="75" x2="18" y2="97" stroke="#1b2820" strokeWidth="5" strokeLinecap="round" />
                  <line x1="28" y1="75" x2="32" y2="96" stroke="#1b2820" strokeWidth="5" strokeLinecap="round" />
                  <ellipse cx="16" cy="97" rx="5" ry="3" fill="#0f1913" />
                  <ellipse cx="34" cy="96" rx="5" ry="3" fill="#0f1913" />

                  {/* Torso & Ochre Coat */}
                  <path d="M 14,48 C 12,58 13,74 15,76 L 35,76 C 37,74 38,58 36,48 Z" fill="#c88b39" />

                  {/* Backpack */}
                  <path d="M 9,50 C 7,55 7,68 11,72 L 15,72 L 15,50 Z" fill="#8c5825" />

                  {/* Bob's Magical Open Sketchbook in his hand */}
                  <rect
                    x="28"
                    y="52"
                    width="14"
                    height="19"
                    rx="2"
                    fill="#ffffff"
                    stroke="#38493f"
                    strokeWidth="1.2"
                    transform="rotate(8 28 52)"
                  />
                  <line x1="35" y1="53" x2="35" y2="70" stroke="#a26c27" strokeWidth="1" />

                  {/* Arms & Quill Pen */}
                  <path d="M 24,50 Q 32,58 32,66" stroke="#c88b39" strokeWidth="4" strokeLinecap="round" fill="none" />
                  <circle cx="32" cy="66" r="3" fill="#f5ceab" />
                  <line x1="32" y1="66" x2="42" y2="60" stroke="#714b1c" strokeWidth="2" strokeLinecap="round" />

                  {/* Head & Expression */}
                  <circle cx="26" cy="38" r="9.5" fill="#f5ceab" />
                  <circle cx="29" cy="37" r="1.3" fill="#1d2822" />
                  <path d="M 28,42 Q 29,43 31,42" stroke="#684a36" strokeWidth="0.9" fill="none" />

                  {/* Hair */}
                  <path
                    d="M 16,37 C 16,28 23,26 33,28 C 36,30 36,37 34,39 C 32,35 30,34 26,34 C 22,34 19,38 16,37 Z"
                    fill="#1d2822"
                  />
                </g>

                {/* THE MAGICAL SKETCHPAD ZONE RIGHT IN FRONT OF BOB */}
                <g transform="translate(230, 85)">
                  {/* Parchment circular glowing easel in the world */}
                  <ellipse cx="80" cy="75" rx="85" ry="85" fill="url(#magicAura)" />
                  <circle cx="80" cy="75" r="82" fill="none" stroke="#d4b476" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />

                  {/* Optional Hint Outline (if user toggled one from the idea list) */}
                  {showHintOutline && activeHintOption && (
                    <svg
                      x="25"
                      y="20"
                      width="110"
                      height="110"
                      viewBox={activeHintOption.viewBox}
                      className="overflow-visible"
                    >
                      <path
                        d={activeHintOption.outlinePath}
                        fill="none"
                        stroke="#a1885f"
                        strokeWidth="2.5"
                        strokeDasharray="4 4"
                        opacity="0.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </g>
              </svg>

              {/* DIRECT DRAWING HTML5 CANVAS LAYERED DIRECTLY OVER THE SCENE */}
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="drawing-canvas absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none select-none"
              />

              {/* Floating Guidance Badge on the Storybook */}
              {!hasStartedDrawing && !materializedOption && !isPaused && !finalAIResult && (
                <div className="absolute top-3 left-3 z-20 pointer-events-none">
                  <span className="px-3 py-1.5 rounded-full bg-[#fdfaf3]/95 border border-[#d6cbba] text-xs font-semibold text-[#253930] shadow-sm flex items-center gap-1.5 animate-pulse">
                    <span>✏️ Sketch your idea anywhere on the page</span>
                  </span>
                </div>
              )}

              {/* AI Recognition Thinking Overlay */}
              {isAIAnalyzing && (
                <div className="absolute inset-0 z-30 bg-[#16281e]/40 backdrop-blur-[2px] flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-5 rounded-2xl bg-[#ffffff] border-2 border-[#8c6727] shadow-2xl flex flex-col items-center gap-2 max-w-xs text-center"
                  >
                    <Sparkles className="w-8 h-8 text-[#d4af37] animate-spin" />
                    <h4 className="font-serif-display text-lg text-[#1a2b22] font-bold">
                      AI Analyzing Your Ink...
                    </h4>
                    <p className="text-xs text-[#52655b]">
                      Matching your hand-drawn sketch to Bob’s safe story choices
                    </p>
                  </motion.div>
                </div>
              )}

              {/* AI Result & Materialization Celebration Burst */}
              <AnimatePresence>
                {finalAIResult && (
                  <motion.div
                    initial={{ scale: 0.4, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="absolute top-[48%] left-[62%] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center pointer-events-none max-w-xs text-center"
                  >
                    <div className="relative w-20 h-20 rounded-2xl bg-[#ffffff] border-3 border-[#8c6727] shadow-2xl flex items-center justify-center p-3">
                      <span className="animate-bounce">
                        {renderOptionIcon(finalAIResult.matchedOption.icon, 'w-10 h-10 text-[#254d39]')}
                      </span>
                      <Sparkles className="w-6 h-6 text-[#d4af37] absolute -top-3 -right-3 animate-spin" />
                    </div>

                    <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-[#1c2c23] text-[#f7f3eb] text-xs font-bold tracking-wide shadow-lg border border-[#eeddb7]/30 space-y-0.5">
                      <div>✨ AI Recognized: {finalAIResult.recognizedConcept}</div>
                      <div className="text-[10px] text-[#e8d7b5] font-normal font-serif-display italic">
                        {finalAIResult.matchedOption.name} Materialized!
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Countdown Paused Overlay */}
              {isPaused && (
                <div className="absolute inset-0 bg-[#0f1a14]/65 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center text-[#fbf8f2] p-4 text-center">
                  <Pause className="w-10 h-10 text-[#ecd7aa] mb-2" />
                  <h3 className="font-serif-display text-xl sm:text-2xl font-bold">
                    Encounter Paused
                  </h3>
                  <p className="text-xs sm:text-sm text-[#e0d6c3] max-w-sm mt-1">
                    Take your time. When you are ready, resume the story.
                  </p>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="mt-4 px-5 py-2 rounded-xl bg-[#294c39] hover:bg-[#1e3b2b] text-[#fbf9f4] font-semibold text-xs sm:text-sm shadow-md cursor-pointer transition-all"
                  >
                    Resume Encounter
                  </button>
                </div>
              )}
            </div>

            {/* ACTION BAR: AI RECOGNIZE & MATERIALIZE BUTTON + CONTROLS */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                {/* Clear Ink Button */}
                <button
                  onClick={clearInk}
                  disabled={strokes.length === 0 || isAIAnalyzing || Boolean(finalAIResult)}
                  className="px-3 py-2 rounded-xl border border-[#ded5c5] bg-[#ffffff] hover:bg-[#ede5d4] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-[#3d5145] flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                  title="Wipe canvas to sketch anew"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#8c6727]" />
                  <span>Wipe Ink</span>
                </button>

                {/* Magic Ink Instant Draw for Accessibility */}
                <button
                  onClick={triggerMagicInk}
                  disabled={isAIAnalyzing || Boolean(finalAIResult)}
                  className="px-3 py-2 rounded-xl border border-[#ded5c5] bg-[#ffffff] hover:bg-[#ede5d4] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-[#3d5145] flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                  title="Auto-draw an accessible ink outline"
                >
                  <Wand2 className="w-3.5 h-3.5 text-[#245239]" />
                  <span>Magic Ink</span>
                </button>
              </div>

              {/* PRIMARY ACTION: RECOGNIZE & BRING TO LIFE */}
              <button
                id="ai-recognize-btn"
                onClick={handleRecognizeAndMaterialize}
                disabled={isAIAnalyzing || Boolean(finalAIResult)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#244c37] to-[#1a3828] hover:from-[#1b3d2b] hover:to-[#132d1f] disabled:opacity-50 text-[#fbf9f2] font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-[#ecd89f] animate-spin" />
                <span>
                  {isAIAnalyzing
                    ? 'AI Interpreting...'
                    : finalAIResult
                    ? 'Materializing...'
                    : 'AI: Recognize & Bring to Life ✨'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
