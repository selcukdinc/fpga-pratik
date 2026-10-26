// Ders sayfalarının biçimi. Metinler kendi cümlelerimizle yazılır; hocanın
// sunumları depoya girmez.
//
// Metinlerde ` yerine ~ yazılır (şablon dizgilerinde ters tırnak kaçış
// gerektirdiği için); md() ~ karakterlerini ` ile değiştirir.

export interface MiniSim {
  // Tasarım ve testbench'i birlikte içeren tek VHDL dosyası
  kod: string;
  // En üst birim, genellikle "tb"
  top: string;
  sure: string;
  // Öğrenciye kodda ne değiştirip deneyeceğini söyleyen kısa görev
  gorev?: string;
}

export interface DersBolumu {
  baslik: string;
  metin: string;
  sim?: MiniSim;
}

export interface Ders {
  hafta: number;
  baslik: string;
  ozet: string;
  bolumler: DersBolumu[];
  // Konu sonu testi: soru havuzundaki kimlikler
  test: string[];
}

export const md = (s: string) => s.replace(/~/g, "`").trim();

export const UST = "library ieee;\nuse ieee.std_logic_1164.all;\nuse ieee.numeric_std.all;\n";
