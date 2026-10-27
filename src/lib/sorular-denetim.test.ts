// Soru havuzundaki çoktan seçmeli soruların şıkları adil mi (bkz. sik-denetimi.ts)
import { describe, expect, it } from "vitest";
import { sorular } from "../../content/sorular/index";
import { sikUyarilari } from "./sik-denetimi";

describe("şık denetimi", () => {
  const mcq = sorular.flatMap((s) => (s.tip === "mcq" ? [[s.id, s.secenekler, s.dogru] as const] : []));
  it.each(mcq)("%s", (_, secenekler, dogru) => {
    expect(sikUyarilari(secenekler, dogru)).toEqual([]);
  });

  it("sorunları yakalar", () => {
    expect(sikUyarilari(["Sentez (synthesis)", "Simülasyon", "Eşleme", "Yerleştirme"], 0)).toHaveLength(1);
    expect(sikUyarilari(["kısa", "kısa bir şık", "bu doğru şık açıklamayı da içinde taşıyan çok uzun bir cümle", "yine kısa"], 2)).toHaveLength(1);
    expect(sikUyarilari(["~(a and b)~", "~a or b~", "c", "d"], 0)).toEqual([]);
  });
});
