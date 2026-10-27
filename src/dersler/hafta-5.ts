import { UST, md, type Ders } from "./tipler";

export const HAFTA_5: Ders = {
  hafta: 5,
  baslik: "Eşzamanlı ve sıralı kod",
  ozet: "when/else ve with/select ile eşzamanlı atamaları; process, if, case ve döngülerle sıralı kodu; flip-flop, sayaç ve durum makineleriyle saatli devreleri öğren.",
  bolumler: [
    {
      baslik: "Eşzamanlı kod",
      metin: md(`
**Neden önemli?** Bir çoklayıcıyı when/else ile ya da with/select ile yazmak aynı işi görüyor gibi durur, ama biri öncelikli bir zincir, diğeri paralel bir seçicidir. Son satırı unutmak ise devreye fark edilmeden bir bellek ekler. Bu bölüm iki yazımın hangi donanıma dönüştüğünü gösterir.

Mimarinin gövdesine (process dışına) yazılan her atama **eşzamanlıdır**: satırların sırası önemli değildir, hepsi aynı anda çalışan ayrı donanım parçalarıdır. Sağ taraftaki bir sinyal değişince atama yeniden hesaplanır.

İki koşullu eşzamanlı atama biçimi vardır:

- **when/else:** Koşullar sırayla denenir; ilk doğru olanın değeri atanır. Bu yüzden **öncelik** içerir ve öncelikli bir çoklayıcı zinciri olarak sentezlenir.

~~~
y <= a when sec = "00" else
     b when sec = "01" else
     c;
~~~

- **with/select:** Bir ifadenin değerine göre seçim yapar. Seçenekler öncelik sırası taşımaz; her değer **tam olarak bir kez** yazılmalı ve kalanlar ~when others~ ile kapatılmalıdır. Paralel bir çoklayıcı olarak sentezlenir.

[[G-H5-01]]

Şeklin solunda when/else'in zinciri var: çıkışa en yakın çoklayıcı ilk koşulu (~sec = "00"~) sınar, bu yüzden önceliği en yüksek olan odur. Sağda with/select'in tek, dört girişli çoklayıcısı var; hiçbir seçenek diğerinden önce gelmez.

**Son else neden önemli?** Son dal da koşullu yazılırsa (~... else c when sec = "10";~) kod VHDL-93'te derlenir, ama hiçbir koşul doğru olmadığında atama yapılmaz ve sinyal **eski değerini saklar**:

[[G-H5-03]]

Zincirin en sonundaki çoklayıcının boşta kalan girişine sentez aracı ~y~'nin kendisini bağlar. Bu geri besleme, kombinasyonel bir çoklayıcıda istenmeyen bir bellek, yani latch demektir. Son satıra koşulsuz ~else c~ yazmak döngüyü koparır.

Koşulların her biri farklı sinyalleri sorgulayabilir; ilk doğru koşul kazanır. ~std_logic~ bir sinyal ~'Z'~ ya da ~'X'~ olduğunda ne ~'0'~'a ne ~'1'~'e eşittir, bu yüzden bu koşulların hepsi yanlış çıkar ve son ~else~ dalı seçilir.

**81 değer ve when others.** ~std_logic~ seçicilerde ~"00"~, ~"01"~... dışında ~'U'~, ~'X'~ gibi değerler de olduğu için ~when others~ pratikte her zaman gerekir:

[[G-H5-04]]

2 bitlik bir std_logic vektörünün 9 · 9 = 81 olası değeri vardır; dört ikilik değer yalnızca dört hücreyi kapsar. Seçici ~'X'~ ya da ~'Z'~ olursa (şekildeki ~"1X"~ gibi) açıkça yazılmış hiçbir seçeneğe uymaz ve ~others~ dalına düşer.

with/select kuralları:

- Aynı değeri iki kez yazmak derleme hatasıdır; seçenekler birbirini dışlar. "İlk eşleşen kazanır" mantığı when/else'e aittir.
- Birden çok değer ~|~ ile tek dalda birleştirilir: ~y <= a when "00" | "11",~. Virgül ise dalları ayırır.
- with/select eşzamanlı bir deyimdir, process dışında yazılır. VHDL-93'te process içinde kullanılamaz; orada aynı işi ~case~ yapar. (VHDL-2008 sıralı biçimine izin verir.)

> **Çözümlü örnek:** ~y <= i3 when i3 = '1' else i2 when i2 = '1' else i1 when i1 = '1' else '0';~ girişler yalnızca '0' ya da '1' iken hangi kapıdır?
>
> 1. Bir dal seçildiğinde verdiği değer, sınadığı girişin kendisidir; o giriş '1' olduğu için çıkış '1' olur.
> 2. Hiçbir giriş '1' değilse son ~else~ '0' verir.
> 3. Demek ki girişlerden en az biri '1' ise y = '1': bu bir **OR** kapısıdır. Önceliğin bir anlamı olması için seçim sinyalleri ile veri girişleri ayrı olmalıdır.

> **Sık hata:** with/select'te ~"00"~, ~"01"~, ~"10"~, ~"11"~ yazınca bütün durumların kapsandığını sanıp ~when others~'ı unutmak. std_logic seçicide kalan 77 değer kapsanmadığı için kod derlenmez.
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
      dene: ["h5-when-else-latch", "h5-kosullu-z", "h5-secilmis-x", "t5-ws-coklu", "h5-oncelikli-mux-or"],
    },
    {
      baslik: "process ve hassasiyet listesi",
      metin: md(`
**Neden önemli?** Benzetimde doğru çalışan bir devrenin kartta farklı davranmasının en sık nedeni eksik bir hassasiyet listesidir. Bir process'in ne zaman uyandığını bilirsen bu ayrışmayı daha kod yazarken görürsün.

~process~ içindeki satırlar **sırayla** yürür, tıpkı bir programdaki gibi. Ama process'in kendisi diğer process'ler ve eşzamanlı atamalarla aynı anda çalışır.

[[G-H5-05]]

Şekildeki döngü her process için geçerlidir. Benzetim başlarken **her process bir kez** çalışır (beklemeye geçene kadar); bu yüzden kombinasyonel çıkışlar ilk anda da hesaplanır. Process ~end process~'e ya da bir ~wait~'e gelince bekler; sinyal atamaları bu anda uygulanır. Uyandırıcı gelince process baştan sona bir kez daha çalışır.

Uyandırıcı iki biçimden yalnızca biri olabilir: bir process ya bir **hassasiyet listesiyle** ya da ~wait~ deyimleriyle beklemeye geçer; ikisi birlikte kullanılamaz. Testbench'lerdeki listesiz process'ler bu yüzden ~wait for 10 ns;~ gibi satırlar içerir.

~~~
process (a, b, sec)
  variable gecici : std_logic;   -- bildirim bölümü
begin
  ...
end process;
~~~

~process (...)~ ile ~begin~ arasındaki kısım process'in **bildirim bölümüdür**; değişkenler, sabitler ve process'e özel tipler burada tanımlanır.

**Eksik hassasiyet.** Listedeki sinyallerden biri değiştiğinde process çalışır, sonra listedeki bir sinyal yeniden değişene kadar bekler. Kombinasyonel bir process'te okunan **tüm** sinyaller listede olmalıdır. Eksik bir sinyal benzetimde yanlış sonuç verir; sentez aracı ise genellikle uyarıp listeyi kendisi tamamlar, böylece benzetimle donanım birbirini tutmaz. Örneğin ~process (a)~ içinde ~y <= a and b;~ yazılırsa yalnızca ~b~ değiştiğinde process uyanmaz ve ~y~ eski değerinde kalır; sentezlenen devre ise düz bir AND kapısıdır.

[[G-H5-06]]

Şekilde b'nin her değişimi process'i uyandırmıyor: benzetimdeki y (kırmızı) eski değerinde kalırken donanımdaki AND kapısı (yeşil) hemen yeni değeri veriyor. a değişince process uyanıyor ve iki y yeniden tutuyor. Boyalı aralıklar, dalga ekranında görmeyi bekleyeceğin hatanın tam yeridir.

VHDL-2008'de ~process (all)~ yazabilirsin: ~all~, process'in okuduğu bütün sinyalleri listeye kendiliğinden ekler ve eksik hassasiyet hatasını önler.

> **Çözümlü örnek:** ~process (b) begin y <= a or b; end process;~ benzetimde ~a = '0'~, ~b = '0'~ ile başlıyor. Önce a 1 oluyor, sonra b 1 oluyor. y'nin değerlerini izle.
>
> 1. Başlangıçta process bir kez çalışır: y = 0 or 0 = '0'.
> 2. a 1 olur ama a listede değil; process uyanmaz, y '0'da kalır. Donanımda y burada '1' olurdu.
> 3. b 1 olunca process uyanır: y = 1 or 1 = '1'. Benzetim ancak şimdi yetişir.

> **Sık hata:** Hassasiyet listesi olan bir process'in içine ~wait~ yazmak. İkisi birlikte kullanılamaz; derleyici hata verir. Testbench'te ~wait~ istiyorsan listeyi kaldır.

Aşağıdaki benzetimde aynı AND hesabı bir kez eksik, bir kez tam listeyle yapılıyor.
`),
      sim: {
        top: "tb",
        sure: "40ns",
        gorev: "Birinci process'in listesine b'yi ekle: process (a, b). Yeniden çalıştır ve iki y'nin artık her adımda aynı olduğunu gör.",
        kod: `${UST}
entity tb is
end entity;

architecture sim of tb is
  signal a : std_logic := '1';
  signal b : std_logic := '0';
  signal y_eksik, y_tam : std_logic;
begin
  process (a)  -- b listede yok
  begin
    y_eksik <= a and b;
  end process;

  process (a, b)  -- okunan her sinyal listede
  begin
    y_tam <= a and b;
  end process;

  process
  begin
    wait for 10 ns;
    report "baslangic: y_eksik = " & std_logic'image(y_eksik) & ", y_tam = " & std_logic'image(y_tam);
    b <= '1'; wait for 10 ns;
    -- yalnizca b degisti: birinci process uyanmaz
    report "b = 1: y_eksik = " & std_logic'image(y_eksik) & ", y_tam = " & std_logic'image(y_tam);
    a <= '0'; wait for 10 ns;
    a <= '1'; wait for 10 ns;
    -- a degisince birinci process de uyanir ve yetisir
    report "a degisti: y_eksik = " & std_logic'image(y_eksik) & ", y_tam = " & std_logic'image(y_tam);
    wait;
  end process;
end architecture;
`,
      },
      dene: ["t5-hassas-eksik", "t5-hassas-wait", "h5-variable-yeri"],
    },
    {
      baslik: "if, case ve kilitlenme (latch)",
      metin: md(`
**Neden önemli?** if ve case process içinde aynı işi görebilir, ama ürettikleri donanım farklıdır: biri öncelikli bir zincir, diğeri paralel bir seçici. Bir dalda atamayı unutmak ise kombinasyonel devreye istemeden bir latch ekler.

- **if / elsif / else:** Koşullar sırayla denenir, yani **öncelik** vardır. Öncelikli kodlayıcılar için doğaldır.
- **case:** Bir ifadenin değerine göre dallanır; tüm olası değerler kapsanmalıdır, bu yüzden genellikle ~when others =>~ ile biter. Seçenekler arasında öncelik yoktur.

[[G-H5-07]]

Solda aşağıdaki öncelikli kodlayıcının if zinciri var: ~r(3)~'ü sınayan çoklayıcı çıkışa en yakındır. Birden çok bit '1' olsa da yalnızca ilk doğru dal seçilir; ~r = "0110"~ iken ~r(2)~ kazanır ve kod ~"10"~ olur. Sağda aynı işin case ile yazımı: 4 bitlik ~r~'nin 16 değerinin her biri bir dalda yer almalı. ~"1---"~ gibi bir desen yazılamaz, çünkü case'te ~'-'~ joker değildir; yalnızca ~'-'~ değeriyle eşleşir. Öncelik gerektiren işte if, değerlerin birbirini dışladığı işte case doğal seçimdir.

case kuralları:

- Seçenekler **sabit** (yerel statik) değerler olmalıdır: ~when "01" =>~, ~when 3 =>~ ya da bir ~constant~. Bir sinyalle ya da değişkenle karşılaştırma gerekiyorsa if/elsif kullanılır.
- Aynı değer iki kez yazılamaz; seçimler çakışmamalıdır.
- Tamsayılarda aralık ~to~ ile, ayrık değerler ~|~ ile yazılır: ~when 0 to 3 =>~, ~when 0 | 2 =>~.
- Her dalda en az bir deyim olmalıdır. "Hiçbir şey yapma" ~null;~ ile söylenir: ~when others => null;~

**Latch.** Kombinasyonel bir process'te bir çıkışa **her yolda** değer atanmazsa, sentez aracı eski değeri hatırlamak için bir **latch** (kilitleme elemanı) üretir. Bu çoğunlukla istenmeyen bir durumdur. Önlemek için ya her dalda atama yap ya da process'in başında varsayılan bir değer ver.

[[G-H5-02]]

Latch'in dalgadaki davranışı bir flip-flop'tan farklıdır:

[[G-H5-08]]

~en = '1'~ iken latch **saydamdır**: q, d'yi saat beklemeden izler. ~en~ 0'a düşünce q son değerini tutar; bu sırada d kaç kez değişirse değişsin q kıpırdamaz. Kombinasyonel olmasını beklediğin bir çıkışın dalgada böyle "donduğunu" görürsen eksik bir atama ara.

> **Çözümlü örnek:** ~process (s, a, b) begin case s is when "00" => y <= a; when "01" => y <= b; when others => null; end case; end process;~ latch üretir mi?
>
> 1. ~s = "10"~ ya da ~"11"~ iken ~others~ dalı çalışır ve ~null;~ y'ye hiçbir şey atamaz.
> 2. Bir yolda y atanmadığı için y eski değerini tutmalıdır: sentez bir latch üretir.
> 3. Çözüm: ~when others => y <= '0';~ ya da process'in başına ~y <= '0';~ varsayılanı.

> **Sık hata:** case'te bir sinyalle karşılaştırmaya çalışmak (~when b =>~). Seçenekler derleme anında bilinen sabitler olmalıdır; değişen bir değerle karşılaştırma için if/elsif kullan.

Aşağıdaki öncelikli kodlayıcı, en yüksek anlamlı '1' bitinin konumunu verir. Başta ~kod <= "00"~ ve ~gecerli <= '1'~ varsayılanları verildiği için her yolda iki çıkışa da bir değer atanmış olur ve latch oluşmaz.
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
      dene: ["h5-if-oncelik", "h5-case-sinyal", "t5-case-tekrar", "t5-oncelik-kodlayici"],
    },
    {
      baslik: "Döngüler",
      metin: md(`
**Neden önemli?** Yazılımda döngü zaman içinde döner; donanımda ise her tur ayrı bir devre olur. Bunu bilmeyen biri 1000 turluk bir döngü yazıp yongayı dolduracak bir devre üretebilir.

~for~ döngüsü sentezde **açılır**: her tur ayrı bir donanım kopyası olur. Bu yüzden sınırları derleme anında bilinmelidir (sabit, generic ya da ~'range~ gibi). Döngü değişkeni kendiliğinden tanımlanır ve döngü içinde değiştirilemez.

[[G-H5-09]]

Şekilde aşağıdaki birler sayacının döngüsü açılmış: ~d'range~ 7'den 0'a sekiz değer verdiği için sekiz kopya var. Her kopya kendi bitine bakar ve bir öncekinin sonucuna 1 ya da 0 ekler; ~"10100101"~ için ara sonuçlar 1, 1, 2, 2, 2, 3, 3, 4'tür. Döngü değişkeni ~i~ her kopyada sabit bir sayıdır, bir tel adı gibi düşünebilirsin.

Aralığı bir giriş sinyaline bağlı bir döngü sentezlenemez. ~for i in 7 downto 2 loop~ 7, 6, 5, 4, 3, 2 değerlerini alır, yani 6 tur döner.

~while~ döngüsü ve ~exit~ / ~next~ deyimleri de vardır; ~while~ çoğunlukla yalnızca benzetimde (testbench'te) kullanılır. ~exit~ döngüden tamamen çıkar (örneğin aranan şey bulununca), ~next~ ise o turun kalanını atlayıp sonraki tura geçer.

[[G-H5-10]]

Üstteki döngüde tek ~i~'lerde ~next~ çalışır ve toplama atlanır; t yalnızca çift sayıları toplar: 0 + 2 + 4 + 6 = 12. Alttaki döngü ilk '1'i arar: ~i = 2~'de bulur, ~yer~'e 2 yazar ve ~exit~ ile çıkar; v(4) ve v(5)'teki 1'lere hiç bakılmaz. Bulunmasaydı ~yer~ döngüden önceki değerinde kalırdı. Donanımda exit, sonraki kopyaları devre dışı bırakan bir öncelik zinciri olur.

Döngüdeki ~sayi~ bir **değişken** olduğu için her tur bir öncekinin sonucunu görür; sinyal kullansaydık bu çalışmazdı.

> **Çözümlü örnek:** ~v = "0110"~ (3 downto 0) için ~yer := 9; for i in 3 downto 0 loop if v(i) = '1' then yer := i; exit; end if; end loop;~ sonrası yer kaçtır?
>
> 1. Döngü 3'ten başlar: v(3) = '0', devam.
> 2. v(2) = '1': yer := 2 ve exit. v(1)'deki '1'e bakılmaz.
> 3. yer = 2. v hiç '1' içermeseydi yer başlangıç değeri 9'da kalırdı.

> **Sık hata:** Döngü sayacını sinyal yapmak. Sinyal process içinde eski değerini verdiği için her tur aynı eski değeri okur ve sayaç yalnızca bir kez artmış gibi görünür.

Aşağıdaki devre bir vektördeki '1' bitlerini sayar.
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
      dene: ["t5-for-sayi", "t5-birleri-say", "h5-arama-modulu"],
    },
    {
      baslik: "Saat ile çalışan devreler: flip-flop, sayaç ve kaydırmalı kayıtçı",
      metin: md(`
**Neden önemli?** Gerçek tasarımların neredeyse tamamı saatlidir: değerler bir saat kenarında yakalanır ve bir sonraki kenara kadar tutulur. Flip-flop, reset, sayaç ve kaydırmalı kayıtçı bu yapının temel taşlarıdır.

Şimdiye kadarki process'ler kombinasyoneldi. Bir process'in içinde ~if rising_edge(clk) then~ yazdığında atamalar yalnızca saatin **yükselen kenarında** yapılır ve sentez aracı her atanan sinyal için bir **D flip-flop** kurar. ~rising_edge(clk)~, ~clk'event and clk = '1'~ ile aynı işi yapar; ayrıca 'X'ten '1'e gibi geçişleri dışarıda bırakır.

~~~
process (clk)
begin
  if rising_edge(clk) then
    q <= d;      -- D flip-flop
  end if;
end process;
~~~

[[G-H5-11]]

Şekilde q yalnızca yükselen kenarlarda değişiyor ve o andaki d'yi alıyor. İki kenar arasındaki kısa darbe sırasında kenar olmadığı için q onu hiç görmüyor. Latch'in tersine flip-flop saydam değildir.

Saatli bir process'te her kenarda atama yapılmaması latch üretmez: flip-flop zaten değerini bir sonraki kenara kadar saklar.

**Reset:** İki tür reset vardır.

- **Asenkron reset** saati beklemez. ~rst~ hassasiyet listesinde olur ve saat kenarından **önce** denetlenir: ~process (clk, rst) begin if rst = '1' then q <= '0'; elsif rising_edge(clk) then q <= d; end if; end process;~
- **Senkron reset** yalnızca saat kenarında denetlenir: ~if rising_edge(clk) then if rst = '1' then ... else ... end if; end if;~. Çıkış ancak ~clk~ değişince değişebildiği için listede yalnızca ~clk~ yeter; ~rst~ ve ~d~ gerekmez.

[[G-H5-12]]

İki kenar arasında ~rst~ 1 olunca asenkron resetli q hemen 0'a iniyor; senkron resetli q bir sonraki yükselen kenarı bekliyor. ~rst~ bırakıldıktan sonra ikisi de ilk kenarda yeniden d'yi alıyor.

**Sayaç:** Çıkış portu okunamadığı için sayım bir iç ~unsigned~ sinyalde tutulur ve dışarıya ~q <= std_logic_vector(sayi);~ ile verilir. ~unsigned~ toplama taşınca sarar: 4 bitlik bir sayaç 15'ten sonra 0'a döner.

[[G-H5-13]]

~1111 + 1~ beş bit ister; dört bitlik sayaç beşinci biti tutamaz ve ~0000~'a döner. Sıfırdan başlayan 4 bitlik sayaç 18 kenardan sonra 18 mod 16 = 2 gösterir.

**Kaydırmalı kayıtçı:** ~q <= q(2 downto 0) & din;~ her kenarda bitleri bir sola kaydırır ve yeni biti sağdan alır.

[[G-H5-14]]

~q = "0000"~ iken sırasıyla 1, 0, 1, 1 gelirse q: ~0001~, ~0010~, ~0101~, ~1011~. Her kenarda en soldaki bit atılır; dört kenar sonra ilk gelen bit en solda durur.

**Kenar yakalama:** Bir girişin önceki değeri bir sinyalde saklanırsa yükselişi yakalanabilir: aynı kenarda ~p <= d and not onceki;~ ve ~onceki <= d;~. Sinyal atamaları process beklemeye geçince uygulandığı için ~p~ hesaplanırken ~onceki~ hâlâ eski değerdir.

> **Çözümlü örnek:** Sıfırdan başlayan 4 bitlik bir sayaç 35 yükselen kenar görüyor. Kaç gösterir?
>
> 1. 4 bit 16 değer tutar; her 16 kenarda bir başa döner.
> 2. 35 = 2 · 16 + 3, yani iki tam tur ve 3 kenar.
> 3. Sayaç 35 mod 16 = 3 gösterir.

> **Sık hata:** Asenkron reset yazarken ~rst~'yi hassasiyet listesine eklemeyi unutmak. ~process (clk)~ olursa ~rst~ yükselse bile process ancak saat değişince uyanır ve reset benzetimde senkron gibi görünür.

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
      dene: ["t5-kaydirma"],
    },
    {
      baslik: "Durum makineleri",
      metin: md(`
**Neden önemli?** Bir trafik ışığı, bir seri iletişim alıcısı ya da bir kilit şifresi: davranışı adımlara bölünen her devre bir durum makinesidir. Diyagramı çizip koda çevirmek, karmaşık denetim mantığını yönetilebilir tutmanın standart yoludur.

Davranışı adımlara bölünen devreler bir sayım tipiyle kurulur: ~type durum is (S0, S1, S10, S101);~ tipinde bir durum sinyali saatli bir process'te ~case~ ile bir sonraki duruma geçirilir. Çıkış yalnızca o anki duruma bağlıysa buna **Moore** makinesi denir. Örneğin "101" dizisini arayan bir makinede S101 durumundayken ~z = '1'~ olur.

Bu makinenin diyagramı aşağıda. Her daire bir durumdur; durumun adı, o ana kadar aranan diziden ne kadarının görüldüğünü söyler. Oklar, her saat kenarında okunan ~x~ bitine göre gidilecek durumu gösterir:

[[G-H5-15]]

- **S0:** Henüz bir şey yok. 0 gelirse yerinde kalır, 1 gelirse S1.
- **S1:** "1" görüldü. 1 gelirse yine S1 (yeni 1 de bir başlangıçtır), 0 gelirse S10.
- **S10:** "10" görüldü. 1 gelirse S101, 0 gelirse "100" hiçbir başlangıç taşımaz: S0.
- **S101:** "101" bulundu, z = 1. Son iki bit "01" yeni bir aramanın başı olabilir: 0 gelirse S10, 1 gelirse S1.

Son kural makineyi **örtüşen** dizileri de yakalar hale getirir: ~1 0 1 0 1~ girişinde ortadaki 1 hem ilk hem ikinci dizinin parçasıdır ve "101" iki kez bulunur. Şekildeki adımlayıcıda **Örnek: 10101** düğmesine basıp bunu izleyebilirsin.

**Diyagramdan koda.** Diyagram koda neredeyse satır satır çevrilir:

[[G-H5-16]]

1. Her daire, sayım tipinin bir değeridir: ~type durum_t is (S0, S1, S10, S101);~. Durum sinyali başlangıçta (ve reset'te) S0 olur.
2. Her daire saatli process'teki ~case d is~ içinde bir ~when~ dalıdır; o daireden çıkan oklar dalın içindeki ~if x = '1' then ... else ... end if;~ olur.
3. Dairedeki çıkış, process dışında durumdan çözülür: ~z <= '1' when d = S101 else '0';~. Çıkış yalnızca duruma bağlı olduğu için z, son biti okuyan kenardan hemen sonra 1 olur ve bir sonraki kenara kadar öyle kalır.

Çıkış duruma ek olarak o anki girişe de bağlıysa makineye **Mealy** denir; çıkış bir kenar erken gelir ama girişteki her kıpırtı çıkışa yansıyabilir.

> **Çözümlü örnek:** Makine S0'da ve sırasıyla 1, 1, 0, 1, 0, 1 geliyor. z kaç kez 1 olur?
>
> 1. 1: S0 → S1. 1: S1 → S1. 0: S1 → S10.
> 2. 1: S10 → S101, z = 1 (birinci).
> 3. 0: S101 → S10. 1: S10 → S101, z = 1 (ikinci).
> 4. z iki kez 1 olur; "101" dizileri ortadaki 1'i paylaşır.

> **Sık hata:** S10'dan 0 gelince S0 yerine S1'e ya da S10'da kalmaya gitmek. "100" içinde aranan dizinin başı olabilecek bir parça yoktur; makine en baştan başlamalıdır. Her ok için "şimdiye kadar görülenlerin sonu, aranan dizinin hangi başına uyuyor?" diye sor.

Aşağıdaki benzetimde makine ~1 0 1 0 1 1 0 1~ girişini okuyor ve "101"i üç kez buluyor.
`),
      sim: {
        top: "tb",
        sure: "120ns",
        gorev: "Aramayı örtüşmesiz yap: S101'den x = 0 ile S10 yerine S0'a gidilsin. Aynı girişte kaç dizi bulunduğunu karşılaştır ve farkı durum diyagramında izle.",
        kod: `${UST}
entity dizi101 is
  port (
    clk, rst, x : in  std_logic;
    z           : out std_logic
  );
end entity;

architecture rtl of dizi101 is
  type durum_t is (S0, S1, S10, S101);
  signal d : durum_t := S0;
begin
  process (clk)
  begin
    if rising_edge(clk) then
      if rst = '1' then
        d <= S0;
      else
        case d is
          when S0 =>
            if x = '1' then d <= S1; else d <= S0; end if;
          when S1 =>
            if x = '1' then d <= S1; else d <= S10; end if;
          when S10 =>
            if x = '1' then d <= S101; else d <= S0; end if;
          when S101 =>
            if x = '1' then d <= S1; else d <= S10; end if;
        end case;
      end if;
    end if;
  end process;

  -- Moore: cikis yalnizca o anki duruma bagli
  z <= '1' when d = S101 else '0';
end architecture;

library ieee;
use ieee.std_logic_1164.all;

entity tb is
end entity;

architecture sim of tb is
  signal clk, rst, x, z : std_logic := '0';
begin
  uut : entity work.dizi101 port map (clk => clk, rst => rst, x => x, z => z);

  clk <= not clk after 5 ns when now < 110 ns;

  process
    constant dizi : std_logic_vector(0 to 7) := "10101101";
    variable bulunan : integer := 0;
  begin
    rst <= '1';
    wait until falling_edge(clk);
    rst <= '0';
    for i in dizi'range loop
      -- bit dusen kenarda verilir, yukselen kenarda okunur
      x <= dizi(i);
      wait until falling_edge(clk);
      if z = '1' then
        bulunan := bulunan + 1;
        report "101 bulundu: " & integer'image(i + 1) & ". bitten sonra";
      end if;
    end loop;
    report "toplam: " & integer'image(bulunan);
    wait;
  end process;
end architecture;
`,
      },
    },
  ],
  test: ["h5-with-select-mux", "h5-with-others-zorunlu", "h5-oncelikli-secim", "h5-process-tetik", "h5-eksik-hassasiyet", "h5-case-others", "h5-for-statik", "t5-asenkron-reset", "t5-sayac-18"],
};
