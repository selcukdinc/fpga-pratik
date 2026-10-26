import { describe, expect, it } from "vitest";
import { basamak, seri } from "./ilerleme";

const gun = (deneme: number, i: number) => ({ gun: `2026-10-${String(i + 1).padStart(2, "0")}`, deneme, dogru: 0 });

describe("ilerleme", () => {
  it("basamak boş günü 0, en yoğun günü 4 yapar", () => {
    expect(basamak(0, 10)).toBe(0);
    expect(basamak(1, 10)).toBe(1);
    expect(basamak(10, 10)).toBe(4);
    expect(basamak(6, 10)).toBe(3);
  });

  it("seri bugün boşsa dünden sayar, aradaki boşlukta durur", () => {
    expect(seri([1, 0, 2, 3, 0].map(gun))).toBe(2);
    expect(seri([1, 1, 1].map(gun))).toBe(3);
    expect(seri([1, 0, 0].map(gun))).toBe(0);
    expect(seri([])).toBe(0);
  });
});
