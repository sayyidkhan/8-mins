import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayMode, GameScreen, DrawOption, PlayerJournalEntry } from './types';
import { AIRecognitionResult } from './utils/sketchMatcher';
import { STORY_CHAPTERS } from './data/storyData';
import { StoryHeader } from './components/StoryHeader';
import { HomeHero } from './components/HomeHero';
import { StorybookEncounter } from './components/StorybookEncounter';
import { ConsequenceModal } from './components/ConsequenceModal';
import { TimeoutRecovery } from './components/TimeoutRecovery';
import { EndingJournal } from './components/EndingJournal';
import { HowToPlayModal } from './components/HowToPlayModal';

export const App: React.FC = () => {
  // Game state
  const [screen, setScreen] = useState<GameScreen>('intro');
  const [chapterIndex, setChapterIndex] = useState<number>(0);
  const [mode, setMode] = useState<PlayMode>('challenge');
  const [selectedOption, setSelectedOption] = useState<DrawOption>(
    STORY_CHAPTERS[0].options[0]
  );
  const [materializedOption, setMaterializedOption] = useState<DrawOption | null>(null);
  const [journalEntries, setJournalEntries] = useState<PlayerJournalEntry[]>([]);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  const currentChapter = STORY_CHAPTERS[chapterIndex];

  // Start the game from the Hero screen
  const handleStartGame = () => {
    setChapterIndex(0);
    setSelectedOption(STORY_CHAPTERS[0].options[0]);
    setMaterializedOption(null);
    setJournalEntries([]);
    setIsTimerRunning(true);
    setScreen('encounter');
  };

  // Toggle mode (8-second challenge vs untimed)
  const handleToggleMode = () => {
    setMode((prev) => (prev === 'challenge' ? 'untimed' : 'challenge'));
  };

  // When an option is selected to sketch
  const handleSelectOption = (opt: DrawOption) => {
    setSelectedOption(opt);
  };

  // When sketch is completed
  const handleCompleteDrawing = (opt: DrawOption, aiResult?: AIRecognitionResult) => {
    setIsTimerRunning(false);
    setSelectedOption(opt);
    setMaterializedOption(opt);

    // Record in player journal
    const newEntry: PlayerJournalEntry = {
      chapterId: currentChapter.id,
      chapterTitle: currentChapter.title,
      optionId: opt.id,
      optionName: opt.name,
      icon: opt.icon,
      caption: opt.sketchbookCaption,
      takeaway: opt.takeaway,
      recognizedConcept: aiResult?.recognizedConcept,
      aiCommentary: aiResult?.commentary,
    };

    setJournalEntries((prev) => {
      // replace if retried current chapter, otherwise append
      const filtered = prev.filter((e) => e.chapterId !== currentChapter.id);
      return [...filtered, newEntry];
    });

    // Pause briefly for materialization animation, then show consequence
    setTimeout(() => {
      setScreen('consequence');
    }, 1400);
  };

  // When 8-second countdown expires
  const handleTimeout = () => {
    setIsTimerRunning(false);
    setScreen('timeout');
  };

  // Retry encounter in timed mode
  const handleRetryTimed = () => {
    setIsTimerRunning(true);
    setMaterializedOption(null);
    setScreen('encounter');
  };

  // Switch to untimed mode from timeout
  const handleSwitchUntimed = () => {
    setMode('untimed');
    setIsTimerRunning(false);
    setMaterializedOption(null);
    setScreen('encounter');
  };

  // Advance to next chapter or ending
  const handleNextChapter = () => {
    if (chapterIndex < STORY_CHAPTERS.length - 1) {
      const nextIndex = chapterIndex + 1;
      setChapterIndex(nextIndex);
      setSelectedOption(STORY_CHAPTERS[nextIndex].options[0]);
      setMaterializedOption(null);
      setIsTimerRunning(true);
      setScreen('encounter');
    } else {
      setScreen('ending');
    }
  };

  // Replay from beginning
  const handleReplay = () => {
    setChapterIndex(0);
    setSelectedOption(STORY_CHAPTERS[0].options[0]);
    setMaterializedOption(null);
    setJournalEntries([]);
    setIsTimerRunning(true);
    setScreen('intro');
  };

  return (
    <div className="min-h-screen paper-bg flex flex-col text-[#1c2822]">
      {/* Top Header Navigation - Matching Image 2 */}
      <StoryHeader
        currentChapter={screen === 'encounter' || screen === 'consequence' ? chapterIndex + 1 : undefined}
        totalChapters={STORY_CHAPTERS.length}
        mode={mode}
        onToggleMode={handleToggleMode}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onReturnHome={() => setScreen('intro')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {screen === 'intro' && (
          <HomeHero
            mode={mode}
            onSelectMode={setMode}
            onStartGame={handleStartGame}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          />
        )}

        {screen === 'encounter' && (
          <StorybookEncounter
            key={currentChapter.id}
            chapter={currentChapter}
            selectedOption={selectedOption}
            onSelectOption={handleSelectOption}
            onCompleteDrawing={handleCompleteDrawing}
            onTimeout={handleTimeout}
            materializedOption={materializedOption}
            mode={mode}
          />
        )}

        {screen === 'consequence' && (
          <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <ConsequenceModal
              chapter={currentChapter}
              completedOption={selectedOption}
              onNextChapter={handleNextChapter}
              isLastChapter={chapterIndex === STORY_CHAPTERS.length - 1}
              journalEntry={journalEntries.find((e) => e.chapterId === currentChapter.id)}
            />
          </div>
        )}

        {screen === 'timeout' && (
          <div className="w-full max-w-3xl mx-auto px-4 py-8">
            <TimeoutRecovery
              chapter={currentChapter}
              onRetryTimed={handleRetryTimed}
              onSwitchUntimed={handleSwitchUntimed}
            />
          </div>
        )}

        {screen === 'ending' && (
          <EndingJournal
            journalEntries={journalEntries}
            onReplay={handleReplay}
          />
        )}
      </main>

      {/* How To Play Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      {/* Subtle Footer */}
      <footer className="w-full border-t border-[#dfd8cb] bg-[#fbf9f4] py-4 text-center text-xs text-[#6e7d74] mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>The Next 8 Seconds · Draw Your Way Home</span>
          <span className="text-[#8c6727] font-medium">A story about courage, clarity, and care</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
