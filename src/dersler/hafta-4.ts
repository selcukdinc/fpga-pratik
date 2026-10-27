import { UST, md, type Ders } from "./tipler";

export const HAFTA_4: Ders = {
  hafta: 4,
  baslik: "Veri nesneleri ve veri tipleri",
  ozet: "constant, signal ve variable farkını; std_logic, numeric_std, tip dönüşümleri ve dizileri öğren.",
  bolumler: [
    {
      baslik: "constant, signal, variable",
      metin: md(`
VHDL'de değer tutan üç tür nesne vardır:

- **constant:** Bir kez değer alır, sonra değişmez. ~constant GENISLIK : integer := 8;~
- **signal:** Donanımdaki bir teli ya da yazmacı temsil eder. ~<=~ ile atanır. Mimarinin bildirim bölümünde (ya da port olarak) tanımlanır.
- **variable:** Yalnızca bir ~process~ (ya da function, procedure) içinde, ~process~ ile ~begin~ arasındaki bildirim bölümünde tanımlanır ve kullanılır. ~:=~ ile atanır. Başka bir process onu göremez; değeri dışarı taşımak için process içinde bir sinyale atanır.

En önemli fark, değerin **ne zaman** güncellendiğidir:

- Değişkene atanan değer **hemen** geçerli olur; bir sonraki satır yeni değeri görür.
- Sinyale atanan değer process **beklemeye geçtiğinde** (sonuna ulaştığında ya da ~wait~'te) güncellenir. Aynı process içinde aynı sinyale birden çok atama yapılırsa **sonuncusu** geçerli olur.

Bu yüzden aynı process'te ~a <= b; b <= a;~ yazmak iki sinyalin değerini **takas eder**: iki satır da eski değerleri okur. Değişkenlerle aynı şey olmaz; ~v1 := v2; v2 := v1;~ sonrası ikisi de aynı değeri taşır, takas için üçüncü bir değişken gerekir. Sinyal ataması bir sonraki **delta döngüsünde** etkili olur: delta döngüsü, benzetim zamanı ilerlemeden atılan sıfır süreli adımdır. Atamadan hemen sonra ~x := s;~ yazarsan hâlâ eski değeri okursun.

Bir process'in değişkenleri benzetim başında bir kez ilklenir ve process her uyandığında **kaldıkları değerden devam eder**; değerlerini process çalışmaları arasında korurlar.

~s <= a after 5 ns;~ gibi gecikmeler yalnızca benzetimde anlamlıdır. Sentez aracı ~after~'ı yok sayar; gerçek gecikmeyi kullanılan donanım belirler.

Bir ~out~ portu mimarinin içinden okunamadığı için, değeri hem çıkışa vermek hem içeride kullanmak gerektiğinde bir **iç sinyal** tanımlanır: hesap iç sinyalle yapılır, port da ~y <= ic;~ ile bu sinyalden sürülür. ~buffer~ da çalışır ama iç sinyal daha temiz bir yoldur.

[[G-H4-01]]

Aşağıdaki örnekte aynı hesap bir kez değişkenle, bir kez sinyalle yapılıyor. Mesaj panelindeki farkı incele.
`),
      sim: {
        top: "tb",
        sure: "20ns",
        gorev: "Sinyalli process'in sonuna bir wait for 0 ns; ve ardından bir report daha ekleyip s_sonuc'un ne zaman güncellendiğini gör.",
        kod: `entity tb is
end entity;

architecture sim of tb is
  signal s : integer := 0;
  signal s_sonuc : integer := 0;
begin
  -- Değişkenle: her satır bir öncekinin sonucunu görür
  process
    variable v : integer := 0;
  begin
    v := 1;
    v := v + 1;
    v := v * 10;
    report "degiskenle sonuc = " & integer'image(v);  -- 20
    wait;
  end process;

  -- Sinyalle: atamalar process beklemeye geçince uygulanır
  process
  begin
    s <= 1;
    s <= s + 1;      -- s hâlâ 0, yani 1 planlanır
    s_sonuc <= s * 10;
    report "sinyal process icindeyken s = " & integer'image(s);  -- 0
    wait for 1 ns;
    report "1 ns sonra s = " & integer'image(s) & ", s_sonuc = " & integer'image(s_sonuc);
    wait;
  end process;
end architecture;
`,
      },
    },
    {
      baslik: "İsimlendirme kuralları",
      metin: md(`
VHDL büyük/küçük harf ayırmaz: ~Sayac~ ve ~SAYAC~ aynı isimdir. Bir isim:

- harfle başlamalıdır,
- harf, rakam ve alt çizgiden oluşur,
- alt çizgiyle bitemez ve iki alt çizgi yan yana gelemez,
- ~signal~, ~entity~, ~process~ gibi ayrılmış sözcüklerden biri olamaz.

Örneğin ~veri_1~ geçerli; ~1veri~, ~veri_~ ve ~veri__1~ geçersizdir.
`),
    },
    {
      baslik: "std_logic ve dokuz değer",
      metin: md(`
~bit~ tipinin yalnızca ~'0'~ ve ~'1'~ değerleri vardır. Gerçek devrelerde bundan fazlasına ihtiyaç duyulur, bu yüzden ~std_ulogic~ dokuz değer tanımlar:

- ~'U'~ başlangıç değeri verilmemiş (atanmamış). Yalnızca benzetimde görülür; donanımda karşılığı yoktur.
- ~'X'~ güçlü bilinmeyen (çakışma), ~'0'~ ve ~'1'~ güçlü değerler
- ~'Z'~ yüksek empedans: hattı hiçbir kaynak sürmüyor. Üç durumlu (tri-state) çıkışlarla donanımda gerçeklenebilir.
- ~'W'~, ~'L'~, ~'H'~ zayıf bilinmeyen, zayıf 0, zayıf 1. Çekme dirençleri (pull-up, pull-down) ~'H'~ ve ~'L'~ ile modellenir.
- ~'-'~ önemsiz (don't care): sentez aracına sadeleştirme serbestliği verir.

Değerlerin tanımlı sırası 'U', 'X', '0', '1', 'Z', 'W', 'L', 'H', '-' şeklindedir. Bu sıra alt tip aralıklarında önemlidir: ~subtype s3 is std_ulogic range '0' to 'Z';~ yalnızca '0', '1' ve 'Z' değerlerini içerir.

~bit~ yalnızca bir mantık tipidir; onun için aritmetik tanımlı değildir. Toplama için ~integer~, ~unsigned~ ya da ~signed~ kullanılır.

~std_logic~, ~std_ulogic~'in **çözümlenmiş** alt tipidir: aynı sinyali birden çok kaynak sürerse bir çözümleme fonksiyonu sonucu belirler. Kurallar:

- İki güçlü değer çelişirse güçlü bilinmeyen: ~'0'~ ile ~'1'~ → ~'X'~.
- ~'Z'~ hattı sürmez, sonucu diğer kaynak belirler: ~'Z'~ ile ~'1'~ → ~'1'~.
- Güçlü değer zayıfı yener: ~'0'~ ile ~'H'~ → ~'0'~.
- İki zayıf değer çelişirse zayıf bilinmeyen: ~'L'~ ile ~'H'~ → ~'W'~.

~std_ulogic~ (ve ~bit~ gibi çözümlenmemiş tipler) için birden çok sürücü hatadır. Bu, iki çıkışı yanlışlıkla birbirine bağlamayı yakalar. Dikkat: mimarideki **her eşzamanlı atama ayrı bir sürücüdür**. ~bit_vector~ tipindeki E için ~E <= not H;~ ve ardından ~E(2) <= '0';~ yazarsan E(2)'nin iki sürücüsü olur ve "multiple driven" hatası alırsın. Çözüm tek atamada birleştirmektir: ~E <= '0' & not H(1 downto 0);~

[[G-H4-03]]

Aşağıda iki üç durumlu tamponun çıkışları (~s1~ ve ~s2~) aynı hatta bağlanıyor. Hattın değerini, std_logic_1164 paketinin kullandığı çözümleme fonksiyonu ~resolved~ ile hesaplıyoruz; iki sürücü aynı sinyale atandığında benzetici de arka planda tam olarak bunu yapar. ~en1~ ve ~en2~'nin birlikte '1' olduğu anda hattın ~'X'~ olduğunu gör.
`),
      sim: {
        top: "tb",
        sure: "40ns",
        kod: `library ieee;
use ieee.std_logic_1164.all;

entity tb is
end entity;

architecture sim of tb is
  signal en1, en2 : std_logic := '0';
  signal s1, s2 : std_ulogic;  -- iki tamponun çıkışı
  signal hat : std_logic;
begin
  -- Birinci tampon '0', ikincisi '1' sürmeye çalışıyor
  s1 <= '0' when en1 = '1' else 'Z';
  s2 <= '1' when en2 = '1' else 'Z';
  -- Ortak hat: iki sürücünün değeri çözümleme fonksiyonundan geçer
  hat <= resolved(std_ulogic_vector'(s1, s2));

  process
  begin
    wait for 5 ns;  report "ikisi de Z birakiyor: hat = " & std_logic'image(hat);
    en1 <= '1';
    wait for 10 ns; report "yalniz en1: hat = " & std_logic'image(hat);
    en2 <= '1';
    wait for 10 ns; report "en1 ve en2 birlikte: hat = " & std_logic'image(hat);
    en1 <= '0';
    wait for 10 ns; report "yalniz en2: hat = " & std_logic'image(hat);
    wait;
  end process;
end architecture;
`,
      },
    },
    {
      baslik: "numeric_std: signed, unsigned ve dönüşümler",
      metin: md(`
~std_logic_vector~ yalnızca bir bit dizisidir; sayı olarak yorumlanmaz. Aritmetik için ~ieee.numeric_std~ paketindeki ~unsigned~ ve ~signed~ tipleri kullanılır. Derste ~std_logic_arith~ ve ~std_logic_unsigned~ yerine bu paket tercih edilir, çünkü standarttır.

VHDL tiplere çok sıkı bakar; farklı tipler arasında açık dönüşüm gerekir:

- ~unsigned(v)~ / ~signed(v)~: ~std_logic_vector~'ü sayıya çevirir (aynı bitler, yeni yorum).
- ~std_logic_vector(u)~: geri çevirir.
- ~to_integer(u)~: ~unsigned~ ya da ~signed~'ı tamsayıya çevirir.
- ~to_unsigned(n, genislik)~ / ~to_signed(n, genislik)~: tamsayıyı verilen genişlikte vektöre çevirir.

~to_integer~ yalnızca ~signed~ ve ~unsigned~ alır, ~std_logic_vector~ almaz: önce ~to_integer(unsigned(v))~ yazılır. Tamsayıyı vektöre çevirmek için de önce ~to_unsigned(n, 8)~ ile genişlik verilir, sonra ~std_logic_vector(...)~ ile çevrilir. Tek bir ~std_logic~ bitini sayıya çevirmek için onu boş dizgiyle birleştirip 1 elemanlı bir vektör yaparsın: ~to_integer(unsigned'(b & ""))~ 0 ya da 1 döndürür. Bu dönüşümler donanımda hiçbir şey eklemez; kablolar aynı kalır, yalnızca bitlerin yorumu değişir.

**İkiye tümleyen:** ~signed~ değerler ikiye tümleyendir. n bitlik signed aralığı -2^(n-1) ile 2^(n-1) - 1 arasıdır; 4 bitte -8..7, 8 bitte -128..127. En soldaki bit -2^(n-1) ağırlığındadır:

- ~"1000"~ signed olarak -8, unsigned olarak 8'dir.
- ~"1110"~ = -8 + 4 + 2 = -2. ~"1010"~: tersi 0101, +1 = 0110 = 6, yani -6.
- ~to_signed(-3, 4)~: 3 = 0011, tersi 1100, +1 = ~"1101"~.

~resize(x, n)~ genişliği değiştirir: ~signed~ için işaret bitini çoğaltır (-6 = ~"1010"~ → ~"11111010"~), ~unsigned~ için sola sıfır ekler. numeric_std, ~signed~ ve ~unsigned~ için ~and~, ~or~ gibi mantıksal operatörleri de tanımlar.

Aynı bitler farklı tiplerde farklı sayılar demektir: ~"1111"~, ~unsigned~ olarak 15, ~signed~ olarak -1'dir.

[[G-H4-02]]

**Tip uyumu:** VHDL güçlü tiplidir ve örtük dönüşüm yapmaz. ~bit~ ile ~std_logic~, ~bit_vector~ ile ~std_logic_vector~, ~integer~ ile ~std_logic_vector~ birbirine doğrudan atanamaz; ~unsigned~ bir sinyal de ~std_logic_vector~'e ancak ~std_logic_vector(u)~ ile atanır.

**Bit dizgileri ve sayı tabanları:**

- ~B"1010"~ ikilik, ~O"17"~ sekizlik (her basamak 3 bit), ~X"A5"~ onaltılık (her basamak 4 bit) yazımdır. ~X"A5"~ 8 bittir; ~X"3C"~ = ~"00111100"~; ~O"17"~ = ~"001111"~.
- Taban belirtilen dizgilerde okunabilirlik için alt çizgi kullanılabilir: ~X"FF_00"~, ~B"1010_0101"~. Tabansız ~"1010_0101"~ yazımında alt çizgi kullanılamaz.
- Farklı tabanlar aynı bitleri verebilir: ~X"333"~ = 0011 0011 0011 = üçerli gruplanınca 001 100 110 011 = ~O"1463"~.
- Tamsayılar da tabanla yazılabilir: ~16#FF#~ = 255, ~2#1010#~ = 10.
`),
      sim: {
        top: "tb",
        sure: "1ns",
        gorev: "BITLER'i \"1000\" yapıp signed yorumunun -8 olduğunu gör. Sonra toplamı 4 bitte taşacak şekilde değiştir.",
        kod: `${UST}
entity tb is
end entity;

architecture sim of tb is
  constant BITLER : std_logic_vector(3 downto 0) := "1111";
begin
  process
    variable u : unsigned(3 downto 0);
    variable t : unsigned(3 downto 0);
  begin
    report "unsigned: " & integer'image(to_integer(unsigned(BITLER)));
    report "signed:   " & integer'image(to_integer(signed(BITLER)));

    u := to_unsigned(9, 4);
    t := u + 3;  -- 4 bitte 12
    report "9 + 3 = " & integer'image(to_integer(t));
    t := u + 9;  -- 18, ama 4 bit: taşar
    report "9 + 9 (4 bit) = " & integer'image(to_integer(t));
    wait;
  end process;
end architecture;
`,
      },
    },
    {
      baslik: "Diziler ve alt tipler",
      metin: md(`
Kendi dizi tiplerini tanımlayabilirsin. Bir bellek, kelimelerden oluşan bir dizidir:

~~~
type bellek_t is array (0 to 15) of std_logic_vector(7 downto 0);
signal ram : bellek_t;
~~~

~ram(3)~ dördüncü kelimeyi, ~ram(3)(0)~ o kelimenin en düşük bitini verir. Dizi tipinde önce indeks aralığı (kelime sayısı), sonra eleman tipi (kelime genişliği) yazılır. ~ram'length~ kelime sayısıdır (16), kelime genişliği bunu etkilemez. VHDL'de hazır bir bellek tipi yoktur; önce böyle bir tip tanımlanır.

Bu bir **dizinin dizisidir** (1Dx1D) ve elemanlara iki ayrı parantezle erişilir: ~y(1)(2)~. Gerçek **2 boyutlu** dizide ise tek parantez ve virgül kullanılır, tek indeksle bir satır alınamaz:

~~~
type matris_t is array (0 to 3, 0 to 3) of std_logic;
signal w : matris_t;   -- w(2, 1) bir bittir
~~~

Yapısı aynı olan iki dizi tipi yine de **farklı tiplerdir**: ~type row is array (7 downto 0) of std_logic;~ ile tanımlı bir sinyal, aynı genişlikteki ~std_logic_vector~'e atanamaz.

Bir port kendi tanımladığın bir dizi tipinde olacaksa, tip port listesinden **önce** görünür olmalıdır. Architecture'da tanımlanan tip entity'den sonra geldiği için yetmez; tip bir **package** içinde tanımlanır ve ~use work.paket_adi.all;~ ile tasarıma açılır.

**Vektör indisleri ve dilimler:** Bir dizgi değeri soldan sağa **indis sırasıyla** yerleşir. ~downto~ ile bildirilen vektörde soldaki bit en büyük indistir; ~to~ ile bildirilen vektörde en küçük indis (ör. ~b(0)~) soldadır. Dilimin yönü vektörün bildirildiği yönle aynı olmalıdır: ~a : std_logic_vector(7 downto 0)~ için ~a(7 downto 4)~ soldaki dört bittir, ~a(4 to 7)~ ise hatadır. Dilimler birleştirilebilir: ~a(1 downto 0) & a(3 downto 2)~ alt iki biti sola, üst iki biti sağa yazar.

**Alt tip** (subtype), var olan bir tipin değer aralığını daraltır ama tipi değiştirmez: ~subtype rakam is integer range 0 to 9;~ ile tanımlı bir nesne ~integer~ ile serbestçe karışır. ~type~ ile bildirilen bir tamsayı tipi ise ~type r_t is range 0 to 9;~ gibi **yeni ve bağımsız** bir tiptir; ~integer~'a atamak için ~integer(r)~ dönüşümü gerekir.

**Aralık ve bit sayısı:** Tamsayılara aralık vermek sentezde bit sayısını belirler:

- ~integer range 0 to 15~ 4 bit (2^4 = 16 değer), ~0 to 100~ 7 bit (6 bit en çok 63'ü gösterir), ~0 to 255~ 8 bit.
- Negatif değer varsa ikiye tümleyen kullanılır: ~-8 to 7~ 4 bit, ~-63 to 63~ 6 değer biti ve 1 işaret biti, yani 7 bit.
- Aralık verilmezse ~integer~ 32 bit olarak sentezlenir.

Aralık dışı bir değer **benzetimde** hata verip benzetimi durdurur; 0 to 15 aralıklı bir sayaç 15'ten sonra 16 olursa benzetim durur. Sentezlenmiş devrede ise denetim yoktur, değer yalnızca bitlerin taşıyabildiği kadardır. Bu yüzden aralığı en büyük sonuca göre seç: 0..15 ve 0..31 aralıklı iki sayının çarpımı en çok 15 · 31 = 465'tir, ~range 0 to 511~ (9 bit) yeterlidir.
`),
    },
  ],
  test: ["h4-variable-yer", "h4-signal-guncelleme", "h4-isim-gecerli", "h4-std-ulogic-deger", "h4-cozumleme", "h4-signed-deger", "h4-to-integer"],
};
