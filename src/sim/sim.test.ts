import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { cifteKodlamayiCoz, parseMessages } from "./messages";
import { bitsToNumber, parseVcd } from "./vcd";

// NVC'nin tarayıcıda ürettiği gerçek çıktı (renk kodlarıyla birlikte)
const syntaxOutput = [
  "\u001b[31m** Error:\u001b[0m no visible declaration for B",
  " \u001b[34m  > \u001b[0m\u001b]8;;file:///w/bad.vhd#4\u0007bad.vhd:4\u001b]8;;\u0007",
  "  \u001b[34m |\u001b[0m",
  " \u001b[34m4 |\u001b[0m \u001b[36m  y <= a and b\u001b[0m",
  "  \u001b[34m |\u001b[0m \u001b[32m             ^\u001b[0m\u001b[32m did you mean A?\u001b[0m",
  "\u001b[31m** Error:\u001b[0m unexpected \u001b[33mend\u001b[0m while parsing conditional signal assignment, ",
  "          expecting one of \u001b[33m**\u001b[0m, \u001b[33mafter\u001b[0m, \u001b[33m,\u001b[0m, \u001b[33mwhen\u001b[0m or \u001b[33m;\u001b[0m",
  " \u001b[34m  > \u001b[0m\u001b]8;;file:///w/bad.vhd#5\u0007bad.vhd:5\u001b]8;;\u0007",
];

describe("parseMessages", () => {
  it("sözdizimi hatalarını dosya ve satırla ayırır", () => {
    const msgs = parseMessages(syntaxOutput);
    expect(msgs).toHaveLength(2);
    expect(msgs[0]).toMatchObject({ severity: "error", text: "no visible declaration for B", file: "bad.vhd", line: 4 });
    expect(msgs[0].detail.join("\n")).toContain("did you mean A?");
    expect(msgs[1].text).toBe(
      "unexpected end while parsing conditional signal assignment, expecting one of **, after, ,, when or ;",
    );
    expect(msgs[1].line).toBe(5);
  });

  it("report notlarını süreç konumuyla okur", () => {
    const msgs = parseMessages([
      "** Note: 412ns+0: son deger 10\n   Process\u001b[0m :tb:_p1 at \u001b]8;;file:///w/tri.vhd#22\u0007tri.vhd:22\u001b]8;;\u0007",
    ]);
    expect(msgs[0]).toMatchObject({ severity: "note", text: "412ns+0: son deger 10", file: "tri.vhd", line: 22 });
  });

  it("kaynak alıntısındaki Türkçe karakterleri düzeltir", () => {
    // NVC'nin yerel çıktısından: "-- açarsan r = 10 aralık dışı" iki kez UTF-8'e çevrilmiş
    const bozuk = new TextDecoder("latin1").decode(new TextEncoder().encode("-- açarsan r = 10 aralık dışı"));
    expect(bozuk).toContain("Ã§");
    expect(cifteKodlamayiCoz(bozuk)).toBe("-- açarsan r = 10 aralık dışı");
    // Zaten doğru olan metin ve Latin-1'e benzeyen tek karakterler değişmez
    expect(cifteKodlamayiCoz("güçlü ölçü ÇĞİÖŞÜ")).toBe("güçlü ölçü ÇĞİÖŞÜ");
    expect(cifteKodlamayiCoz("Â")).toBe("Â");
  });

  it("kaynak alıntısını dosyanın kendisinden okur", () => {
    // Yerel NVC çıktısı: "ş"nin ikinci baytı (0x9F) hiç basılmamış
    const cikti = ["** Fatal: 0ms+0: value 10 outside of RAKAM range 0 to 9 for variable R", "   > m.vhd:8", "   |", " 8 |     r := r + 1;  -- aÃ§arsan r = 10 aralÄ±k dÄ±ÅÄ±", "   |          ^^^^^"];
    const kaynak = "\n".repeat(7) + "    r := r + 1;  -- açarsan r = 10 aralık dışı\n    wait;";
    const [m] = parseMessages(cikti, { "m.vhd": kaynak });
    expect(m).toMatchObject({ severity: "fatal", file: "m.vhd", line: 8 });
    expect(m!.detail).toContain(" 8 |     r := r + 1;  -- açarsan r = 10 aralık dışı");
    // Kaynak verilmezse kurtarılabilen harfler yine düzelir
    expect(parseMessages(cikti)[0]!.detail[1]).toContain("açarsan r = 10 aralık");
  });
});

describe("parseVcd", () => {
  const vcd = parseVcd(readFileSync(new URL("./fixtures/ucgen.vcd", import.meta.url), "utf8"));

  it("hiyerarşiyi ve genişlikleri okur", () => {
    const q = vcd.signals.find((s) => s.scope === "tb" && s.name === "q[3:0]")!;
    expect(q.width).toBe(4);
    expect(vcd.signals.filter((s) => s.scope === "tb.dut").map((s) => s.name)).toContain("up");
  });

  it("üçgen dalga 0'dan 15'e çıkıp geri iner", () => {
    const q = vcd.signals.find((s) => s.scope === "tb" && s.name === "q[3:0]")!;
    const values = q.changes.map(([, v]) => bitsToNumber(v));
    expect(values.slice(0, 16)).toEqual([...Array(16).keys()]);
    expect(values[16]).toBe(14);
    expect(q.changes[1][0]).toBe(15_000_000); // ilk artış 15 ns'de
  });
});
