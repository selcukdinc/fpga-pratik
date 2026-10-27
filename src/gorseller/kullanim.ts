import { DERSLER } from "../dersler";

export interface Kullanim {
  hafta: number;
  // 1'den başlar; ders sayfasındaki #bolum-N bağlantısıyla aynı
  bolum: number;
  bolumBasligi: string;
}

// Hangi şekil hangi ders bölümünde kullanılıyor
export function gorselKullanimlari(): Map<string, Kullanim[]> {
  const sonuc = new Map<string, Kullanim[]>();
  for (const d of DERSLER) {
    d.bolumler.forEach((b, i) => {
      for (const m of b.metin.matchAll(/^\[\[(G-H\d+-\d+)\]\]$/gm)) {
        const liste = sonuc.get(m[1]!) ?? [];
        liste.push({ hafta: d.hafta, bolum: i + 1, bolumBasligi: b.baslik });
        sonuc.set(m[1]!, liste);
      }
    });
  }
  return sonuc;
}
