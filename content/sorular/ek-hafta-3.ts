// B6: 3. hafta için türetilmiş ek sorular. yedek: true olanlar yalnızca aralıklı tekrarda gelir.
import { IEEE, bit, turet, vektor, type Soru } from "./tipler.ts";

// Tek bir process'te assert'lerle sınayan küçük testbench
const sina = (bildirim: string, govde: string, ust = IEEE) => ({
  calismali: `${ust}
entity tb is end tb;
architecture z of tb is
${bildirim}
begin
  process begin
    wait for 1 ns;
${govde}
    wait;
  end process;
end z;`,
});

export const ekHafta3: Soru[] = [
  ...turet(3, "vhdl-temel", "vhdl-yapi", [
    {
      id: "t3-end-satiri", zorluk: 2, tip: "mcq",
      soru: "~entity sayac is ... ~ bildirimini kapatan satırlardan hangisi VHDL-93'te **yanlıştır**?",
      secenekler: ["~end entity;~", "~end sayac;~", "~end entity sayac;~", "~end architecture sayac;~"],
      dogru: 3,
      aciklama: "Entity ~end~, ~end entity~, ~end sayac~ ya da ~end entity sayac~ ile kapatılabilir. ~end architecture~ yalnızca bir mimariyi kapatır.",
    },
    {
      id: "t3-use-satiri", zorluk: 1, tip: "mcq",
      soru: "~std_logic~ tipini kullanabilmek için ~library ieee;~ satırından sonra hangi satır gerekir?",
      secenekler: ["~use work.all;~", "~use ieee.std_logic_1164.all;~", "~library std_logic;~", "~use std.standard.all;~"],
      dogru: 1,
      aciklama: "~std_logic~ ve ~std_logic_vector~, ieee kütüphanesindeki std_logic_1164 paketinde tanımlıdır.",
    },
    {
      id: "t3-coklu-arch", zorluk: 2, tip: "tf", yedek: true,
      soru: "Bir entity'nin birden fazla architecture'ı olabilir.",
      dogru: true,
      aciklama: "Aynı arayüz için farklı gerçeklemeler (ör. davranışsal ve yapısal) yazılabilir; örneklerken hangisinin kullanılacağı seçilir.",
    },
    {
      id: "t3-port-yazimi", zorluk: 2, tip: "mcq", yedek: true,
      soru: "Hangi port listesi doğru yazılmıştır?",
      secenekler: [
        "~port (a : in std_logic; y : out std_logic);~",
        "~port (a : in std_logic; y : out std_logic;);~",
        "~port (a in std_logic, y out std_logic);~",
        "~port (a : std_logic in; y : std_logic out);~",
      ],
      dogru: 0,
      aciklama: "Her port ~ad : mod tip~ biçimindedir, portlar noktalı virgülle ayrılır ve son porttan sonra noktalı virgül konmaz.",
    },
  ]),

  ...turet(3, "vhdl-temel", "port-modlari", [
    {
      id: "t3-buffer", zorluk: 2, tip: "mcq",
      soru: "Yazılan ve mimari içinden geri okunabilen, ama yalnızca tek bir kaynaktan sürülebilen port modu hangisidir?",
      secenekler: ["in", "out", "inout", "buffer"],
      dogru: 3,
      aciklama: "~buffer~ çıkış gibi sürülür ve içeriden okunabilir. ~inout~ ise iki yönlüdür ve birden çok kaynak tarafından sürülebilir.",
    },
    {
      id: "t3-in-yazma", zorluk: 1, tip: "tf",
      soru: "~in~ modundaki bir porta mimari içinde değer atanabilir.",
      dogru: false,
      aciklama: "~in~ portu yalnızca okunur; ona atama yapmak derleme hatasıdır.",
      dogrulama: {
        derlenmemeli: IEEE + `
entity tb is port (a : in std_logic); end tb;
architecture z of tb is begin
  a <= '1';
end z;`,
      },
    },
    {
      id: "t3-ara-sinyal", zorluk: 3, tip: "mcq", yedek: true,
      soru: "VHDL-93'te ~y : out std_logic~ portunu mimaride hem sürmek hem de okumak istiyorsun. Hangisi doğru yoldur?",
      secenekler: [
        "~y~'nin modunu ~in~ yapmak",
        "Hesabı bir iç sinyalle yapıp sonunda ~y <= ic;~ yazmak",
        "~y'event~ ile okumak",
        "~y~'yi bir variable'a dönüştürmek",
      ],
      dogru: 1,
      aciklama: "~out~ port VHDL-93'te içeriden okunamaz. Değer bir iç sinyalde tutulur, hem okunur hem de porta atanır.",
    },
  ]),

  ...turet(3, "vhdl-temel", "toplayici", [
    {
      id: "t3-yarim-01", zorluk: 1, tip: "fill",
      soru: "Yarım toplayıcıda A = 0, B = 1 iken toplam ve elde nedir? Boşluk 1: S, Boşluk 2: C",
      bosluklar: [bit("1"), bit("0")],
      aciklama: "S = A XOR B = 1, C = A AND B = 0.",
    },
    {
      id: "t3-tam-111", zorluk: 2, tip: "fill", yedek: true,
      soru: "Tam toplayıcıda A = 1, B = 1, Cin = 1 için çıkışlar nedir? Boşluk 1: S, Boşluk 2: Cout",
      bosluklar: [bit("1"), bit("1")],
      aciklama: "1 + 1 + 1 = 3, ikili olarak 11: toplam biti 1, elde 1.",
    },
    {
      id: "t3-tam-s-ifade", zorluk: 2, tip: "mcq",
      soru: "Tam toplayıcının toplam çıkışı S için hangi ifade doğrudur?",
      secenekler: ["~s <= a and b and cin;~", "~s <= (a and b) or cin;~", "~s <= a xor b xor cin;~", "~s <= a or b or cin;~"],
      dogru: 2,
      aciklama: "Toplam biti, girişlerden tek sayıda 1 olduğunda 1'dir: üç girişin XOR'u.",
    },
    {
      id: "t3-yarim-eksik", zorluk: 3, tip: "mcq", yedek: true,
      soru: "Çok bitli bir toplayıcıda neden her bit için yarım toplayıcı yeterli değildir?",
      secenekler: [
        "Toplam çıkışını XOR kapısıyla üretmediği için",
        "Elde çıkışını dışarıya vermediği için",
        "Önceki bitin eldesini alan girişi olmadığı için",
        "Yalnızca çıkarma işlemi yapabildiği için",
      ],
      dogru: 2,
      aciklama: "En düşük bit dışındaki her bit üç şeyi toplar: iki giriş biti ve alt bitten gelen elde. Bunun için tam toplayıcı gerekir.",
    },
  ]),

  ...turet(3, "operatorler", "mantik-operatorleri", [
    {
      id: "t3-xnor", zorluk: 2, tip: "fill",
      soru: "~a = '1'~ ve ~b = '0'~ iken ~a xnor b~ kaçtır?",
      bosluklar: [bit("0")],
      aciklama: "XNOR, girişler eşitken 1 verir. Girişler farklı olduğu için sonuç 0.",
      dogrulama: sina("  signal a : std_logic := '1';\n  signal b : std_logic := '0';", "    assert (a xnor b) = '0' severity failure;"),
    },
    {
      id: "t3-nor-zincir", zorluk: 2, tip: "tf", yedek: true,
      soru: "~y <= a nor b nor c;~ yazımı parantezsiz olarak derlenir.",
      dogru: false,
      aciklama: "~nand~ ve ~nor~ birleşmeli değildir; VHDL bunları parantezsiz zincirlemeye izin vermez. ~y <= not (a or b or c);~ yazılır.",
      dogrulama: {
        derlenmemeli: IEEE + `
entity tb is end tb;
architecture z of tb is
  signal a, b, c, y : std_logic;
begin
  y <= a nor b nor c;
end z;`,
      },
    },
    {
      id: "t3-and-or-parantez", zorluk: 2, tip: "mcq",
      soru: "VHDL'de ~a and b or c~ yazılamaz, ~(a and b) or c~ yazılır. Bunun nedeni nedir?",
      secenekler: [
        "~or~, ~and~'den önce hesaplandığı için",
        "~and~ yalnızca vektörlerle çalıştığı için",
        "~and~ ile ~or~ arasında öncelik tanımlanmadığı için farklı mantık operatörleri parantezsiz karıştırılamaz",
        "~c~'nin tipi uyuşmadığı için",
      ],
      dogru: 2,
      aciklama: "Bütün ikili mantık operatörleri (~not~ hariç) aynı önceliktedir. Karışıklığı önlemek için VHDL farklı olanların parantezsiz yan yana yazılmasını yasaklar.",
    },
    {
      id: "t3-not-oncelik2", zorluk: 2, tip: "fill", yedek: true,
      soru: "~a = '0'~ ve ~b = '1'~ iken ~not a and b~ kaçtır?",
      bosluklar: [bit("1")],
      aciklama: "~not~ en yüksek önceliklidir: ~(not a) and b~ = 1 and 1 = 1.",
      dogrulama: sina("  signal a : std_logic := '0';\n  signal b : std_logic := '1';", "    assert (not a and b) = '1' severity failure;"),
    },
  ]),

  ...turet(3, "operatorler", "mod-rem", [
    {
      id: "t3-mod-7-3", zorluk: 1, tip: "fill",
      soru: "~8 mod 3~ ve ~8 rem 3~ kaçtır? Boşluk 1: mod, Boşluk 2: rem",
      bosluklar: [["2"], ["2"]],
      aciklama: "İki sayı da pozitifken mod ve rem aynıdır: 8 = 2·3 + 2.",
    },
    {
      id: "t3-mod-neg-b", zorluk: 3, tip: "fill", yedek: true,
      soru: "~10 mod (-3)~ ve ~10 rem (-3)~ kaçtır? Boşluk 1: mod, Boşluk 2: rem",
      bosluklar: [["-2"], ["1"]],
      aciklama: "~rem~ sonucu bölünenin (10) işaretini, ~mod~ sonucu bölenin (-3) işaretini alır. rem: bölüm sıfıra doğru -3, 10 - (-3)·(-3) = 1. mod: bölüm aşağı doğru -4, 10 - (-3)·(-4) = -2.",
      dogrulama: sina("", "    assert (10 mod (-3)) = -2 severity failure;\n    assert (10 rem (-3)) = 1 severity failure;"),
    },
    {
      id: "t3-mod-neg-a", zorluk: 3, tip: "fill",
      soru: "~(-11) mod 4~ ve ~(-11) rem 4~ kaçtır? Boşluk 1: mod, Boşluk 2: rem",
      bosluklar: [["1"], ["-3"]],
      aciklama: "rem bölünenin işaretini alır: bölüm sıfıra doğru -2, -11 - 4·(-2) = -3. mod bölenin işaretini alır: bölüm aşağı doğru -3, -11 - 4·(-3) = 1.",
      dogrulama: sina("", "    assert ((-11) mod 4) = 1 severity failure;\n    assert ((-11) rem 4) = -3 severity failure;"),
    },
    {
      id: "t3-bolme-kuvvet", zorluk: 2, tip: "mcq", yedek: true,
      soru: "Sentezde ~x / 4~ gibi ikinin kuvvetine bölme neden genellikle sorun çıkarmaz?",
      secenekler: [
        "4 bir asal sayı olduğu için",
        "Bölme bitleri sağa kaydırmaya indirgenebildiği için",
        "Bölme her zaman yalnızca benzetimde yapıldığı için",
        "x'in sabit olması gerektiği için",
      ],
      dogru: 1,
      aciklama: "4'e bölmek, işaretsiz bir sayıda iki bit sağa kaydırmakla aynıdır; ek donanım gerekmez. Genel bölme ise büyük bir devre ister.",
    },
  ]),

  ...turet(3, "operatorler", "aritmetik-tasma", [
    {
      id: "t3-tasma-4bit", zorluk: 2, tip: "fill",
      soru: "~a~ ve ~b~ 4 bitlik ~unsigned~ sinyallerdir ve ~y <= a + b;~ (y de 4 bit). ~a = \"1100\"~, ~b = \"0101\"~ iken y nedir?",
      bosluklar: [vektor("0001")],
      aciklama: "12 + 5 = 17. 4 bit en çok 15 tutar, taşan elde atılır: 17 - 16 = 1, yani \"0001\".",
      dogrulama: sina(
        '  signal a : unsigned(3 downto 0) := "1100";\n  signal b : unsigned(3 downto 0) := "0101";\n  signal y : unsigned(3 downto 0);',
        '    y <= a + b;\n    wait for 0 ns;\n    assert y = "0001" severity failure;',
      ),
    },
    {
      id: "t3-elde-bit", zorluk: 3, tip: "mcq", yedek: true,
      soru: "İki 4 bitlik ~unsigned~ sayının toplamındaki eldeyi kaybetmemek için ne yapılır?",
      secenekler: [
        "Sonuç 3 bite indirilir",
        "Sayılar önce 5 bite genişletilir (ör. ~'0' & a~) ve 5 bitlik bir sonuca toplanır",
        "~mod~ operatörü kullanılır",
        "Sayılar ~signed~ yapılır",
      ],
      dogru: 1,
      aciklama: "~numeric_std~'de toplamın genişliği işlenenlerin genişliğidir. Eldeyi görmek için işlenenler bir bit genişletilir.",
    },
    {
      id: "t3-cikarma-tasma", zorluk: 3, tip: "fill", yedek: true,
      soru: "4 bitlik ~unsigned~ sinyallerde ~y <= a - b;~ yazılıyor. ~a = \"0010\"~, ~b = \"0011\"~ iken y nedir?",
      bosluklar: [vektor("1111")],
      aciklama: "2 - 3 = -1 işaretsiz 4 bitte gösterilemez; sonuç 16'ya göre sarılır: -1 + 16 = 15, yani \"1111\".",
      dogrulama: sina(
        '  signal a : unsigned(3 downto 0) := "0010";\n  signal b : unsigned(3 downto 0) := "0011";\n  signal y : unsigned(3 downto 0);',
        '    y <= a - b;\n    wait for 0 ns;\n    assert y = "1111" severity failure;',
      ),
    },
  ]),

  ...turet(3, "operatorler", "numeric-std-islem", [
    {
      id: "t3-unsigned-arti", zorluk: 1, tip: "tf",
      soru: "~numeric_std~ paketi kullanıldığında iki ~unsigned~ sinyal doğrudan ~+~ ile toplanabilir.",
      dogru: true,
      aciklama: "~numeric_std~, ~unsigned~ ve ~signed~ için aritmetik operatörleri tanımlar. ~std_logic_vector~ için tanımlamaz.",
    },
    {
      id: "t3-slv-cevir", zorluk: 2, tip: "mcq", yedek: true,
      soru: "~a~, ~b~ ve ~y~ ~std_logic_vector(3 downto 0)~ tipindedir. Hangi toplama doğrudur?",
      secenekler: [
        "~y <= a + b;~",
        "~y <= unsigned(a + b);~",
        "~y <= to_integer(a) + to_integer(b);~",
        "~y <= std_logic_vector(unsigned(a) + unsigned(b));~",
      ],
      dogru: 3,
      aciklama: "Vektörler önce ~unsigned~'a çevrilip toplanır, sonuç yeniden ~std_logic_vector~'e çevrilir.",
    },
    {
      id: "t3-integer-arti", zorluk: 2, tip: "tf",
      soru: "~integer~ tipindeki iki sinyal ek bir paket kullanmadan ~+~ ile toplanabilir.",
      dogru: true,
      aciklama: "~integer~ ve aritmetiği her zaman görünür olan ~std.standard~ paketinde tanımlıdır.",
    },
  ]),

  ...turet(3, "operatorler", "karsilastirma", [
    {
      id: "t3-signed-buyuk", zorluk: 3, tip: "mcq",
      soru: "~signed'(\"1000\") > signed'(\"0111\")~ ifadesinin sonucu nedir?",
      secenekler: ["true", "false", "Derleme hatası", "'X'"],
      dogru: 1,
      aciklama: "signed olarak \"1000\" = -8 ve \"0111\" = 7'dir. -8 > 7 yanlıştır.",
      dogrulama: sina("", "    assert not (signed'(\"1000\") > signed'(\"0111\")) severity failure;"),
    },
    {
      id: "t3-esit", zorluk: 1, tip: "mcq", yedek: true,
      soru: "VHDL'de iki değerin eşitliğini sınayan operatör hangisidir?",
      secenekler: ["==", ":=", "=", "=>"],
      dogru: 2,
      aciklama: "Eşitlik ~=~ ile, eşitsizlik ~/=~ ile sınanır. ~:=~ değişken ataması, ~=>~ eşleme içindir.",
    },
    {
      id: "t3-buyuk-esit", zorluk: 1, tip: "fill",
      soru: "VHDL'de \"büyük veya eşit\" karşılaştırma operatörü nasıl yazılır?",
      bosluklar: [[">="]],
      aciklama: "~>=~ büyük veya eşit, ~<=~ ise (koşul içinde) küçük veya eşittir.",
    },
  ]),

  ...turet(3, "operatorler", "kaydirma-birlestirme", [
    {
      id: "t3-birlestir-uzunluk", zorluk: 1, tip: "fill",
      soru: "~a~ 3 bitlik, ~b~ 5 bitlik bir vektörse ~a & b~ kaç bitliktir?",
      bosluklar: [["8"]],
      aciklama: "Birleştirme (~&~) iki vektörü uç uca ekler: 3 + 5 = 8 bit.",
    },
    {
      id: "t3-sola-kaydir", zorluk: 2, tip: "mcq",
      soru: "4 bitlik ~x~ için ~x <= x(2 downto 0) & '0';~ ne yapar?",
      secenekler: [
        "x'i bir bit sağa kaydırır",
        "x'i bir bit sola kaydırır, sağdan 0 girer",
        "x'in en düşük bitini siler, x 3 bit olur",
        "x'in bitlerini ters çevirir",
      ],
      dogru: 1,
      aciklama: "Alt üç bit üste taşınır ve en sağa '0' eklenir: bu, bir bit sola kaydırmadır.",
    },
    {
      id: "t3-rol", zorluk: 3, tip: "fill", yedek: true,
      soru: "~signal x : bit_vector(3 downto 0) := \"1001\";~ için ~x rol 1~ nedir?",
      bosluklar: [vektor("0011")],
      aciklama: "~rol~ sola döndürür: soldan çıkan bit sağdan girer. \"1001\" → \"0011\".",
      dogrulama: sina('  signal x : bit_vector(3 downto 0) := "1001";', '    assert (x rol 1) = "0011" severity failure;', ""),
    },
    {
      id: "t3-srl-sonuc", zorluk: 2, tip: "fill", yedek: true,
      soru: "~bit_vector'(\"1100\") srl 1~ nedir?",
      bosluklar: [vektor("0110")],
      aciklama: "~srl~ mantıksal sağa kaydırmadır: soldan 0 girer, en sağdaki bit atılır.",
      dogrulama: sina("", '    assert (bit_vector\'("1100") srl 1) = "0110" severity failure;', ""),
    },
  ]),

  ...turet(3, "operatorler", "others-atama", [
    {
      id: "t3-others-sifir", zorluk: 1, tip: "fill",
      soru: "~signal v : std_logic_vector(5 downto 0);~ için ~v <= (others => '0');~ ataması sonrası v nedir?",
      bosluklar: [vektor("000000")],
      aciklama: "~others~ belirtilmeyen bütün elemanları kapsar; 6 bitin hepsi '0' olur.",
    },
    {
      id: "t3-others-konum", zorluk: 3, tip: "fill", yedek: true,
      soru: "~signal v : std_logic_vector(0 to 3);~ için ~v <= (1 => '1', others => '0');~ sonrası v soldan sağa nasıl yazılır?",
      bosluklar: [vektor("0100")],
      aciklama: "~0 to 3~ aralığında en soldaki eleman v(0)'dır. v(1) = '1', diğerleri '0': \"0100\".",
      dogrulama: sina("  signal v : std_logic_vector(0 to 3);", "    v <= (1 => '1', others => '0');\n    wait for 1 ns;\n    assert v = \"0100\" severity failure;"),
    },
    {
      id: "t3-others-downto", zorluk: 2, tip: "fill",
      soru: "~signal v : std_logic_vector(3 downto 0);~ için ~v <= (1 => '1', others => '0');~ sonrası v nedir?",
      bosluklar: [vektor("0010")],
      aciklama: "~3 downto 0~ aralığında soldan sağa v(3), v(2), v(1), v(0) yazılır. Yalnızca v(1) = '1': \"0010\".",
      dogrulama: sina("  signal v : std_logic_vector(3 downto 0);", "    v <= (1 => '1', others => '0');\n    wait for 1 ns;\n    assert v = \"0010\" severity failure;"),
    },
  ]),

  ...turet(3, "nitelikler", "dizi-nitelikleri", [
    {
      id: "t3-length", zorluk: 1, tip: "fill",
      soru: "~signal d : std_logic_vector(15 downto 0);~ için ~d'LENGTH~ kaçtır?",
      bosluklar: [["16"]],
      aciklama: "15'ten 0'a kadar 16 eleman vardır.",
    },
    {
      id: "t3-left-right", zorluk: 2, tip: "fill", yedek: true,
      soru: "~signal x : std_logic_vector(2 to 9);~ için Boşluk 1: ~x'LEFT~, Boşluk 2: ~x'RIGHT~",
      bosluklar: [["2"], ["9"]],
      aciklama: "'LEFT ve 'RIGHT aralığın yazılışındaki sol ve sağ uçlardır: 2 ve 9.",
    },
    {
      id: "t3-range-dongu", zorluk: 2, tip: "mcq",
      soru: "Döngüde ~for i in d'RANGE loop~ yazmanın avantajı nedir?",
      secenekler: [
        "Döngü turlarını paralel olarak çalıştırması",
        "Döngü sayısını iki katına çıkarması",
        "Yalnızca ~to~ aralıklarında çalışması",
        "Vektörün sınırları değişince de uyum sağlaması",
      ],
      dogru: 3,
      aciklama: "~d'RANGE~ vektörün kendi aralığını verir. Genişlik bir GENERIC ile değişse bile döngü kodunu değiştirmek gerekmez.",
    },
    {
      id: "t3-high-low", zorluk: 2, tip: "fill", yedek: true,
      soru: "~signal d : std_logic_vector(7 downto 2);~ için Boşluk 1: ~d'HIGH~, Boşluk 2: ~d'LOW~, Boşluk 3: ~d'LENGTH~",
      bosluklar: [["7"], ["2"], ["6"]],
      aciklama: "En büyük indis 7, en küçüğü 2; 7'den 2'ye 6 eleman vardır.",
    },
  ]),

  ...turet(3, "nitelikler", "sinyal-nitelikleri", [
    {
      id: "t3-rising-edge", zorluk: 1, tip: "mcq",
      soru: "Saatin yükselen kenarını algılamanın önerilen yolu hangisidir?",
      secenekler: ["~clk = '1'~", "~rising_edge(clk)~", "~clk'LAST_VALUE~", "~falling_edge(clk)~"],
      dogru: 1,
      aciklama: "~rising_edge(clk)~ yalnızca '0'dan '1'e geçişte doğrudur; 'X' ya da 'U'dan geçişleri kenar saymaz.",
    },
    {
      id: "t3-event", zorluk: 2, tip: "tf", yedek: true,
      soru: "~clk'EVENT~, clk sinyalinde o anda bir değişiklik olduysa ~true~ döner.",
      dogru: true,
      aciklama: "'EVENT, sinyalin o benzetim adımında değiştiğini gösterir. ~clk'event and clk = '1'~ yükselen kenarı algılar.",
    },
    {
      id: "t3-dusen-kenar", zorluk: 2, tip: "mcq",
      soru: "~clk'event and clk = '0'~ hangi kenarı algılar?",
      secenekler: ["Yükselen kenarı", "Her iki kenarı", "Düşen kenarı", "Hiçbirini"],
      dogru: 2,
      aciklama: "Değişiklik olmuş ve yeni değer '0' ise saat 1'den 0'a inmiştir: düşen kenar.",
    },
  ]),

  ...turet(3, "nitelikler", "enum-nitelikleri", [
    {
      id: "t3-enum-pos", zorluk: 2, tip: "fill",
      soru: "~type renk is (kirmizi, yesil, mavi);~ için Boşluk 1: ~renk'POS(mavi)~, Boşluk 2: ~renk'VAL(0)~",
      bosluklar: [["2"], ["kirmizi"]],
      aciklama: "Sayım tipinde konumlar 0'dan başlar: kirmizi 0, yesil 1, mavi 2. 'VAL(0) ilk değeri verir.",
    },
    {
      id: "t3-enum-left", zorluk: 2, tip: "fill", yedek: true,
      soru: "~type durum is (bosta, calis, bitti);~ için Boşluk 1: ~durum'LEFT~, Boşluk 2: ~durum'HIGH~",
      bosluklar: [["bosta"], ["bitti"]],
      aciklama: "'LEFT yazılıştaki ilk değer, 'HIGH en büyük konumdaki değerdir.",
    },
    {
      id: "t3-enum-baslangic", zorluk: 3, tip: "mcq", yedek: true,
      soru: "~type durum is (bosta, calis, bitti);~ ve ~signal d : durum;~ başlangıç değeri verilmeden tanımlanıyor. Benzetimin başında d nedir?",
      secenekler: ["bitti", "'U'", "Rastgele bir değer", "bosta"],
      dogru: 3,
      aciklama: "Başlangıç değeri verilmeyen bir nesne tipinin 'LEFT değerini alır. std_logic'te bu 'U', bu tipte ~bosta~'dır.",
      dogrulama: sina("  type durum is (bosta, calis, bitti);\n  signal d : durum;", "    assert d = bosta severity failure;", ""),
    },
  ]),

  ...turet(3, "nitelikler", "generic", [
    {
      id: "t3-generic-map", zorluk: 2, tip: "mcq",
      soru: "Bir bileşen örneklenirken GENERIC değeri nasıl verilir?",
      secenekler: ["~port map (N => 8)~", "~generic map (N => 8)~", "Mimaride ~N := 8;~ yazarak", "~constant N <= 8;~ ile"],
      dogru: 1,
      aciklama: "Örneklemede önce ~generic map~, ardından ~port map~ yazılır: ~u1 : entity work.sayac generic map (N => 8) port map (...)~.",
    },
    {
      id: "t3-generic-varsayilan", zorluk: 2, tip: "fill", yedek: true,
      soru: "~entity alt is generic (N : integer := 4); port (x : in std_logic_vector(N-1 downto 0)); end alt;~ bileşeni ~generic map~ yazılmadan örnekleniyor. ~x'LENGTH~ kaçtır?",
      bosluklar: [["4"]],
      aciklama: "generic map verilmezse varsayılan değer kullanılır: N = 4, x 3 downto 0, yani 4 bit.",
      dogrulama: {
        calismali: IEEE + `
entity alt is
  generic (N : integer := 4);
  port (x : in std_logic_vector(N-1 downto 0));
end alt;
architecture a of alt is begin
  process begin
    assert x'length = 4 severity failure;
    wait;
  end process;
end a;

library ieee;
use ieee.std_logic_1164.all;
entity tb is end tb;
architecture z of tb is
  signal s : std_logic_vector(3 downto 0) := "0000";
begin
  u : entity work.alt port map (x => s);
end z;`,
      },
    },
    {
      id: "t3-generic-sabit", zorluk: 2, tip: "tf",
      soru: "GENERIC parametresi mimaride bir sabit gibi kullanılabilir, ama mimari içinde değeri değiştirilemez.",
      dogru: true,
      aciklama: "GENERIC değeri örnekleme anında belirlenir ve o örnek için sabittir; vektör genişliği gibi yerlerde kullanılır.",
    },
  ]),

  ...turet(3, "nitelikler", "kullanici-nitelik", [
    {
      id: "t3-attribute-bagla", zorluk: 3, tip: "mcq", yedek: true,
      soru: "~attribute pin_no : integer;~ bildiriminden sonra bu niteliği ~s~ sinyaline 5 olarak bağlamak için ne yazılır?",
      secenekler: [
        "~s'pin_no := 5;~",
        "~attribute pin_no of s : signal is 5;~",
        "~attribute s.pin_no = 5;~",
        "~signal s'pin_no : integer := 5;~",
      ],
      dogru: 1,
      aciklama: "Nitelik önce tipiyle bildirilir, sonra ~attribute ad of nesne : sınıf is değer;~ ile bir nesneye bağlanır. Değeri ~s'pin_no~ ile okunur.",
    },
    {
      id: "t3-overload-isim", zorluk: 2, tip: "tf",
      soru: "Bir operatörü aşırı yüklerken fonksiyonun adı tırnak içinde yazılır, ör. ~function \"+\" (a, b : renk) return renk~.",
      dogru: true,
      aciklama: "Operatör fonksiyonlarının adı operatör sembolünün tırnaklı halidir; derleyici tiplerine bakarak hangi ~+~'nın çağrılacağını seçer.",
    },
  ]),
];
