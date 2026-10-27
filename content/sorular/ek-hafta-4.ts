// B6: 4. hafta için türetilmiş ek sorular. yedek: true olanlar yalnızca aralıklı tekrarda gelir.
import { IEEE, bit, turet, vektor, type Soru } from "./tipler.ts";

// Tek bir process'te assert'lerle sınayan küçük testbench; degisken process'in bildirim kısmına girer
const sina = (bildirim: string, govde: string, degisken = "") => ({
  calismali: `${IEEE}
entity tb is end tb;
architecture z of tb is
${bildirim}
begin
  process
${degisken}
  begin
    wait for 1 ns;
${govde}
    wait;
  end process;
end z;`,
});

// Derlenmemesi gereken bildirim ya da deyimi boş bir mimariye yerleştirir
const hatali = (bildirim: string, deyim = "") => ({
  derlenmemeli: `${IEEE}
entity tb is end tb;
architecture z of tb is
${bildirim}
begin
${deyim}
end z;`,
});

// std_logic_1164'teki çözümleme fonksiyonunu iki sürücüyle doğrudan çağırır
const coz = (iki: string, sonuc: string) =>
  sina("", `    assert resolved(std_ulogic_vector'("${iki}")) = '${sonuc}' severity failure;`);

export const ekHafta4: Soru[] = [
  ...turet(4, "veri-nesneleri", "atama-zamani", [
    {
      id: "t4-son-atama", zorluk: 1, tip: "fill",
      soru: "Bir process içinde art arda ~y <= '0';~ ve ~y <= '1';~ yazılmıştır. Process askıya alındıktan sonra ~y~ kaçtır?",
      bosluklar: [bit("1")],
      aciklama: "Aynı process'te bir sinyale yapılan atamalardan sonuncusu geçerli olur. Önceki atama, sinyal güncellenmeden önce ezilir.",
      dogrulama: sina("  signal y : std_logic := 'U';", "    y <= '0';\n    y <= '1';\n    wait for 0 ns;\n    assert y = '1' severity failure;"),
    },
    {
      id: "t4-swap", zorluk: 2, tip: "tf",
      soru: "Bir process içinde ~a <= b;~ ve ~b <= a;~ yazmak, iki sinyalin değerini takas eder.",
      dogru: true,
      aciklama: "İki atama da sinyallerin eski değerlerini okur; yeni değerler process askıya alınınca birlikte yazılır. Bu yüzden ara değişken gerekmez.",
      dogrulama: sina(
        "  signal a : std_logic := '0';\n  signal b : std_logic := '1';",
        "    a <= b;\n    b <= a;\n    wait for 0 ns;\n    assert a = '1' and b = '0' severity failure;",
      ),
    },
    {
      id: "t4-swap-var", zorluk: 2, tip: "mcq", yedek: true,
      soru: "~v1 = 1~ ve ~v2 = 2~ olan iki değişken için ~v1 := v2; v2 := v1;~ çalışınca değerler ne olur?",
      secenekler: ["v1 = 2, v2 = 1", "v1 = 2, v2 = 2", "v1 = 1, v2 = 1", "v1 = 1, v2 = 2"],
      dogru: 1,
      aciklama: "Değişkenler hemen güncellenir. ~v1~ önce 2 olur, ardından ~v2 := v1~ bu yeni değeri okur. Değişkenlerle takas için üçüncü bir değişken gerekir.",
      dogrulama: sina(
        "",
        "    v1 := v2;\n    v2 := v1;\n    assert v1 = 2 and v2 = 2 severity failure;",
        "    variable v1 : integer := 1;\n    variable v2 : integer := 2;",
      ),
    },
    {
      id: "t4-delta", zorluk: 2, tip: "fill",
      soru: "~s~ sinyalinin değeri ~'0'~ iken process içinde ~s <= '1';~ ve hemen ardından ~x := s;~ çalışıyor. ~x~ kaçtır?",
      bosluklar: [bit("0")],
      aciklama: "Sinyal ataması yalnızca bir sonraki delta döngüsünde etkili olur. ~x := s~ satırı hâlâ eski değeri, yani 0'ı okur.",
      dogrulama: sina(
        "  signal s : std_logic := '0';",
        "    s <= '1';\n    x := s;\n    assert x = '0' severity failure;",
        "    variable x : std_logic;",
      ),
    },
    {
      id: "t4-sinyal-sayac", zorluk: 3, tip: "fill", yedek: true,
      soru: "~c : unsigned(3 downto 0)~ sinyali 0 iken bir process'te art arda iki kez ~c <= c + 1;~ çalışıyor. Process askıya alındıktan sonra ~c~ kaçtır (ondalık)?",
      bosluklar: [["1"]],
      aciklama: "İki satır da ~c~'nin eski değeri olan 0'ı okur ve 1 atar. Son atama geçerli olduğundan sonuç 1'dir, 2 değil.",
      dogrulama: sina(
        "  signal c : unsigned(3 downto 0) := \"0000\";",
        "    c <= c + 1;\n    c <= c + 1;\n    wait for 0 ns;\n    assert c = 1 severity failure;",
      ),
    },
    {
      id: "t4-after", zorluk: 2, tip: "tf", yedek: true,
      soru: "~y <= a after 5 ns;~ yazılan bir tasarım sentezlenince devrede 5 ns'lik bir gecikme oluşur.",
      dogru: false,
      aciklama: "~after~ yalnızca benzetimde anlamlıdır. Sentez araçları bu gecikmeyi yok sayar; gerçek gecikmeyi kullanılan donanım belirler.",
    },
  ]),

  ...turet(4, "veri-nesneleri", "variable-kullanim", [
    {
      id: "t4-var-operator", zorluk: 1, tip: "mcq",
      soru: "Bir değişkene değer atamak için hangi operatör kullanılır?",
      secenekler: ["~<=~", "~:=~", "~=>~", "~=~"],
      dogru: 1,
      aciklama: "Değişkenler ~:=~ ile atanır. ~<=~ sinyal ataması, ~=>~ eşleme, ~=~ ise karşılaştırmadır.",
    },
    {
      id: "t4-var-sayac", zorluk: 2, tip: "fill",
      soru: "~v~ tamsayı değişkeni 0 iken process'te ~v := v + 1; v := v + 1; y <= v;~ çalışıyor. ~y~'ye atanan değer kaçtır?",
      bosluklar: [["2"]],
      aciklama: "Değişken her satırda hemen güncellenir: önce 1, sonra 2 olur. ~y~'ye 2 atanır.",
      dogrulama: sina(
        "  signal y : integer := 0;",
        "    v := v + 1;\n    v := v + 1;\n    y <= v;\n    wait for 0 ns;\n    assert y = 2 severity failure;",
        "    variable v : integer := 0;",
      ),
    },
    {
      id: "t4-var-kalici", zorluk: 3, tip: "tf", yedek: true,
      soru: "Bir process'te bildirilen değişken, process'in bir çalışmasından sonrakine değerini korur.",
      dogru: true,
      aciklama: "Process'in değişkenleri benzetim başında bir kez ilklenir ve process her uyandığında kaldıkları değerden devam eder. Bu yüzden saatsiz bir process'te okunmadan önce yazılmayan değişken bellek gibi davranır.",
      dogrulama: {
        calismali: `${IEEE}
entity tb is end tb;
architecture z of tb is
  signal clk : std_logic := '0';
  signal cnt : integer := 0;
begin
  process (clk)
    variable n : integer := 0;
  begin
    n := n + 1;
    cnt <= n;
  end process;
  process begin
    wait for 1 ns;
    clk <= '1';
    wait for 1 ns;
    clk <= '0';
    wait for 1 ns;
    assert cnt = 3 severity failure;
    wait;
  end process;
end z;`,
      },
    },
    {
      id: "t4-var-baska-process", zorluk: 2, tip: "tf", yedek: true,
      soru: "Bir process'te bildirilen değişken, aynı mimarideki başka bir process'te okunabilir.",
      dogru: false,
      aciklama: "Değişken yalnızca bildirildiği process'te görünür. Process'ler arasında veri sinyallerle taşınır.",
      dogrulama: {
        derlenmemeli: `${IEEE}
entity tb is end tb;
architecture z of tb is
  signal y : integer;
begin
  process
    variable v : integer := 0;
  begin
    v := 1;
    wait;
  end process;
  process begin
    y <= v;
    wait;
  end process;
end z;`,
      },
    },
    {
      id: "t4-sabit-atama", zorluk: 1, tip: "tf",
      soru: "~constant N : integer := 8;~ olarak bildirilen sabite process içinde ~N := 9;~ ile yeni değer verilebilir.",
      dogru: false,
      aciklama: "Sabitin değeri bildirimde verilir ve sonra değiştirilemez. Değişen bir değer için ~variable~ ya da ~signal~ kullanılır.",
      dogrulama: {
        derlenmemeli: `${IEEE}
entity tb is end tb;
architecture z of tb is
  constant N : integer := 8;
begin
  process begin
    N := 9;
    wait;
  end process;
end z;`,
      },
    },
  ]),

  ...turet(4, "veri-nesneleri", "tanimlayicilar", [
    {
      id: "t4-isim-rakam", zorluk: 1, tip: "tf",
      soru: "~2giris~ geçerli bir sinyal adıdır.",
      dogru: false,
      aciklama: "VHDL tanımlayıcıları bir harfle başlamalıdır. ~giris2~ geçerlidir, ~2giris~ değildir.",
      dogrulama: hatali("  signal 2giris : std_logic;"),
    },
    {
      id: "t4-isim-cift-alt", zorluk: 2, tip: "mcq",
      soru: "Hangisi geçerli bir VHDL tanımlayıcısı **değildir**?",
      secenekler: ["~veri_giris~", "~Veri2~", "~veri__giris~", "~v_1_a~"],
      dogru: 2,
      aciklama: "Tanımlayıcıda iki alt çizgi yan yana gelemez. Tek alt çizgiler ve rakamlar (ilk karakter dışında) serbesttir.",
      dogrulama: hatali("  signal veri__giris : std_logic;"),
    },
    {
      id: "t4-isim-buyuk-kucuk", zorluk: 2, tip: "tf", yedek: true,
      soru: "Aynı mimaride ~Sayac~ ve ~SAYAC~ adında iki ayrı sinyal bildirilebilir.",
      dogru: false,
      aciklama: "VHDL büyük ve küçük harf ayırmaz; ~Sayac~ ile ~SAYAC~ aynı addır ve ikinci bildirim çakışma hatası verir.",
      dogrulama: hatali("  signal Sayac : std_logic;\n  signal SAYAC : std_logic;"),
    },
    {
      id: "t4-isim-son-alt", zorluk: 2, tip: "tf", yedek: true,
      soru: "~veri_~ (alt çizgiyle biten) geçerli bir tanımlayıcıdır.",
      dogru: false,
      aciklama: "Tanımlayıcı alt çizgiyle bitemez ve alt çizgiyle başlayamaz.",
      dogrulama: hatali("  signal veri_ : std_logic;"),
    },
  ]),

  ...turet(4, "veri-tipleri", "std-logic-degerleri", [
    {
      id: "t4-dokuz-deger", zorluk: 1, tip: "fill",
      soru: "~std_logic~ tipi kaç farklı değer alabilir?",
      bosluklar: [["9", "dokuz"]],
      aciklama: "U, X, 0, 1, Z, W, L, H ve - olmak üzere dokuz değer vardır.",
    },
    {
      id: "t4-z-anlam", zorluk: 1, tip: "mcq",
      soru: "~std_logic~'teki ~'Z'~ değeri neyi gösterir?",
      secenekler: ["Bilinmeyen değer", "Yüksek empedans", "Zayıf 0", "Önemsiz değer"],
      dogru: 1,
      aciklama: "~'Z'~ hattın hiçbir kaynakça sürülmediğini anlatır; üç durumlu (tri-state) çıkışlarda kullanılır.",
    },
    {
      id: "t4-tire-anlam", zorluk: 2, tip: "mcq", yedek: true,
      soru: "~std_logic~'teki ~'-'~ değeri neyi gösterir?",
      secenekler: ["Önemsiz (don't care)", "Zayıf bilinmeyen", "Negatif değer", "Başlatılmamış"],
      dogru: 0,
      aciklama: "~'-'~ değerin önemsiz olduğunu söyler ve sentez aracına sadeleştirme serbestliği verir.",
    },
    {
      id: "t4-l-anlam", zorluk: 2, tip: "mcq", yedek: true,
      soru: "~'L'~ ve ~'H'~ değerleri neyi gösterir?",
      secenekler: ["Düşük ve yüksek empedans", "Zayıf 0 ve zayıf 1", "Mantık 0 ve 1'in ters hali", "Saat kenarları"],
      dogru: 1,
      aciklama: "~'L'~ zayıf 0, ~'H'~ zayıf 1'dir; örneğin çekme dirençleri (pull-up, pull-down) böyle modellenir.",
    },
    {
      id: "t4-x-anlam", zorluk: 2, tip: "mcq", yedek: true,
      soru: "Benzetimde bir sinyalin ~'X'~ olması genellikle neye işaret eder?",
      secenekler: [
        "Sinyale hiç değer verilmediğine",
        "Sinyalin sürülmediğine",
        "Birden çok kaynağın çeliştiğine",
        "Sinyalin önemsiz olduğuna",
      ],
      dogru: 2,
      aciklama: "~'X'~ güçlü bilinmeyendir; tipik nedeni bir kaynağın 0, diğerinin 1 sürmesidir. Hiç değer verilmemiş sinyal ~'U'~ görünür.",
    },
  ]),

  ...turet(4, "veri-tipleri", "cozumleme", [
    {
      id: "t4-coz-01", zorluk: 1, tip: "fill",
      soru: "Bir ~std_logic~ hattını bir kaynak ~'0'~, diğeri ~'1'~ ile sürüyor. Çözümlenen değer nedir?",
      bosluklar: [bit("X")],
      aciklama: "İki güçlü değer çelişince sonuç güçlü bilinmeyen ~'X'~ olur.",
      dogrulama: coz("01", "X"),
    },
    {
      id: "t4-coz-z1", zorluk: 2, tip: "fill",
      soru: "Bir kaynak ~'Z'~, diğeri ~'1'~ sürüyor. Çözümlenen değer nedir?",
      bosluklar: [bit("1")],
      aciklama: "~'Z'~ hattı sürmez; sonucu diğer kaynak belirler. Ortak veri yollarındaki üç durumlu çıkışlar bu kurala dayanır.",
      dogrulama: coz("Z1", "1"),
    },
    {
      id: "t4-coz-lh", zorluk: 3, tip: "fill", yedek: true,
      soru: "Bir kaynak ~'L'~, diğeri ~'H'~ sürüyor. Çözümlenen değer nedir?",
      bosluklar: [bit("W")],
      aciklama: "İki zayıf değer çelişince sonuç zayıf bilinmeyen ~'W'~ olur.",
      dogrulama: coz("LH", "W"),
    },
    {
      id: "t4-coz-0l", zorluk: 2, tip: "fill", yedek: true,
      soru: "Bir kaynak ~'0'~, diğeri ~'H'~ sürüyor. Çözümlenen değer nedir?",
      bosluklar: [bit("0")],
      aciklama: "Güçlü değer zayıfı yener. ~'0'~ güçlü olduğu için zayıf ~'H'~'yi bastırır.",
      dogrulama: coz("0H", "0"),
    },
  ]),

  ...turet(4, "veri-tipleri", "vektor-indeks", [
    {
      id: "t4-dilim-downto", zorluk: 1, tip: "fill",
      soru: "~a : std_logic_vector(7 downto 0) := \"10110010\"~ için ~a(7 downto 4)~ nedir?",
      bosluklar: [vektor("1011")],
      aciklama: "~downto~ vektörde soldaki bit en büyük indekstir. ~a(7 downto 4)~ soldaki dört bittir: 1011.",
      dogrulama: sina("  signal a : std_logic_vector(7 downto 0) := \"10110010\";", "    assert a(7 downto 4) = \"1011\" severity failure;"),
    },
    {
      id: "t4-indeks-to", zorluk: 2, tip: "fill",
      soru: "~b : std_logic_vector(0 to 3) := \"1000\"~ için ~b(0)~ kaçtır?",
      bosluklar: [bit("1")],
      aciklama: "~to~ ile bildirilen vektörde soldaki bit en küçük indekstir, yani ~b(0)~ = 1.",
      dogrulama: sina("  signal b : std_logic_vector(0 to 3) := \"1000\";", "    assert b(0) = '1' severity failure;"),
    },
    {
      id: "t4-dilim-yon", zorluk: 3, tip: "tf", yedek: true,
      soru: "~a : std_logic_vector(7 downto 0)~ için ~a(0 to 3)~ dilimi geçerlidir.",
      dogru: false,
      aciklama: "Dilimin yönü vektörün bildirildiği yönle aynı olmalıdır. Doğru yazım ~a(3 downto 0)~'dır.",
      dogrulama: hatali(
        "  signal a : std_logic_vector(7 downto 0);\n  signal y : std_logic_vector(3 downto 0);",
        "  y <= a(0 to 3);",
      ),
    },
    {
      id: "t4-dilim-birlestir", zorluk: 2, tip: "fill", yedek: true,
      soru: "~a : std_logic_vector(3 downto 0) := \"1100\"~ için ~a(1 downto 0) & a(3 downto 2)~ nedir?",
      bosluklar: [vektor("0011")],
      aciklama: "Alt iki bit (00) sola, üst iki bit (11) sağa yazılır: 0011.",
      dogrulama: sina(
        "  signal a : std_logic_vector(3 downto 0) := \"1100\";",
        "    assert a(1 downto 0) & a(3 downto 2) = \"0011\" severity failure;",
      ),
    },
  ]),

  ...turet(4, "veri-tipleri", "sayi-tabani", [
    {
      id: "t4-hex-bit", zorluk: 1, tip: "fill",
      soru: "~x\"A5\"~ bit dizgisi kaç bit uzunluğundadır?",
      bosluklar: [["8"]],
      aciklama: "Her onaltılık basamak 4 bittir; iki basamak 8 bit eder.",
      dogrulama: sina("  constant c : std_logic_vector := x\"A5\";", "    assert c'length = 8 severity failure;"),
    },
    {
      id: "t4-hex-ikili", zorluk: 2, tip: "fill",
      soru: "~x\"3C\"~ ikili olarak nasıl yazılır?",
      bosluklar: [vektor("00111100")],
      aciklama: "3 = 0011 ve C = 1100; yan yana 00111100.",
      dogrulama: sina("", "    assert std_logic_vector'(x\"3C\") = \"00111100\" severity failure;"),
    },
    {
      id: "t4-oktal", zorluk: 2, tip: "fill", yedek: true,
      soru: "~o\"17\"~ sekizlik bit dizgisi ikili olarak nasıl yazılır?",
      bosluklar: [vektor("001111")],
      aciklama: "Her sekizlik basamak 3 bittir: 1 = 001, 7 = 111.",
      dogrulama: sina("", "    assert std_logic_vector'(o\"17\") = \"001111\" severity failure;"),
    },
    {
      id: "t4-tabanli-hex", zorluk: 2, tip: "fill", yedek: true,
      soru: "~16#FF#~ tamsayı sabitinin ondalık değeri kaçtır?",
      bosluklar: [["255"]],
      aciklama: "~taban#basamaklar#~ yazımında FF onaltılık olarak 15·16 + 15 = 255'tir.",
      dogrulama: sina("  constant n : integer := 16#FF#;", "    assert n = 255 severity failure;"),
    },
    {
      id: "t4-tabanli-ikili", zorluk: 1, tip: "fill", yedek: true,
      soru: "~2#1010#~ tamsayı sabitinin ondalık değeri kaçtır?",
      bosluklar: [["10"]],
      aciklama: "1010 ikili sayısı 8 + 2 = 10'dur.",
      dogrulama: sina("  constant n : integer := 2#1010#;", "    assert n = 10 severity failure;"),
    },
  ]),

  ...turet(4, "veri-tipleri", "signed-unsigned", [
    {
      id: "t4-signed-1000", zorluk: 2, tip: "fill",
      soru: "~signed'(\"1000\")~ değerinin ondalık karşılığı kaçtır?",
      bosluklar: [["-8"]],
      aciklama: "4 bitlik ikiye tümleyende en soldaki bit -8 ağırlığındadır; diğer bitler 0 olduğundan sonuç -8.",
      dogrulama: sina("", "    assert to_integer(signed'(\"1000\")) = -8 severity failure;"),
    },
    {
      id: "t4-unsigned-1000", zorluk: 1, tip: "fill",
      soru: "~unsigned'(\"1000\")~ değerinin ondalık karşılığı kaçtır?",
      bosluklar: [["8"]],
      aciklama: "İşaretsiz yorumda en soldaki bit +8 ağırlığındadır.",
      dogrulama: sina("", "    assert to_integer(unsigned'(\"1000\")) = 8 severity failure;"),
    },
    {
      id: "t4-signed-aralik", zorluk: 2, tip: "mcq",
      soru: "8 bitlik ~signed~ bir sayının alabileceği değer aralığı nedir?",
      secenekler: ["0 ile 255", "-127 ile 127", "-128 ile 127", "-256 ile 255"],
      dogru: 2,
      aciklama: "n bitlik ikiye tümleyen aralığı -2ⁿ⁻¹ ile 2ⁿ⁻¹ - 1'dir; n = 8 için -128 ile 127.",
    },
    {
      id: "t4-resize-signed", zorluk: 3, tip: "fill", yedek: true,
      soru: "~resize(signed'(\"1010\"), 8)~ sonucu nedir?",
      bosluklar: [vektor("11111010")],
      aciklama: "~signed~ için ~resize~ işaret bitini çoğaltır; -6 değeri 8 bitte de -6 kalır: 11111010.",
      dogrulama: sina("", "    assert resize(signed'(\"1010\"), 8) = \"11111010\" severity failure;"),
    },
    {
      id: "t4-resize-unsigned", zorluk: 2, tip: "fill", yedek: true,
      soru: "~resize(unsigned'(\"1010\"), 8)~ sonucu nedir?",
      bosluklar: [vektor("00001010")],
      aciklama: "~unsigned~ için ~resize~ sola sıfır ekler; değer 10 olarak kalır.",
      dogrulama: sina("", "    assert resize(unsigned'(\"1010\"), 8) = \"00001010\" severity failure;"),
    },
  ]),

  ...turet(4, "veri-tipleri", "tip-donusumu", [
    {
      id: "t4-int-slv", zorluk: 2, tip: "mcq",
      soru: "~n : integer~ değerini 8 bitlik bir ~std_logic_vector~'e çevirmenin doğru yolu hangisidir?",
      secenekler: [
        "~std_logic_vector(n)~",
        "~to_unsigned(std_logic_vector(n), 8)~",
        "~std_logic_vector(to_unsigned(n, 8))~",
        "~to_integer(n, 8)~",
      ],
      dogru: 2,
      aciklama: "Tamsayı önce ~to_unsigned~ (ya da ~to_signed~) ile bit uzunluğu verilerek sayısal vektöre çevrilir, sonra tip dönüşümüyle ~std_logic_vector~ yapılır.",
    },
    {
      id: "t4-slv-int", zorluk: 2, tip: "mcq",
      soru: "~v : std_logic_vector(7 downto 0)~ değerini işaretsiz tamsayıya çevirmenin doğru yolu hangisidir?",
      secenekler: ["~to_integer(v)~", "~integer(v)~", "~to_integer(unsigned(v))~", "~unsigned(to_integer(v))~"],
      dogru: 2,
      aciklama: "~std_logic_vector~ sayısal anlam taşımaz; önce ~unsigned~ ya da ~signed~ olarak yorumlanır, sonra ~to_integer~ çağrılır.",
    },
    {
      id: "t4-to-signed-neg", zorluk: 3, tip: "fill", yedek: true,
      soru: "~to_signed(-3, 4)~ sonucu hangi bit dizisidir?",
      bosluklar: [vektor("1101")],
      aciklama: "-3'ün 4 bitlik ikiye tümleyeni: 3 = 0011, tersi 1100, bir eklenince 1101.",
      dogrulama: sina("", "    assert to_signed(-3, 4) = \"1101\" severity failure;"),
    },
    {
      id: "t4-signed-int", zorluk: 2, tip: "fill", yedek: true,
      soru: "~to_integer(signed'(\"1110\"))~ kaçtır?",
      bosluklar: [["-2"]],
      aciklama: "1110 ikiye tümleyende -8 + 4 + 2 = -2'dir.",
      dogrulama: sina("", "    assert to_integer(signed'(\"1110\")) = -2 severity failure;"),
    },
    {
      id: "t4-donusum-maliyet", zorluk: 2, tip: "tf", yedek: true,
      soru: "~unsigned(v)~ ya da ~std_logic_vector(u)~ dönüşümleri sentezde ek donanım üretmez.",
      dogru: true,
      aciklama: "Bu tipler aynı elemanlardan oluşan yakın tiplerdir; dönüşüm yalnızca bitlerin nasıl yorumlanacağını değiştirir, kablolar aynı kalır.",
    },
  ]),

  ...turet(4, "veri-tipleri", "tip-uyumu", [
    {
      id: "t4-slv-unsigned", zorluk: 2, tip: "tf",
      soru: "~unsigned~ tipindeki bir değer, ~std_logic_vector~ sinyaline dönüşüm yazmadan atanabilir.",
      dogru: false,
      aciklama: "VHDL tipleri katı biçimde denetler. Atama ~y <= std_logic_vector(u);~ biçiminde yapılmalıdır.",
      dogrulama: hatali(
        "  signal u : unsigned(3 downto 0);\n  signal y : std_logic_vector(3 downto 0);",
        "  y <= u;",
      ),
    },
    {
      id: "t4-bit-stdlogic", zorluk: 2, tip: "tf", yedek: true,
      soru: "~bit~ tipindeki bir sinyal ~std_logic~ sinyaline doğrudan atanabilir.",
      dogru: false,
      aciklama: "~bit~ ve ~std_logic~ farklı tiplerdir. ~to_stdulogic~ gibi bir dönüşüm fonksiyonu gerekir.",
      dogrulama: hatali("  signal b : bit;\n  signal y : std_logic;", "  y <= b;"),
    },
    {
      id: "t4-subtype-uyum", zorluk: 2, tip: "tf", yedek: true,
      soru: "~subtype bayt is std_logic_vector(7 downto 0);~ ile bildirilen bir sinyal, ~std_logic_vector(7 downto 0)~ sinyaline doğrudan atanabilir.",
      dogru: true,
      aciklama: "Alt tip (subtype) yeni bir tip değildir, temel tipe bir kısıt ekler. Bu yüzden temel tiple serbestçe karışır.",
      dogrulama: sina(
        "  subtype bayt is std_logic_vector(7 downto 0);\n  signal a : bayt := x\"5A\";\n  signal b : std_logic_vector(7 downto 0);",
        "    b <= a;\n    wait for 0 ns;\n    assert b = x\"5A\" severity failure;",
      ),
    },
    {
      id: "t4-yeni-tip", zorluk: 3, tip: "tf", yedek: true,
      soru: "~type rakam is range 0 to 9;~ ile bildirilen tipteki bir sinyal, ~integer~ sinyaline doğrudan atanabilir.",
      dogru: false,
      aciklama: "~type~ ile bildirilen tamsayı tipi ~integer~'dan bağımsız yeni bir tiptir; ~integer(r)~ dönüşümü gerekir. ~subtype~ kullanılsaydı atama geçerli olurdu.",
      dogrulama: hatali("  type rakam is range 0 to 9;\n  signal r : rakam;\n  signal n : integer;", "  n <= r;"),
    },
  ]),

  ...turet(4, "veri-tipleri", "integer-aralik", [
    {
      id: "t4-bit-0-15", zorluk: 1, tip: "fill",
      soru: "~integer range 0 to 15~ olarak bildirilen bir sinyal sentezde kaç bitle gerçeklenir?",
      bosluklar: [["4"]],
      aciklama: "0 ile 15 arası 16 değerdir; 2⁴ = 16 olduğundan 4 bit yeter.",
    },
    {
      id: "t4-bit-0-100", zorluk: 2, tip: "fill", yedek: true,
      soru: "~integer range 0 to 100~ için kaç bit gerekir?",
      bosluklar: [["7"]],
      aciklama: "6 bit en fazla 63'ü, 7 bit 127'yi gösterebilir. 100 için 7 bit gerekir.",
    },
    {
      id: "t4-bit-negatif", zorluk: 3, tip: "fill", yedek: true,
      soru: "~integer range -8 to 7~ için kaç bit gerekir?",
      bosluklar: [["4"]],
      aciklama: "Aralık negatif değer içerdiği için ikiye tümleyen kullanılır; 4 bit -8 ile 7 arasını tam karşılar.",
    },
    {
      id: "t4-aralik-arttirma", zorluk: 2, tip: "tf", yedek: true,
      soru: "~variable v : integer range 0 to 15 := 15;~ için ~v := v + 1;~ benzetimde hataya yol açar.",
      dogru: true,
      aciklama: "Sonuç 16 olur ve tanımlı aralığın dışına çıkar. Benzetim aralık hatasıyla durur; sayaçlarda sınır kontrolü ya da ~mod~ kullanılır.",
      dogrulama: {
        calisirken_hata: `${IEEE}
entity tb is end tb;
architecture z of tb is
begin
  process
    variable v : integer range 0 to 15 := 15;
  begin
    wait for 1 ns;
    v := v + 1;
    wait;
  end process;
end z;`,
      },
    },
  ]),

  ...turet(4, "veri-tipleri", "diziler", [
    {
      id: "t4-dizi-bildirim", zorluk: 2, tip: "mcq",
      soru: "Her biri 8 bit olan 4 sözcüklük bir bellek için doğru tip bildirimi hangisidir?",
      secenekler: [
        "~type bellek is array (0 to 3) of std_logic_vector(7 downto 0);~",
        "~type bellek is std_logic_vector(0 to 3)(7 downto 0);~",
        "~type bellek is array (7 downto 0) of integer range 0 to 3;~",
        "~subtype bellek is std_logic_vector(31 downto 0);~",
      ],
      dogru: 0,
      aciklama: "Dizi tipinde önce indeks aralığı (sözcük sayısı), sonra eleman tipi (sözcük genişliği) yazılır.",
    },
    {
      id: "t4-dizi-eleman", zorluk: 2, tip: "fill", yedek: true,
      soru: "~constant m : tablo := (\"0001\", \"0010\", \"0101\");~ (indeksler 0'dan başlıyor, elemanlar ~std_logic_vector(3 downto 0)~) için ~m(2)(0)~ kaçtır?",
      bosluklar: [bit("1")],
      aciklama: "~m(2)~ üçüncü eleman olan 0101'dir; bunun 0. biti en sağdaki bit, yani 1'dir.",
      dogrulama: sina(
        "  type tablo is array (0 to 2) of std_logic_vector(3 downto 0);\n  constant m : tablo := (\"0001\", \"0010\", \"0101\");",
        "    assert m(2)(0) = '1' severity failure;",
      ),
    },
    {
      id: "t4-dizi-uzunluk", zorluk: 1, tip: "fill", yedek: true,
      soru: "~type bellek is array (0 to 15) of std_logic_vector(7 downto 0);~ tipindeki bir dizinin ~'length~ değeri kaçtır?",
      bosluklar: [["16"]],
      aciklama: "~'length~ dizideki eleman sayısını verir: 0'dan 15'e 16 eleman. Eleman genişliği bu sayıyı etkilemez.",
      dogrulama: sina(
        "  type bellek is array (0 to 15) of std_logic_vector(7 downto 0);\n  signal m : bellek;",
        "    assert m'length = 16 severity failure;",
      ),
    },
  ]),
];
