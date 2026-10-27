import { UST, md, type Ders } from "./tipler";

export const HAFTA_3: Ders = {
  hafta: 3,
  baslik: "VHDL'in yapısı, operatörler ve öznitelikler",
  ozet: "Bir VHDL dosyasının üç bölümünü, operatörleri, öznitelikleri ve GENERIC ile parametreli tasarımı öğren.",
  bolumler: [
    {
      baslik: "Üç bölüm: library, entity, architecture",
      metin: md(`
Her VHDL tasarımı üç parçadan oluşur:

- **Kütüphane bildirimleri:** Kullanacağın tip ve fonksiyonların nereden geleceğini söyler. ~library ieee;~ ve ~use ieee.std_logic_1164.all;~ neredeyse her dosyada bulunur. ~std~ ve ~work~ kütüphaneleri her zaman görünür olduğu için bildirilmeleri gerekmez.
- **entity:** Devrenin dışarıdan görünüşü, yani portlarıdır. Bir kutunun bacaklarını tanımlar.
- **architecture:** Kutunun içinde ne olduğunu anlatır. ~architecture rtl of yarim_toplayici is~ satırı bu mimarinin hangi entity'ye ait olduğunu söyler. Bir entity'nin **birden fazla** architecture'ı olabilir (örneğin bir davranışsal, bir yapısal); bileşen örneklenirken hangisinin kullanılacağı seçilir.

[[G-H3-01]]

Yazım kuralları:

- Port listesinde her port ~ad : mod tip~ biçimindedir. Portlar noktalı virgülle **ayrılır**; son porttan sonra noktalı virgül konmaz: ~port (a : in std_logic; y : out std_logic);~
- Bir entity ~end;~, ~end entity;~, ~end sayac;~ ya da ~end entity sayac;~ ile kapatılabilir. ~end architecture~ yalnızca bir mimariyi kapatır.

Port modları:

- ~in~: yalnızca okunur.
- ~out~: yalnızca yazılır; VHDL-93'te devrenin içinden okunamaz.
- ~inout~: iki yönlüdür; hem dışarıdan hem içeriden sürülebilir.
- ~buffer~: yazılır ve içeriden geri okunabilir, ama yalnızca tek bir kaynaktan sürülür.

[[G-H3-02]]

**Yarım ve tam toplayıcı:** Yarım toplayıcı iki biti toplar: ~s = a xor b~, ~c = a and b~. Önceki basamaktan gelen bir elde girişi olmadığı için çok bitli toplamada yalnızca en düşük basamakta işe yarar. **Tam toplayıcı** üç biti (a, b ve elde girişi cin) toplar:

- Toplam: ~s = a xor b xor cin~
- Elde: ~cout = (a and b) or (cin and (a xor b))~, yani Cout = AB + Cin(A ⊕ B). Girişlerden en az ikisi 1 ise elde 1 olur.

Örneğin a = 1, b = 0, cin = 1 için 1 + 0 + 1 = 2 = ikilik 10, yani s = 0 ve cout = 1.

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
    },
    {
      baslik: "Operatörler",
      metin: md(`
VHDL operatörleri gruplara ayrılır:

- **Mantıksal:** ~and or nand nor xor xnor not~. ~not~ en yüksek önceliğe sahiptir; diğerlerinin hepsi aynı önceliktedir. Bu yüzden ~a and b or c~ geçersizdir, parantez şarttır. ~nand~ ve ~nor~ zincirlenemez: ~a nand b nand c~ derlenmez.
- **İlişkisel:** ~= /= < <= > >=~. Sonuç ~boolean~'dır. ~<=~ hem "küçük eşit" hem sinyal atamasıdır; bağlam belirler.
- **Toplama ve birleştirme:** ~+ -~ ve ~&~. ~&~ iki vektörü ya da biti uç uca ekler: ~"10" & '1'~ sonucu ~"101"~.
- **Çarpma:** ~* / mod rem~. Tam sayı bölmesi **sıfıra doğru** yuvarlar: ~7 / 2 = 3~, ~-7 / 2 = -3~. Bölme sentezde pahalıdır; çoğu araç yalnızca bölen **2'nin sabit bir kuvveti** olduğunda kabul eder, çünkü bu bitleri sağa kaydırmaya indirgenir (~x / 4~ iki bit sağa kaydırmadır). ~mod~, ~rem~ ve ~abs~ için de destek sınırlıdır.
- **Kaydırma:** ~sll srl sla sra rol ror~ (~bit_vector~ ve numeric_std tipleriyle).
- **Atama:** sinyale ~<=~; değişken, sabit ve generic'e ~:=~. ~=>~ ise ~others => '0'~ ya da port map gibi eleman eşlemede kullanılır.

**Kaydırma ve döndürme:** ~sll~ sola kaydırır ve sağdan '0' ekler; ~srl~ sağa kaydırır ve soldan '0' ekler. ~rol~ ve ~ror~ ise döndürür: bir uçtan çıkan bit öbür uçtan girer. ~x = "1011"~ için:

- ~x sll 1~ = ~"0110"~, ~x srl 2~ = ~"0010"~
- ~"1001" rol 1~ = ~"0011"~

Aynı işi birleştirmeyle de yapabilirsin: ~x(2 downto 0) & '0'~ bir bit sola kaydırmadır.

**others ile toplu atama:** ~(others => '0')~ belirtilmeyen bütün elemanları kapsar. Tek tek indis de verilebilir: ~(1 => '1', others => '0')~. Sonuç soldan sağa **indis sırasıyla** yazılır, bu yüzden aralığın yönü önemlidir:

- ~std_logic_vector(3 downto 0)~ için soldan sağa v(3), v(2), v(1), v(0): sonuç ~"0010"~.
- ~std_logic_vector(0 to 3)~ için en soldaki v(0)'dır: sonuç ~"0100"~.

**mod ve rem farkı:** ikisi de bölümden kalanı verir ama işaretleri farklıdır. ~rem~ sonucunun işareti **bölünenle**, ~mod~ sonucunun işareti **bölenle** aynıdır. Pozitif sayılarda ikisi eşittir.

**Hangi tip toplanabilir?** ~integer~ tipindeki iki sinyal hiçbir paket gerekmeden ~+~ ile toplanır. Vektörlerde ise ~ieee.numeric_std~ paketi ~signed~ ve ~unsigned~ için aritmetik tanımlar, ama ~std_logic_vector~ için **tanımlamaz**. İki ~std_logic_vector~ doğrudan ~a + b~ diye toplanamaz; önce dönüştürmek gerekir: ~std_logic_vector(unsigned(a) + unsigned(b))~. (Eski ~std_logic_unsigned~ paketi buna izin verir ama standart değildir.)

**Taşma sessizdir:** numeric_std'de toplamın genişliği işlenenlerin genişliğidir. Sonuç sığmazsa üstteki bit atılır ve değer 2^n'e göre **sarar**, uyarı da verilmez:

- 4 bitlik unsigned: 12 + 5 = 17 → 17 - 16 = 1, yani ~"0001"~. 2 - 3 = -1 → -1 + 16 = 15, yani ~"1111"~.
- 4 bitlik signed (aralık -8..7): -7 - 6 = -13 → -13 + 16 = 3, yani ~"0011"~.

Eldeyi kaybetmemek için işlenenler önce bir bit genişletilir ve 5 bitlik bir sonuca toplanır: ~('0' & a) + ('0' & b)~.

**İşaretli karşılaştırma:** aynı bitler signed ve unsigned olarak farklı sayılardır. ~signed'("1000")~ = -8 ve ~signed'("0111")~ = 7 olduğu için ~signed'("1000") > signed'("0111")~ yanlıştır (false); unsigned olarak bakılsaydı 8 > 7 doğru olurdu.

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
    },
    {
      baslik: "Öznitelikler",
      metin: md(`
Öznitelikler (attribute) bir sinyal, tip ya da dizi hakkında bilgi verir ve ~'~ ile yazılır.

Dizi öznitelikleri, ~signal d : std_logic_vector(7 downto 0)~ için:

- ~d'left~ = 7, ~d'right~ = 0
- ~d'high~ = 7, ~d'low~ = 0
- ~d'length~ = 8
- ~d'range~ = ~7 downto 0~, ~d'reverse_range~ = ~0 to 7~

~to~ ile tanımlı bir dizide ~'left~ küçük indistir. ~'high~ ve ~'low~ ise yönden bağımsız olarak en büyük ve en küçük indisi verir.

Sinyal öznitelikleri:

- ~clk'event~: sinyal bu anda değişti mi? Tek başına **her iki** kenarda da doğrudur.
- ~clk'stable~: sinyal bu anda değişmedi mi? ~clk'event~'in tersidir.
- ~s'last_value~: son değişimden önceki değer. Örneğin s '0'dan '1'e geçtiyse ~s'last_value~ = '0'. Yalnızca benzetimde kullanılır.

Kenar algılama yazımları:

- Yükselen kenar için şu üçü eşdeğerdir: ~clk'event and clk = '1'~, ~not clk'stable and clk = '1'~ ve ~rising_edge(clk)~.
- ~clk'event and clk = '0'~ düşen kenardır (~falling_edge(clk)~).

Döngülerde ~for i in d'range loop~ yazmak, dizinin genişliği değişse bile kodu doğru tutar. Sinyal özniteliklerinin çoğu yalnızca benzetim içindir. Sentezlenebilen ikisi ~'event~ ve ~'stable~'dır; ~'last_value~, ~'last_event~, ~'quiet~, ~'active~, ~'delayed~ ve ~'transaction~ sentezlenmez. Dizi öznitelikleri de sentezde desteklenir.

**Sayım (enumeration) tipleri:** ~type durum is (bekle, ileri, geri, dur);~ gibi bir tipte değerlerin konumu 0'dan başlar:

- ~durum'pos(geri)~ = 2: değerden konuma.
- ~durum'val(3)~ = ~dur~: konumdan değere.
- ~durum'left~ = ~bekle~ (yazılıştaki ilk değer), ~durum'high~ = ~dur~ (en büyük konumdaki değer).
- Başlangıç değeri verilmeyen bir nesne tipinin ~'left~ değerini alır. std_logic'te bu 'U', ~durum~ tipinde ~bekle~'dir.

Sentezde değerler varsayılan olarak **sıralı** kodlanır: dört değerli bir tipte 00, 01, 10, 11. ~enum_encoding~ özniteliği bu kodları değiştirir; dizgideki kodlar aynı sırayla değerlere verilir. ~type color is (red, green, blue, white);~ için ~attribute enum_encoding of color : type is "11 00 10 01";~ yazılırsa red = 11, green = 00, blue = 10, white = 01 olur.

**Kullanıcı tanımlı öznitelikler:** Kendi özniteliğini önce bildirir, sonra bir nesneye değer verirsin:

~~~
attribute number_of_inputs : integer;                -- bildirim
attribute number_of_inputs of nand3 : signal is 3;   -- belirtim
~~~

Belirtimin biçimi ~attribute ad of hedef : sınıf is değer;~ şeklindedir. Değer sonra ~nand3'number_of_inputs~ ile okunur.

**Operatör aşırı yükleme:** ~+~ gibi bir operatör yeni tip birleşimleri için tanımlanabilir. Fonksiyonun adı operatörün **tırnaklı** halidir: ~function "+" (a : integer; b : bit) return integer~. Derleyici hangi ~+~'nın çağrılacağını işlenenlerin tiplerine bakarak seçer.
`),
    },
    {
      baslik: "GENERIC ile parametreli tasarım",
      metin: md(`
~generic~, bir entity'ye derleme anında verilen sabit parametredir. Aynı kodu farklı genişliklerde kullanmanı sağlar. Entity içinde ~port~'tan önce yazılır:

~~~
entity parite is
  generic (N : positive := 8);
  port (d : in std_logic_vector(N-1 downto 0); p : out std_logic);
end entity;
~~~

Varsayılan değer ~:=~ ile verilir (~N : positive := 8~). Bileşeni kullanırken önce ~generic map (N => 4)~, ardından ~port map~ yazılır: ~u1 : entity work.parite generic map (N => 4) port map (...)~. Değer verilmezse varsayılan geçerlidir. Mimarinin içinde generic bir **sabit** gibi davranır; okunabilir ama değiştirilemez.

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
    },
  ],
  test: ["h3-uc-bolum", "h3-port-inout", "h3-not-oncelik", "h3-mod-rem-pozitif", "h3-birlestirme", "h3-attr-downto", "h3-generic-yer"],
};
