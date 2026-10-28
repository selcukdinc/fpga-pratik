// Bir sorunun cevabının anlatıldığı ders bölümü. Soru kartındaki "Derste oku"
// bağlantısı buradan gelir; sunumdaki slayt adları ("Hafta 4_1") öğrenciye bir
// şey söylemediği için gösterilmez.
import { DERSLER } from "./index";

// Hafta -> kavram -> bölümün sırası (0'dan). Kavramlar shared/kavramlar.ts'de.
export const KAVRAM_BOLUMU: Record<number, Record<string, number>> = {
  1: { "fpga-yapi": 0, "fpga-asic": 1, "fpga-cpu": 2, "entegre-olcek": 3 },
  2: {
    "fpga-yapi": 1, "pld-diziler": 0, "pla-tasarim": 0, "lut-clb": 2, "tasarim-akisi": 3, modelleme: 4, vivado: 4,
  },
  3: {
    "vhdl-yapi": 0, "port-modlari": 0, toplayici: 1, "mantik-operatorleri": 2, "mod-rem": 2, karsilastirma: 2,
    "kaydirma-birlestirme": 2, "atama-zamani": 2, "aritmetik-tasma": 3, "numeric-std-islem": 3, "others-atama": 4,
    "dizi-nitelikleri": 4, "sinyal-nitelikleri": 5, "enum-nitelikleri": 6, "kullanici-nitelik": 6, generic: 7,
  },
  4: {
    "port-modlari": 0, "variable-kullanim": 0, "atama-zamani": 0, tanimlayicilar: 2, "std-logic-degerleri": 3,
    cozumleme: 3, "numeric-std-islem": 4, "signed-unsigned": 4, "tip-donusumu": 4, "sayi-tabani": 5,
    "vektor-indeks": 6, "tip-uyumu": 6, "integer-aralik": 6, diziler: 6,
  },
  5: {
    "others-atama": 0, "with-select": 0, "when-else": 0, "process-hassasiyet": 1, "variable-kullanim": 1,
    "if-case": 2, donguler: 3, "saatli-devre": 4,
  },
};

export interface SoruBolumu {
  hafta: number;
  // Ders sayfasındaki bölümün sırası (0'dan); bölüm bulunamadıysa null
  bolum: number | null;
  baslik: string;
}

export function soruBolumu(q: { id: string; week: number; kavram?: string | null }): SoruBolumu | null {
  // Önce "Kendini dene"de kullanıldığı bölüm
  for (const d of DERSLER) {
    const i = d.bolumler.findIndex((b) => b.dene?.includes(q.id));
    if (i >= 0) return { hafta: d.hafta, bolum: i, baslik: d.bolumler[i]!.baslik };
  }
  const d = DERSLER.find((x) => x.hafta === q.week);
  if (!d) return null;
  const i = q.kavram ? KAVRAM_BOLUMU[q.week]?.[q.kavram] : undefined;
  if (i !== undefined && d.bolumler[i]) return { hafta: d.hafta, bolum: i, baslik: d.bolumler[i].baslik };
  return { hafta: d.hafta, bolum: null, baslik: d.baslik };
}

export const bolumId = (i: number) => `bolum-${i + 1}`;
