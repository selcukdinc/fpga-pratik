import type { Question } from "./api";

// Aralıklı tekrar (Leitner kutuları). Yanlış yapılan soru 1. kutuya girer ve ertesi gün
// sorulur. Tekrarda doğru cevaplanınca bir sonraki kutuya geçer; 5. kutuda da doğru
// cevaplanırsa öğrenilmiş sayılır. Yanlış cevap her zaman 1. kutuya döndürür.

// Kutu k'deki bir sorunun, k'ye girdikten kaç gün sonra sorulacağı
export const ARALIKLAR = [1, 3, 7, 14, 30] as const;
export const SON_KUTU = ARALIKLAR.length;
// 6. kutu: öğrenildi, bir daha sorulmaz
export const OGRENILDI = SON_KUTU + 1;
export const GUNLUK_TEKRAR = 20;
// Seçilebilen günlük tekrar sayıları; 0 sınırsız
export const GUNLUK_SECENEKLERI = [10, 20, 30, 50, 0] as const;
export const gunlukGecerli = (n: unknown): n is number => (GUNLUK_SECENEKLERI as readonly unknown[]).includes(n);
// "Biraz daha tekrar et" her basışta bu kadar soru ekler
export const EK_TEKRAR = 10;
// Takvimde gösterilen gün sayısı (yarından başlayarak)
export const TAKVIM_GUN = 30;
// Bir soru yanlış yapılınca aynı kavramdan en çok bu kadar yeni soru eklenir
export const ILISKILI_SAYISI = 2;

export interface KutuGecisi {
  kutu: number;
  // Bugünün başından kaç gün sonra sorulacak; öğrenildiyse null
  gun: number | null;
}

export function sonrakiKutu(kutu: number, dogru: boolean): KutuGecisi {
  if (!dogru) return { kutu: 1, gun: ARALIKLAR[0] };
  const yeni = Math.min(kutu + 1, OGRENILDI);
  return { kutu: yeni, gun: yeni === OGRENILDI ? null : ARALIKLAR[yeni - 1]! };
}

export type TekrarKaynagi = "yanlis" | "iliskili";

export interface TekrarSorusu {
  id: string;
  kutu: number;
  kaynak: TekrarKaynagi;
  kavram: string | null;
}

// Takvimdeki bir soru: hangi gün, hangi kutudan sorulacak
export interface TakvimSorusu {
  id: string;
  topicId: string;
  hafta: number;
  kutu: number;
  // Yarın 1, öbür gün 2...
  gun: number;
  ozet: string;
}

export interface TekrarCevabi {
  // Bugün için geçerli günlük sınır (0 sınırsız)
  gunluk: number;
  // Bugün sorulacaklar (en çok gunluk - yapilan + ek)
  bugun: TekrarSorusu[];
  // Vadesi gelmiş toplam soru (günlük sınırı aşanlar dahil)
  bekleyen: number;
  // Bugün tekrar edilen
  yapilan: number;
  // 1-5. kutulardaki soru sayıları
  kutular: number[];
  ogrenilen: number;
  // Önümüzdeki TAKVIM_GUN günün her birinde vadesi gelecek soru sayısı (yarından başlayarak)
  takvim: number[];
  // Aynı günlerin soruları (en çok 500)
  takvimSorular: TakvimSorusu[];
  // Vadesi gelmiş soruların haftalara dağılımı (süzgeçten bağımsız)
  haftalar: { hafta: number; n: number }[];
  // bugun ile aynı sırada soruların kendileri
  sorular: Question[];
}
