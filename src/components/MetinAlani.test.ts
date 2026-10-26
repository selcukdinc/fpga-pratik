import { describe, expect, it } from "vitest";
import { bicimle } from "./MetinAlani";

describe("bicimle", () => {
  it("seçimi kalın ve kod yapar, ikinci basışta geri alır", () => {
    const a = bicimle("a sig b", 2, 5, "kod");
    expect(a.metin).toBe("a `sig` b");
    expect(a.metin.slice(a.bas, a.son)).toBe("sig");
    expect(bicimle(a.metin, a.bas, a.son, "kod").metin).toBe("a sig b");
    expect(bicimle("x", 0, 1, "kalin").metin).toBe("**x**");
  });
  it("boş seçimde yer tutucu ekler", () => {
    const d = bicimle("ab", 1, 1, "kod");
    expect(d.metin).toBe("a`kod`b");
  });
  it("satırları liste yapar ve geri alır", () => {
    const d = bicimle("bir\niki", 0, 7, "liste");
    expect(d.metin).toBe("- bir\n- iki");
    expect(bicimle(d.metin, 0, d.metin.length, "liste").metin).toBe("bir\niki");
  });
  it("seçili satırları kod bloğuna alır ve geri çıkarır", () => {
    const m = "Açıklama\nq <= d;";
    const d = bicimle(m, 9, m.length, "blok");
    expect(d.metin).toBe("Açıklama\n\n```\nq <= d;\n```");
    expect(d.metin.slice(d.bas, d.son)).toBe("q <= d;");
    expect(bicimle(d.metin, d.bas, d.son, "blok").metin).toBe("Açıklama\n\nq <= d;");
  });
});
