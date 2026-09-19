import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Clock, Sparkles, Feather, ShieldCheck } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141f19]/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-[#ffffff] rounded-3xl border-2 border-[#ded6c5] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            id="close-how-to-play-modal"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#ded5c5] bg-[#fbf9f4] hover:bg-[#ede5d4] flex items-center justify-center text-[#46574d] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Title Header */}
          <div className="space-y-1.5 pr-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8c6727]">
              <BookOpen className="w-4 h-4 text-[#8c6727]" />
              <span>Storybook Guide</span>
            </div>
            <h2 className="text-2xl font-serif-display text-[#1c2923]">
              How to Play The Next 8 Seconds
            </h2>
          </div>

          {/* Rules / Steps */}
          <div className="space-y-4 text-xs sm:text-sm text-[#3e5045] font-sans-ui">
            {/* Step 1 */}
            <div className="flex gap-3 p-3 rounded-xl bg-[#fcf9f2] border border-[#ded6c5]">
              <div className="w-7 h-7 rounded-lg bg-[#8c6727] text-[#ffffff] font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-[#1e2e25]">Read the Encounter</h4>
                <p className="text-[#596a60] leading-snug">
                  Bob meets 5 real situations involving peer pressure, unknown claims, emotional stress, and helping an unwell friend.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 p-3 rounded-xl bg-[#fcf9f2] border border-[#ded6c5]">
              <div className="w-7 h-7 rounded-lg bg-[#274c38] text-[#ffffff] font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-[#1e2e25]">Sketch Freely & AI Recognizes</h4>
                <p className="text-[#596a60] leading-snug">
                  No dropdowns required! Sketch your protective idea directly onto Bob’s world (door, phone, stop hand, etc.). The AI analyzes your drawing and matches it to the closest safe action!
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3 p-3 rounded-xl bg-[#fcf9f2] border border-[#ded6c5]">
              <div className="w-7 h-7 rounded-lg bg-[#a87a2c] text-[#ffffff] font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-[#1e2e25]">8-Second Challenge vs Untimed</h4>
                <p className="text-[#596a60] leading-snug">
                  The 8-second countdown simulates social pressure. If time runs out, Bob simply pauses—no punishment, no harm. You can retry or switch to untimed mode anytime.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-3 p-3 rounded-xl bg-[#fcf9f2] border border-[#ded6c5]">
              <div className="w-7 h-7 rounded-lg bg-[#254333] text-[#ffffff] font-bold flex items-center justify-center shrink-0">
                4
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-[#1e2e25]">Accessibility First</h4>
                <p className="text-[#596a60] leading-snug">
                  Use the <strong>Magic Ink</strong> button for instant 1-click sketch completion, or keyboard controls to play comfortably without fine-motor tracing.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#274c38] hover:bg-[#1c3829] text-[#fbf8f2] font-semibold text-sm shadow-sm transition-colors cursor-pointer"
            >
              Got it, let’s sketch!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
