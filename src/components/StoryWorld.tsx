import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
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
  Sparkles,
} from 'lucide-react';
import { Chapter, DrawOption } from '../types';

interface StoryWorldProps {
  chapter: Chapter;
  activeOption?: DrawOption;
  materializedOption?: DrawOption | null;
  isTimerRunning?: boolean;
  timeLeft?: number;
  mode: 'challenge' | 'untimed';
}

export const StoryWorld: React.FC<StoryWorldProps> = ({
  chapter,
  activeOption,
  materializedOption,
  isTimerRunning,
  timeLeft = 8,
  mode,
}) => {
  // Render icon for materialized object
  const renderMaterializedIcon = (iconName: string) => {
    switch (iconName) {
      case 'DoorOpen':
        return <DoorOpen className="w-10 h-10 text-[#2d523e]" />;
      case 'PhoneCall':
        return <PhoneCall className="w-10 h-10 text-[#855d21]" />;
      case 'MessageSquare':
        return <MessageSquare className="w-10 h-10 text-[#2f4d6d]" />;
      case 'Octagon':
        return <Octagon className="w-10 h-10 text-[#9b2c2c]" />;
      case 'Search':
        return <Search className="w-10 h-10 text-[#2b4c6f]" />;
      case 'Headphones':
        return <Headphones className="w-10 h-10 text-[#285744]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-10 h-10 text-[#963750]" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-10 h-10 text-[#b91c1c]" />;
      case 'Flame':
        return <Flame className="w-10 h-10 text-[#c26d1d]" />;
      case 'Key':
        return <Key className="w-10 h-10 text-[#966b24]" />;
      default:
        return <Sparkles className="w-10 h-10 text-[#8c6727]" />;
    }
  };

  return (
    <div className="relative w-full rounded-2xl border-2 border-[#ded6c5] bg-[#faefe0] overflow-hidden shadow-md">
      {/* Visual Header / Scene Tag */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fdfaf3]/90 backdrop-blur-xs border border-[#d6cbba] text-xs font-semibold text-[#253930]">
        <span className="w-2 h-2 rounded-full bg-[#8c6727] animate-pulse" />
        <span>{chapter.title}</span>
      </div>

      {/* Countdown Timer Badge if in 8s challenge mode */}
      {mode === 'challenge' && isTimerRunning && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fdfaf3]/95 border border-[#d6cbba] text-xs font-bold text-[#1f2d25] shadow-xs">
          <span className="text-[#8c6727]">Encounter:</span>
          <span className="font-mono text-sm px-1.5 py-0.5 rounded-md bg-[#eee5d3] text-[#734f18]">
            {timeLeft}s
          </span>
        </div>
      )}

      {/* SVG Canvas for the Chapter Environment */}
      <svg
        viewBox="0 0 500 300"
        className="w-full h-auto max-h-[360px] object-cover select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Chapter Specific Gradients */}
          <linearGradient id="skyEvening" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#41394c" />
            <stop offset="45%" stopColor="#755a5b" />
            <stop offset="75%" stopColor="#b47e68" />
            <stop offset="100%" stopColor="#e3a77d" />
          </linearGradient>

          <linearGradient id="skyNight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1f2533" />
            <stop offset="50%" stopColor="#2c3749" />
            <stop offset="100%" stopColor="#434e5f" />
          </linearGradient>

          <linearGradient id="groundColor" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#49554a" />
            <stop offset="100%" stopColor="#29352a" />
          </linearGradient>

          {/* Road / Sidewalk */}
          <linearGradient id="pavement" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d1c4aa" />
            <stop offset="100%" stopColor="#b6a78b" />
          </linearGradient>
        </defs>

        {/* Sky Background based on Scene */}
        <rect
          width="500"
          height="300"
          fill={chapter.sceneTheme === 'street' || chapter.sceneTheme === 'bench' ? 'url(#skyNight)' : 'url(#skyEvening)'}
        />

        {/* Moon / Lantern in sky */}
        {chapter.sceneTheme === 'bench' ? (
          <g>
            <circle cx="420" cy="65" r="24" fill="#fff9de" opacity="0.9" />
            <circle cx="414" cy="60" r="22" fill="#1f2533" />
            <circle cx="422" cy="65" r="32" fill="#fff9de" opacity="0.12" />
          </g>
        ) : (
          <circle cx="430" cy="70" r="28" fill="#fcd34d" opacity="0.35" filter="blur(4px)" />
        )}

        {/* Distant building silhouettes or trees */}
        <g fill="#21282c" opacity="0.8">
          <rect x="20" y="110" width="70" height="120" />
          <polygon points="15,110 55,80 95,110" />
          <rect x="110" y="90" width="85" height="140" />
          <rect x="210" y="130" width="60" height="100" />
          {/* Windows with soft warm lights */}
          <rect x="130" y="110" width="12" height="16" fill="#fef08a" opacity="0.75" />
          <rect x="155" y="110" width="12" height="16" fill="#fef08a" opacity="0.6" />
          <rect x="130" y="140" width="12" height="16" fill="#fef08a" opacity="0.8" />
          <rect x="40" y="135" width="14" height="18" fill="#fef08a" opacity="0.6" />
        </g>

        {/* Ground Surface */}
        <rect x="0" y="210" width="500" height="90" fill="url(#groundColor)" />

        {/* Paved Path / Road */}
        <path
          d="M 0,260 Q 220,230 500,245 L 500,300 L 0,300 Z"
          fill="url(#pavement)"
        />

        {/* Scene-Specific Scenery Elements */}
        {chapter.sceneTheme === 'alley' && (
          /* Porch railing and steps */
          <g>
            <rect x="330" y="170" width="170" height="60" fill="#3a483e" />
            <polygon points="320,195 500,195 500,170 340,170" fill="#2d3931" />
            {/* Steps */}
            <rect x="330" y="210" width="170" height="8" fill="#58675c" />
            <rect x="310" y="218" width="190" height="8" fill="#4d5a50" />
            <rect x="290" y="226" width="210" height="8" fill="#445046" />
            {/* Porch light */}
            <circle cx="420" cy="155" r="16" fill="#fef08a" opacity="0.7" />
            <rect x="415" y="145" width="10" height="14" fill="#1c251f" />
          </g>
        )}

        {chapter.sceneTheme === 'bench' && (
          /* Wooden Park Bench & Tree */
          <g>
            {/* Tree */}
            <path d="M 60,240 C 65,180 50,140 70,80 C 80,140 75,190 85,240 Z" fill="#221915" />
            <circle cx="75" cy="85" r="50" fill="#1e3427" opacity="0.9" />
            <circle cx="110" cy="110" r="40" fill="#294635" opacity="0.85" />
            {/* Park Bench */}
            <rect x="270" y="215" width="110" height="7" rx="2" fill="#784e2d" />
            <rect x="270" y="225" width="110" height="6" rx="2" fill="#784e2d" />
            <line x1="280" y1="225" x2="280" y2="250" stroke="#1c241e" strokeWidth="4" />
            <line x1="370" y1="225" x2="370" y2="250" stroke="#1c241e" strokeWidth="4" />
          </g>
        )}

        {chapter.sceneTheme === 'street' && (
          /* Leo resting against brick pillar in alley */
          <g>
            {/* Brick Pillar */}
            <rect x="360" y="150" width="70" height="100" fill="#57362a" stroke="#3b231a" strokeWidth="2" />
            {/* Brick details */}
            <line x1="360" y1="175" x2="430" y2="175" stroke="#3b231a" strokeWidth="1.5" />
            <line x1="360" y1="200" x2="430" y2="200" stroke="#3b231a" strokeWidth="1.5" />
            <line x1="360" y1="225" x2="430" y2="225" stroke="#3b231a" strokeWidth="1.5" />

            {/* Friend Leo sitting down slumped */}
            <g transform="translate(340, 205)">
              <ellipse cx="25" cy="42" rx="16" ry="5" fill="#18231c" opacity="0.4" />
              {/* Slumped torso */}
              <path d="M 15,15 C 10,25 15,38 25,40 L 40,40 C 45,35 45,20 35,15 Z" fill="#3b5266" />
              {/* Slumped head */}
              <circle cx="20" cy="10" r="9" fill="#e8ba99" />
              {/* Hair */}
              <path d="M 12,8 C 12,2 24,0 28,6 C 26,12 18,14 12,8 Z" fill="#694025" />
            </g>
          </g>
        )}

        {chapter.sceneTheme === 'doorstep' && (
          /* Warm Front Door & Porch Welcome */
          <g>
            {/* Door Frame */}
            <rect x="360" y="110" width="90" height="145" fill="#324036" />
            {/* Warm Wooden Door */}
            <rect x="368" y="118" width="74" height="137" fill="#8f532a" stroke="#633719" strokeWidth="2" />
            {/* Warm Golden Window in door */}
            <rect x="382" y="132" width="46" height="46" rx="4" fill="#fef08a" stroke="#633719" strokeWidth="2" />
            <line x1="405" y1="132" x2="405" y2="178" stroke="#633719" strokeWidth="2" />
            <line x1="382" y1="155" x2="428" y2="155" stroke="#633719" strokeWidth="2" />
            {/* Glowing doorknob */}
            <circle cx="378" cy="195" r="4" fill="#fef08a" stroke="#996e1b" strokeWidth="1" />
            {/* Welcome mat */}
            <rect x="360" y="254" width="90" height="12" rx="3" fill="#a18465" />
          </g>
        )}

        {/* Vintage Streetlamp on side */}
        <g transform="translate(18, 140)">
          <line x1="20" y1="120" x2="20" y2="15" stroke="#1a241d" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 20,25 C 26,18 34,20 34,26 L 34,45" fill="none" stroke="#1a241d" strokeWidth="2.5" />
          <polygon points="26,28 42,28 44,46 24,46" fill="#1a241d" />
          <polygon points="28,30 40,30 42,44 26,44" fill="#fef08a" />
          <circle cx="34" cy="37" r="30" fill="#fef08a" opacity="0.3" filter="blur(4px)" />
        </g>

        {/* Bob Character in Scene */}
        <g transform="translate(140, 160)">
          {/* Shadow */}
          <ellipse cx="25" cy="98" rx="16" ry="5" fill="#17241c" opacity="0.45" />

          {/* Legs */}
          <line x1="20" y1="75" x2="18" y2="97" stroke="#1b2820" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="28" y1="75" x2="32" y2="96" stroke="#1b2820" strokeWidth="5.5" strokeLinecap="round" />
          <ellipse cx="16" cy="97" rx="5" ry="3" fill="#0f1913" />
          <ellipse cx="34" cy="96" rx="5" ry="3" fill="#0f1913" />

          {/* Torso & Warm Ochre Coat */}
          <path d="M 14,48 C 12,58 13,74 15,76 L 35,76 C 37,74 38,58 36,48 Z" fill="#c88b39" />

          {/* Backpack */}
          <path d="M 9,50 C 7,55 7,68 11,72 L 15,72 L 15,50 Z" fill="#8c5825" />

          {/* Bob's Magical White Sketchbook */}
          <rect
            x="28"
            y="55"
            width="13"
            height="18"
            rx="2"
            fill="#ffffff"
            stroke="#38493f"
            strokeWidth="1.2"
            transform="rotate(6 28 55)"
          />
          <line x1="34" y1="56" x2="34" y2="72" stroke="#a26c27" strokeWidth="1" />

          {/* Arms */}
          <path d="M 24,50 Q 32,60 30,68" stroke="#c88b39" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <circle cx="30" cy="68" r="3" fill="#f5ceab" />

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

        {/* Materialized Object Location (Glowing in scene when created) */}
        {materializedOption && (
          <g transform="translate(230, 160)">
            {/* Glow Aura */}
            <circle cx="30" cy="30" r="45" fill="#fef08a" opacity="0.35" filter="blur(6px)" />
            <circle cx="30" cy="30" r="35" fill="#ffffff" opacity="0.5" />
          </g>
        )}
      </svg>

      {/* Floating Materialized Object with Motion Pop */}
      <AnimatePresence>
        {materializedOption && (
          <motion.div
            initial={{ scale: 0, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="absolute top-[48%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
          >
            <div className="relative w-18 h-18 rounded-2xl bg-[#ffffff]/95 border-2 border-[#8c6727] shadow-xl flex items-center justify-center p-3">
              <span className="animate-pulse">{renderMaterializedIcon(materializedOption.icon)}</span>
              <Sparkles className="w-5 h-5 text-[#c28e35] absolute -top-2 -right-2 animate-bounce" />
            </div>
            <span className="mt-2 px-3 py-1 rounded-full bg-[#243a2f] text-[#f7f3eb] text-xs font-bold tracking-wide shadow-md">
              {materializedOption.name} Materialized!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Tracing Outline Preview overlay if option selected */}
      {activeOption && !materializedOption && (
        <div className="absolute bottom-3 right-3 z-10 px-3 py-1.5 rounded-lg bg-[#fcf9f2]/90 backdrop-blur-xs border border-[#d8cfbe] flex items-center gap-2 text-xs text-[#2c3d34]">
          <span className="text-[#8c6727] font-semibold">Sketching:</span>
          <span className="font-bold">{activeOption.name}</span>
        </div>
      )}
    </div>
  );
};
