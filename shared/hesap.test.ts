import { describe, expect, it } from "vitest";
import { epostaHatasi, kullaniciAdiHatasi, parolaGucu, parolaHatasi } from "./hesap";
import { AVATARLAR } from "./avatarlar";

describe("kullanıcı adı", () => {
  it("kurala uyanları kabul eder", () => {
    for (const ad of ["ali", "ayse_42", "a_b_c", "x".repeat(20)]) expect(kullaniciAdiHatasi(ad)).toBeNull();
  });
  it("kısa, uzun, büyük harfli ve Türkçe karakterli adları reddeder", () => {
    for (const ad of ["al", "x".repeat(21), "Ali", "ayşe", "ali veli", "ali-veli"]) expect(kullaniciAdiHatasi(ad)).not.toBeNull();
  });
  it("ayrılmış adları reddeder", () => {
    expect(kullaniciAdiHatasi("admin")).not.toBeNull();
    expect(kullaniciAdiHatasi("yonetim")).not.toBeNull();
  });
});

describe("e-posta", () => {
  it("biçimi kontrol eder", () => {
    expect(epostaHatasi("ogrenci@ogr.example.edu.tr")).toBeNull();
    expect(epostaHatasi("ogrenci@")).not.toBeNull();
    expect(epostaHatasi("ogr enci@a.com")).not.toBeNull();
  });
});

describe("parola gücü", () => {
  it("10 karakterden kısa parolayı kabul etmez", () => {
    expect(parolaGucu("Ab3!xyz").seviye).toBe(0);
  });
  it("tekrar eden karakterleri ve kullanıcı adını içeren parolayı kabul etmez", () => {
    expect(parolaGucu("aaaaaaaaaaaa").seviye).toBe(0);
    expect(parolaGucu("ababababababab").seviye).toBe(0);
    expect(parolaGucu("mehmet2026!!", ["mehmet"]).seviye).toBe(0);
  });
  it("bilinen parolaları zayıf sayar", () => {
    expect(parolaGucu("1234567890").seviye).toBe(1);
    expect(parolaGucu("qwertyuiop").seviye).toBe(1);
    expect(parolaGucu("galatasaray1905").seviye).toBe(1);
  });
  it("uzun ve karışık parolaları güçlü sayar", () => {
    expect(parolaGucu("Mavi-Kedi-Uçuyor-7").seviye).toBe(3);
    expect(parolaGucu("kirmizi elma ve yesil armut").seviye).toBeGreaterThanOrEqual(2);
  });
  it("sunucu yalnızca kabul edilmeyenleri reddeder", () => {
    expect(parolaHatasi("1234567890")).toBeNull();
    expect(parolaHatasi("kisa")).not.toBeNull();
  });
});

describe("avatarlar", () => {
  it("56 tane ve kimlikleri tekil", () => {
    expect(AVATARLAR).toHaveLength(56);
    expect(new Set(AVATARLAR.map((a) => a.id)).size).toBe(56);
  });
});
