import { describe, expect, it } from "vitest";
import { boslukSonuclari, grade } from "./grade";

describe("grade", () => {
  it("doğru/yanlış", () => {
    expect(grade("tf", { value: false }, { value: false })).toBe(true);
    expect(grade("tf", { value: false }, { value: true })).toBe(false);
  });

  it("şıklı", () => {
    expect(grade("mcq", { index: 2 }, { index: 2 })).toBe(true);
    expect(grade("mcq", { index: 2 }, { index: 0 })).toBe(false);
  });

  it("boşluk doldurma büyük/küçük harf ve boşluğa duyarsız", () => {
    const want = { blanks: [["unsigned"], ["rising_edge(clk)"]] };
    expect(grade("fill", want, { blanks: ["UNSIGNED", "rising_edge( clk )"] })).toBe(true);
    expect(grade("fill", want, { blanks: ["signed", "rising_edge(clk)"] })).toBe(false);
    expect(grade("fill", want, { blanks: ["unsigned"] })).toBe(false);
  });

  it("boşluklar ayrı ayrı değerlendirilir", () => {
    const want = { blanks: [["1"], ["-1", "- 1"], ["2"]] };
    expect(boslukSonuclari(want, { blanks: ["1", "1", "2"] })).toEqual([true, false, true]);
    expect(boslukSonuclari(want, { blanks: ["1", "-1", "2"] })).toEqual([true, true, true]);
    expect(boslukSonuclari(want, { blanks: ["1"] })).toBeNull();
    expect(boslukSonuclari({ index: 1 }, { blanks: ["1"] })).toBeNull();
  });

  it("tip uyuşmazlığı yanlış sayılır", () => {
    expect(grade("mcq", { index: 1 }, { value: true })).toBe(false);
  });
});
