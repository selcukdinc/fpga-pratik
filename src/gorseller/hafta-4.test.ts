import { describe, expect, it } from "vitest";
import { cozumle, DELTA_ADIMLARI, DELTA_KOD } from "./hafta-4";

describe("çözümleme tablosu", () => {
  it("derste geçen örnekleri verir", () => {
    expect(cozumle("0", "1")).toBe("X");
    expect(cozumle("Z", "1")).toBe("1");
    expect(cozumle("0", "H")).toBe("0");
    expect(cozumle("L", "H")).toBe("W");
    expect(cozumle("U", "1")).toBe("U");
  });

  it("simetriktir", () => {
    const d = ["U", "X", "0", "1", "Z", "W", "L", "H", "-"];
    for (const a of d) for (const b of d) expect(cozumle(a, b)).toBe(cozumle(b, a));
  });
});

describe("delta adımlayıcı", () => {
  it("her adım koddaki bir satırı gösterir ve sonunda s = 1, x = 1 olur", () => {
    for (const a of DELTA_ADIMLARI.slice(1)) expect(DELTA_KOD[a.satir]).toBeDefined();
    const son = DELTA_ADIMLARI[DELTA_ADIMLARI.length - 1]!;
    expect([son.v, son.x, son.s]).toEqual([2, 1, 1]);
    // x := s ilk kez okunduğunda sinyal henüz güncellenmemiştir
    expect(DELTA_ADIMLARI.find((a) => DELTA_KOD[a.satir]?.trim() === "x := s;")!.x).toBe(0);
  });
});
