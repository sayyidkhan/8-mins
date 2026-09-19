import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Clock, Feather, ArrowRight, BookOpen } from 'lucide-react';
import { PlayMode } from '../types';

interface HomeHeroProps {
  mode: PlayMode;
  onSelectMode: (mode: PlayMode) => void;
  onStartGame: () => void;
  onOpenHowToPlay: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  mode,
  onSelectMode,
  onStartGame,
  onOpenHowToPlay,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Story Copy & Controls */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-6 flex flex-col justify-center space-y-6"
        >
          {/* Eyebrow / Kicker */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-[#886224]">
            <Sparkles className="w-4 h-4 text-[#a87a2c]" />
            <span>A STORY YOU HELP CREATE</span>
          </div>

          {/* Main Title Heading - Exactly matching Image 2 */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal font-serif-display leading-[1.1] text-[#1c2923] tracking-tight">
              A little ink.
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal font-serif-display leading-[1.1] text-[#1c2923] tracking-tight">
              A way <span className="italic text-[#284c39] font-normal">home.</span>
            </h1>
          </div>

          {/* Subtitle Quotes & Description */}
          <div className="space-y-4 text-base sm:text-lg text-[#3d4d45] font-sans-ui">
            <div className="font-serif-display italic text-[#253930] text-lg sm:text-xl space-y-1 border-l-2 border-[#8c6727] pl-3 py-0.5">
              <p>One boy. One magical sketchbook.</p>
              <p>And the courage to choose his own path.</p>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-[#515f57]">
              Help Bob find his way home. Draw right into his world. AI reads your sketch and brings a helpful object to life.
            </p>
          </div>

          {/* Mode Selector - Matching Image 2 */}
          <div className="pt-2 space-y-4">
            <div className="inline-flex p-1.5 rounded-xl bg-[#ede7d8] border border-[#d6cdbc] gap-1.5 shadow-xs">
              <button
                id="mode-challenge-btn"
                onClick={() => onSelectMode('challenge')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  mode === 'challenge'
                    ? 'bg-[#ffffff] text-[#1c2823] shadow-xs border border-[#cfc6b5]'
                    : 'text-[#5d6b63] hover:text-[#1c2823] hover:bg-[#f3ede1]'
                }`}
              >
                <Clock className="w-4 h-4 text-[#8c6727]" />
                <span>8-second challenge</span>
              </button>

              <button
                id="mode-untimed-btn"
                onClick={() => onSelectMode('untimed')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  mode === 'untimed'
                    ? 'bg-[#ffffff] text-[#1c2823] shadow-xs border border-[#cfc6b5]'
                    : 'text-[#5d6b63] hover:text-[#1c2823] hover:bg-[#f3ede1]'
                }`}
              >
                <Feather className="w-4 h-4 text-[#2b6049]" />
                <span>Untimed</span>
              </button>
            </div>

            {/* Explanatory helper for selected mode */}
            <p className="text-xs text-[#6e7d74]">
              {mode === 'challenge'
                ? '⚡ 8-second encounter countdown represents social urgency. Fully recoverable if time runs out.'
                : '🍃 Relaxed storybook mode. Draw at your own pace without any ticking clock.'}
            </p>

            {/* Primary Action Button */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="start-story-button"
                onClick={onStartGame}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#243c30] hover:bg-[#1a2d24] text-[#f7f4ec] font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer font-sans-ui"
              >
                <BookOpen className="w-4 h-4 text-[#e0cfab]" />
                <span>Open the Sketchbook</span>
                <ArrowRight className="w-4 h-4 text-[#e0cfab]" />
              </button>

              <button
                id="learn-how-to-play-hero"
                onClick={onOpenHowToPlay}
                className="px-4 py-3.5 rounded-xl border border-[#d6cdbc] bg-[#fbf9f5] hover:bg-[#ede7d8] text-[#33463d] font-medium text-sm transition-colors cursor-pointer"
              >
                How to play
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: The Arched Storybook Window - Matching Image 2 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-6 flex justify-center items-center"
        >
          <div className="relative w-full max-w-[430px] aspect-[3/4] storybook-arch border-4 border-[#eae3d5] bg-[#faefe0] shadow-xl">
            {/* SVG Storybook Illustration of Bob walking home at sunset */}
            <svg
              viewBox="0 0 360 480"
              className="w-full h-full object-cover select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Sky Sunset Gradient */}
                <linearGradient id="sunsetSky" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f3ca9e" />
                  <stop offset="40%" stopColor="#f4dbbe" />
                  <stop offset="70%" stopColor="#faecd6" />
                  <stop offset="100%" stopColor="#ede1cc" />
                </linearGradient>

                {/* Sun Glow */}
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff8db" stopOpacity="1" />
                  <stop offset="60%" stopColor="#fedea6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f4cb9f" stopOpacity="0" />
                </radialGradient>

                {/* Hills Gradients */}
                <linearGradient id="distantHill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8da992" />
                  <stop offset="100%" stopColor="#67836d" />
                </linearGradient>

                <linearGradient id="midHill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#55755b" />
                  <stop offset="100%" stopColor="#3d5b43" />
                </linearGradient>

                <linearGradient id="foreHill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#34543b" />
                  <stop offset="100%" stopColor="#223927" />
                </linearGradient>

                {/* Winding Road Gradient */}
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f8deb3" />
                  <stop offset="100%" stopColor="#ecd1a0" />
                </linearGradient>
              </defs>

              {/* Sky Background */}
              <rect width="360" height="480" fill="url(#sunsetSky)" />

              {/* Gentle Evening Sun */}
              <circle cx="280" cy="120" r="45" fill="url(#sunGlow)" />
              <circle cx="280" cy="120" r="32" fill="#fff5d9" />

              {/* Distant soft sunset clouds */}
              <path
                d="M 60,95 Q 110,88 160,98 Q 200,92 240,96"
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 120,130 Q 170,125 210,132"
                stroke="rgba(255, 255, 255, 0.35)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Distant Flying Birds */}
              <g stroke="#907963" strokeWidth="1.6" fill="none" opacity="0.6">
                <path d="M 230,105 Q 235,100 240,105 Q 245,100 250,105" />
                <path d="M 295,90 Q 299,86 303,90 Q 307,86 311,90" />
                <path d="M 280,75 Q 283,72 286,75 Q 289,72 292,75" />
              </g>

              {/* Distant Ridge / Layer 1 */}
              <path
                d="M -20,240 Q 90,170 210,210 Q 300,240 380,215 L 380,480 L -20,480 Z"
                fill="url(#distantHill)"
              />

              {/* Silhouette Pine Trees on Distant Ridge */}
              <g fill="#4e6854" opacity="0.8">
                {/* Tree 1 */}
                <polygon points="45,210 38,240 52,240" />
                <polygon points="45,218 35,250 55,250" />
                {/* Tree 2 */}
                <polygon points="62,205 56,235 68,235" />
                <polygon points="62,215 53,248 71,248" />
                {/* Tree 3 */}
                <polygon points="80,215 74,242 86,242" />
              </g>

              {/* Middle Hill / Layer 2 */}
              <path
                d="M -10,310 Q 120,245 260,285 Q 330,305 380,285 L 380,480 L -10,480 Z"
                fill="url(#midHill)"
              />

              {/* Foreground Rolling Hill / Layer 3 */}
              <path
                d="M -10,390 Q 150,310 380,360 L 380,480 L -10,480 Z"
                fill="url(#foreHill)"
              />

              {/* The Winding Path Home */}
              <path
                d="M 370,265 C 320,270 280,285 285,320 C 290,360 250,380 200,395 C 130,415 60,450 30,490 L 120,490 C 160,455 220,430 265,410 C 315,385 330,360 325,325 C 320,295 350,280 380,275 Z"
                fill="url(#pathGradient)"
              />

              {/* Small flowers and grass tufts */}
              <g fill="#9ab89e" opacity="0.7">
                <circle cx="70" cy="380" r="1.5" />
                <circle cx="110" cy="360" r="1.5" />
                <circle cx="140" cy="375" r="1.5" />
                <circle cx="270" cy="385" r="1.5" />
                <circle cx="310" cy="370" r="1.5" />
              </g>

              {/* Glowing Warm Street Lantern on the Path */}
              <g transform="translate(268, 260)">
                {/* Lantern Post */}
                <line x1="12" y1="55" x2="12" y2="10" stroke="#1d2621" strokeWidth="3" strokeLinecap="round" />
                {/* Lantern Bracket */}
                <path d="M 12,18 C 16,14 20,15 20,20 L 20,38" fill="none" stroke="#1d2621" strokeWidth="2.2" />
                {/* Lantern Housing */}
                <polygon points="15,22 25,22 27,36 13,36" fill="#1d2621" />
                <polygon points="16,24 24,24 25,34 15,34" fill="#fef08a" />
                {/* Lantern Cap */}
                <polygon points="12,22 28,22 20,16" fill="#1d2621" />
                {/* Lantern Glow Halo */}
                <circle cx="20" cy="29" r="24" fill="#fef08a" opacity="0.35" filter="blur(3px)" />
              </g>

              {/* Bob Character Walking on the Path */}
              <g transform="translate(195, 305)">
                {/* Shadow */}
                <ellipse cx="25" cy="98" rx="14" ry="4" fill="#17241c" opacity="0.4" />

                {/* Bob's Legs */}
                <line x1="20" y1="75" x2="17" y2="97" stroke="#1c2b22" strokeWidth="5.5" strokeLinecap="round" />
                <line x1="28" y1="75" x2="31" y2="95" stroke="#1c2b22" strokeWidth="5.5" strokeLinecap="round" />
                {/* Shoes */}
                <ellipse cx="14" cy="97" rx="5" ry="3" fill="#0f1913" />
                <ellipse cx="32" cy="96" rx="5" ry="3" fill="#0f1913" />

                {/* Bob's Coat/Torso (Warm Ochre / Mustard) */}
                <path
                  d="M 14,48 C 12,58 13,74 15,76 L 35,76 C 37,74 38,58 36,48 Z"
                  fill="#c88b39"
                />

                {/* Bob's Backpack */}
                <path
                  d="M 9,50 C 7,55 7,68 11,72 L 15,72 L 15,50 Z"
                  fill="#8c5825"
                />

                {/* White Magical Sketchbook under his arm */}
                <rect
                  x="28"
                  y="55"
                  width="12"
                  height="16"
                  rx="1.5"
                  fill="#ffffff"
                  stroke="#38493f"
                  strokeWidth="1.2"
                  transform="rotate(8 28 55)"
                />
                {/* Sketchbook Bookmark ribbon */}
                <line x1="34" y1="56" x2="34" y2="70" stroke="#a26c27" strokeWidth="1" />

                {/* Bob's Arm */}
                <path
                  d="M 24,50 Q 32,60 29,67"
                  stroke="#c88b39"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="29" cy="67" r="3" fill="#f5ceab" />

                {/* Bob's Head & Face */}
                <circle cx="26" cy="38" r="9" fill="#f5ceab" />

                {/* Thoughtful / Determined Eye and expression */}
                <circle cx="29" cy="37" r="1.2" fill="#1d2822" />
                <path d="M 28,42 Q 29,43 31,42" stroke="#684a36" strokeWidth="0.8" fill="none" />

                {/* Bob's Dark Hair */}
                <path
                  d="M 17,37 C 17,28 24,27 33,28 C 36,30 36,37 34,39 C 32,35 30,34 26,34 C 22,34 20,38 17,37 Z"
                  fill="#1d2822"
                />
              </g>

              {/* Magical Sketchbook Sparkles Floating Near Bob */}
              <g fill="#d89c38">
                <circle cx="242" cy="355" r="1.5" />
                <circle cx="248" cy="348" r="2" />
                <circle cx="238" cy="342" r="1.2" />
              </g>

              {/* Storybook Inner Border Vignette */}
              <rect
                x="2"
                y="2"
                width="356"
                height="476"
                rx="16"
                fill="none"
                stroke="#c9bea9"
                strokeWidth="1.5"
                opacity="0.6"
              />
            </svg>

            {/* Subtle bottom caption card */}
            <div className="absolute bottom-3 inset-x-3 bg-[#fdfaf4]/90 backdrop-blur-xs py-2 px-3 rounded-lg border border-[#ded5c5] flex items-center justify-between text-xs text-[#394940] shadow-xs">
              <span className="font-semibold font-serif-display italic">Chapter 1 to 5</span>
              <span className="text-[#846327] font-semibold text-[11px]">8s Tracing & Storybook</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
