import { describe, expect, it } from "vitest";
import { terimleriAyir } from "./terimler";

const yaz = (s: string) => terimleriAyir(s).map((p) => (typeof p === "string" ? p : `${p.metin} (${p.en})`)).join("");

describe("terimleriAyir", () => {
  it("büyük harfli mantık işlemleri, küçük harfli bağlaç değil", () => {
    expect(yaz("a ve b'nin VE'si ile VEYA dizisi")).toBe("a ve b'nin VE'si (AND) ile VEYA (OR) dizisi");
  });
  it("uzun terim önce eşleşir", () => {
    expect(yaz("ÖZEL VEYA kapısı")).toBe("ÖZEL VEYA (XOR) kapısı (gate)");
    expect(yaz("bir tam toplayıcı ve bir toplayıcı")).toBe("bir tam toplayıcı (full adder) ve bir toplayıcı (adder)");
  });
  it("Türkçe ekleri ve cümle başını kapsar", () => {
    expect(yaz("Sentez sırasında sentezlenir.")).toBe("Sentez (synthesis) sırasında sentezlenir (synthesis).");
  });
  it("zaten açıklanmış kullanımı atlar", () => {
    expect(yaz("Eşleme (mapping) adımı")).toBe("Eşleme (mapping) adımı");
  });
  it("başka kelimelerin içinde eşleşmez", () => {
    expect(yaz("kapanış değil, VEKİL değil, saatler")).toBe("kapanış değil, VEKİL değil, saatler (clock)");
  });
});
