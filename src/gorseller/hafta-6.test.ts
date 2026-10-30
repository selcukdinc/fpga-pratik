import { describe, expect, it } from "vitest";
import { KENAR_GIRIS, kenarCikisi, kenarOyunu, ucgenDizisi, ucgenOyunu, UCGEN_SAATLER, UCGEN_TEPELER } from "./hafta-6";

describe("kenar seçimi", () => {
  it("girişler kenarların arasında değişir", () => {
    const kenarlar = [...kenarCikisi("yukselen").kenarlar, ...kenarCikisi("dusen").kenarlar];
    for (const d of Object.values(KENAR_GIRIS))
      for (let k = 1; k < d.length; k++) if (d[k] !== d[k - 1]) expect(kenarlar.includes(k), `dilim ${k}`).toBe(false);
  });

  it("kısa olayları yalnızca düşen kenar yakalar", () => {
    // Yükselen: 1, giris_1'in düşüşünü görmeden doğrudan 0 ve sonda yeniden 1
    expect(kenarCikisi("yukselen").dalga).toMatch(/^x+1+0+1+$/);
    // Düşen: giris_1'in düşüşü (0) ve giris_2'nin darbesi (1) de görünür
    expect(kenarCikisi("dusen").dalga).toMatch(/^x+1+0+1+0+1+$/);
    for (const s of ["yukselen", "dusen", "ikisi"] as const) expect(kenarOyunu(s)).toContain("y (");
  });
});

describe("üçgen dalga", () => {
  it("0'dan tepeye çıkar, 0'a iner; periyot 2 · tepe saat", () => {
    for (const tepe of UCGEN_TEPELER) {
      const d = ucgenDizisi(tepe, 4 * tepe + 1);
      expect(Math.max(...d)).toBe(tepe);
      expect(Math.min(...d)).toBe(0);
      expect(d[tepe]).toBe(tepe);
      expect(d[2 * tepe]).toBe(0);
      expect(d[4 * tepe]).toBe(0);
      for (let k = 1; k < d.length; k++) expect(Math.abs(d[k]! - d[k - 1]!)).toBe(1);
    }
  });

  it("çizim periyodu ve bit sayısını yazar", () => {
    expect(ucgenOyunu(8, 10)).toContain("160 ns");
    expect(ucgenOyunu(32, 40)).toContain("2,56 µs");
    for (const t of UCGEN_TEPELER) for (const c of UCGEN_SAATLER) expect(ucgenOyunu(t, c)).not.toMatch(/NaN|undefined/);
  });
});
