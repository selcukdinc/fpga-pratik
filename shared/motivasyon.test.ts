import { describe, expect, it } from "vitest";
import { gunSusu, kutlama, rozetler, seriler } from "./motivasyon";

describe("motivasyon", () => {
  it("gün süsü eşikleri", () => {
    expect([0, 9, 10, 24, 25, 49, 50, 120].map(gunSusu)).toEqual([null, null, "kivilcim", "kivilcim", "parilti", "parilti", "alev", "alev"]);
  });

  it("kutlama yalnızca eşiğe tam ulaşıldığında", () => {
    expect(kutlama({ dogru: 10, hedef: 10 })).toBe("hedef");
    expect(kutlama({ dogru: 11, hedef: 10 })).toBeNull();
    expect(kutlama({ dogru: 0, hedef: 0 })).toBeNull();
    expect(kutlama({ dogru: 50, hedef: 50 })).toBe("alev");
    expect(kutlama({ dogru: 50, hedef: 10 })).toBe("alev");
  });

  it("seriler: bugün ya da dün biten seri sürer", () => {
    const g = ["2026-10-01", "2026-10-02", "2026-10-03", "2026-10-10", "2026-10-11"];
    expect(seriler(g, "2026-10-11")).toEqual({ simdi: 2, enUzun: 3 });
    expect(seriler(g, "2026-10-12")).toEqual({ simdi: 2, enUzun: 3 });
    expect(seriler(g, "2026-10-13")).toEqual({ simdi: 0, enUzun: 3 });
    expect(seriler([], "2026-10-13")).toEqual({ simdi: 0, enUzun: 0 });
    // ay sonu geçişi ve tekrar eden gün
    expect(seriler(["2026-09-30", "2026-10-01", "2026-10-01"], "2026-10-01")).toEqual({ simdi: 2, enUzun: 2 });
  });

  it("rozetler eşiğe göre", () => {
    const r = rozetler({ enUzunSeri: 8, alevGunleri: 0, hedefGunleri: 3, cozulen: 5, toplam: 146 });
    expect(r.filter((x) => x.ilerleme >= x.esik).map((x) => x.id)).toEqual(["seri-7"]);
  });
});
