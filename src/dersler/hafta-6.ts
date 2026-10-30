import { UST, md, type Ders } from "./tipler";

export const HAFTA_6: Ders = {
  hafta: 6,
  baslik: "Saat sinyali ile çalışmak",
  ozet: "Saat darbesinin periyodunu ve kenarlarını; yükselen ve düşen kenar tetiklemeyi; sayıcıları, mod-N saymayı, saat bölmeyi ve üçgen dalga üretimini; tek/çift, işaretli karşılaştırma ve ödül kodu gibi uygulamaları öğren.",
  bolumler: [
    {
      baslik: "Saat darbesi: periyot, frekans ve kenarlar",
      metin: md(`
**Neden önemli?** Saatli bir devrede her şey saatin temposuyla olur. Bir sayıcının kaç bit olacağı, bir LED'in ne hızda yanıp söneceği ya da üretilen bir dalganın periyodu hep aynı ilk adımla hesaplanır: saatin periyodunu ve frekansını birbirine çevirmek.

Process'leri tetiklemek için çoğunlukla dışarıdan gelen bir **kare dalga** kullanılır. Bu sinyal düzenli aralıklarla 0 ile 1 arasında gidip gelir ve **saat darbesi** (clock) diye adlandırılır. Genellikle karttaki bir osilatörden gelir; gerekirse FPGA'nın içinde de üretilebilir (PLL gibi saat blokları başka frekanslar türetir). Process'ler bu sinyalin değişimleriyle tetiklenir.

[[G-H6-01]]

- **Yükselen kenar** (rising edge): sinyalin 0'dan 1'e geçtiği an.
- **Düşen kenar** (falling edge): sinyalin 1'den 0'a geçtiği an.
- **Periyot (T):** iki yükselen kenar arasındaki süre. Bir periyot bir yüksek ve bir alçak süreden oluşur.
- **Frekans (f):** saniyedeki periyot sayısı, ~f = 1 / T~. 10 ns periyot 100 MHz, 20 ns periyot 50 MHz, 1 µs periyot 1 MHz demektir.
- **Görev oranı** (duty cycle): yüksek sürenin periyoda oranı. Saatler çoğunlukla %50'dir: yarım periyot 1, yarım periyot 0.

Birimleri çevirirken ns ile MHz'in birbirinin tersi olduğunu hatırla: ~1 / (1 ns) = 1000 MHz~. Böylece periyodu ns cinsinden bilinen bir saatin frekansı MHz cinsinden ~1000 / T~ olur.

**Testbench'te saat.** Benzetimde saati testbench üretir. En kısa yazım her yarım periyotta sinyali tersine çevirmektir:

~~~
clk <= not clk after 5 ns;              -- yarım periyot 5 ns: T = 10 ns
clk <= not clk after 5 ns when now < 200 ns;  -- 200 ns'den sonra durur
~~~

~after~'daki süre **yarım periyottur**; tam periyot bunun iki katıdır. Saat sinyalinin bir başlangıç değeri olmalıdır (~signal clk : std_logic := '0';~); yoksa ~not 'U'~ yine ~'U'~ olur ve saat hiç başlamaz. ~when now < ...~ eki, testbench'teki diğer process'ler bittiğinde benzetimin de kendiliğinden durmasını sağlar.

Bir sürede kaç kenar olduğunu bulmak için süreyi periyoda bölersin: 10 ns'lik bir saat 1 µs'de 100 kez yükselir.

> **Çözümlü örnek:** 50 MHz'lik bir saati testbench'te üretmek istiyorsun. ~after~'a hangi süre yazılır ve 1 ms'de kaç yükselen kenar olur?
>
> 1. T = 1 / 50 MHz = 20 ns.
> 2. ~after~'a yarım periyot yazılır: ~clk <= not clk after 10 ns;~
> 3. 1 ms = 1 000 000 ns; 1 000 000 / 20 = 50 000 yükselen kenar.

> **Sık hata:** ~after~'a tam periyodu yazmak. ~clk <= not clk after 20 ns;~ 20 ns'lik değil 40 ns'lik bir saat üretir, çünkü sinyal her 20 ns'de yalnızca bir kez değişir.

Aşağıdaki benzetimde iki saat aynı anda çalışıyor ve 200 ns boyunca yükselen kenarları sayılıyor.
`),
      sim: {
        top: "tb",
        sure: "220ns",
        gorev: "clk_b'nin yarım periyodunu 40 ns yap. Periyodu ve frekansı hesapla, sonra 200 ns'de kaç kenar sayılacağını tahmin edip benzetimle karşılaştır.",
        kod: `${UST}
entity tb is
end entity;

architecture sim of tb is
  signal clk_a : std_logic := '0';
  signal clk_b : std_logic := '0';
  signal say_a, say_b : integer := 0;
begin
  -- yarim periyot 5 ns: T = 10 ns, f = 100 MHz
  clk_a <= not clk_a after 5 ns when now < 200 ns;
  -- yarim periyot 10 ns: T = 20 ns, f = 50 MHz
  clk_b <= not clk_b after 10 ns when now < 200 ns;

  process (clk_a)
  begin
    if rising_edge(clk_a) then
      say_a <= say_a + 1;
    end if;
  end process;

  process (clk_b)
  begin
    if rising_edge(clk_b) then
      say_b <= say_b + 1;
    end if;
  end process;

  process
  begin
    wait for 200 ns;
    report "200 ns icinde yukselen kenar: clk_a = " & integer'image(say_a) & ", clk_b = " & integer'image(say_b);
    wait;
  end process;
end architecture;
`,
      },
      dene: ["h6-saat-frekans", "t6-periyot-mhz"],
    },
    {
      baslik: "Yükselen ve düşen kenar tetikleme",
      metin: md(`
**Neden önemli?** Aynı kod yükselen kenar yerine düşen kenarla yazıldığında girişleri yarım periyot kaymış anlarda örnekler ve başka sonuçlar verebilir. Kenarı yazmanın birkaç yolu vardır; aralarındaki küçük farklar özellikle benzetimin başında ortaya çıkar.

VHDL'de **yükselen kenarı** yakalamanın iki yazımı vardır:

~~~
if clk'event and clk = '1' then
if rising_edge(clk) then
~~~

İkisi de ~clk~ değiştiğinde ve yeni değeri 1 olduğunda, yani 0'dan 1'e geçişte koşulu doğru yapar. **Düşen kenar** için de iki yazım vardır:

~~~
if clk'event and clk = '0' then
if falling_edge(clk) then
~~~

Bunlar ~clk~ 1'den 0'a geçtiğinde doğrudur. ~'event~, sinyalin **tam o anda** değiştiğini söyleyen niteliktir (3. haftadaki sinyal nitelikleri); tek başına yön bilgisi taşımaz, yönü ~clk = '1'~ ya da ~clk = '0'~ ekler.

**Fark nerede?** ~rising_edge~ yalnızca önceki değer ~'0'~ (ya da zayıf ~'L'~) ve yeni değer ~'1'~ (ya da zayıf ~'H'~) olduğunda doğrudur. ~clk'event and clk = '1'~ ise önceki değere bakmaz: ~'X'~'ten ya da ~'U'~'dan ~'1'~'e geçişi de kenar sayar.

[[G-H6-02]]

Tablodaki ~'U' → '1'~ satırı benzetimin başında görülür: ilk değeri verilmemiş bir saat sinyali ~'U'~ ile başlar, ilk kez 1 olduğunda ~'event~ yazımı bunu bir kenar sayar ve flip-flop'lar gerçekte olmayan bir kenarda değer yükler. Bu yüzden yeni kodda ~rising_edge~ ve ~falling_edge~ tercih edilir. Sentezde ikisi de aynı flip-flop'u üretir.

**Hangi kenar?** Aşağıdaki kayıtlı seçici her kenarda ~sec~'e göre iki girişten birini ~y~'ye yükler. Kod aynı kalıp yalnızca ~rising_edge~ ~falling_edge~ yapılınca ne değişir?

~~~
process (clk)
begin
  if rising_edge(clk) then
    if sec = '0' then
      y <= giris_1;
    else
      y <= giris_2;
    end if;
  end if;
end process;
~~~

[[G-H6-03]]

Düşen kenarla çalışan sürüm girişleri **yarım periyot kaymış** anlarda örnekler. Girişler kenarlardan uzakta ve yavaş değişiyorsa iki çıkış aynı değerleri yarım periyot arayla gösterir. Ama yarım periyottan kısa süren bir olay yalnızca o sırada gelen kenar tarafından görülür: şekildeki kısa darbeyi yükselen kenar kaçırır, düşen kenar yakalar. Kenar türü, devrenin hangi anlardaki değerleri "gördüğünü" belirler.

Bir tasarımda genellikle tek bir kenar kullanılır; hepsi yükselen kenarla çalışan flip-flop'lar aynı anda güncellenir ve zamanlamayı hesaplamak kolaylaşır. FPGA'daki flip-flop'lar tek kenarla tetiklenir: ~if clk'event then~ gibi yön içermeyen bir koşul iki kenarda da çalışan bir yapı tarif eder ve sıradan bir D flip-flop olarak sentezlenmez.

> **Çözümlü örnek:** ~clk~ 0'dan başlıyor ve ~clk <= not clk after 5 ns;~ ile sürülüyor. Kayıtlı seçicide ~sec = '0'~ ve ~giris_1~ 12 ns'de 0'dan 1'e çıkıyor. ~y~ yükselen kenarla ve düşen kenarla ne zaman 1 olur?
>
> 1. T = 10 ns: yükselen kenarlar 5, 15, 25 ns'de; düşen kenarlar 10, 20, 30 ns'de.
> 2. 12 ns'den sonraki ilk yükselen kenar 15 ns'dedir: rising_edge ile y 15 ns'de 1 olur.
> 3. 12 ns'den sonraki ilk düşen kenar 20 ns'dedir: falling_edge ile y 20 ns'de 1 olur.

> **Sık hata:** Saatin ilk değerini vermeyip ~clk'event and clk = '1'~ kullanmak. ~'U'~'dan ~'1'~'e ilk geçiş bir kenar sayılır ve benzetim, donanımda olmayan bir yükleme gösterir. Saate ~:= '0'~ ver ve ~rising_edge~ yaz.

Aşağıdaki benzetimde şekildeki girişler kayıtlı seçiciye veriliyor. Çalıştırıp dalgaya bak, sonra kenarı değiştirip yeniden çalıştır.
`),
      sim: {
        top: "tb",
        sure: "240ns",
        gorev: "rising_edge'i falling_edge yapıp yeniden çalıştır. Dalgada y'nin hangi anlarda değiştiğini karşılaştır ve 62 ns'deki mesajın neden değiştiğini açıkla.",
        kod: `${UST}
entity kenar_secici is
  port (
    clk, giris_1, giris_2, sec : in  std_logic;
    y                          : out std_logic
  );
end entity;

architecture rtl of kenar_secici is
begin
  process (clk)
  begin
    if rising_edge(clk) then
      if sec = '0' then
        y <= giris_1;
      else
        y <= giris_2;
      end if;
    end if;
  end process;
end architecture;

library ieee;
use ieee.std_logic_1164.all;

entity tb is
end entity;

architecture sim of tb is
  signal clk : std_logic := '0';
  signal giris_1, giris_2, sec, y : std_logic;
begin
  uut : entity work.kenar_secici port map (clk => clk, giris_1 => giris_1, giris_2 => giris_2, sec => sec, y => y);

  -- T = 20 ns: yukselen kenarlar 10, 30, 50 ns..., dusen kenarlar 20, 40, 60 ns...
  clk <= not clk after 10 ns when now < 230 ns;

  -- Girisler kenarlarin arasinda degisir
  sec     <= '0', '1' after 45 ns, '0' after 95 ns;
  giris_1 <= '1', '0' after 35 ns, '1' after 55 ns;
  giris_2 <= '0', '1' after 55 ns, '0' after 65 ns;

  process
  begin
    wait for 62 ns;
    report "62 ns: y = " & std_logic'image(y);
    wait;
  end process;
end architecture;
`,
      },
      dene: ["h6-kenar-sozdizimi", "h6-x-gecis", "t6-ilk-kenar"],
    },
    {
      baslik: "Sayıcı: toplayıcı ve kayıtçı",
      metin: md(`
**Neden önemli?** Sayıcı, saatli tasarımların en temel parçasıdır: zamanlayıcılar, saat bölücüler, adres üreteçleri ve dalga üreteçleri hep bir sayıcının üstüne kurulur. Aynı sayıcıyı yazmanın iki yaygın yolu vardır; biri standarttır, diğeri eski kitaplarda ve örneklerde karşına çıkar.

Her yükselen kenarda bir artan sayıcı iki donanım parçasından oluşur: değeri tutan bir **kayıtçı** (her bit için bir D flip-flop) ve kayıtçının çıkışına 1 ekleyen bir **toplayıcı**. Toplayıcının sonucu kayıtçının girişine gider; bir sonraki kenarda kayıtçı yeni değeri yükler.

[[G-H6-04]]

**numeric_std ile.** Önerilen yazım sayımı iç bir ~unsigned~ sinyalde tutar ve dışarıya dönüştürerek verir:

~~~
architecture rtl of sayici4 is
  signal sayi : unsigned(3 downto 0) := (others => '0');
begin
  process (clk)
  begin
    if rising_edge(clk) then
      sayi <= sayi + 1;
    end if;
  end process;
  say <= std_logic_vector(sayi);
end architecture;
~~~

İç sinyal iki sorunu birden çözer. ~unsigned~ tipinde ~+~ tanımlı olduğu için ~sayi + 1~ yazılabilir. Ayrıca VHDL-93'te ~out~ modundaki bir port mimari içinde **okunamaz**: ~say <= say + 1;~ ya da ~if say = "1111" then~ gibi her satır çıkış portunu okuduğu için derlenmez (ilkinde ~std_logic_vector~ için ~+~ da tanımlı değildir). Sayım iç sinyalde yapılır, ~say~ yalnızca atanır.

**std_logic_unsigned ile.** Eski örneklerde aynı sayıcı şöyle yazılır:

~~~
use ieee.std_logic_unsigned.all;
...
count : inout std_logic_vector(3 downto 0) := (others => '0');
...
count <= count + 1;
~~~

Burada ~std_logic_unsigned~ paketi ~std_logic_vector~'ü işaretsiz sayı gibi yorumlayan bir ~+~ ekler; port ise okunabilsin diye ~inout~ yapılmıştır. Çalışır ve aynı devreyi üretir, ama iki nedenle önerilmez:

- ~std_logic_unsigned~ bir IEEE standardı değildir; bir firmanın yazdığı ve sonradan ~ieee~ kütüphanesine konmuş bir pakettir. ~numeric_std~ ile birlikte kullanıldığında aynı işlem iki yerde tanımlanır ve belirsizlik hataları çıkar. Hangi vektörün işaretli, hangisinin işaretsiz olduğu da tipten anlaşılmaz.
- ~inout~ bir portun iki yönlü olduğunu söyler; yonganın dışına çıkan gerçek bir iki yönlü hat (örneğin bir veri yolu) için düşünülmüştür. Yalnızca okumak için ~inout~ yapmak tasarımın niyetini gizler. Doğrusu iç sinyal kullanmaktır.

**Testere dişi.** 4 bitlik bir sayıcı 0'dan 15'e çıkar, sonra 0'a döner (5. haftadaki sarma). Değerleri dalga ekranında sayı olarak görmek yerine **analog** gösterimle (dalga ekranındaki ~∿~ düğmesi) çizersen basamaklı bir testere dişi görürsün:

[[G-H6-05]]

Testere dişinin periyodu, sayıcının bir turunun süresidir: n bitlik bir sayıcı 2ⁿ değer dolaşır, bu yüzden periyot ~2ⁿ · T~ olur.

> **Çözümlü örnek:** 5 bitlik bir sayıcı 10 ns'lik bir saatle sayıyor. Testere dişinin periyodu ne kadardır?
>
> 1. 5 bit 2⁵ = 32 değer tutar: 0'dan 31'e.
> 2. Her değer bir saat periyodu sürer.
> 3. Periyot 32 · 10 ns = 320 ns.

> **Sık hata:** Çıkış portunu doğrudan artırmak: ~count <= count + 1;~ (~count~ bir ~out~ port). VHDL-93'te out port okunamaz ve kod derlenmez. Portu ~inout~ yapmak yerine iç bir ~unsigned~ sinyal kullan.

Aşağıdaki benzetimde 4 bitlik sayıcı 400 ns boyunca sayıyor.
`),
      sim: {
        top: "tb",
        sure: "400ns",
        gorev: "Dalga ekranında say'ın yanındaki ∿ düğmesine basıp testere dişini gör. Sonra process'e if say = \"1111\" then report \"tur bitti\"; end if; satırını ekleyip out port hatasını oku; karşılaştırmayı sayi = 15 ile yapınca düzeldiğini gör.",
        kod: `${UST}
entity sayici4 is
  port (
    clk : in  std_logic;
    say : out std_logic_vector(3 downto 0)
  );
end entity;

architecture rtl of sayici4 is
  signal sayi : unsigned(3 downto 0) := (others => '0');
begin
  process (clk)
  begin
    if rising_edge(clk) then
      sayi <= sayi + 1;   -- 15'ten sonra 0'a sarar
    end if;
  end process;

  say <= std_logic_vector(sayi);  -- out port yalnizca atanir
end architecture;

library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity tb is
end entity;

architecture sim of tb is
  signal clk : std_logic := '0';
  signal say : std_logic_vector(3 downto 0);
begin
  uut : entity work.sayici4 port map (clk => clk, say => say);

  clk <= not clk after 5 ns when now < 400 ns;

  process
  begin
    wait for 102 ns;
    -- 10 kenar gecti: say = 10
    report "102 ns: say = " & integer'image(to_integer(unsigned(say)));
    wait;
  end process;
end architecture;
`,
      },
      dene: ["h6-sayac-rtl", "h6-sayac-out-okuma", "h6-std-logic-unsigned"],
    },
    {
      baslik: "Mod-N sayıcı, reset ve saat bölme",
      metin: md(`
**Neden önemli?** Gerçek tasarımlar nadiren 2'nin kuvveti kadar sayar: bir saat 0'dan 59'a, bir ondalık sayaç 0'dan 9'a sayar. Aynı yapı, hızlı bir saatten saniyede bir gelen bir "tik" üretmenin de yoludur.

**Mod-N sayıcı** 0'dan N - 1'e sayar ve sonra 0'a döner; N farklı durumu vardır. 2'nin kuvveti olmayan bir N için sarma kendiliğinden olmaz, sayıcının son değeri görüp sıfırlanması gerekir:

~~~
if rising_edge(clk) then
  if sayi = N - 1 then
    sayi <= (others => '0');
  else
    sayi <= sayi + 1;
  end if;
end if;
~~~

[[G-H6-06]]

**Kaç bit?** 0'dan N - 1'e kadar sayabilmek için en büyük değer N - 1'i tutacak kadar bit gerekir: k bit 0..2ᵏ - 1 aralığını tutar. 0..9 için 3 bit (0..7) yetmez, 4 bit (0..15) gerekir; 10..15 değerlerine hiç uğranmaz.

**Reset.** Reset girişi 1 olduğunda sayıcı sıfırlanmalı ve reset 1 kaldığı sürece çıkış 0'da kalmalıdır; sayma yalnızca reset 0 iken ve saatin yükselen kenarında olur. 5. haftada gördüğün iki biçim burada da geçerlidir:

- **Asenkron reset:** ~process (clk, rst)~ ve ~if rst = '1' then ... elsif rising_edge(clk) then ...~. Reset saati beklemez.
- **Senkron reset:** ~process (clk)~ ve kenarın içinde ~if rst = '1' then ... else ... end if;~. Reset bir sonraki kenarda etkili olur.

İkisinde de reset, sayma koşulundan **önce** denetlenir; böylece reset 1 iken sayıcı kenar gelse de artmaz.

**Saat bölme.** Mod-N bir sayıcı her N saatte bir kez son değerine ulaşır. Bu anı işaretleyen bir sinyal, saatin N'de biri hızında gelen bir **tik** olur:

~~~
tik <= '1' when sayi = N - 1 else '0';
~~~

[[G-H6-07]]

Yavaş çalışması gereken bir devre yeni bir saatle değil, aynı hızlı saatle ve bu tikle sürülür: ~if rising_edge(clk) then if tik = '1' then ... end if; end if;~. Buna **saat etkinleştirme** (clock enable) denir. Mantık kapılarıyla üretilmiş bir sinyali başka flip-flop'lara saat olarak vermek, saatin yongada gecikmeli ve dengesiz dağılmasına yol açar; FPGA araçları bunu uyarır. Kare dalga gerektiğinde (örneğin dışarıdaki bir LED için) bir sinyal tik geldikçe tersine çevrilir: şekildeki ~yavas~ gibi. Tersine çevrilen sinyalin periyodu 2N saattir.

Hızlı bir saatten yavaş bir tik üretmek için N, iki frekansın oranıdır: ~N = f_saat / f_tik~.

> **Çözümlü örnek:** 100 MHz'lik bir saatten saniyede bir gelen bir tik isteniyor. Sayıcı kaça kadar sayar ve kaç bit olur?
>
> 1. N = 100 000 000 / 1 = 100 000 000; sayıcı 0'dan 99 999 999'a sayar.
> 2. 2²⁶ = 67 108 864 yetmez; 2²⁷ = 134 217 728 yeter.
> 3. 27 bitlik bir ~unsigned~ gerekir; tik ~sayi = 99 999 999~ iken 1 olur.

> **Sık hata:** Karşılaştırmayı N ile yapmak: ~if sayi = 10 then sayi <= 0;~ bir mod-10 değil mod-11 sayıcıdır, çünkü 10 değeri bir saat boyunca görünür ve 0..10 arası 11 durum olur. Son değer N - 1'dir.

Aşağıdaki mod-10 sayıcı asenkron resetlidir ve her 10 saatte bir tik verir.
`),
      sim: {
        top: "tb",
        sure: "300ns",
        gorev: "Sayıcıyı mod-6 yap (karşılaştırmayı ve tik koşulunu değiştir). 250 ns'deki tik sayısının nasıl değiştiğini hesapla ve benzetimle karşılaştır.",
        kod: `${UST}
entity mod10 is
  port (
    clk, rst : in  std_logic;
    say      : out std_logic_vector(3 downto 0);
    tik      : out std_logic
  );
end entity;

architecture rtl of mod10 is
  signal sayi : unsigned(3 downto 0) := (others => '0');
begin
  process (clk, rst)  -- asenkron reset
  begin
    if rst = '1' then
      sayi <= (others => '0');
    elsif rising_edge(clk) then
      if sayi = 9 then           -- son deger N - 1
        sayi <= (others => '0');
      else
        sayi <= sayi + 1;
      end if;
    end if;
  end process;

  say <= std_logic_vector(sayi);
  tik <= '1' when sayi = 9 else '0';
end architecture;

library ieee;
use ieee.std_logic_1164.all;

entity tb is
end entity;

architecture sim of tb is
  signal clk : std_logic := '0';
  signal rst : std_logic := '1';
  signal say : std_logic_vector(3 downto 0);
  signal tik : std_logic;
  signal tikler : integer := 0;
begin
  uut : entity work.mod10 port map (clk => clk, rst => rst, say => say, tik => tik);

  clk <= not clk after 5 ns when now < 290 ns;

  process (clk)
  begin
    if rising_edge(clk) and tik = '1' then
      tikler <= tikler + 1;
    end if;
  end process;

  process
  begin
    wait for 12 ns;
    rst <= '0';
    wait for 238 ns;
    report "250 ns: gelen tik sayisi = " & integer'image(tikler);
    wait;
  end process;
end architecture;
`,
      },
      dene: ["h6-mod12-bit", "h6-saat-bolme", "t6-mod-esik"],
    },
    {
      baslik: "Üçgen dalga üreteci",
      metin: md(`
**Neden önemli?** Bir sayıcıyı yukarı ve aşağı saydırmak dijital bir devreden analog bir dalga biçimi elde etmenin en basit yoludur. Çıkış bir DAC'a (dijitalden analoğa çevirici) verilirse gerçek bir üçgen gerilim olur; ses, motor sürme ve test sinyalleri böyle üretilir.

Üçgen dalga, 0'dan bir **tepe** değerine çıkıp yeniden 0'a inen bir sayıcıdır. Sayıcının yönünü bir sinyal tutar: ~yukari = '1'~ iken artar, ~'0'~ iken azalır. Yön, sayı tepeye ve dibe gelince değişir.

[[G-H6-08]]

**Periyot hesabı.** Sayı 0, 1, ..., tepe, tepe - 1, ..., 1 değerlerini dolaşıp yeniden 0'a gelir: çıkışta tepe kadar, inişte tepe kadar basamak vardır. Her basamak bir saat periyodu sürdüğü için:

~~~
üçgen periyodu = 2 · tepe · T
tepe = üçgen periyodu / (2 · T)
~~~

Bir saat periyodu ve istenen üçgen periyodu verildiğinde önce bir periyotta kaç saat olduğunu bul, sonra ikiye böl: yarısı çıkış, yarısı iniş. Sayıcının bit sayısı tepe değerini tutacak kadar olmalıdır.

**Yön ne zaman değişir?** Sinyal atamaları process beklemeye geçince uygulanır; ~yukari <= '0';~ yazdığın kenarda sayı hâlâ eski yönde bir adım daha atar. Bu yüzden yön, sınıra **bir adım önce** çevrilir:

~~~
if rising_edge(clk) then
  if yukari = '1' then
    if sayi = TEPE - 1 then
      yukari <= '0';      -- bu kenarda sayi TEPE olur, sonra iner
    end if;
    sayi <= sayi + 1;
  else
    if sayi = 1 then
      yukari <= '1';      -- bu kenarda sayi 0 olur, sonra çıkar
    end if;
    sayi <= sayi - 1;
  end if;
end if;
~~~

[[G-H6-09]]

Karşılaştırma ~sayi = TEPE~ ve ~sayi = 0~ ile yapılırsa dönüşler bir kenar gecikir: sayı tepeyi bir aşar, dipte ise ~unsigned~ 0 - 1 sarıp en büyük değere sıçrar. Analog gösterimde bu, üçgenin dibinde ince bir iğne olarak görünür.

> **Çözümlü örnek:** 10 ns'lik bir saatle 640 ns periyotlu bir üçgen dalga isteniyor. Tepe kaçtır ve sayıcı kaç bit olur?
>
> 1. Bir periyotta 640 / 10 = 64 saat var.
> 2. Yarısı çıkış, yarısı iniş: tepe = 64 / 2 = 32.
> 3. 0..32 için 5 bit (0..31) yetmez, 6 bit gerekir.

> **Sık hata:** Tepeyi periyottaki saat sayısının kendisi sanmak. 64 saatlik bir periyotta sayı 64'e kadar çıkarsa çıkış ve iniş birlikte 128 saat sürer; periyot iki katına çıkar.

Aşağıdaki benzetimde tepe 32; 10 ns'lik saatle periyot 640 ns'dir. Dalga ekranında ~dalga~ sinyalini analog göster.
`),
      sim: {
        top: "tb",
        sure: "1500ns",
        gorev: "Dalga ekranında dalga sinyalinin ∿ düğmesine bas. Sonra TEPE'yi 20 yap ve iki dip arasının 400 ns olduğunu imleçle ölç.",
        kod: `${UST}
entity ucgen is
  port (
    clk, rst : in  std_logic;
    dalga    : out std_logic_vector(5 downto 0)
  );
end entity;

architecture rtl of ucgen is
  constant TEPE : integer := 32;
  signal sayi   : unsigned(5 downto 0) := (others => '0');
  signal yukari : std_logic := '1';
begin
  process (clk)
  begin
    if rising_edge(clk) then
      if rst = '1' then
        sayi <= (others => '0');
        yukari <= '1';
      elsif yukari = '1' then
        if sayi = TEPE - 1 then
          yukari <= '0';
        end if;
        sayi <= sayi + 1;
      else
        if sayi = 1 then
          yukari <= '1';
        end if;
        sayi <= sayi - 1;
      end if;
    end if;
  end process;

  dalga <= std_logic_vector(sayi);
end architecture;

library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity tb is
end entity;

architecture sim of tb is
  signal clk   : std_logic := '0';
  signal rst   : std_logic := '1';
  signal dalga : std_logic_vector(5 downto 0);
begin
  uut : entity work.ucgen port map (clk => clk, rst => rst, dalga => dalga);

  clk <= not clk after 5 ns when now < 1500 ns;

  process
    variable en_cok : integer := 0;
  begin
    wait until falling_edge(clk);
    rst <= '0';
    for i in 1 to 140 loop
      wait until falling_edge(clk);
      if to_integer(unsigned(dalga)) > en_cok then
        en_cok := to_integer(unsigned(dalga));
      end if;
    end loop;
    report "en yuksek deger = " & integer'image(en_cok);
    wait;
  end process;
end architecture;
`,
      },
      dene: ["h6-ucgen-bit", "t6-ucgen-periyot"],
    },
    {
      baslik: "Uygulamalar: tek/çift, işaretli karşılaştırma ve ödül kodu",
      metin: md(`
**Neden önemli?** Saatli devrelerin girişlerinde ve çıkışlarında hep küçük kombinasyonel bloklar vardır: bir sayının tek mi çift mi olduğuna, iki ölçümden hangisinin küçük olduğuna ya da bir sonuca göre hangi kodun üretileceğine karar veren bloklar. Bu bölüm önceki haftaların araçlarıyla üç tipik soruyu çözer.

**Tek mi çift mi?** İkilik bir sayının değeri bitlerin ağırlıklarıyla toplanır: 4 bit için 8, 4, 2 ve 1. Bunlardan yalnızca en düşük bitin ağırlığı (1) tektir; diğerlerinin toplamı her zaman çifttir. Bu yüzden bir sayı **en düşük biti 1 ise tektir**:

[[G-H6-10]]

Devre bir tel kadar basittir: ~tek <= x(0);~ ve ~cift <= not x(0);~. Aynı sonuç ~to_integer(unsigned(x)) mod 2~ ile de bulunur; sentez aracı bunu da tek bir bite indirger, ama ~x(0)~ niyeti daha açık söyler. Vektör ~(0 to 3)~ gibi artan yönde tanımlanmışsa en düşük ağırlıklı bit ~x(3)~'tür; ~x'right~ ya da ~x(x'low)~ yerine bitin ağırlığını düşün.

**İşaretli karşılaştırma.** Bir ~std_logic_vector~'ün sayısal bir anlamı yoktur; aynı bitler ~unsigned~ ve ~signed~ olarak farklı sayılardır (4. hafta). "Karşılaştırma işaretli olmalıdır" deniyorsa iki giriş de ~signed(...)~ ile dönüştürülür:

[[G-H6-11]]

~~~
process (a, b)
begin
  if signed(a) < signed(b) then
    kucuk <= to_integer(signed(a));
  else
    kucuk <= to_integer(signed(b));
  end if;
end process;
~~~

Çıkış bir ~integer~ ise ~to_integer~ işaretli değeri verir: ~"1100"~ için -4. Aynı karşılaştırma ~unsigned~ ile yapılsaydı ~"1100"~ 12 sayılır ve sonuç değişirdi. Port listesinde ~std_logic_vector(4 downto 0)~ yazan bir giriş 5 bitliktir; 4 bitlik bir giriş ~(3 downto 0)~ olur.

**Ödül kodu.** Bir koşu yarışında 10 saniyenin altında bitiren yarışmacı rekor ödülü (kod ~"111"~), ilk beşe girenler sırasıyla platin, altın, gümüş, bronz ve alüminyum madalya (kodlar 1'den 5'e), ilk beşe giremeyenler katılım belgesi (kod ~"110"~) alıyor. Önce rekor denetlenir, sonra sıraya bakılır; sıra bir tamsayı olduğu için ~case~ en okunaklı yazımdır:

[[G-H6-12]]

Kodlar 3 bitlik bir ~std_logic_vector~'e yazılır, bu yüzden **ikilik** olmalıdır: 1. sıra ~"001"~, 2. sıra ~"010"~, 3. sıra ~"011"~, 4. sıra ~"100"~, 5. sıra ~"101"~. ~"002"~ gibi bir dizgi yazılamaz: bit dizgisinin her karakteri bir ~std_logic~ değeri (~'0'~, ~'1'~, ~'Z'~...) olmalıdır, ~'2'~ değildir ve kod derlenmez. "10 saniyenin altında" ~süre < 10~ demektir; ~süre <= 10~ yazılırsa tam 10 saniyede bitiren de rekor ödülü alır.

Process'in hassasiyet listesinde iki giriş de vardır ve her yolda ~kod~'a bir değer atanır: ~when others~ dalı sayesinde latch oluşmaz (5. hafta).

> **Çözümlü örnek:** süre = 12 ve sıra = 4 olan bir yarışmacının kodu nedir?
>
> 1. 12 < 10 yanlıştır; rekor dalı atlanır.
> 2. ~case sira~ 4 değerini ~when 4~ dalında bulur.
> 3. 4. sıra bronz madalyadır: kod ~"100"~.

> **Sık hata:** Ödül kodlarını onluk sırayla yazmak (~"001"~, ~"002"~, ~"003"~...). Bit dizgisinde yalnızca std_logic karakterleri olabilir; sıranın kendisini ikilik olarak yaz.

Aşağıdaki benzetim dört yarışmacının kodunu yazdırıyor.
`),
      sim: {
        top: "tb",
        sure: "50ns",
        gorev: "Koşulu sure <= 10 yapıp yeniden çalıştır: tam 10 saniyede bitiren yarışmacının kodu nasıl değişti?",
        kod: `${UST}
entity odul is
  port (
    sure : in  integer range 0 to 99;
    sira : in  integer range 1 to 99;
    kod  : out std_logic_vector(2 downto 0)
  );
end entity;

architecture rtl of odul is
begin
  process (sure, sira)
  begin
    if sure < 10 then
      kod <= "111";                -- rekor
    else
      case sira is
        when 1      => kod <= "001";  -- platin
        when 2      => kod <= "010";  -- altin
        when 3      => kod <= "011";  -- gumus
        when 4      => kod <= "100";  -- bronz
        when 5      => kod <= "101";  -- aluminyum
        when others => kod <= "110";  -- katilim belgesi
      end case;
    end if;
  end process;
end architecture;

library ieee;
use ieee.std_logic_1164.all;

entity tb is
end entity;

architecture sim of tb is
  signal sure : integer range 0 to 99 := 0;
  signal sira : integer range 1 to 99 := 1;
  signal kod  : std_logic_vector(2 downto 0);

  function bitler(v : std_logic_vector) return string is
    variable s : string(1 to v'length);
    variable k : integer := 1;
  begin
    for i in v'range loop
      if v(i) = '1' then s(k) := '1'; else s(k) := '0'; end if;
      k := k + 1;
    end loop;
    return s;
  end function;
begin
  uut : entity work.odul port map (sure => sure, sira => sira, kod => kod);

  process
    type ikili is array (1 to 4, 1 to 2) of integer;
    constant yarismaci : ikili := ((12, 4), (8, 2), (15, 9), (10, 1));
  begin
    for i in 1 to 4 loop
      sure <= yarismaci(i, 1);
      sira <= yarismaci(i, 2);
      wait for 10 ns;
      report "sure = " & integer'image(sure) & ", sira = " & integer'image(sira) & ": kod = " & bitler(kod);
    end loop;
    wait;
  end process;
end architecture;
`,
      },
      dene: ["h6-tek-cift", "h6-odul-002", "h6-isaretli-unsigned"],
    },
  ],
  test: [
    "h6-tb-yari-periyot", "h6-rising-esdeger", "h6-secici-deger", "h6-sayac-periyot", "h6-mod12-deger",
    "h6-saat-bolme-bit", "h6-ucgen-tepe", "h6-isaretli-kucuk", "h6-odul-kod", "h6-odul-sinir",
  ],
};
