import { describe, expect, it } from "vitest";
import { vhdlGirinti } from "./vhdlGirinti";

const g = (kod: string, suanki = "") => vhdlGirinti(kod.split("\n"), suanki);

describe("VHDL girintisi", () => {
  it("wait satırlarından sonra aynı girintide kalır", () => {
    expect(g("  process\n  begin\n    report \"x\";\n    wait;")).toBe(4);
    expect(g("    wait for 0 ns;")).toBe(4);
    expect(g("    wait for 10 ns;  -- for burada döngü değil")).toBe(4);
    expect(g("    wait until rising_edge(clk);")).toBe(4);
  });

  it("blok açan satırlardan sonra bir kademe içeri girer", () => {
    expect(g("architecture rtl of x is")).toBe(2);
    expect(g("  process (clk, rst)")).toBe(4);
    expect(g("  p1 : process")).toBe(4);
    expect(g("    if rising_edge(clk) then")).toBe(6);
    expect(g("    for i in 0 to 7 loop")).toBe(6);
    expect(g("    while n < 10 loop")).toBe(6);
    expect(g("      when \"01\" =>")).toBe(8);
    expect(g("  port (")).toBe(4);
    expect(g("  with sec select")).toBe(4);
    expect(g("  gen : for i in 0 to 3 generate")).toBe(4);
  });

  it("kapatan sözcükler bir kademe geri gelir", () => {
    expect(g("    wait;", "end process;")).toBe(2);
    expect(g("      q <= d;", "end if;")).toBe(4);
    expect(g("      q <= d;", "else")).toBe(4);
    expect(g("      q <= d;", "elsif rst = '1' then")).toBe(4);
    expect(g("    variable v : integer;", "begin")).toBe(2);
    expect(g("    a : in std_logic", ");")).toBe(2);
  });

  it("blok açan satırın hemen ardından gelen kapatan aynı hizada durur", () => {
    expect(g("  process (clk)", "begin")).toBe(2);
    expect(g("    if a = '1' then", "else")).toBe(4);
    expect(g("entity x is", "end entity;")).toBe(0);
  });

  it("case'in ilk when'i içeride, sonrakiler aynı hizada", () => {
    expect(g("    case s is", "when \"00\" =>")).toBe(6);
    expect(g("    case s is\n      when \"00\" =>\n        y <= a;", "when others =>")).toBe(6);
  });

  it("boş satırları atlar ve yorumu, dizgiyi saymaz", () => {
    expect(g("    if a then\n\n")).toBe(6);
    expect(g("    report \"loop is\";")).toBe(4);
    expect(g("    x := 1;  -- then")).toBe(4);
    expect(g("")).toBe(0);
  });

  it("noktalı virgülle biten bildirimler blok açmaz", () => {
    expect(g("  type durum_t is (S0, S1);")).toBe(2);
    expect(g("  subtype rakam is integer range 0 to 9;")).toBe(2);
    expect(g("  component ha port (a : in bit);")).toBe(2);
  });

  it("end case ve end if açan satırın hizasına döner", () => {
    expect(g("    case s is\n      when \"00\" =>\n        y <= a;\n      when others =>\n        y <= b;", "end case;")).toBe(4);
    expect(g("  if a then\n    if b then\n      y <= 1;\n    end if;\n    z <= 1;", "end if;")).toBe(2);
    expect(g("p : process (clk)\nbegin\n  if rising_edge(clk) then\n    q <= d;\n  end if;", "end process;")).toBe(0);
  });
});
