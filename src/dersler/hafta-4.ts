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
- **variable:** Yalnızca bir ~process~ (ya da alt program) içinde tanımlanır ve kullanılır. ~:=~ ile atanır.

En önemli fark, değerin **ne zaman** güncellendiğidir:

- Değişkene atanan değer **hemen** geçerli olur; bir sonraki satır yeni değeri görür.
- Sinyale atanan değer process **beklemeye geçtiğinde** (sonuna ulaştığında ya da ~wait~'te) güncellenir. Aynı process içinde aynı sinyale birden çok atama yapılırsa **sonuncusu** geçerli olur.

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

- ~'U'~ başlangıç değeri verilmemiş (atanmamış)
- ~'X'~ güçlü bilinmeyen (çakışma), ~'0'~ ve ~'1'~ güçlü değerler
- ~'Z'~ yüksek empedans (hat bırakılmış)
- ~'W'~, ~'L'~, ~'H'~ zayıf bilinmeyen, zayıf 0, zayıf 1
- ~'-'~ önemsiz (don't care)

~std_logic~, ~std_ulogic~'in **çözümlenmiş** halidir: aynı sinyali birden çok kaynak sürerse bir çözümleme fonksiyonu sonucu belirler. Örneğin bir kaynak ~'0'~, diğeri ~'1'~ sürerse sonuç ~'X'~; biri ~'Z'~ bırakırsa diğerinin değeri geçerli olur. ~std_ulogic~'te birden çok sürücü derleme hatasıdır.

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

Aynı bitler farklı tiplerde farklı sayılar demektir: ~"1111"~, ~unsigned~ olarak 15, ~signed~ olarak -1'dir.
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

~ram(3)~ dördüncü kelimeyi, ~ram(3)(0)~ o kelimenin en düşük bitini verir.

**Alt tip** (subtype), var olan bir tipin değer aralığını daraltır ama tipi değiştirmez: ~subtype rakam is integer range 0 to 9;~ ile tanımlı bir nesne ~integer~ ile serbestçe karışır, fakat aralık dışı bir değer benzetimde hata verir. Tamsayılara aralık vermek sentezde bit sayısını da belirler: ~integer range 0 to 255~ 8 bitle gerçeklenir.
`),
    },
  ],
  test: ["h4-variable-yer", "h4-signal-guncelleme", "h4-isim-gecerli", "h4-std-ulogic-deger", "h4-cozumleme", "h4-signed-deger", "h4-to-integer"],
};
