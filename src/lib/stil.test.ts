// styles.css'te iki sayfanın aynı sınıf adını farklı düzenlerle tanımlaması
// sessizce birini bozar (İlerlemem'deki ısı haritası, Tekrar takviminin 7 sütunlu
// ızgara kuralına sarılmıştı). Bu testler o çakışmanın geri gelmesini yakalar.

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const oku = (yol: string) => readFileSync(new URL(yol, import.meta.url), "utf8");
const css = oku("../styles.css").replace(/\/\*[\s\S]*?\*\//g, "");

// Seçici listesinde tam olarak verilen seçiciyi içeren kuralların gövdeleri
function kurallar(secici: string): string[] {
  const sonuc: string[] = [];
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const seciciler = m[1]!.split(",").map((s) => s.trim());
    if (seciciler.includes(secici)) sonuc.push(m[2]!);
  }
  return sonuc;
}

describe("stil sınıfı çakışmaları", () => {
  it(".takvim-izgara yalnızca bir kez, flex düzeniyle tanımlı", () => {
    const govdeler = kurallar(".takvim-izgara");
    expect(govdeler).toHaveLength(1);
    expect(govdeler[0]).toMatch(/display:\s*flex/);
    expect(govdeler[0]).not.toMatch(/grid-template-columns/);
  });

  it("Tekrar takvimi ısı haritasının sınıfını kullanmaz", () => {
    expect(oku("../pages/Tekrar.tsx")).not.toContain('"takvim-izgara"');
  });
});
