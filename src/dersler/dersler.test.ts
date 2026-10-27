import { describe, expect, it } from "vitest";
import { DERSLER } from "./index";
import { sorular } from "../../content/sorular/index";

describe("dersler", () => {
  const kimlikler = new Map(sorular.map((s) => [s.id, s]));
  it("testlerdeki her soru havuzda var, kod sorusu değil ve dersin haftasında", () => {
    for (const d of DERSLER) {
      for (const id of d.test) {
        const s = kimlikler.get(id);
        expect(s, id).toBeDefined();
        expect(s!.tip, id).not.toBe("code");
        expect(s!.hafta <= d.hafta, id).toBe(true);
      }
    }
  });
  it("Kendini dene soruları havuzda, yedek değil ve konu sonu testinde yok", () => {
    for (const d of DERSLER) {
      const goruldu = new Set(d.test);
      for (const b of d.bolumler)
        for (const id of b.dene ?? []) {
          const s = kimlikler.get(id);
          expect(s, id).toBeDefined();
          expect(s!.tip, id).not.toBe("code");
          expect(s!.yedek ?? false, id).toBe(false);
          expect(s!.hafta <= d.hafta, id).toBe(true);
          expect(goruldu.has(id), `${id} iki kez`).toBe(false);
          goruldu.add(id);
        }
    }
  });
  it("her benzetimin en üst birimi kodda tanımlı", () => {
    for (const d of DERSLER)
      for (const b of d.bolumler)
        if (b.sim) expect(b.sim.kod).toMatch(new RegExp(`entity ${b.sim.top} is`));
  });
  it("VHDL dizgilerinde Türkçe karakter yok (VHDL-93 dizgileri Latin-1)", () => {
    for (const d of DERSLER)
      for (const b of d.bolumler)
        for (const dizgi of b.sim?.kod.match(/"[^"\n]*"/g) ?? []) expect(dizgi).toMatch(/^[\x20-\x7e]*$/);
  });
});
