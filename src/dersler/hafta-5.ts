import { UST, md, type Ders } from "./tipler";

export const HAFTA_5: Ders = {
  hafta: 5,
  baslik: "Eşzamanlı ve sıralı kod",
  ozet: "when/else ve with/select ile eşzamanlı atamaları; process, if, case ve döngülerle sıralı kodu öğren.",
  bolumler: [
    {
      baslik: "Eşzamanlı kod",
      metin: md(`
Mimarinin gövdesine (process dışına) yazılan her atama **eşzamanlıdır**: satırların sırası önemli değildir, hepsi aynı anda çalışan ayrı donanım parçalarıdır. Sağ taraftaki bir sinyal değişince atama yeniden hesaplanır.

İki koşullu eşzamanlı atama biçimi vardır:

- **when/else:** Koşullar sırayla denenir; ilk doğru olanın değeri atanır. Bu yüzden **öncelik** içerir ve öncelikli bir çoklayıcı zinciri olarak sentezlenir.

~~~
y <= a when sec = "00" else
     b when sec = "01" else
     c;
~~~

- **with/select:** Bir ifadenin değerine göre seçim yapar. Seçenekler öncelik sırası taşımaz; her değer **tam olarak bir kez** yazılmalı ve kalanlar ~when others~ ile kapatılmalıdır. Paralel bir çoklayıcı olarak sentezlenir.

~std_logic~ seçicilerde ~"00"~, ~"01"~... dışında ~'U'~, ~'X'~ gibi değerler de olduğu için ~when others~ pratikte her zaman gerekir.
`),
      sim: {
        top: "tb",
        sure: "60ns",
        gorev: "with/select'teki \"11\" satırını silip derle; when others olmadan da çalıştığını gör. Sonra when others'ı da sil ve hatayı oku.",
        kod: `${UST}
entity mux4 is
  port (
    a, b, c, d : in  std_logic;
    sec        : in  std_logic_vector(1 downto 0);
    y          : out std_logic
  );
end entity;

architecture rtl of mux4 is
begin
  with sec select
    y <= a when "00",
         b when "01",
         c when "10",
         d when "11",
         'X' when others;
end architecture;

library ieee;
use ieee.std_logic_1164.all;

entity tb is
end entity;

architecture sim of tb is
  signal sec : std_logic_vector(1 downto 0) := "00";
  signal y : std_logic;
  -- Girişlere farklı değerler veriyoruz ki seçim görülsün
  signal a : std_logic := '1';
  signal b : std_logic := '0';
  signal c : std_logic := '1';
  signal d : std_logic := '0';
begin
  uut : entity work.mux4 port map (a => a, b => b, c => c, d => d, sec => sec, y => y);

  process
  begin
    sec <= "00"; wait for 10 ns;
    sec <= "01"; wait for 10 ns;
    sec <= "10"; wait for 10 ns;
    sec <= "11"; wait for 10 ns;
    sec <= "1X"; wait for 10 ns;
    wait;
  end process;
end architecture;
`,
      },
    },
    {
      baslik: "process ve hassasiyet listesi",
      metin: md(`
~process~ içindeki satırlar **sırayla** yürür, tıpkı bir programdaki gibi. Ama process'in kendisi diğer process'ler ve eşzamanlı atamalarla aynı anda çalışır.

Bir process ya bir **hassasiyet listesiyle** ya da ~wait~ deyimleriyle beklemeye geçer; ikisi birlikte kullanılamaz.

~~~
process (a, b, sec)
begin
  ...
end process;
~~~

Listedeki sinyallerden biri değiştiğinde process baştan sona bir kez çalışır. Kombinasyonel bir process'te okunan **tüm** sinyaller listede olmalıdır. Eksik bir sinyal benzetimde yanlış sonuç verir; sentez aracı ise genellikle uyarıp listeyi kendisi tamamlar, böylece benzetimle donanım birbirini tutmaz.
`),
    },
    {
      baslik: "if, case ve kilitlenme (latch)",
      metin: md(`
- **if / elsif / else:** Koşullar sırayla denenir, yani **öncelik** vardır. Öncelikli kodlayıcılar için doğaldır.
- **case:** Bir ifadenin değerine göre dallanır; tüm olası değerler kapsanmalıdır, bu yüzden genellikle ~when others =>~ ile biter. Seçenekler arasında öncelik yoktur.

Kombinasyonel bir process'te bir çıkışa **her yolda** değer atanmazsa, sentez aracı eski değeri hatırlamak için bir **latch** (kilitleme elemanı) üretir. Bu çoğunlukla istenmeyen bir durumdur. Önlemek için ya her dalda atama yap ya da process'in başında varsayılan bir değer ver.

Aşağıdaki öncelikli kodlayıcı, en yüksek anlamlı '1' bitinin konumunu verir. Başta ~gecerli <= '0'~ varsayılanı olduğu için latch oluşmaz.
`),
      sim: {
        top: "tb",
        sure: "60ns",
        gorev: "if zincirini case ile yazmayı dene: neden case burada aynı işi daha zor yapar?",
        kod: `${UST}
entity oncelik is
  port (
    r       : in  std_logic_vector(3 downto 0);
    kod     : out std_logic_vector(1 downto 0);
    gecerli : out std_logic
  );
end entity;

architecture rtl of oncelik is
begin
  process (r)
  begin
    kod <= "00";      -- varsayılanlar: latch oluşmaz
    gecerli <= '1';
    if r(3) = '1' then
      kod <= "11";
    elsif r(2) = '1' then
      kod <= "10";
    elsif r(1) = '1' then
      kod <= "01";
    elsif r(0) = '1' then
      kod <= "00";
    else
      gecerli <= '0';
    end if;
  end process;
end architecture;

library ieee;
use ieee.std_logic_1164.all;

entity tb is
end entity;

architecture sim of tb is
  signal r : std_logic_vector(3 downto 0) := "0000";
  signal kod : std_logic_vector(1 downto 0);
  signal gecerli : std_logic;
begin
  uut : entity work.oncelik port map (r => r, kod => kod, gecerli => gecerli);

  process
  begin
    r <= "0000"; wait for 10 ns;
    r <= "0001"; wait for 10 ns;
    r <= "0110"; wait for 10 ns;
    r <= "1011"; wait for 10 ns;
    r <= "0100"; wait for 10 ns;
    wait;
  end process;
end architecture;
`,
      },
    },
    {
      baslik: "Döngüler",
      metin: md(`
~for~ döngüsü sentezde **açılır**: her tur ayrı bir donanım kopyası olur. Bu yüzden sınırları derleme anında bilinmelidir (sabit, generic ya da ~'range~ gibi). Döngü değişkeni kendiliğinden tanımlanır ve döngü içinde değiştirilemez.

~while~ döngüsü ve ~exit~ / ~next~ deyimleri de vardır; ~while~ çoğunlukla yalnızca benzetimde (testbench'te) kullanılır.

Aşağıdaki devre bir vektördeki '1' bitlerini sayar. Döngüdeki ~sayi~ bir **değişken** olduğu için her tur bir öncekinin sonucunu görür; sinyal kullansaydık bu çalışmazdı.
`),
      sim: {
        top: "tb",
        sure: "40ns",
        gorev: "sayi'yı process dışında bir sinyal yapıp aynı döngüyü yaz ve sonucun neden yanlış çıktığını açıkla.",
        kod: `${UST}
entity birler is
  port (
    d : in  std_logic_vector(7 downto 0);
    n : out unsigned(3 downto 0)
  );
end entity;

architecture rtl of birler is
begin
  process (d)
    variable sayi : unsigned(3 downto 0);
  begin
    sayi := (others => '0');
    for i in d'range loop
      if d(i) = '1' then
        sayi := sayi + 1;
      end if;
    end loop;
    n <= sayi;
  end process;
end architecture;

library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity tb is
end entity;

architecture sim of tb is
  signal d : std_logic_vector(7 downto 0) := (others => '0');
  signal n : unsigned(3 downto 0);
begin
  uut : entity work.birler port map (d => d, n => n);

  process
  begin
    d <= "00000001"; wait for 10 ns;
    d <= "10100101"; wait for 10 ns;
    d <= "11111111"; wait for 10 ns;
    report "11111111 icindeki birler: " & integer'image(to_integer(n));
    wait;
  end process;
end architecture;
`,
      },
    },
  ],
  test: ["h5-with-select-mux", "h5-with-others-zorunlu", "h5-oncelikli-secim", "h5-process-tetik", "h5-eksik-hassasiyet", "h5-case-others", "h5-for-statik"],
};
