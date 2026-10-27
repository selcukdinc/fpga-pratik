import { describe, expect, it } from "vitest";
import { basamak } from "./ilerleme";

describe("ilerleme", () => {
  it("basamak boş günü 0, en yoğun günü 4 yapar", () => {
    expect(basamak(0, 10)).toBe(0);
    expect(basamak(1, 10)).toBe(1);
    expect(basamak(10, 10)).toBe(4);
    expect(basamak(6, 10)).toBe(3);
  });
});
