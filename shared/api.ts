// İstemci ile Worker arasındaki veri tipleri

import type { QuestionType } from "./grade";
import type { KodBilgisi } from "./kod";

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
  // Yönetici cevap verince e-posta gitsin mi
  notifyEmail: boolean;
  // Susturulduysa bu zamana kadar öneri gönderemez
  mutedUntil: number | null;
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
  payload: { choices?: string[]; blanks?: number; kod?: KodBilgisi };
  difficulty: number;
  sourceRef: string | null;
  // Üye önerisinden gelen ve adı görünsün denmiş sorularda
  oneren?: string;
}

export interface SoruIstatistigi {
  // Soruyu deneyen kişi sayısı ve ilk denemesinde doğru yapanlar (misafirler dahil, anonim)
  kisi: number;
  ilkDogru: number;
  // Çoktan seçmeli sorularda ilk denemelerde her şıkkın kaç kez seçildiği
  siklar?: number[];
}

export interface AnswerResult {
  correct: boolean;
  explanation: string | null;
  istatistik?: SoruIstatistigi;
}

// Kullanıcının sorulardaki durumu: en az bir kez doğru çözdüyse "dogru",
// denediği halde henüz doğru çözemediyse "yanlis". Denenmeyenler listede yok.
export type SoruDurumlari = Record<string, "dogru" | "yanlis">;

export interface IlerlemeAyrintisi {
  // Son 84 gün (12 hafta), Türkiye saatine göre, eskiden yeniye
  takvim: { gun: string; deneme: number; dogru: number }[];
  // Denenip henüz doğru çözülemeyen sorular, en son deneneni başta
  yanlislar: { id: string; topicId: string; topicTitle: string; week: number; ozet: string; deneme: number; son: number }[];
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
