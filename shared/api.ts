// İstemci ile Worker arasındaki veri tipleri

import type { QuestionType } from "./grade";

export interface Me {
  id: string;
  kind: "guest" | "member";
  displayName: string | null;
  // Aşağıdakiler yalnızca hesaplarda dolu
  username: string | null;
  email: string | null;
  avatar: string | null;
  avatarBg: string | null;
  role: string;
  publicProfile: boolean;
  usernameChangedAt: number | null;
  // Sunucu e-posta gönderebiliyor mu (kayıt ve sıfırlama buna bağlı)
  epostaAcik?: boolean;
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

export interface ProfilSon {
  questionId: string;
  topicTitle: string;
  week: number;
  prompt: string;
  at: number;
}

export type Profil =
  | { gizli: true; username: string }
  | {
      gizli: false;
      username: string;
      avatar: string | null;
      avatarBg: string | null;
      joinedAt: number;
      publicProfile: boolean;
      kendisi: boolean;
      konular: TopicProgress[];
      son: ProfilSon[];
    };

export interface ApiHata {
  error: string;
  // Hangi alana ait olduğu (form altında göstermek için)
  alan?: string;
  kalan?: number;
}
