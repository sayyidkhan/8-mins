import React from 'react';
import { motion } from 'motion/react';
import { Clock, RotateCcw, Feather, HeartHandshake } from 'lucide-react';
import { Chapter } from '../types';

interface TimeoutRecoveryProps {
  chapter: Chapter;
  onRetryTimed: () => void;
  onSwitchUntimed: () => void;
}

export const TimeoutRecovery: React.FC<TimeoutRecoveryProps> = ({
  chapter,
  onRetryTimed,
  onSwitchUntimed,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-[#ffffff] rounded-2xl border-2 border-[#dfd8cb] p-6 sm:p-8 shadow-lg space-y-6"
    >
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8c6727]">
        <Clock className="w-4 h-4 text-[#8c6727]" />
        <span>Social Pressure Paused · Safe Second Chance</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-serif-display text-[#1e2d25] leading-tight">
        Bob paused to catch his breath.
      </h2>

      <div className="p-4 sm:p-5 rounded-xl bg-[#fcf9f2] border border-[#ded5c4] text-[#3d4d44] leading-relaxed text-sm sm:text-base space-y-3 font-sans-ui">
        <p>
          In high-pressure situations, hesitation is completely human. Eight seconds go by quickly when someone is crowding your space or making demands.
        </p>
        <p className="font-serif-display italic text-[#253930]">
          Bob takes a steady step back, opens his magical sketchbook again, and prepares his next move.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          id="retry-timed-btn"
          onClick={onRetryTimed}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#d6cdbc] bg-[#fcfaf4] hover:bg-[#ede7d8] text-[#34463d] font-semibold text-sm transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again (8 Seconds)</span>
        </button>

        <button
          id="switch-untimed-btn"
          onClick={onSwitchUntimed}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#274c38] hover:bg-[#1d3829] text-[#fbf8f2] font-semibold text-sm shadow-md transition-all cursor-pointer"
        >
          <Feather className="w-4 h-4 text-[#eeddb7]" />
          <span>Switch to Untimed Mode</span>
        </button>
      </div>
    </motion.div>
  );
};
