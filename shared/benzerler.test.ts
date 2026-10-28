import { describe, expect, it } from "vitest";
import { BENZERLER, benzerleriAyikla } from "./benzerler";
import { sorular } from "../content/sorular/index";
import { DERSLER } from "../src/dersler/index";

describe("benzer sorular", () => {
  it("gruplardaki her soru havuzda var ve bir gruba bir kez girer", () => {
    const ids = new Set(sorular.map((s) => s.id));
    const goruldu = new Set<string>();
    for (const g of BENZERLER) {
      expect(g.length).toBeGreaterThan(1);
      for (const id of g) {
        expect(ids.has(id), id).toBe(true);
        expect(goruldu.has(id), id).toBe(false);
        goruldu.add(id);
      }
    }
  });

  it("bir dersin testinde ve Kendini dene sorularında aynı gruptan iki soru yok", () => {
    for (const d of DERSLER) {
      const dersteki = [...d.test, ...d.bolumler.flatMap((b) => b.dene ?? [])];
      for (const g of BENZERLER) expect(g.filter((id) => dersteki.includes(id)).length, g.join(", ")).toBeLessThan(2);
    }
  });

  it("gruptan denenmiş soruyu, yoksa ilkini bırakır", () => {
    const liste = [{ id: "a" }, { id: "h4-std-ulogic-deger" }, { id: "b" }, { id: "t4-dokuz-deger" }];
    expect(benzerleriAyikla(liste, () => false).map((q) => q.id)).toEqual(["a", "h4-std-ulogic-deger", "b"]);
    expect(benzerleriAyikla(liste, (id) => id === "t4-dokuz-deger").map((q) => q.id)).toEqual(["a", "b", "t4-dokuz-deger"]);
  });
});
