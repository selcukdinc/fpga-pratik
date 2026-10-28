import { describe, expect, it } from "vitest";
import { GUNLUK_SECENEKLERI, GUNLUK_TEKRAR, OGRENILDI, gunlukGecerli, sonrakiKutu } from "./tekrar";

describe("aralıklı tekrar", () => {
  it("doğru cevap bir sonraki kutuya, aralığı o kutunun", () => {
    expect(sonrakiKutu(1, true)).toEqual({ kutu: 2, gun: 3 });
    expect(sonrakiKutu(2, true)).toEqual({ kutu: 3, gun: 7 });
    expect(sonrakiKutu(3, true)).toEqual({ kutu: 4, gun: 14 });
    expect(sonrakiKutu(4, true)).toEqual({ kutu: 5, gun: 30 });
  });

  it("5. kutuda doğru: öğrenildi", () => {
    expect(sonrakiKutu(5, true)).toEqual({ kutu: OGRENILDI, gun: null });
  });

  it("yanlış her zaman 1. kutu, ertesi gün", () => {
    for (const k of [1, 3, 5, OGRENILDI]) expect(sonrakiKutu(k, false)).toEqual({ kutu: 1, gun: 1 });
  });

  it("günlük tekrar seçenekleri varsayılanı içerir, başka değer kabul edilmez", () => {
    expect(GUNLUK_SECENEKLERI).toContain(GUNLUK_TEKRAR);
    for (const n of GUNLUK_SECENEKLERI) expect(gunlukGecerli(n)).toBe(true);
    for (const n of [-1, 15, 1000, "20", null, 20.5]) expect(gunlukGecerli(n)).toBe(false);
  });
});
