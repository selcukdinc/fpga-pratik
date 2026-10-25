import { describe, expect, it } from "vitest";
import { adDuzelt, adHatasi, bosAd, crc32, kaynakSablonu, topBul, varliklar, zipOlustur } from "./proje";
import { hataAciklamasi } from "./aciklama";
import { ORNEKLER } from "./ornekler";

const tasarim = { name: "sayac.vhd", text: kaynakSablonu("sayac", "tasarim").replace("--  Port ( );", "port (clk : in std_logic);") };
const tb = { name: "tb_sayac.vhd", text: kaynakSablonu("tb_sayac", "testbench") };

describe("proje", () => {
  it("entity'leri ve portlu olup olmadıklarını bulur", () => {
    expect(varliklar([tasarim, tb])).toEqual([
      { ad: "sayac", dosya: "sayac.vhd", portlu: true },
      { ad: "tb_sayac", dosya: "tb_sayac.vhd", portlu: false },
    ]);
    // Yorumdaki port satırı port sayılmaz, örnekleme entity sayılmaz
    expect(varliklar([{ name: "a.vhd", text: kaynakSablonu("a", "tasarim") + "\nu : entity work.b port map (x => y);" }])).toEqual([
      { ad: "a", dosya: "a.vhd", portlu: false },
    ]);
  });

  it("top seçili değilse testbench'i seçer", () => {
    expect(topBul([tasarim, tb], "")).toBe("tb_sayac");
    expect(topBul([tasarim, tb], "SAYAC")).toBe("sayac");
    expect(topBul([tasarim, tb], "yok")).toBe("tb_sayac");
    expect(topBul([tasarim], "")).toBe("");
  });

  it("dosya adını tanımlayıcıya çevirir ve denetler", () => {
    expect(adDuzelt(" Sayaç Devresi.vhd")).toBe("Sayac_Devresi");
    expect(adHatasi("sayac")).toBeNull();
    expect(adHatasi("4bit")).toMatch(/harfle/);
    expect(adHatasi("a__b")).toMatch(/iki _/);
    expect(adHatasi("process")).toMatch(/ayrılmış/);
    expect(bosAd("sayac", ["sayac", "SAYAC_2"])).toBe("sayac_3");
  });

  it("şablonda port satırı dışında yorum yok", () => {
    const yorumlar = kaynakSablonu("x", "tasarim").split("\n").filter((l) => l.includes("--"));
    expect(yorumlar).toEqual(["--  Port ( );"]);
    expect(kaynakSablonu("tb_x", "testbench")).not.toContain("--");
  });

  it("örnekler verilen adla üretilir ve dizgilerinde Türkçe karakter yok", () => {
    for (const o of ORNEKLER) {
      const u = o.uret("deneme");
      expect(varliklar(u.files).map((v) => v.ad)).toEqual(["deneme", "tb_deneme"]);
      for (const f of u.files) expect(f.text.match(/"[^"\n]*"/g)?.join("") ?? "").toMatch(/^[\x00-\x7f]*$/);
    }
  });

  it("zip yapısı ve CRC doğru", () => {
    expect(crc32(new TextEncoder().encode("123456789"))).toBe(0xcbf43926);
    const z = zipOlustur([tasarim, tb]);
    const v = new DataView(z.buffer);
    expect(v.getUint32(0, true)).toBe(0x04034b50);
    expect(v.getUint32(z.length - 22, true)).toBe(0x06054b50);
    expect(v.getUint16(z.length - 12, true)).toBe(2);
  });

  it("NVC hatalarına açıklama ekler", () => {
    const m = (text: string) => hataAciklamasi({ severity: "error", text, detail: [] });
    expect(m("no visible declaration for STD_LOGIC")).toMatch(/library ieee/);
    expect(m("no visible declaration for Y")).toMatch(/Y adında/);
    expect(m("cannot read output port Q")).toMatch(/okunamaz/);
    expect(m("choices cover only 2 of 81 possible values")).toMatch(/when others/);
    expect(m("tamamen başka bir şey")).toBeNull();
  });
});
