import { describe, expect, it } from "vitest";
import { YENILIKLER } from "./yenilikler";

// Her PR yenilikler.ts'in en üstüne bir kayıt ekler. Bu test kayıtların
// sırasını ve biçimini korur.
describe("yenilikler", () => {
  it("PR numaraları tekil ve en yenisi en üstte", () => {
    const prler = YENILIKLER.map((y) => y.pr);
    expect(prler).toEqual([...new Set(prler)].sort((a, b) => b - a));
  });

  it("tarihler geçerli ve yeniden eskiye", () => {
    for (const y of YENILIKLER) {
      expect(y.tarih, `#${y.pr}`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(y.tarih)), `#${y.pr}`).toBe(false);
    }
    const tarihler = YENILIKLER.map((y) => y.tarih);
    expect(tarihler).toEqual([...tarihler].sort().reverse());
  });

  it("her kaydın başlığı ve en az bir maddesi var", () => {
    for (const y of YENILIKLER) {
      expect(y.baslik.trim(), `#${y.pr}`).not.toBe("");
      expect(y.maddeler.length, `#${y.pr}`).toBeGreaterThan(0);
      for (const m of y.maddeler) expect(m.trim(), `#${y.pr}`).not.toBe("");
    }
  });
});
