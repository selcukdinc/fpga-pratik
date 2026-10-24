import type { Konu, Soru } from "./tipler.ts";
import { hafta12 } from "./hafta-1-2.ts";
import { hafta3 } from "./hafta-3.ts";
import { hafta4 } from "./hafta-4.ts";
import { hafta5 } from "./hafta-5.ts";

// vhdl-temel ve veri-tipleri, 0002'deki örnek konuların kimlikleridir;
// o konulardaki denemeler kaybolmasın diye aynı kimlikler kullanılır.
export const konular: Konu[] = [
  { id: "fpga-giris", baslik: "FPGA'ya giriş: FPGA, ASIC, CPU", hafta: 1, sira: 1 },
  { id: "pld", baslik: "PROM, PAL, PLA ve FPGA yapısı", hafta: 2, sira: 1 },
  { id: "tasarim-akisi", baslik: "Tasarım akışı, modelleme ve Vivado", hafta: 2, sira: 2 },
  { id: "vhdl-temel", baslik: "VHDL yapısı: library, entity, architecture", hafta: 3, sira: 1 },
  { id: "operatorler", baslik: "VHDL operatörleri", hafta: 3, sira: 2 },
  { id: "nitelikler", baslik: "Öznitelikler, operatör aşırı yükleme ve GENERIC", hafta: 3, sira: 3 },
  { id: "veri-nesneleri", baslik: "Veri nesneleri: constant, signal, variable", hafta: 4, sira: 1 },
  { id: "veri-tipleri", baslik: "Veri tipleri, dönüşümler ve diziler", hafta: 4, sira: 2 },
  { id: "esz-atamalar", baslik: "Eşzamanlı atamalar: when/else, with/select", hafta: 5, sira: 1 },
  { id: "sirali-kod", baslik: "Sıralı kod: process, if, case, loop", hafta: 5, sira: 2 },
];

export const sorular: Soru[] = [...hafta12, ...hafta3, ...hafta4, ...hafta5];
