import { UST, md, type Ders } from "./tipler";

export const HAFTA_3: Ders = {
  hafta: 3,
  baslik: "VHDL'in yapısı, operatörler ve öznitelikler",
  ozet: "Bir VHDL dosyasının üç bölümünü, toplayıcıları, operatörleri, numeric_std aritmetiğini, öznitelikleri ve GENERIC ile parametreli tasarımı öğren.",
  bolumler: [
    {
      baslik: "Üç bölüm: library, entity, architecture",
      metin: md(`
**Neden önemli?** Yazacağın her VHDL dosyası aynı iskeleti taşır. İskeleti bir kez oturtursan derleyicinin hata mesajlarını da okuman kolaylaşır: hatanın kütüphanede mi, portlarda mı, yoksa devrenin içinde mi olduğunu hemen görürsün.

Her VHDL tasarımı üç parçadan oluşur. Şekildeki yarım toplayıcı dosyası bu üç parçaya renkli bantlarla ayrılmış:

[[G-H3-01]]

- **Kütüphane bildirimleri** (üstteki bant): Kullanacağın tip ve fonksiyonların nereden geleceğini söyler. ~library ieee;~ ve ~use ieee.std_logic_1164.all;~ neredeyse her dosyada bulunur; ikinci satır olmadan ~std_logic~ tipi tanınmaz. ~std~ ve ~work~ kütüphaneleri her zaman görünür olduğu için bildirilmeleri gerekmez.
- **entity** (ortadaki bant): Devrenin dışarıdan görünüşü, yani portlarıdır. Bir kutunun bacaklarını tanımlar.
- **architecture** (alttaki bant): Kutunun içinde ne olduğunu anlatır. ~architecture rtl of yarim_toplayici is~ satırındaki ~of~, bu mimarinin hangi entity'ye ait olduğunu söyler.

Aynı dosyayı devre olarak çizersek entity dış kutu, architecture ise kutunun içidir:

[[G-H3-02]]

Yazım kuralları:

- Port listesinde her port ~ad : mod tip~ biçimindedir. Portlar noktalı virgülle **ayrılır**; son porttan sonra noktalı virgül konmaz: ~port (a : in std_logic; y : out std_logic);~
- Bir entity ~end;~, ~end entity;~, ~end sayac;~ ya da ~end entity sayac;~ ile kapatılabilir. ~end architecture~ yalnızca bir mimariyi kapatır.

**Port modları.** Şekildeki oklar verinin hangi yöne aktığını gösteriyor:

[[G-H3-03]]

- ~in~: yalnızca okunur; mimari içinde ona değer atanamaz.
- ~out~: yalnızca yazılır; VHDL-93'te devrenin içinden okunamaz. Okuman gerekirse bir iç sinyal tanımlar, hesabı onda yapar ve portu o sinyalden sürersin.
- ~inout~: iki yönlüdür; hem dışarıdan hem içeriden sürülebilir.
- ~buffer~: yazılır ve içeriden geri okunabilir (şekildeki yeşil geri dönüş), ama yalnızca tek bir kaynaktan sürülür.

**Bir entity, birden fazla architecture.** Dış görünüş aynı kalırken iç yapı farklı yazılabilir; örneğin biri davranışsal, biri yapısal. Bileşen örneklenirken hangisinin kullanılacağı entity adının yanındaki parantezle seçilir:

[[G-H3-04]]

Şekilde ~ve_kapisi~'nın ~kapi~ ve ~tablo~ adlı iki mimarisi var; ~entity work.ve_kapisi(tablo)~ yazınca ikincisi kullanılır. Parantez yazılmazsa en son derlenen mimari seçilir.

> **Çözümlü örnek:** ~port (a, b : in std_logic; y : out std_logic;);~ satırı neden derlenmez?
>
> 1. Portlar noktalı virgülle ayrılır, sonlandırılmaz.
> 2. ~y : out std_logic~'ten sonra gelen ~;~ ardından yeni bir port bekler, ama hemen ~)~ geliyor.
> 3. Doğrusu: ~port (a, b : in std_logic; y : out std_logic);~

> **Sık hata:** VHDL-93'te ~out~ portunu mimari içinde okumak, örneğin ~y <= y and a;~ yazmak. Derleyici hata verir. Bir iç sinyal kullan (~signal y_ic : std_logic;~), hesabı onda yap ve sonunda ~y <= y_ic;~ yaz.

Aşağıda bir yarım toplayıcı ve onu deneyen testbench var. Benzetimi çalıştır, sonra dalga ekranında ~s~ ve ~c~'ye bak.
`),
      sim: {
        top: "tb",
        sure: "50ns",
        gorev: "Mimariyi tam toplayıcıya genişlet: bir cin girişi ekle, s <= a xor b xor cin; c <= (a and b) or (cin and (a xor b)); yaz.",
        kod: `${UST}
entity yarim_toplayici is
  port (
    a, b : in  std_logic;
    s, c : out std_logic
  );
end entity;

architecture rtl of yarim_toplayici is
begin
  s <= a xor b;  -- toplam
  c <= a and b;  -- elde
end architecture;

library ieee;
use ieee.std_logic_1164.all;

entity tb is
end entity;

architecture sim of tb is
  signal a, b, s, c : std_logic := '0';
begin
  uut : entity work.yarim_toplayici port map (a => a, b => b, s => s, c => c);

  process
  begin
    a <= '0'; b <= '0'; wait for 10 ns;
    a <= '0'; b <= '1'; wait for 10 ns;
    a <= '1'; b <= '0'; wait for 10 ns;
    a <= '1'; b <= '1'; wait for 10 ns;
    assert s = '0' and c = '1' report "1 + 1 yanlis" severity error;
    report "Dort giris birlesimi denendi";
    wait;
  end process;
end architecture;
`,
      },
      dene: ["h3-out-okuma", "t3-buffer"],
    },
    {
      baslik: "Toplayıcılar: yarımdan 4 bite",
      metin: md(`
**Neden önemli?** Toplayıcı, bir işlemcinin aritmetik biriminden bir sayaca kadar her yerde vardır. Bir bitlik toplayıcıyı kapı kapı anlayınca, ~a + b~ yazdığında sentez aracının ne kurduğunu da bilirsin.

**Yarım toplayıcı** iki biti toplar: ~s = a xor b~, ~c = a and b~. Önceki basamaktan gelen bir elde girişi olmadığı için çok bitli toplamada yalnızca en düşük basamakta işe yarar; diğer basamaklar bir alt basamağın eldesini de toplamak zorundadır.

**Tam toplayıcı** üç biti (a, b ve elde girişi cin) toplar. Şekilde iki yarım toplayıcı ve bir VEYA kapısından kurulmuş:

[[G-H3-05]]

- Toplam: ~s = a xor b xor cin~. Üç girişte tek sayıda 1 varsa s = 1 olur.
- Elde: ~cout = (a and b) or (cin and (a xor b))~, yani Cout = AB + Cin(A ⊕ B). Girişlerden en az ikisi 1 ise elde 1 olur.

Şekildeki örneği adım adım izle: a = 1, b = 0, cin = 1 iken birinci yarım toplayıcıda p = a xor b = 1 ve ab = 0 olur. İkinci yarım toplayıcıda s = p xor cin = 0 ve cin·p = 1 olur. VEYA kapısı 0 ile 1'i birleştirir: cout = 1. Kontrol: 1 + 0 + 1 = 2 = ikilik 10, yani s = 0 ve cout = 1.

**4 bitlik toplayıcı.** Dört tam toplayıcıyı yan yana koyup her birinin eldesini bir soldakine verirsek 4 bitlik sayıları toplayabiliriz:

[[G-H3-06]]

Elde bit 0'dan başlayıp sola doğru dalga gibi ilerler; bu yüzden bu yapıya **dalgalı elde toplayıcısı** (ripple carry adder) denir. Şekilde 0111 + 0011 toplanıyor: her basamakta elde 1 doğuyor, sonuç 1010 = 10. Bir toplamanın bitmesi için eldenin en sağdan en sola kadar dört kutudan geçmesi gerekebilir; genişlik arttıkça bu yol uzar ve devre yavaşlar.

> **Çözümlü örnek:** a = 1, b = 1, cin = 1 iken s ve cout kaçtır?
>
> 1. s = 1 xor 1 xor 1: ilk ikisi 0 verir, 0 xor 1 = 1. Yani s = 1.
> 2. cout = (1 and 1) or (1 and (1 xor 1)) = 1 or 0 = 1.
> 3. Kontrol: 1 + 1 + 1 = 3 = ikilik 11.

> **Sık hata:** Elde için ~a xor b xor cin~ yazmak. Bu toplam bitidir. Elde, girişlerin en az ikisi 1 olduğunda 1'dir: ~(a and b) or (cin and (a xor b))~.

Aşağıdaki kod tam toplayıcıyı dört kez örnekleyip 4 bitlik bir toplayıcı kuruyor, sonra 16 × 16 = 256 toplamanın hepsini deniyor.
`),
      sim: {
        top: "tb",
        sure: "300ns",
        gorev: "Dalga ekranında c sinyalini aç ve 0111 + 0011 toplamasında eldenin hangi bitlerde 1 olduğuna bak. Sonra cout'u kaldırıp sonucu 4 bitle karşılaştırmayı dene.",
        kod: `${UST}
entity tam_toplayici is
  port (
    a, b, cin : in  std_logic;
    s, cout   : out std_logic
  );
end entity;

architecture rtl of tam_toplayici is
begin
  s    <= a xor b xor cin;
  cout <= (a and b) or (cin and (a xor b));
end architecture;

library ieee;
use ieee.std_logic_1164.all;

entity toplayici4 is
  port (
    a, b : in  std_logic_vector(3 downto 0);
    s    : out std_logic_vector(3 downto 0);
    cout : out std_logic
  );
end entity;

architecture yapisal of toplayici4 is
  signal c : std_logic_vector(4 downto 0);  -- c(0) elde girişi
begin
  c(0) <= '0';
  fa0 : entity work.tam_toplayici port map (a(0), b(0), c(0), s(0), c(1));
  fa1 : entity work.tam_toplayici port map (a(1), b(1), c(1), s(1), c(2));
  fa2 : entity work.tam_toplayici port map (a(2), b(2), c(2), s(2), c(3));
  fa3 : entity work.tam_toplayici port map (a(3), b(3), c(3), s(3), c(4));
  cout <= c(4);
end architecture;

${UST}
entity tb is
end entity;

architecture sim of tb is
  signal a, b, s : std_logic_vector(3 downto 0) := "0000";
  signal cout    : std_logic;
begin
  uut : entity work.toplayici4 port map (a => a, b => b, s => s, cout => cout);

  process
  begin
    a <= "0111"; b <= "0011"; wait for 10 ns;  -- 7 + 3
    report "0111 + 0011: cout = " & std_logic'image(cout) & ", s = " & integer'image(to_integer(unsigned(s)));
    for i in 0 to 15 loop
      for j in 0 to 15 loop
        a <= std_logic_vector(to_unsigned(i, 4));
        b <= std_logic_vector(to_unsigned(j, 4));
        wait for 1 ns;
        assert to_integer(unsigned(cout & s)) = i + j
          report integer'image(i) & " + " & integer'image(j) & " yanlis" severity error;
      end loop;
    end loop;
    report "256 toplamanin hepsi denendi";
    wait;
  end process;
end architecture;
`,
      },
      dene: ["h3-tam-toplayici", "h3-tam-toplayici-cout"],
    },
    {
      baslik: "Operatörler",
      metin: md(`
**Neden önemli?** Operatörlerin önceliğini bilmezsen kod derlenir ama başka bir devre kurar, ya da hiç derlenmez. Kaydırma ve kalan operatörleri ise sınavda en çok sayı hesaplatan konulardır.

VHDL operatörleri gruplara ayrılır:

- **Mantıksal:** ~and or nand nor xor xnor not~.
- **İlişkisel:** ~= /= < <= > >=~. Sonuç ~boolean~'dır. ~<=~ hem "küçük eşit" hem sinyal atamasıdır; bağlam belirler.
- **Toplama ve birleştirme:** ~+ -~ ve ~&~. ~&~ iki vektörü ya da biti uç uca ekler: ~"10" & '1'~ sonucu ~"101"~.
- **Çarpma:** ~* / mod rem~. Tam sayı bölmesi **sıfıra doğru** yuvarlar: ~7 / 2 = 3~, ~-7 / 2 = -3~. Bölme sentezde pahalıdır; çoğu araç yalnızca bölen **2'nin sabit bir kuvveti** olduğunda kabul eder, çünkü bu bitleri sağa kaydırmaya indirgenir (~x / 4~ iki bit sağa kaydırmadır). ~mod~, ~rem~ ve ~abs~ için de destek sınırlıdır.
- **Kaydırma:** ~sll srl sla sra rol ror~ (~bit_vector~ ve numeric_std tipleriyle).
- **Atama:** sinyale ~<=~; değişken, sabit ve generic'e ~:=~. ~=>~ ise ~others => '0'~ ya da port map gibi eleman eşlemede kullanılır.

**Öncelik.** Operatörler yedi basamaklı bir merdivende durur; yukarıdaki basamak önce uygulanır:

[[G-H3-07]]

~not~ en üst basamakta olduğu için ~not a and b~, ~(not a) and b~ demektir. Mantıksal operatörlerin hepsi **en alt basamakta ve aynı önceliktedir**; aralarında sıra olmadığı için ~a and b or c~ geçersizdir, parantez şarttır: ~(a and b) or c~. Aynı operatörün tekrarı serbesttir (~a and b and c~), ama ~nand~ ve ~nor~ zincirlenemez: ~a nand b nand c~ derlenmez, çünkü ~(a nand b) nand c~ ile ~a nand (b nand c)~ farklı sonuç verir.

**Kaydırma ve döndürme.** ~sll~ sola kaydırır ve sağdan '0' ekler; ~srl~ sağa kaydırır ve soldan '0' ekler. ~rol~ ve ~ror~ ise döndürür: bir uçtan çıkan bit öbür uçtan girer. Şekilde her bitin nereye gittiği oklarla gösteriliyor; kesik kutular düşen bitler, sarı kutular yeni giren sıfırlar:

[[G-H3-08]]

~x = "1011"~ için ~x sll 1~ = ~"0110"~ ve ~x srl 2~ = ~"0010"~; ~"1001" rol 1~ = ~"0011"~. Aynı işi birleştirmeyle de yapabilirsin: ~x(2 downto 0) & '0'~ bir bit sola kaydırmadır, çünkü alttaki üç bit üste taşınır ve sağa bir '0' eklenir.

**mod ve rem farkı.** İkisi de bölümden kalanı verir ama işaretleri farklıdır. ~rem~ sonucunun işareti **bölünenle**, ~mod~ sonucunun işareti **bölenle** aynıdır. Sayı doğrusunda bakınca fark açıkça görünür:

[[G-H3-09]]

-7'yi 3'e bölelim. ~rem~ için bölüm sıfıra doğru yuvarlanır: -7 / 3 = -2, en yakın kat -6, kalan -7 - (-6) = **-1**. ~mod~ için bölüm aşağı yuvarlanır: -3, kat -9, kalan -7 - (-9) = **2**. Pozitif sayılarda iki yuvarlama aynı yere düştüğü için ~mod~ ve ~rem~ eşittir.

> **Çözümlü örnek:** ~7 mod (-3)~ ve ~7 rem (-3)~ kaçtır?
>
> 1. rem: 7 / (-3) sıfıra doğru -2 olur; -2 × -3 = 6; kalan 7 - 6 = 1. İşaret bölünenin (7) işareti: 1.
> 2. mod: bölüm aşağı yuvarlanır, -3 olur; -3 × -3 = 9; kalan 7 - 9 = -2. İşaret bölenin (-3) işareti: -2.

> **Sık hata:** ~a and b or c~ yazıp derleyicinin bunu "önce and" diye okuyacağını sanmak. VHDL'de mantıksal operatörler arasında öncelik yoktur; Vivado bu satırı reddeder. (Bu sitedeki benzetici bu kuralı denetlemez, ama sentez aracı denetler.)

Aşağıdaki kod birkaç işlemi ~report~ ile mesaj paneline yazar. Sayıları değiştirip sonuçları tahmin etmeye çalış.
`),
      sim: {
        top: "tb",
        sure: "1ns",
        gorev: "Önce sonuçları kafandan hesapla, sonra çalıştır. -7 ve 3 için de dene.",
        kod: `entity tb is
end entity;

architecture sim of tb is
begin
  process
    constant A : integer := 7;
    constant B : integer := -3;
  begin
    report "A rem B = " & integer'image(A rem B);   -- işaret A'dan gelir
    report "A mod B = " & integer'image(A mod B);   -- işaret B'den gelir
    report "A / B   = " & integer'image(A / B);     -- sıfıra doğru yuvarlanır
    report "2 ** 5  = " & integer'image(2 ** 5);
    report "abs B   = " & integer'image(abs B);
    wait;
  end process;
end architecture;
`,
      },
      dene: ["h3-karisik-op", "t3-sola-kaydir", "t3-mod-neg-a"],
    },
    {
      baslik: "numeric_std ile aritmetik",
      metin: md(`
**Neden önemli?** Donanımda sayılar sabit genişliktedir. Bir toplamanın sonucu sığmadığında VHDL seni uyarmaz; sonucu sessizce keser. Bu bölümdeki çember resmini aklında tutarsan sayaçların neden sıfıra döndüğünü ve eldenin nereye kaybolduğunu hemen görürsün.

**Hangi tip toplanabilir?** ~integer~ tipindeki iki sinyal hiçbir paket gerekmeden ~+~ ile toplanır. Vektörlerde ise ~ieee.numeric_std~ paketi ~signed~ ve ~unsigned~ için aritmetik tanımlar, ama ~std_logic_vector~ için **tanımlamaz**. İki ~std_logic_vector~ doğrudan ~a + b~ diye toplanamaz; önce dönüştürmek gerekir: ~std_logic_vector(unsigned(a) + unsigned(b))~. (Eski ~std_logic_unsigned~ paketi buna izin verir ama standart değildir.)

**Taşma sessizdir.** numeric_std'de toplamın genişliği işlenenlerin genişliğidir. 4 bitin alabileceği 16 deseni bir çemberin çevresine dizersek toplama saat yönünde ilerlemek, çıkarma geri gitmek olur:

[[G-H3-10]]

12'den saat yönünde 5 adım gidince 15'ten 0'a geçip 1'e gelirsin. Yani sonuç sığmazsa üstteki bit atılır ve değer 2^n'e göre **sarar**, uyarı da verilmez:

- 4 bitlik unsigned: 12 + 5 = 17 → 17 - 16 = 1, yani ~"0001"~. 2 - 3 = -1 → -1 + 16 = 15, yani ~"1111"~.
- 4 bitlik signed (aralık -8..7): -7 - 6 = -13 → -13 + 16 = 3, yani ~"0011"~.

Çemberin içindeki iki halka aynı bitlerin iki okunuşudur. Unsigned'da taşma 15'ten 0'a geçerken, signed'da 7'den -8'e geçerken olur.

**Eldeyi tutmak.** Eldeyi kaybetmemek için işlenenler önce bir bit genişletilir ve 5 bitlik bir sonuca toplanır: ~('0' & a) + ('0' & b)~.

[[G-H3-11]]

Solda dört bitlik sonuçta beşinci bit atılıyor ve 12 + 5 = 1 çıkıyor. Sağda iki işlenenin başına '0' eklenince sonuç beş bitlik oluyor ve elde en üst bitte kalıyor: ~"10001"~ = 17.

**İşaretli karşılaştırma.** Aynı bitler signed ve unsigned olarak farklı sayılardır; çemberde 1000 dışarıdan 8, içeriden -8 okunur. ~signed'("1000")~ = -8 ve ~signed'("0111")~ = 7 olduğu için ~signed'("1000") > signed'("0111")~ yanlıştır (false); unsigned olarak bakılsaydı 8 > 7 doğru olurdu.

> **Çözümlü örnek:** a = "1001" ve b = "0110" 4 bitlik unsigned iken ~a + b~ ve ~('0' & a) + ('0' & b)~ kaçtır?
>
> 1. 9 + 6 = 15. 15 dört bite sığar: ~a + b~ = ~"1111"~, taşma yok.
> 2. Genişletilmiş toplam da 15'tir ama 5 bittir: ~"01111"~.
> 3. Aynı bitler signed olsaydı: a = -7, b = 6, toplam -1 = ~"1111"~. Bitler aynı, anlamı farklı.

> **Sık hata:** ~y <= a + b;~ yazıp y'yi bir bit geniş tanımlamak. numeric_std'de sonuç işlenenlerin genişliğindedir; 4 bitlik bir toplamı 5 bitlik sinyale atamak genişlik uyuşmazlığı hatası verir. İşlenenleri genişletmek gerekir.

Aşağıdaki kod çemberdeki örnekleri hesaplayıp mesaj paneline yazar.
`),
      sim: {
        top: "tb",
        sure: "1ns",
        gorev: "a ve b'yi değiştir: 15 + 1 ve 0 - 1 sonuçlarını önce çemberden tahmin et, sonra çalıştır.",
        kod: `${UST}
entity tb is
end entity;

architecture sim of tb is
begin
  process
    variable a, b : unsigned(3 downto 0);
    variable t4   : unsigned(3 downto 0);
    variable t5   : unsigned(4 downto 0);
    variable x, y : signed(3 downto 0);
  begin
    a := "1100"; b := "0101";  -- 12 ve 5
    t4 := a + b;                       -- 4 bitlik sonuç: elde atılır
    t5 := ('0' & a) + ('0' & b);       -- 5 bitlik sonuç: elde kalır
    report "4 bit: 12 + 5 = " & integer'image(to_integer(t4));
    report "5 bit: 12 + 5 = " & integer'image(to_integer(t5));

    a := "0010"; b := "0011";
    t4 := a - b;
    report "4 bit: 2 - 3 = " & integer'image(to_integer(t4));

    x := "1001"; y := "0110";  -- -7 ve 6
    report "signed: -7 - 6 = " & integer'image(to_integer(x - y));

    if signed'("1000") > signed'("0111") then
      report "signed: 1000 > 0111 dogru";
    else
      report "signed: 1000 > 0111 yanlis, cunku -8 > 7 degil";
    end if;
    if unsigned'("1000") > unsigned'("0111") then
      report "unsigned: 1000 > 0111 dogru, cunku 8 > 7";
    end if;
    wait;
  end process;
end architecture;
`,
      },
      dene: ["t3-tasma-4bit", "t3-signed-buyuk"],
    },
    {
      baslik: "Öznitelikler 1: diziler",
      metin: md(`
**Neden önemli?** Öznitelikler kodun kendi boyutunu sorabilmesini sağlar. Bir vektörün genişliğini ~'length~ ile, sınırlarını ~'range~ ile alan kod, genişlik değiştiğinde hiç dokunulmadan çalışmaya devam eder.

Öznitelikler (attribute) bir sinyal, tip ya da dizi hakkında bilgi verir ve ~'~ ile yazılır: ~d'length~ "d'nin uzunluğu" diye okunur. Dizi öznitelikleri bir vektörün hangi kutusunu gösterir? Aynı sekiz kutuyu önce ~downto~, sonra ~to~ ile yazalım:

[[G-H3-12]]

~signal d : std_logic_vector(7 downto 0)~ için:

- ~d'left~ = 7, ~d'right~ = 0
- ~d'high~ = 7, ~d'low~ = 0
- ~d'length~ = 8
- ~d'range~ = ~7 downto 0~, ~d'reverse_range~ = ~0 to 7~

Kural şekilden okunur: ~'left~ ve ~'right~ **yazılıştaki** soldaki ve sağdaki sınırdır, bu yüzden ~to~ ile tanımlı bir dizide ~'left~ küçük indistir. ~'high~ ve ~'low~ ise yönden bağımsız olarak en büyük ve en küçük indisi verir. ~'length~ her zaman büyük indis - küçük indis + 1'dir.

Aşağıdaki gezginde bir aralık ve bir öznitelik seç; hangi kutunun gösterildiğini ve sonucu gör:

[[G-H3-13]]

Döngülerde ~for i in d'range loop~ yazmak, dizinin genişliği değişse bile kodu doğru tutar: i, dizinin yazıldığı sırayla dolaşır. ~for i in d'reverse_range loop~ ters sırayla dolaşır.

**others ile toplu atama.** ~(others => '0')~ belirtilmeyen bütün elemanları kapsar. Tek tek indis de verilebilir: ~(1 => '1', others => '0')~. Sonuç soldan sağa **indis sırasıyla** yazılır, bu yüzden aralığın yönü önemlidir:

[[G-H3-14]]

- ~std_logic_vector(3 downto 0)~ için soldan sağa v(3), v(2), v(1), v(0): v(1) sağdan ikinci kutudur, sonuç ~"0010"~.
- ~std_logic_vector(0 to 3)~ için en soldaki v(0)'dır: v(1) soldan ikinci kutudur, sonuç ~"0100"~.

> **Çözümlü örnek:** ~signal x : std_logic_vector(3 to 10);~ için ~x'left~, ~x'high~ ve ~x'length~ kaçtır?
>
> 1. Yazılışta soldaki sınır 3: ~x'left~ = 3.
> 2. En büyük indis 10: ~x'high~ = 10.
> 3. Eleman sayısı 10 - 3 + 1 = 8: ~x'length~ = 8.

> **Sık hata:** ~'left~'in her zaman büyük indis olduğunu sanmak. Bu yalnızca ~downto~ için doğrudur. Yönden bağımsız büyük indis istiyorsan ~'high~ kullan.

Aşağıdaki kod öznitelikleri ve iki ~others~ atamasının sonucunu yazar. ~bitler~ fonksiyonu vektörü ~'range~ ile dolaştığı için her iki yöndeki vektörü de doğru yazar.
`),
      sim: {
        top: "tb",
        sure: "2ns",
        gorev: "x'in aralığını 7 downto 2 yap ve sonuçları önce gezginden tahmin et.",
        kod: `${UST}
entity tb is
end entity;

architecture sim of tb is
  signal d : std_logic_vector(7 downto 0);
  signal x : std_logic_vector(3 to 10);
  signal v : std_logic_vector(3 downto 0);
  signal w : std_logic_vector(0 to 3);

  -- Bir vektörü soldan sağa yazar; 'range sayesinde her yöne uyar
  function bitler(s : std_logic_vector) return string is
    variable r : string(1 to s'length);
    variable k : positive := 1;
  begin
    for i in s'range loop
      r(k) := std_logic'image(s(i))(2);
      k := k + 1;
    end loop;
    return r;
  end function;
begin
  v <= (1 => '1', others => '0');
  w <= (1 => '1', others => '0');

  process
  begin
    report "d: left = " & integer'image(d'left) & ", right = " & integer'image(d'right)
         & ", high = " & integer'image(d'high) & ", length = " & integer'image(d'length);
    report "x: left = " & integer'image(x'left) & ", high = " & integer'image(x'high)
         & ", low = " & integer'image(x'low) & ", length = " & integer'image(x'length);
    wait for 1 ns;
    report "v (3 downto 0) = " & bitler(v);
    report "w (0 to 3)     = " & bitler(w);
    wait;
  end process;
end architecture;
`,
      },
      dene: ["h3-attr-to", "h3-others-to"],
    },
    {
      baslik: "Öznitelikler 2: sinyaller ve saat kenarı",
      metin: md(`
**Neden önemli?** Her flip-flop, sayaç ve durum makinesi "saatin yükselen kenarında" çalışır. Kenarı yakalayan yazım bir sinyal özniteliğine dayanır; yanlış yazım devreyi iki kenarda da tetikler ya da hiç sentezlenmez.

Sinyal öznitelikleri bir sinyalin **zaman içindeki** davranışını sorar. Bir dalga üzerinde bakalım; s sinyali üç kez değişiyor:

[[G-H3-15]]

- ~s'event~: sinyal bu anda değişti mi? Yalnızca değişim anında doğrudur (şekildeki mavi noktalar). Saat için tek başına ~clk'event~ **her iki** kenarda da doğrudur.
- ~s'stable~: sinyal bu anda değişmedi mi? ~s'event~'in tersidir; şekildeki yeşil çizgi yalnızca olay anlarında aşağı iner.
- ~s'last_value~: son değişimden önceki değer. Şekilde s '0'dan '1'e geçtikten sonra ~s'last_value~ = '0', '1'den '0'a geçtikten sonra '1' olur. Yalnızca benzetimde kullanılır.

Sinyal özniteliklerinin çoğu yalnızca benzetim içindir. Sentezlenebilen ikisi ~'event~ ve ~'stable~'dır; ~'last_value~, ~'last_event~, ~'quiet~, ~'active~, ~'delayed~ ve ~'transaction~ sentezlenmez.

**Kenar algılama.** ~clk'event~ tek başına iki kenarı da yakaladığı için yükselen kenarı seçmek üzere saatin yeni değerine de bakılır:

[[G-H3-16]]

- Yükselen kenar için şu üçü eşdeğerdir: ~clk'event and clk = '1'~, ~not clk'stable and clk = '1'~ ve ~rising_edge(clk)~.
- ~clk'event and clk = '0'~ düşen kenardır (~falling_edge(clk)~).

Önerilen yazım ~rising_edge(clk)~'tir: hem okunması kolaydır hem de benzetimde 'X' ya da 'U'dan '1'e geçişi kenar saymaz.

> **Çözümlü örnek:** Saat dört periyot çalışıyor (4 yükselen, 4 düşen kenar). Bir sayaç ~if clk'event then~ ile, diğeri ~if rising_edge(clk) then~ ile artıyor. Sonunda sayaçlar kaçtır?
>
> 1. ~clk'event~ her kenarda doğrudur: 4 + 4 = 8.
> 2. ~rising_edge(clk)~ yalnızca yükselen kenarlarda: 4.
>
> Aşağıdaki benzetim tam olarak bunu sayıyor.

> **Sık hata:** Flip-flop yazarken yalnızca ~if clk'event then~ yazmak. Bu iki kenarda da tetiklenir; gerçek bir flip-flop yalnızca bir kenarda çalışır ve sentez aracı bu kodu ya reddeder ya da beklenmedik bir devre kurar.

Aşağıdaki kodda bir sayaç her olayı, biri yalnızca yükselen kenarları, biri yalnızca düşen kenarları sayıyor. Ayrıca s her değiştiğinde ~s'last_value~ yazılıyor.
`),
      sim: {
        top: "tb",
        sure: "60ns",
        gorev: "Dalga ekranında clk ile üç sayacı yan yana aç ve her sayacın hangi kenarda arttığına bak.",
        kod: `${UST}
entity tb is
end entity;

architecture sim of tb is
  signal clk : std_logic := '0';
  signal s   : std_logic := '0';
  signal n_olay, n_yukselen, n_dusen : integer := 0;
begin
  saat : process
  begin
    for i in 1 to 4 loop
      clk <= '1'; wait for 5 ns;
      clk <= '0'; wait for 5 ns;
    end loop;
    wait;
  end process;

  sayac : process (clk)
  begin
    if clk'event then n_olay <= n_olay + 1; end if;              -- her iki kenar
    if rising_edge(clk) then n_yukselen <= n_yukselen + 1; end if;
    if clk'event and clk = '0' then n_dusen <= n_dusen + 1; end if;
  end process;

  izle : process (s)
  begin
    if s'event then
      report "s degisti: " & std_logic'image(s'last_value) & " -> " & std_logic'image(s);
    end if;
  end process;

  uyaran : process
  begin
    wait for 12 ns; s <= '1';
    wait for 15 ns; s <= '0';
    wait for 23 ns;
    report "olay: " & integer'image(n_olay) & ", yukselen: " & integer'image(n_yukselen)
         & ", dusen: " & integer'image(n_dusen);
    wait;
  end process;
end architecture;
`,
      },
      dene: ["h3-kenar-algilama", "h3-sentezlenebilir-nitelik"],
    },
    {
      baslik: "Öznitelikler 3: sayım tipleri ve kendi özniteliğin",
      metin: md(`
**Neden önemli?** Durum makinelerinde durumları ~bekle~, ~calis~ gibi adlarla yazarsın. Bu adların sırası, başlangıç değeri ve donanımdaki kodu özniteliklerle belirlenir; sentez raporunda gördüğün kodları anlamak için bunları bilmen gerekir.

**Sayım (enumeration) tipleri.** ~type durum is (bekle, ileri, geri, dur);~ gibi bir tipte her değerin bir konumu ve sentezde bir kodu vardır. Şekildeki üst şerit üçünü alt alta gösteriyor:

[[G-H3-17]]

Konumlar 0'dan başlar:

- ~durum'pos(geri)~ = 2: değerden konuma.
- ~durum'val(3)~ = ~dur~: konumdan değere.
- ~durum'left~ = ~bekle~ (yazılıştaki ilk değer), ~durum'high~ = ~dur~ (en büyük konumdaki değer).
- Başlangıç değeri verilmeyen bir nesne tipinin ~'left~ değerini alır. std_logic'te bu 'U', ~durum~ tipinde ~bekle~'dir.

Sentezde değerler varsayılan olarak **sıralı** kodlanır: dört değerli bir tipte 00, 01, 10, 11. ~enum_encoding~ özniteliği bu kodları değiştirir; dizgideki kodlar aynı sırayla değerlere verilir. Alt şeritte ~type color is (red, green, blue, white);~ için ~attribute enum_encoding of color : type is "11 00 10 01";~ yazılmış: red = 11, green = 00, blue = 10, white = 01 olur.

**Kullanıcı tanımlı öznitelikler.** Kendi özniteliğini üç adımda kullanırsın: bildir, bir nesneye bağla, oku.

[[G-H3-18]]

~~~
attribute number_of_inputs : integer;                -- bildirim
attribute number_of_inputs of nand3 : signal is 3;   -- belirtim
~~~

Belirtimin biçimi ~attribute ad of hedef : sınıf is değer;~ şeklindedir. Değer sonra ~nand3'number_of_inputs~ ile okunur. Sentez araçları da bu yolu kullanır: ~enum_encoding~ gibi araca özel ayarlar birer öznitelik belirtimidir.

**Operatör aşırı yükleme.** ~+~ gibi bir operatör yeni tip birleşimleri için tanımlanabilir. Fonksiyonun adı operatörün **tırnaklı** halidir: ~function "+" (a : integer; b : bit) return integer~. Derleyici hangi ~+~'nın çağrılacağını işlenenlerin tiplerine bakarak seçer.

> **Çözümlü örnek:** ~type durum is (bosta, calis, bitti);~ için ~durum'pos(bitti)~, ~durum'val(1)~ ve başlangıç değeri verilmemiş bir ~signal d : durum;~ kaçtır?
>
> 1. Konumlar bosta = 0, calis = 1, bitti = 2: ~durum'pos(bitti)~ = 2.
> 2. 1 numaralı konum: ~durum'val(1)~ = ~calis~.
> 3. Başlangıç değeri yok: d = ~durum'left~ = ~bosta~.

> **Sık hata:** Belirtimde ad ile hedefi karıştırmak: ~attribute nand3 of number_of_inputs ...~ yanlıştır. Önce öznitelik adı, ~of~'tan sonra hedef gelir. Bir de öznitelik değeri ~nand3'number_of_inputs := 3;~ diye atanamaz; değer yalnızca belirtimde verilir.

Aşağıdaki kod sayım tipinin özniteliklerini ve kullanıcı tanımlı bir özniteliği okur.
`),
      sim: {
        top: "tb",
        sure: "1ns",
        gorev: "durum tipine başa bir değer ekle (ör. kapali) ve d'nin başlangıç değerinin nasıl değiştiğine bak. Sonra nand3'e 3 yerine başka bir değer ver.",
        kod: `entity tb is
end entity;

architecture sim of tb is
  type durum is (bekle, ileri, geri, dur);
  signal d     : durum;  -- başlangıç değeri verilmedi
  signal nand3 : bit;

  attribute number_of_inputs : integer;                -- bildirim
  attribute number_of_inputs of nand3 : signal is 3;   -- belirtim
begin
  process
  begin
    report "d = " & durum'image(d);
    report "durum'pos(geri) = " & integer'image(durum'pos(geri));
    report "durum'val(3) = " & durum'image(durum'val(3));
    report "durum'left = " & durum'image(durum'left) & ", durum'high = " & durum'image(durum'high);
    report "nand3'number_of_inputs = " & integer'image(nand3'number_of_inputs);
    wait;
  end process;
end architecture;
`,
      },
      dene: ["h3-pos-val", "h3-kullanici-nitelik"],
    },
    {
      baslik: "GENERIC ile parametreli tasarım",
      metin: md(`
**Neden önemli?** 4 bitlik ve 8 bitlik iki sayacı ayrı ayrı yazmak yerine bir kez yazıp genişliği dışarıdan vermek hem hatayı hem tekrarı azaltır. Hazır IP çekirdekleri de böyle ayarlanır.

~generic~, bir entity'ye derleme anında verilen sabit parametredir. Aynı kodu farklı genişliklerde kullanmanı sağlar. Entity içinde ~port~'tan önce yazılır:

~~~
entity parite is
  generic (N : positive := 8);
  port (d : in std_logic_vector(N-1 downto 0); p : out std_logic);
end entity;
~~~

Varsayılan değer ~:=~ ile verilir (~N : positive := 8~). Bileşeni kullanırken önce ~generic map (N => 4)~, ardından ~port map~ yazılır: ~u1 : entity work.parite generic map (N => 4) port map (...)~. Değer verilmezse varsayılan geçerlidir. Mimarinin içinde generic bir **sabit** gibi davranır; okunabilir ama değiştirilemez.

Aynı parite kodundan iki farklı donanım çıkar:

[[G-H3-19]]

N = 4 iken port ~std_logic_vector(3 downto 0)~ olur ve ~for i in d'range loop~ döngüsü dört adıma açılır: üç XOR kapısı. N = 8 iken aynı döngü sekiz adıma açılır: yedi XOR kapısı. Döngü donanımda tekrar eden bir işlem değil, **kopyalanan** kapılardır; her adım ayrı bir kapı olur.

> **Çözümlü örnek:** ~generic (N : integer := 8); port (x : in std_logic_vector(N-1 downto 0));~ olan bir entity ~generic map (N => 12)~ ile örnekleniyor. ~x'high~ ve ~x'length~ kaçtır?
>
> 1. N = 12 olduğu için port ~std_logic_vector(11 downto 0)~ olur. Varsayılan 8 kullanılmaz.
> 2. ~x'high~ = 11, ~x'length~ = 12.

> **Sık hata:** Generic değerini ~port map~ içinde vermek ya da mimari içinde ~N := 6;~ diye değiştirmeye çalışmak. Generic yalnızca ~generic map~ ile verilir ve mimaride sabittir.

Aşağıdaki örnekte parite üretecinde ~N~ ve ~'range~ birlikte kullanılıyor. Testbench'teki ~N => 4~ değerini değiştir ve ~d~'nin genişliğini buna uydur.
`),
      sim: {
        top: "tb",
        sure: "40ns",
        gorev: "Testbench'te N'yi 6 yap ve d sinyalini 6 bitlik olacak şekilde güncelle.",
        kod: `${UST}
entity parite is
  generic (N : positive := 8);
  port (
    d : in  std_logic_vector(N - 1 downto 0);
    p : out std_logic
  );
end entity;

architecture rtl of parite is
begin
  process (d)
    variable x : std_logic;
  begin
    x := '0';
    for i in d'range loop
      x := x xor d(i);
    end loop;
    p <= x;  -- 1 sayısı tekse '1'
  end process;
end architecture;

library ieee;
use ieee.std_logic_1164.all;

entity tb is
end entity;

architecture sim of tb is
  signal d : std_logic_vector(3 downto 0) := "0000";
  signal p : std_logic;
begin
  uut : entity work.parite
    generic map (N => 4)
    port map (d => d, p => p);

  process
  begin
    d <= "0001"; wait for 10 ns;
    d <= "0011"; wait for 10 ns;
    d <= "0111"; wait for 10 ns;
    report "d'length = " & integer'image(d'length);
    wait;
  end process;
end architecture;
`,
      },
      dene: ["h3-generic-genislik", "t3-generic-map"],
    },
  ],
  test: ["h3-uc-bolum", "h3-port-inout", "h3-not-oncelik", "h3-mod-rem-pozitif", "h3-birlestirme", "h3-attr-downto", "h3-generic-yer"],
};
