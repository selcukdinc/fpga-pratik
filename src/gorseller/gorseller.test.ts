import { describe, expect, it } from "vitest";
import { GORSELLER, gorselBul } from ".";
import { gorselKullanimlari } from "./kullanim";

describe("ders şekilleri", () => {
  it("kodlar tekil ve biçimi doğru", () => {
    const kodlar = GORSELLER.map((g) => g.kod);
    expect(new Set(kodlar).size).toBe(kodlar.length);
    for (const k of kodlar) expect(k).toMatch(/^G-H\d+-\d{2}$/);
  });

  it("derslerde geçen her kodun şekli var ve her şekil kullanılıyor", () => {
    const kullanim = gorselKullanimlari();
    for (const kod of kullanim.keys()) expect(gorselBul(kod), kod).toBeDefined();
    for (const g of GORSELLER) expect(kullanim.has(g.kod), `${g.kod} hiçbir derste yok`).toBe(true);
  });

  it("SVG etiketleri dengeli, koordinatlar sayı", () => {
    for (const g of GORSELLER) {
      expect(g.icerik, g.kod).not.toMatch(/NaN|undefined/);
      const yigin: string[] = [];
      for (const m of g.icerik.matchAll(/<(\/?)([a-z]+)[^>]*?(\/?)>/g)) {
        if (m[3]) continue;
        if (m[1]) expect(yigin.pop(), g.kod).toBe(m[2]);
        else yigin.push(m[2]!);
      }
      expect(yigin, g.kod).toEqual([]);
    }
  });
});
