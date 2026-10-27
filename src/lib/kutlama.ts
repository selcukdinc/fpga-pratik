import { kutlama, type GunlukDurum, type Kutlama } from "../../shared/motivasyon";

// Doğru bir cevap günlük hedefi ya da alev eşiğini tam o anda doldurduysa
// Shell'deki kutlama bildirimine haber verir
export const KUTLAMA_OLAYI = "fp:kutlama";

export interface KutlamaAyrinti {
  tur: Kutlama;
  dogru: number;
}

export function kutlamaBildir(g: GunlukDurum | undefined) {
  const tur = g && kutlama(g);
  if (tur) window.dispatchEvent(new CustomEvent<KutlamaAyrinti>(KUTLAMA_OLAYI, { detail: { tur, dogru: g.dogru } }));
}
