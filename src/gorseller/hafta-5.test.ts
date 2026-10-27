import { describe, expect, it } from "vitest";
import { durumAdimlayici, durumIzi, GECIS } from "./hafta-5";

describe("101 dedektörü", () => {
  it("örtüşen dizileri de yakalar", () => {
    expect(durumIzi("10101")).toEqual(["S0", "S1", "S10", "S101", "S10", "S101"]);
    // Ders benzetimindeki giriş: 1, 0, 1, 0, 1, 1, 0, 1 üç kez bulur
    expect(durumIzi("10101101").filter((d) => d === "S101")).toHaveLength(3);
  });

  it("S101'e yalnızca son üç bit 1, 0, 1 iken varılır", () => {
    for (let n = 0; n < 256; n++) {
      const b = n.toString(2).padStart(8, "0");
      const iz = durumIzi(b);
      for (let k = 3; k <= 8; k++) expect(iz[k] === "S101").toBe(b.slice(k - 3, k) === "101");
    }
  });

  it("her durumdan iki geçiş vardır ve çizim her girişte üretilir", () => {
    for (const [d, [x0, x1]] of Object.entries(GECIS)) expect([d, x0, x1].every((s) => s.startsWith("S"))).toBe(true);
    expect(durumAdimlayici("")).toContain("S101");
    expect(durumAdimlayici("101")).toContain('"101" bulundu: 1');
  });
});
