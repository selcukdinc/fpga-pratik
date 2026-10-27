import { describe, expect, it } from "vitest";
import { komsuBoyutla, tasi } from "./duzen";
import { VARSAYILAN_DUZEN, duzenDuzelt, duzenleriDenetle } from "../../shared/duzen";

const sira = (d: typeof VARSAYILAN_DUZEN) => [d.ust.map((p) => p.id).join(","), d.alt.map((p) => p.id).join(",")];

describe("pencere düzeni", () => {
  it("paneli aynı satırda ve satırlar arasında taşır", () => {
    expect(sira(tasi(VARSAYILAN_DUZEN, "sources", "ust", 3))).toEqual(["editor,waves,sources", "bottom"]);
    expect(sira(tasi(VARSAYILAN_DUZEN, "waves", "ust", 0))).toEqual(["waves,sources,editor", "bottom"]);
    expect(sira(tasi(VARSAYILAN_DUZEN, "waves", "alt", 1))).toEqual(["sources,editor", "bottom,waves"]);
    expect(sira(tasi(VARSAYILAN_DUZEN, "bottom", "ust", 1))).toEqual(["sources,bottom,editor,waves", ""]);
  });

  it("taşımadan sonra satırın payları toplam 1 kalır (satır pencereyi doldurur)", () => {
    const toplam = (d: typeof VARSAYILAN_DUZEN) => d.ust.reduce((t, p) => t + p.oran, 0);
    const ortada = tasi(VARSAYILAN_DUZEN, "waves", "ust", 1);
    expect(toplam(ortada)).toBeCloseTo(1);
    const geri = tasi(tasi(ortada, "waves", "ust", 3), "editor", "ust", 1);
    expect(sira(geri)).toEqual(["sources,editor,waves", "bottom"]);
    expect(toplam(geri)).toBeCloseTo(1);
  });

  it("ayırıcı iki komşunun toplamını korur ve en az payın altına inmez", () => {
    const d = komsuBoyutla(VARSAYILAN_DUZEN, "ust", 1, 0.1);
    expect(d.ust[1].oran + d.ust[2].oran).toBeCloseTo(0.82);
    expect(d.ust[1].oran).toBeCloseTo(0.51);
    const uc = komsuBoyutla(VARSAYILAN_DUZEN, "ust", 0, -1);
    expect(uc.ust[0].oran).toBeCloseTo(0.06);
  });

  it("bozuk düzeni düzeltir", () => {
    const d = duzenDuzelt({ ust: [{ id: "editor", oran: 1 }, { id: "editor", oran: 2 }, { id: "yok", oran: 1 }], ustOran: 5 });
    expect(sira(d)).toEqual(["editor", "sources,waves,bottom"]);
    expect(d.ustOran).toBe(0.9);
    expect(duzenDuzelt("abc")).toBe(VARSAYILAN_DUZEN);
  });

  it("kayıtlı düzen listesini denetler", () => {
    expect(duzenleriDenetle([{ ad: "  Geniş  ", duzen: {} }])).toMatchObject({ duzenler: [{ ad: "Geniş" }] });
    expect(duzenleriDenetle([{ ad: "a" }, { ad: "A" }])).toHaveProperty("hata");
    expect(duzenleriDenetle([{ ad: "" }])).toHaveProperty("hata");
    expect(duzenleriDenetle(Array.from({ length: 11 }, (_, i) => ({ ad: `d${i}` })))).toHaveProperty("hata");
  });
});
