
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  preferredRole?: string;
}

export interface SessionConfig {
  pressure: number;
  focus: number;
  role: string;
  timeLimit: number;
  questionCount: number;
}

export interface StarAnalysis {
  situation: string;
  task: string;
  action: string;
  result: string;
  score: number;
}

export interface HighlightPart {
  text: string;
  type: 'weak' | 'strong' | 'neutral';
  reason?: string;
}

export interface QuestionFeedback {
  question: string;
  originalResponse: string;
  idealResponse: string;
  highlights: HighlightPart[];
  starAnalysis: StarAnalysis;
  toneScore: number;
  toneExplanation: string;
  assertivenessScore: number;
  assertivenessExplanation: string;
  generalFeedback: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  timestamp: number;
  config: SessionConfig;
  overallScore: number;
  overallSummary: string;
  fillerWordAnalysis: string;
  mistakes: string[];
  questions: QuestionFeedback[];
}

export enum AppView {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  SETUP = 'SETUP',
  INTERVIEW = 'INTERVIEW',
  FEEDBACK = 'FEEDBACK',
  DOCUMENTATION = 'DOCUMENTATION'
}
