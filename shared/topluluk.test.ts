import { describe, expect, it } from "vitest";
import { bildirimHatasi, sablonCikar, sureNs, tbHatasi, type TbGirdi } from "./topluluk";

const cozum = `library ieee;
use ieee.std_logic_1164.all;
-- end gibi kelimeler yorumda sorun çıkarmasın
entity ve2 is
  port (a, b : in std_logic; end_flag : out std_logic);
end entity ve2;

architecture rtl of ve2 is
begin
  end_flag <= a and b;
end rtl;
`;

describe("sablonCikar", () => {
  it("kütüphaneleri ve entity'yi alır, mimariyi boş bırakır", () => {
    const s = sablonCikar(cozum)!;
    expect(s.varlik).toBe("ve2");
    expect(s.sablon).toContain("use ieee.std_logic_1164.all;");
    expect(s.sablon).toContain("end_flag : out std_logic");
    expect(s.sablon).toContain("end entity ve2;");
    expect(s.sablon).toContain("architecture rtl of ve2 is\nbegin\n\nend rtl;");
    expect(s.sablon).not.toContain("a and b");
    expect(s.sablon).not.toContain("--");
  });
  it("entity yoksa null döner", () => {
    expect(sablonCikar("architecture x of y is begin end;")).toBeNull();
  });
});

const g: TbGirdi = {
  topicId: "t", title: "VE kapısı", description: "", sablon: "entity x is end x;",
  testbench: 'assert y = \'1\' report "x" severity failure;', top: "tb_x", stopTime: "100 ns",
};

describe("tbHatasi", () => {
  it("geçerli girdiyi kabul eder", () => expect(tbHatasi(g)).toBeNull());
  it("assert'siz testbench'i reddeder", () => expect(tbHatasi({ ...g, testbench: "wait;" })).toMatch(/severity failure/));
  it("süre ve adları denetler", () => {
    expect(tbHatasi({ ...g, stopTime: "100" })).not.toBeNull();
    expect(tbHatasi({ ...g, stopTime: "20 ms" })).not.toBeNull();
    expect(tbHatasi({ ...g, top: "1tb" })).not.toBeNull();
    expect(tbHatasi({ ...g, testbench: "x".repeat(20_001) })).not.toBeNull();
    expect(tbHatasi({ ...g, title: "ab" })).not.toBeNull();
  });
  it("süreyi ns'ye çevirir", () => {
    expect(sureNs("2 us")).toBe(2000);
    expect(sureNs("1ms")).toBe(1e6);
    expect(sureNs("abc")).toBeNull();
  });
});

describe("bildirimHatasi", () => {
  it("tür ve nedeni denetler", () => {
    expect(bildirimHatasi({ tur: "tb", id: "a", neden: "Spam" })).toBeNull();
    expect(bildirimHatasi({ tur: "oneri", id: "a", neden: "Spam" })).not.toBeNull();
    expect(bildirimHatasi({ tur: "tb", id: "a", neden: " " })).not.toBeNull();
  });
});
