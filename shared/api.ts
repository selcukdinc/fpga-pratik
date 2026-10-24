// İstemci ile Worker arasındaki veri tipleri

import type { QuestionType } from "./grade";

export interface Me {
  id: string;
  kind: "guest" | "member";
  displayName: string | null;
}

export interface Topic {
  id: string;
  title: string;
  week: number;
}

export interface Question {
  id: string;
  topicId: string;
  week: number;
  type: QuestionType;
  source: "original" | "derived";
  prompt: string;
  payload: { choices?: string[]; blanks?: number; template?: string };
  difficulty: number;
  sourceRef: string | null;
}

export interface AnswerResult {
  correct: boolean;
  explanation: string | null;
}

export interface TopicProgress {
  topicId: string;
  title: string;
  week: number;
  total: number;
  attempted: number;
  correct: number;
}
