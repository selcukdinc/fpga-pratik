import { describe, expect, it } from "vitest";
import { BOS_ILERLEME, bolumBittiMi, bolumIsaretle, ilerlemeBirlestir, ilerlemeDuzelt } from "./dersIlerleme";

describe("ders ilerlemesi", () => {
  it("geçersiz parçaları atar, bölümleri sıralar", () => {
    expect(ilerlemeDuzelt(null)).toEqual(BOS_ILERLEME);
    expect(ilerlemeDuzelt({ bitenler: { "4": [3, 1, 1, -2, "x", 99], "0": [1], x: [1], "5": [] }, son: { hafta: 4, bolum: 2 } }))
      .toEqual({ bitenler: { "4": [1, 3] }, son: null });
    expect(ilerlemeDuzelt({ son: { hafta: 3, bolum: 0, zaman: 5 } }).son).toEqual({ hafta: 3, bolum: 0, zaman: 5 });
  });

  it("işaretler ve geri alır", () => {
    let i = bolumIsaretle(BOS_ILERLEME, 4, 2, true);
    i = bolumIsaretle(i, 4, 0, true);
    expect(i.bitenler).toEqual({ "4": [0, 2] });
    expect(bolumBittiMi(i, 4, 2)).toBe(true);
    i = bolumIsaretle(bolumIsaretle(i, 4, 2, false), 4, 0, false);
    expect(i.bitenler).toEqual({});
  });

  it("misafir ilerlemesini hesaptakiyle birleştirir; son yer daha yeni olandır", () => {
    const hesap = { bitenler: { "3": [0, 1] }, son: { hafta: 3, bolum: 1, zaman: 100 } };
    const yerel = { bitenler: { "3": [1, 4], "5": [0] }, son: { hafta: 5, bolum: 0, zaman: 200 } };
    expect(ilerlemeBirlestir(hesap, yerel)).toEqual({ bitenler: { "3": [0, 1, 4], "5": [0] }, son: yerel.son });
    expect(ilerlemeBirlestir(yerel, { bitenler: {}, son: null }).son).toEqual(yerel.son);
  });
});
