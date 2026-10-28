import { describe, expect, it } from "vitest";
import { sonucCumlesi } from "./sonuc";

describe("sonuç cümlesi", () => {
  it("doğru/yanlış sorularında cevabı ve ifadeyi ayırır", () => {
    // İfade yanlış, öğrenci "Yanlış" seçti
    expect(sonucCumlesi("tf", true, false, undefined, 0)).toBe("Cevabın doğru: bu ifade yanlış.");
    // İfade yanlış, öğrenci "Doğru" seçti
    expect(sonucCumlesi("tf", false, true, undefined, 0)).toBe("Cevabın yanlış: bu ifade yanlış.");
    expect(sonucCumlesi("tf", false, false, undefined, 0)).toBe("Cevabın yanlış: bu ifade doğru.");
  });

  it("diğer türlerde kısa cümle verir", () => {
    expect(sonucCumlesi("mcq", true, null, undefined, 0)).toBe("Cevabın doğru");
    expect(sonucCumlesi("fill", false, null, [true, false], 1)).toBe("Kısmen doğru: 2 boşluktan 1 tanesi doğru");
    expect(sonucCumlesi("fill", false, null, [false], 0)).toBe("Cevabın yanlış");
  });
});
