import { describe, expect, it } from "vitest";
import { boslukEtiketi, bosluklariAyir } from "./bosluk";

describe("bosluklariAyir", () => {
  it("virgülle ayrılmış adları ayırır", () => {
    const r = bosluklariAyir("A = 1, B = 1 için S ve CO nedir?\n\nBoşluk 1: S, Boşluk 2: CO", 2);
    expect(r.metin).toBe("A = 1, B = 1 için S ve CO nedir?");
    expect(r.adlar).toEqual(["S", "CO"]);
  });

  it("paragraflara ayrılmış uzun adları ayırır", () => {
    const r = bosluklariAyir("Devre:\n\nBoşluk 1: 3. adımda y kaçtır?\n\nBoşluk 2: Liste (a, b, c) olsaydı?", 2);
    expect(r.metin).toBe("Devre:");
    expect(r.adlar).toEqual(["3. adımda y kaçtır?", "Liste (a, b, c) olsaydı?"]);
  });

  it("satır içi kodu ve parantezli virgülleri bozmaz", () => {
    const r = bosluklariAyir("Sonuç?\n\nBoşluk 1: `x sll 1`, Boşluk 2: `x srl 2`", 2);
    expect(r.adlar).toEqual(["`x sll 1`", "`x srl 2`"]);
  });

  it("sayı tutmazsa ya da bölüm yoksa metni olduğu gibi bırakır", () => {
    expect(bosluklariAyir("Boşluğu doldurun: ____", 1)).toEqual({ metin: "Boşluğu doldurun: ____", adlar: [null] });
    const s = "Soru\n\nBoşluk 1: a, Boşluk 2: b";
    expect(bosluklariAyir(s, 3).metin).toBe(s);
  });

  it("etiketler", () => {
    expect(boslukEtiketi(0, 1)).toBe("Cevap");
    expect(boslukEtiketi(1, 3)).toBe("2. boşluk");
  });
});
