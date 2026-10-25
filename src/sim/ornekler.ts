// Simülasyon alanına eklenebilen örnek projeler (VHDL-93, numeric_std).
// Her örnek bir ad alır; dosya ve entity adları bu addan üretilir, böylece
// aynı örnek farklı adlarla birden çok kez eklenebilir.

import type { SimFile } from "./simulator";

export interface Ornek {
  id: string;
  baslik: string;
  aciklama: string;
  varsayilanAd: string;
  stopTime: string;
  // Dosyalar ve top birimi
  uret: (ad: string) => { files: SimFile[]; top: string };
}

const UST = "library ieee;\nuse ieee.std_logic_1164.all;\nuse ieee.numeric_std.all;\n";

export const ORNEKLER: Ornek[] = [
  {
    id: "ucgen",
    baslik: "Üçgen dalga üreteci",
    aciklama: "8 bitlik sayaç 0'dan 255'e çıkıp geri iner. Dalga ekranında çıkışı analog (∿) gösterimle izle.",
    varsayilanAd: "triangle_gen",
    stopTime: "6us",
    uret: (ad) => ({
      top: `tb_${ad}`,
      files: [
        {
          name: `${ad}.vhd`,
          text: `${UST}
entity ${ad} is
  port (
    clk   : in  std_logic;
    rst   : in  std_logic;
    tri_o : out std_logic_vector(7 downto 0)
  );
end ${ad};

architecture rtl of ${ad} is
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
          name: `tb_${ad}.vhd`,
          text: `${UST}
entity tb_${ad} is
end tb_${ad};

architecture sim of tb_${ad} is
  signal clk   : std_logic := '0';
  signal rst   : std_logic := '1';
  signal tri_o : std_logic_vector(7 downto 0);
begin
  -- 100 MHz saat
  clk <= not clk after 5 ns;

  dut : entity work.${ad}
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
    }),
  },
  {
    id: "sayac",
    baslik: "4 bitlik sayıcı",
    aciklama: "Eşzamanlı reset ve enable girişli yukarı sayıcı. Testbench enable'ı bir süre kapatıp sayımın durduğunu gösterir.",
    varsayilanAd: "sayac",
    stopTime: "400ns",
    uret: (ad) => ({
      top: `tb_${ad}`,
      files: [
        {
          name: `${ad}.vhd`,
          text: `${UST}
entity ${ad} is
  port (
    clk : in  std_logic;
    rst : in  std_logic;
    en  : in  std_logic;
    q   : out std_logic_vector(3 downto 0)
  );
end ${ad};

architecture rtl of ${ad} is
  signal sayi : unsigned(3 downto 0) := (others => '0');
begin
  process (clk)
  begin
    if rising_edge(clk) then
      if rst = '1' then
        sayi <= (others => '0');
      elsif en = '1' then
        sayi <= sayi + 1;
      end if;
    end if;
  end process;

  q <= std_logic_vector(sayi);
end rtl;
`,
        },
        {
          name: `tb_${ad}.vhd`,
          text: `${UST}
entity tb_${ad} is
end tb_${ad};

architecture sim of tb_${ad} is
  signal clk : std_logic := '0';
  signal rst : std_logic := '1';
  signal en  : std_logic := '0';
  signal q   : std_logic_vector(3 downto 0);
begin
  clk <= not clk after 5 ns;

  dut : entity work.${ad}
    port map (clk => clk, rst => rst, en => en, q => q);

  process
  begin
    wait for 20 ns;
    rst <= '0';
    en  <= '1';
    wait for 100 ns;
    assert q = "1010" report "10 saat sonra q 1010 olmaliydi" severity error;
    en <= '0';
    wait for 50 ns;
    assert q = "1010" report "en = 0 iken q degismemeli" severity error;
    en <= '1';
    wait;
  end process;
end sim;
`,
        },
      ],
    }),
  },
  {
    id: "yarim-toplayici",
    baslik: "Yarım toplayıcı",
    aciklama: "İki eşzamanlı atama. Testbench dört giriş kombinasyonunun hepsini assert ile kontrol eder.",
    varsayilanAd: "half_adder",
    stopTime: "100ns",
    uret: (ad) => ({
      top: `tb_${ad}`,
      files: [
        {
          name: `${ad}.vhd`,
          text: `${UST}
entity ${ad} is
  port (
    a, b : in  std_logic;
    s, c : out std_logic
  );
end ${ad};

architecture rtl of ${ad} is
begin
  s <= a xor b;
  c <= a and b;
end rtl;
`,
        },
        {
          name: `tb_${ad}.vhd`,
          text: `${UST}
entity tb_${ad} is
end tb_${ad};

architecture sim of tb_${ad} is
  signal a, b, s, c : std_logic := '0';
begin
  dut : entity work.${ad}
    port map (a => a, b => b, s => s, c => c);

  process
    variable giris : unsigned(1 downto 0);
  begin
    for i in 0 to 3 loop
      giris := to_unsigned(i, 2);
      a <= giris(1);
      b <= giris(0);
      wait for 10 ns;
      assert s = (giris(1) xor giris(0)) and c = (giris(1) and giris(0))
        report "yanlis sonuc: i = " & integer'image(i) severity error;
    end loop;
    report "dort durum da denendi";
    wait;
  end process;
end sim;
`,
        },
      ],
    }),
  },
  {
    id: "mux4",
    baslik: "4'e 1 multiplexer",
    aciklama: "with/select ile seçici. Testbench seçme girişini sırayla değiştirir.",
    varsayilanAd: "mux4",
    stopTime: "100ns",
    uret: (ad) => ({
      top: `tb_${ad}`,
      files: [
        {
          name: `${ad}.vhd`,
          text: `${UST}
entity ${ad} is
  port (
    d   : in  std_logic_vector(3 downto 0);
    sel : in  std_logic_vector(1 downto 0);
    y   : out std_logic
  );
end ${ad};

architecture rtl of ${ad} is
begin
  with sel select
    y <= d(0) when "00",
         d(1) when "01",
         d(2) when "10",
         d(3) when others;
end rtl;
`,
        },
        {
          name: `tb_${ad}.vhd`,
          text: `${UST}
entity tb_${ad} is
end tb_${ad};

architecture sim of tb_${ad} is
  signal d   : std_logic_vector(3 downto 0) := "1010";
  signal sel : std_logic_vector(1 downto 0) := "00";
  signal y   : std_logic;
begin
  dut : entity work.${ad}
    port map (d => d, sel => sel, y => y);

  process
  begin
    for i in 0 to 3 loop
      sel <= std_logic_vector(to_unsigned(i, 2));
      wait for 10 ns;
      assert y = d(i) report "y, d(" & integer'image(i) & ") olmaliydi" severity error;
    end loop;
    d <= "0101";
    for i in 0 to 3 loop
      sel <= std_logic_vector(to_unsigned(i, 2));
      wait for 10 ns;
      assert y = d(i) report "y, d(" & integer'image(i) & ") olmaliydi" severity error;
    end loop;
    wait;
  end process;
end sim;
`,
        },
      ],
    }),
  },
  {
    id: "kaydirma",
    baslik: "8 bitlik kaydırma yazmacı",
    aciklama: "Seri giriş, paralel çıkış. Her saat kenarında bitler bir sola kayar.",
    varsayilanAd: "kaydirma",
    stopTime: "200ns",
    uret: (ad) => ({
      top: `tb_${ad}`,
      files: [
        {
          name: `${ad}.vhd`,
          text: `${UST}
entity ${ad} is
  port (
    clk : in  std_logic;
    rst : in  std_logic;
    din : in  std_logic;
    q   : out std_logic_vector(7 downto 0)
  );
end ${ad};

architecture rtl of ${ad} is
  signal r : std_logic_vector(7 downto 0) := (others => '0');
begin
  process (clk)
  begin
    if rising_edge(clk) then
      if rst = '1' then
        r <= (others => '0');
      else
        r <= r(6 downto 0) & din;
      end if;
    end if;
  end process;

  q <= r;
end rtl;
`,
        },
        {
          name: `tb_${ad}.vhd`,
          text: `${UST}
entity tb_${ad} is
end tb_${ad};

architecture sim of tb_${ad} is
  constant DIZI : std_logic_vector(7 downto 0) := "10110011";
  signal clk : std_logic := '0';
  signal rst : std_logic := '1';
  signal din : std_logic := '0';
  signal q   : std_logic_vector(7 downto 0);
begin
  clk <= not clk after 5 ns;

  dut : entity work.${ad}
    port map (clk => clk, rst => rst, din => din, q => q);

  process
  begin
    wait until falling_edge(clk);
    rst <= '0';
    for i in 7 downto 0 loop
      din <= DIZI(i);
      wait until falling_edge(clk);
    end loop;
    assert q = DIZI report "sekiz kenardan sonra q, DIZI olmaliydi" severity error;
    wait;
  end process;
end sim;
`,
        },
      ],
    }),
  },
  {
    id: "pwm",
    baslik: "PWM üreteci",
    aciklama: "8 bitlik sayaçla darbe genişlik modülasyonu. Testbench görev oranını %25, %50 ve %75 yapar.",
    varsayilanAd: "pwm",
    stopTime: "8us",
    uret: (ad) => ({
      top: `tb_${ad}`,
      files: [
        {
          name: `${ad}.vhd`,
          text: `${UST}
entity ${ad} is
  port (
    clk  : in  std_logic;
    rst  : in  std_logic;
    duty : in  std_logic_vector(7 downto 0);
    o    : out std_logic
  );
end ${ad};

architecture rtl of ${ad} is
  signal cnt : unsigned(7 downto 0) := (others => '0');
begin
  process (clk)
  begin
    if rising_edge(clk) then
      if rst = '1' then
        cnt <= (others => '0');
      else
        cnt <= cnt + 1;
      end if;
    end if;
  end process;

  o <= '1' when cnt < unsigned(duty) else '0';
end rtl;
`,
        },
        {
          name: `tb_${ad}.vhd`,
          text: `${UST}
entity tb_${ad} is
end tb_${ad};

architecture sim of tb_${ad} is
  signal clk  : std_logic := '0';
  signal rst  : std_logic := '1';
  signal duty : std_logic_vector(7 downto 0) := std_logic_vector(to_unsigned(64, 8));
  signal o    : std_logic;
begin
  clk <= not clk after 5 ns;

  dut : entity work.${ad}
    port map (clk => clk, rst => rst, duty => duty, o => o);

  process
  begin
    wait for 20 ns;
    rst <= '0';
    wait for 2560 ns;
    duty <= std_logic_vector(to_unsigned(128, 8));
    wait for 2560 ns;
    duty <= std_logic_vector(to_unsigned(192, 8));
    wait;
  end process;
end sim;
`,
        },
      ],
    }),
  },
  {
    id: "trafik",
    baslik: "Trafik lambası (durum makinesi)",
    aciklama: "Kırmızı, kırmızı-sarı, yeşil ve sarı durumları arasında süreli geçiş yapan Moore makinesi.",
    varsayilanAd: "trafik",
    stopTime: "500ns",
    uret: (ad) => ({
      top: `tb_${ad}`,
      files: [
        {
          name: `${ad}.vhd`,
          text: `${UST}
entity ${ad} is
  port (
    clk     : in  std_logic;
    rst     : in  std_logic;
    kirmizi : out std_logic;
    sari    : out std_logic;
    yesil   : out std_logic
  );
end ${ad};

architecture rtl of ${ad} is
  type durum_t is (KIRMIZI_D, KIRMIZI_SARI_D, YESIL_D, SARI_D);
  signal durum : durum_t := KIRMIZI_D;
  signal sure  : integer range 0 to 7 := 0;
begin
  process (clk)
  begin
    if rising_edge(clk) then
      if rst = '1' then
        durum <= KIRMIZI_D;
        sure  <= 0;
      elsif sure > 0 then
        sure <= sure - 1;
      else
        case durum is
          when KIRMIZI_D      => durum <= KIRMIZI_SARI_D; sure <= 1;
          when KIRMIZI_SARI_D => durum <= YESIL_D;        sure <= 5;
          when YESIL_D        => durum <= SARI_D;         sure <= 1;
          when SARI_D         => durum <= KIRMIZI_D;      sure <= 5;
        end case;
      end if;
    end if;
  end process;

  kirmizi <= '1' when durum = KIRMIZI_D or durum = KIRMIZI_SARI_D else '0';
  sari    <= '1' when durum = KIRMIZI_SARI_D or durum = SARI_D else '0';
  yesil   <= '1' when durum = YESIL_D else '0';
end rtl;
`,
        },
        {
          name: `tb_${ad}.vhd`,
          text: `${UST}
entity tb_${ad} is
end tb_${ad};

architecture sim of tb_${ad} is
  signal clk : std_logic := '0';
  signal rst : std_logic := '1';
  signal kirmizi, sari, yesil : std_logic;
begin
  clk <= not clk after 10 ns;

  dut : entity work.${ad}
    port map (clk => clk, rst => rst, kirmizi => kirmizi, sari => sari, yesil => yesil);

  process
  begin
    wait for 30 ns;
    rst <= '0';
    wait;
  end process;
end sim;
`,
        },
      ],
    }),
  },
];
