import { describe, expect, it } from "vitest";
import { aralikIndisleri, oznitelikSonuc } from "./hafta-3";

describe("öznitelik gezgini", () => {
  it("aralığı soldan sağa indislere açar", () => {
    expect(aralikIndisleri("7 downto 2")).toEqual([7, 6, 5, 4, 3, 2]);
    expect(aralikIndisleri("3 to 10")).toEqual([3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("ders ve sorulardaki değerleri verir", () => {
    const d = (a: string, o: Parameters<typeof oznitelikSonuc>[1]) => oznitelikSonuc(a, o).deger;
    expect([d("7 downto 0", "left"), d("7 downto 0", "right"), d("7 downto 0", "high"), d("7 downto 0", "low"), d("7 downto 0", "length")]).toEqual(["7", "0", "7", "0", "8"]);
    expect(d("7 downto 0", "reverse_range")).toBe("0 to 7");
    expect([d("3 to 10", "left"), d("3 to 10", "high"), d("3 to 10", "length")]).toEqual(["3", "10", "8"]);
    expect([d("7 downto 2", "high"), d("7 downto 2", "low"), d("7 downto 2", "length")]).toEqual(["7", "2", "6"]);
    expect(d("0 to 7", "reverse_range")).toBe("7 downto 0");
  });

  it("'high yönden bağımsız olarak en büyük indisin kutusunu gösterir", () => {
    expect(oznitelikSonuc("7 downto 0", "high").kutular).toEqual([0]);
    expect(oznitelikSonuc("0 to 7", "high").kutular).toEqual([7]);
  });
});
