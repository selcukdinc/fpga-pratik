// 1-6. haftaların ders sayfaları. Her ders kısa anlatımlar, tarayıcıda
// çalışan küçük benzetimler ve soru havuzundan seçilmiş bir konu sonu testi içerir.

import { HAFTA_1, HAFTA_2 } from "./hafta-1-2";
import { HAFTA_3 } from "./hafta-3";
import { HAFTA_4 } from "./hafta-4";
import { HAFTA_5 } from "./hafta-5";
import { HAFTA_6 } from "./hafta-6";
import type { Ders } from "./tipler";

export const DERSLER: Ders[] = [HAFTA_1, HAFTA_2, HAFTA_3, HAFTA_4, HAFTA_5, HAFTA_6];

export const dersBul = (hafta: number) => DERSLER.find((d) => d.hafta === hafta);
