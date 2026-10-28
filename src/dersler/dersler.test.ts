import { describe, expect, it } from "vitest";
import { DERSLER } from "./index";
import { sorular } from "../../content/sorular/index";
import { gorselBul } from "../gorseller";
import { KAVRAM_BOLUMU, soruBolumu } from "./bolumBul";
import { kavramOf } from "../../shared/kavramlar";

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

  // Ders bir değeri çözdüyse aynı değer soruda sorulmaz: öğrenci kuralı uygulamalı,
  // cevabı dersten hatırlamamalı. Taban belirtilen dizgiler, tabanlı tamsayılar,
  // mod/rem işlemleri, "(5 to 12)" gibi aralıklar ve generic değerleri metnin,
  // benzetimin ya da şekil açıklamasının herhangi bir yerinde; 4 bit ve üstü iki
  // vektörün birlikte geçmesi ise yalnızca çözümlü örneklerde aranır.
  it("ders metni ve örnekleri soruların değerlerini önceden çözmez", () => {
    const OZEL = /\b[xob]"[0-9a-f_]+"|\b\d+#[0-9a-f_]+#|-?\d+\s*(?:mod|rem)\s*\(?-?\d+\)?|\(\s*[1-9]\d*\s+to\s+\d+\s*\)|\bn\s*=>\s*\d+/gi;
    const VEKTOR = /"[01]{4,}"/g;
    const ORNEK = /^> \*\*Çözümlü örnek.*(?:\n>.*)*/gm;
    const bul = (s: string, r: RegExp) => new Set([...s.matchAll(r)].map((m) => m[0].toLowerCase().replace(/\s+/g, " ")));
    const cakisan: string[] = [];
    for (const d of DERSLER) {
      const ornekler: string[] = [];
      const diger: string[] = [];
      for (const b of d.bolumler) {
        ornekler.push(...[...b.metin.matchAll(ORNEK)].map((m) => m[0]));
        diger.push(b.metin, b.sim?.kod ?? "");
        for (const m of b.metin.matchAll(/\[\[(G-H\d+-\d+)\]\]/g)) diger.push(gorselBul(m[1]!)?.aciklama ?? "");
      }
      const dersOzel = bul(diger.join("\n"), OZEL);
      for (const s of sorular) {
        if (s.hafta !== d.hafta && !(d.hafta <= 2 && s.hafta <= 2)) continue;
        for (const t of bul(s.soru, OZEL)) if (dersOzel.has(t)) cakisan.push(`${s.id}: ${t}`);
        const v = bul(s.soru, VEKTOR);
        for (const o of ornekler) {
          const ortak = [...bul(o, VEKTOR)].filter((t) => v.has(t));
          if (ortak.length >= 2) cakisan.push(`${s.id}: ${ortak.join(" ")}`);
        }
      }
    }
    expect(cakisan).toEqual([]);
  });

  it("her sorunun kavramı kendi haftasının bir ders bölümüne bağlı", () => {
    const eksik: string[] = [];
    for (const s of sorular) {
      const kavram = s.kavram ?? kavramOf(s.id) ?? null;
      const b = soruBolumu({ id: s.id, week: s.hafta, kavram });
      if (!b || b.bolum === null) eksik.push(`${s.id} (${s.hafta}, ${kavram})`);
    }
    expect(eksik).toEqual([]);
    for (const [h, harita] of Object.entries(KAVRAM_BOLUMU)) {
      const d = DERSLER.find((x) => x.hafta === Number(h))!;
      for (const i of Object.values(harita)) expect(d.bolumler[i], `${h}. hafta ${i}. bölüm`).toBeDefined();
    }
  });
});
