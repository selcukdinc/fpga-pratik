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

Son satırdaki koşulsuz ~else~ önemlidir. Son dal da koşullu yazılırsa (~... else c when sec = "10";~) kod VHDL-93'te derlenir, ama hiçbir koşul doğru olmadığında atama yapılmaz ve sinyal **eski değerini saklar**. Bu, kombinasyonel bir çoklayıcıda istenmeyen bir bellek, yani latch demektir.

Koşulların her biri farklı sinyalleri sorgulayabilir; ilk doğru koşul kazanır. ~std_logic~ bir sinyal ~'Z'~ ya da ~'X'~ olduğunda ne ~'0'~'a ne ~'1'~'e eşittir, bu yüzden bu koşulların hepsi yanlış çıkar ve son ~else~ dalı seçilir.

- **with/select:** Bir ifadenin değerine göre seçim yapar. Seçenekler öncelik sırası taşımaz; her değer **tam olarak bir kez** yazılmalı ve kalanlar ~when others~ ile kapatılmalıdır. Paralel bir çoklayıcı olarak sentezlenir.

[[G-H5-01]]

~std_logic~ seçicilerde ~"00"~, ~"01"~... dışında ~'U'~, ~'X'~ gibi değerler de olduğu için ~when others~ pratikte her zaman gerekir: 2 bitlik bir std_logic vektörünün 9 · 9 = 81 olası değeri vardır, dört ikilik değer yetmez. Seçici ~'X'~ ya da ~'Z'~ olursa açıkça yazılmış hiçbir seçeneğe uymaz ve ~others~ dalına düşer.

with/select kuralları:

- Aynı değeri iki kez yazmak derleme hatasıdır; seçenekler birbirini dışlar. "İlk eşleşen kazanır" mantığı when/else'e aittir.
- Birden çok değer ~|~ ile tek dalda birleştirilir: ~y <= a when "00" | "11",~. Virgül ise dalları ayırır.
- with/select eşzamanlı bir deyimdir, process dışında yazılır. VHDL-93'te process içinde kullanılamaz; orada aynı işi ~case~ yapar. (VHDL-2008 sıralı biçimine izin verir.)
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

Bir process ya bir **hassasiyet listesiyle** ya da ~wait~ deyimleriyle beklemeye geçer; ikisi birlikte kullanılamaz. Testbench'lerdeki listesiz process'ler bu yüzden ~wait for 10 ns;~ gibi satırlar içerir.

~~~
process (a, b, sec)
  variable gecici : std_logic;   -- bildirim bölümü
begin
  ...
end process;
~~~

~process (...)~ ile ~begin~ arasındaki kısım process'in **bildirim bölümüdür**; değişkenler, sabitler ve process'e özel tipler burada tanımlanır.

Listedeki sinyallerden biri değiştiğinde process baştan sona bir kez çalışır, sonra listedeki bir sinyal yeniden değişene kadar bekler. Ayrıca benzetim başlarken **her process bir kez** çalışır (beklemeye geçene kadar); bu yüzden kombinasyonel çıkışlar ilk anda da hesaplanır. Kombinasyonel bir process'te okunan **tüm** sinyaller listede olmalıdır. Eksik bir sinyal benzetimde yanlış sonuç verir; sentez aracı ise genellikle uyarıp listeyi kendisi tamamlar, böylece benzetimle donanım birbirini tutmaz. Örneğin ~process (a)~ içinde ~y <= a and b;~ yazılırsa yalnızca ~b~ değiştiğinde process uyanmaz ve ~y~ eski değerinde kalır; sentezlenen devre ise düz bir AND kapısıdır.

VHDL-2008'de ~process (all)~ yazabilirsin: ~all~, process'in okuduğu bütün sinyalleri listeye kendiliğinden ekler ve eksik hassasiyet hatasını önler.
`),
    },
    {
      baslik: "if, case ve kilitlenme (latch)",
      metin: md(`
- **if / elsif / else:** Koşullar sırayla denenir, yani **öncelik** vardır. Öncelikli kodlayıcılar için doğaldır.
- **case:** Bir ifadenin değerine göre dallanır; tüm olası değerler kapsanmalıdır, bu yüzden genellikle ~when others =>~ ile biter. Seçenekler arasında öncelik yoktur.

case kuralları:

- Seçenekler **sabit** (yerel statik) değerler olmalıdır: ~when "01" =>~, ~when 3 =>~ ya da bir ~constant~. Bir sinyalle ya da değişkenle karşılaştırma gerekiyorsa if/elsif kullanılır.
- Aynı değer iki kez yazılamaz; seçimler çakışmamalıdır.
- Tamsayılarda aralık ~to~ ile, ayrık değerler ~|~ ile yazılır: ~when 0 to 3 =>~, ~when 0 | 2 =>~.
- Her dalda en az bir deyim olmalıdır. "Hiçbir şey yapma" ~null;~ ile söylenir: ~when others => null;~

Kombinasyonel bir process'te bir çıkışa **her yolda** değer atanmazsa, sentez aracı eski değeri hatırlamak için bir **latch** (kilitleme elemanı) üretir. Bu çoğunlukla istenmeyen bir durumdur. Önlemek için ya her dalda atama yap ya da process'in başında varsayılan bir değer ver.

[[G-H5-02]]

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

Aralığı bir giriş sinyaline bağlı bir döngü sentezlenemez. ~for i in 7 downto 2 loop~ 7, 6, 5, 4, 3, 2 değerlerini alır, yani 6 tur döner.

~while~ döngüsü ve ~exit~ / ~next~ deyimleri de vardır; ~while~ çoğunlukla yalnızca benzetimde (testbench'te) kullanılır. ~exit~ döngüden tamamen çıkar (örneğin aranan şey bulununca), ~next~ ise o turun kalanını atlayıp sonraki tura geçer.

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
    {
      baslik: "Saat ile çalışan devreler: flip-flop, sayaç ve kaydırmalı kayıtçı",
      metin: md(`
Şimdiye kadarki process'ler kombinasyoneldi. Bir process'in içinde ~if rising_edge(clk) then~ yazdığında atamalar yalnızca saatin **yükselen kenarında** yapılır ve sentez aracı her atanan sinyal için bir **D flip-flop** kurar. ~rising_edge(clk)~, ~clk'event and clk = '1'~ ile aynı işi yapar; ayrıca 'X'ten '1'e gibi geçişleri dışarıda bırakır.

~~~
process (clk)
begin
  if rising_edge(clk) then
    q <= d;      -- D flip-flop
  end if;
end process;
~~~

Saatli bir process'te her kenarda atama yapılmaması latch üretmez: flip-flop zaten değerini bir sonraki kenara kadar saklar.

**Reset:** İki tür reset vardır.

- **Asenkron reset** saati beklemez. ~rst~ hassasiyet listesinde olur ve saat kenarından **önce** denetlenir: ~process (clk, rst) begin if rst = '1' then q <= '0'; elsif rising_edge(clk) then q <= d; end if; end process;~
- **Senkron reset** yalnızca saat kenarında denetlenir: ~if rising_edge(clk) then if rst = '1' then ... else ... end if; end if;~. Çıkış ancak ~clk~ değişince değişebildiği için listede yalnızca ~clk~ yeter; ~rst~ ve ~d~ gerekmez.

**Sayaç:** Çıkış portu okunamadığı için sayım bir iç ~unsigned~ sinyalde tutulur ve dışarıya ~q <= std_logic_vector(sayi);~ ile verilir. ~unsigned~ toplama taşınca sarar: 4 bitlik bir sayaç 15'ten sonra 0'a döner. Sıfırdan başlayan 4 bitlik sayaç 18 kenardan sonra 18 mod 16 = 2 gösterir.

**Kaydırmalı kayıtçı:** ~q <= q(2 downto 0) & din;~ her kenarda bitleri bir sola kaydırır ve yeni biti sağdan alır. ~q = "0000"~ iken sırasıyla 1, 0, 1, 1 gelirse q: ~0001~, ~0010~, ~0101~, ~1011~.

**Kenar yakalama:** Bir girişin önceki değeri bir sinyalde saklanırsa yükselişi yakalanabilir: aynı kenarda ~p <= d and not onceki;~ ve ~onceki <= d;~. Sinyal atamaları process beklemeye geçince uygulandığı için ~p~ hesaplanırken ~onceki~ hâlâ eski değerdir.

**Durum makinesi:** Davranışı adımlara bölünen devreler bir sayım tipiyle kurulur: ~type durum is (S0, S1, S10, S101);~ tipinde bir durum sinyali saatli bir process'te ~case~ ile bir sonraki duruma geçirilir. Çıkış yalnızca o anki duruma bağlıysa buna **Moore** makinesi denir. Örneğin "101" dizisini arayan bir makinede S101 durumundayken ~z = '1'~ olur.

Aşağıdaki örnekte asenkron resetli 4 bitlik bir sayaç ve bir kaydırmalı kayıtçı aynı saatle çalışıyor.
`),
      sim: {
        top: "tb",
        sure: "260ns",
        gorev: "Reset'i senkron yap: rst'yi listeden çıkar ve kontrolü rising_edge'in içine taşı. Dalga ekranında reset'in artık saat kenarını beklediğini gör.",
        kod: `${UST}
entity saatli is
  port (
    clk, rst, din : in  std_logic;
    say           : out std_logic_vector(3 downto 0);
    kay           : out std_logic_vector(3 downto 0)
  );
end entity;

architecture rtl of saatli is
  signal sayi : unsigned(3 downto 0) := (others => '0');
  signal q    : std_logic_vector(3 downto 0) := (others => '0');
begin
  process (clk, rst)  -- asenkron reset: rst listede
  begin
    if rst = '1' then
      sayi <= (others => '0');
      q    <= (others => '0');
    elsif rising_edge(clk) then
      sayi <= sayi + 1;          -- 15'ten sonra 0'a sarar
      q    <= q(2 downto 0) & din;  -- sola kaydir, yeni bit sagdan
    end if;
  end process;

  say <= std_logic_vector(sayi);
  kay <= q;
end architecture;

library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity tb is
end entity;

architecture sim of tb is
  signal clk, rst, din : std_logic := '0';
  signal say, kay : std_logic_vector(3 downto 0);
begin
  uut : entity work.saatli port map (clk => clk, rst => rst, din => din, say => say, kay => kay);

  clk <= not clk after 5 ns when now < 250 ns;

  process
  begin
    rst <= '1'; wait for 12 ns;
    rst <= '0';
    din <= '1'; wait for 10 ns;
    din <= '0'; wait for 10 ns;
    din <= '1'; wait for 10 ns;
    din <= '1'; wait for 10 ns;
    din <= '0';
    -- 1, 0, 1, 1 girdi: kay = "1011" = 11
    report "kaydirma = " & integer'image(to_integer(unsigned(kay)));
    wait for 140 ns;
    -- reset bittikten sonra 18 kenar gecti: 18 mod 16 = 2
    report "sayac = " & integer'image(to_integer(unsigned(say)));
    wait;
  end process;
end architecture;
`,
      },
    },
  ],
  test: ["h5-with-select-mux", "h5-with-others-zorunlu", "h5-oncelikli-secim", "h5-process-tetik", "h5-eksik-hassasiyet", "h5-case-others", "h5-for-statik", "t5-asenkron-reset", "t5-sayac-18"],
};
