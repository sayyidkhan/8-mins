import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, BookOpen, Check } from 'lucide-react';
import { DrawOption, Chapter, PlayerJournalEntry } from '../types';

interface ConsequenceModalProps {
  chapter: Chapter;
  completedOption: DrawOption;
  onNextChapter: () => void;
  isLastChapter: boolean;
  journalEntry?: PlayerJournalEntry;
}

export const ConsequenceModal: React.FC<ConsequenceModalProps> = ({
  chapter,
  completedOption,
  onNextChapter,
  isLastChapter,
  journalEntry,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-[#ffffff] rounded-2xl border-2 border-[#dfd8cb] p-6 sm:p-8 shadow-lg space-y-6"
    >
      {/* Kicker badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8c6727]">
          <Sparkles className="w-4 h-4 text-[#a87a2c]" />
          <span>Ink Materialized · Story Consequence</span>
        </div>
        {journalEntry?.recognizedConcept && (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f4ebd9] text-[#71501b] font-semibold">
            AI matched: {journalEntry.recognizedConcept}
          </span>
        )}
      </div>

      {/* Outcome Title */}
      <h2 className="text-2xl sm:text-3xl font-serif-display text-[#1a2b22] leading-tight">
        {completedOption.outcomeTitle}
      </h2>

      {/* Narrative Body */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#fcf9f2] border border-[#ded5c4] text-[#33463c] leading-relaxed text-sm sm:text-base font-sans-ui space-y-3">
        <p className="font-serif-display italic text-base sm:text-lg text-[#23382d]">
          {completedOption.outcomeNarrative}
        </p>
      </div>

      {/* Grounded Learning Takeaway Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#f0f6f2] border border-[#cadfd2] space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245239]">
          <Check className="w-4 h-4 text-[#245239]" />
          <span>Real-World Takeaway</span>
        </div>
        <p className="text-xs sm:text-sm font-medium text-[#2d4337] leading-relaxed">
          {completedOption.takeaway}
        </p>
      </div>

      {/* Next Step Button */}
      <div className="flex items-center justify-end pt-2">
        <button
          id="continue-story-btn"
          onClick={onNextChapter}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#274c38] hover:bg-[#1c3829] text-[#fbf8f2] font-semibold text-sm sm:text-base shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <span>{isLastChapter ? 'Reach Safe Home' : 'Continue Down the Path'}</span>
          <ArrowRight className="w-4 h-4 text-[#eeddb7]" />
        </button>
      </div>
    </motion.div>
  );
};
