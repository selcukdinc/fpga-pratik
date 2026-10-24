// Pratik alanının açılış projesi: derste işlenen üçgen dalga üreteci (VHDL-93)

import type { SimFile } from "./simulator";

export const triangleExample: { files: SimFile[]; top: string; stopTime: string } = {
  top: "tb_triangle_gen",
  stopTime: "6us",
  files: [
    {
      name: "triangle_gen.vhd",
      text: `library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity triangle_gen is
  port (
    clk   : in  std_logic;
    rst   : in  std_logic;
    tri_o : out std_logic_vector(7 downto 0)
  );
end triangle_gen;

architecture rtl of triangle_gen is
  signal cnt : unsigned(7 downto 0) := (others => '0');
  signal up  : std_logic := '1';
begin
  process (clk)
  begin
    if rising_edge(clk) then
      if rst = '1' then
        cnt <= (others => '0');
        up  <= '1';
      elsif up = '1' then
        if cnt = 254 then
          up <= '0';
        end if;
        cnt <= cnt + 1;
      else
        if cnt = 1 then
          up <= '1';
        end if;
        cnt <= cnt - 1;
      end if;
    end if;
  end process;

  tri_o <= std_logic_vector(cnt);
end rtl;
`,
    },
    {
      name: "tb_triangle_gen.vhd",
      text: `library ieee;
use ieee.std_logic_1164.all;

entity tb_triangle_gen is
end tb_triangle_gen;

architecture sim of tb_triangle_gen is
  signal clk   : std_logic := '0';
  signal rst   : std_logic := '1';
  signal tri_o : std_logic_vector(7 downto 0);
begin
  -- 100 MHz saat
  clk <= not clk after 5 ns;

  dut : entity work.triangle_gen
    port map (clk => clk, rst => rst, tri_o => tri_o);

  process
  begin
    wait for 20 ns;
    rst <= '0';
    wait;
  end process;
end sim;
`,
    },
  ],
};
