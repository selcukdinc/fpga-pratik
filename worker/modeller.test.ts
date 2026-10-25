import { describe, expect, it } from "vitest";
import { MODELLER, beklenenCikislar, degerlendir, vektorUret } from "./modeller";
import { bitler, izOku, testbenchUret, type KodBilgisi } from "../shared/kod";

const yarim: KodBilgisi = {
  varlik: "half_adder",
  portlar: [
    { ad: "a", yon: "in", genislik: 0 },
    { ad: "b", yon: "in", genislik: 0 },
    { ad: "s", yon: "out", genislik: 0 },
    { ad: "c", yon: "out", genislik: 0 },
  ],
  sablon: "",
};

const sayac: KodBilgisi = {
  varlik: "cnt4",
  saat: "clk",
  portlar: [
    { ad: "clk", yon: "in", genislik: 0 },
    { ad: "rst", yon: "in", genislik: 0 },
    { ad: "en", yon: "in", genislik: 0 },
    { ad: "q", yon: "out", genislik: 4 },
  ],
  sablon: "",
};

// Tekrarlanabilir rastgele sayılar
const tohumlu = (t: number) => () => ((t = (t * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);

describe("testbench", () => {
  it("küçük kombinasyonel girişleri tamamen ve karışık sırayla dener", () => {
    const v = vektorUret(yarim, MODELLER["k-yarim-toplayici"], tohumlu(1));
    expect(v.map((x) => x.a * 2 + x.b).sort()).toEqual([0, 1, 2, 3]);
  });

  it("tasarımı bağlar ve beklenen değerleri içermez", () => {
    const { metin } = testbenchUret(sayac, [{ rst: 1, en: 0 }, { rst: 0, en: 1 }]);
    expect(metin).toContain("dut : entity work.cnt4 port map (clk => clk, rst => rst, en => en, q => q);");
    expect(metin).toContain("rst <= '1'; en <= '0';");
    expect(metin).toContain('report "IZ 1 " & bv(q);');
    expect(metin).not.toContain("0001");
  });

  it("NVC çıktısındaki izleri sırayla okur", () => {
    const iz = izOku([
      "\u001b[0m** Note: 7ns+0: IZ 0 0000\n   Process :tb_sinama:uyaran at tb.vhd:40",
      "** Note: 17ns+0: IZ 1 0001",
      "** Note: 18ns+0: IZ SON",
    ]);
    expect(iz).toEqual(["0000", "0001"]);
  });

  it("sayı ile bit dizgisi arasında çevirir", () => {
    expect(bitler(5, 4)).toBe("0101");
    expect(bitler(1, 0)).toBe("1");
  });
});

describe("değerlendirme", () => {
  const model = MODELLER["k-sayac"];
  const v = vektorUret(sayac, model, tohumlu(7));
  const dogruIz = beklenenCikislar(sayac, model, v).map((d) => bitler(d.q, 4));

  it("doğru iz tüm kontrol noktalarını geçer", () => {
    const d = degerlendir(sayac, model, v, dogruIz);
    expect(d).toMatchObject({ gecen: v.length, toplam: v.length, rapor: null });
  });

  it("bir çevrim gecikmeyi fark eder ve öncesini de raporlar", () => {
    const gecikmeli = ["UUUU", ...dogruIz.slice(0, -1)];
    gecikmeli[0] = "0000";
    const d = degerlendir(sayac, model, v, gecikmeli);
    expect(d.gecen).toBeLessThan(v.length);
    expect(d.ipucu).toMatch(/geriden/);
    expect(d.rapor!.at(-1)!.dogru).toBe(false);
  });

  it("eksik iz ve U değerleri için ipucu verir", () => {
    expect(degerlendir(sayac, model, v, []).ipucu).toMatch(/hiçbir çıkış/);
    expect(degerlendir(sayac, model, v, v.map(() => "UUUU")).ipucu).toMatch(/'U'/);
  });

  it("H ve L değerlerini 1 ve 0 sayar", () => {
    const iz = dogruIz.map((s) => s.replace(/1/g, "H"));
    expect(degerlendir(sayac, model, v, iz).gecen).toBe(v.length);
  });
});
