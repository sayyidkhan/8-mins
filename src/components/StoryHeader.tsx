import React from 'react';
import { BookOpen, Sparkles, HelpCircle, Clock, Feather } from 'lucide-react';
import { PlayMode } from '../types';

interface StoryHeaderProps {
  currentChapter?: number;
  totalChapters?: number;
  mode: PlayMode;
  onToggleMode: () => void;
  onOpenHowToPlay: () => void;
  onReturnHome?: () => void;
}

export const StoryHeader: React.FC<StoryHeaderProps> = ({
  currentChapter,
  totalChapters = 5,
  mode,
  onToggleMode,
  onOpenHowToPlay,
  onReturnHome,
}) => {
  return (
    <header className="w-full bg-[#fbf9f5] border-b border-[#dfd8cb] sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Left Brand - Identical to Image 2 */}
        <button
          id="header-brand-button"
          onClick={onReturnHome}
          className="flex items-center gap-3.5 text-left group cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#375245] rounded-lg p-1"
          title="Return to Story Overview"
        >
          {/* Book Icon Badge */}
          <div className="relative w-11 h-11 rounded-xl border border-[#d6cfbe] bg-[#f4eee1] flex items-center justify-center text-[#243a2f] shadow-xs group-hover:bg-[#ebe3d2] transition-colors">
            <BookOpen className="w-5 h-5 text-[#243a2f]" />
            <Sparkles className="w-3.5 h-3.5 text-[#a87a2c] absolute -top-1 -right-1" />
          </div>

          <div>
            <div className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-[#1c2823] flex items-center gap-1.5 font-sans-ui">
              <span>THE NEXT</span>
              <span className="text-[#8c6727] font-black">8</span>
              <span>SECONDS</span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#69756e] font-sans-ui">
              A LITTLE COURAGE GOES A LONG WAY
            </div>
          </div>
        </button>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Chapter badge if in gameplay */}
          {currentChapter && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ede6d6] border border-[#dad0bd] text-xs font-semibold text-[#283f34]">
              <span>Chapter {currentChapter} of {totalChapters}</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalChapters }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i + 1 === currentChapter
                        ? 'bg-[#8c6727]'
                        : i + 1 < currentChapter
                        ? 'bg-[#243a2f]'
                        : 'bg-[#c5bba8]'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Mode Pill Toggle */}
          <button
            id="header-mode-toggle-button"
            onClick={onToggleMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[#dad0bd] bg-[#fdfcf9] hover:bg-[#ede7d8] text-[#2c3f35] transition-colors cursor-pointer"
            title="Click to toggle between 8-second challenge and untimed mode"
          >
            {mode === 'challenge' ? (
              <>
                <Clock className="w-3.5 h-3.5 text-[#8c6727]" />
                <span className="hidden sm:inline font-semibold">8-second mode</span>
                <span className="sm:hidden font-semibold">8s</span>
              </>
            ) : (
              <>
                <Feather className="w-3.5 h-3.5 text-[#2f634b]" />
                <span className="hidden sm:inline font-semibold">Untimed mode</span>
                <span className="sm:hidden font-semibold">Relaxed</span>
              </>
            )}
          </button>

          {/* How to Play Button */}
          <button
            id="how-to-play-button"
            onClick={onOpenHowToPlay}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#2d4338] hover:text-[#0f1d16] px-2.5 py-1.5 rounded-lg hover:bg-[#ede6d6] transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-[#5c6962]" />
            <span className="hidden sm:inline font-medium">How to play</span>
          </button>
        </div>
      </div>
    </header>
  );
};
