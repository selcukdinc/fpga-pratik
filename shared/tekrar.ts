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

export interface TekrarCevabi {
  // Bugün sorulacaklar (en çok GUNLUK_TEKRAR - yapilan)
  bugun: TekrarSorusu[];
  // Vadesi gelmiş toplam soru (günlük sınırı aşanlar dahil)
  bekleyen: number;
  // Bugün tekrar edilen
  yapilan: number;
  // 1-5. kutulardaki soru sayıları
  kutular: number[];
  ogrenilen: number;
  // Önümüzdeki 7 günün her birinde vadesi gelecek soru sayısı (yarından başlayarak)
  takvim: number[];
  // bugun ile aynı sırada soruların kendileri
  sorular: Question[];
}
