export type PlayMode = 'challenge' | 'untimed';

export type GameScreen = 'intro' | 'encounter' | 'consequence' | 'timeout' | 'ending';

export interface DrawOption {
  id: string;
  name: string;
  subtitle: string;
  actionText: string;
  icon: string; // lucide icon identifier
  outlinePath: string; // SVG path data for the guide outline
  viewBox: string;
  outcomeTitle: string;
  outcomeNarrative: string;
  takeaway: string;
  sketchbookCaption: string;
}

export interface Chapter {
  id: number;
  kicker: string;
  title: string;
  sceneTheme: 'alley' | 'corner' | 'bench' | 'street' | 'doorstep';
  situation: string;
  dialogueSpeaker?: string;
  dialogueQuote: string;
  prompt: string;
  options: DrawOption[];
}

export interface PlayerJournalEntry {
  chapterId: number;
  chapterTitle: string;
  optionId: string;
  optionName: string;
  icon: string;
  caption: string;
  takeaway: string;
  recognizedConcept?: string;
  aiCommentary?: string;
}

