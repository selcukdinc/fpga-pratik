// 6. hafta için türetilmiş ek sorular. yedek: true olanlar yalnızca aralıklı tekrarda gelir.
import { IEEE, bit, turet, vektor, type Soru } from "./tipler.ts";

// Mimarideki eşzamanlı deyimleri (eszamanli) bir testbench process'iyle sınar
const esz = (bildirim: string, eszamanli: string, govde: string, degisken = "") => ({
  calismali: `${IEEE}
entity tb is end tb;
architecture z of tb is
${bildirim}
begin
${eszamanli}
  process
${degisken}
  begin
${govde}
    wait;
  end process;
end z;`,
});

// n saat darbesi: her biri bir yükselen ve bir düşen kenar
const darbe = (n: number) => `    for i in 1 to ${n} loop\n      clk <= '1'; wait for 1 ns; clk <= '0'; wait for 1 ns;\n    end loop;`;

const MOD6 = `  process (clk) begin
    if rising_edge(clk) then
      if sayi = 5 then sayi <= (others => '0'); else sayi <= sayi + 1; end if;
    end if;
  end process;`;

const UCGEN3 = `  process (clk) begin
    if rising_edge(clk) then
      if yukari = '1' then
        if sayi = 2 then yukari <= '0'; end if;
        sayi <= sayi + 1;
      else
        if sayi = 1 then yukari <= '1'; end if;
        sayi <= sayi - 1;
      end if;
    end if;
  end process;`;

const ODUL = `entity odul is
  port (sure : in integer range 0 to 99;
        sira : in integer range 1 to 99;
        kod  : out std_logic_vector(2 downto 0));
end odul;
architecture rtl of odul is
begin
  process (sure, sira) begin
    if sure < 10 then
      kod <= "111";
    else
      case sira is
        when 1 => kod <= "001";
        when 2 => kod <= "010";
        when 3 => kod <= "011";
        when 4 => kod <= "100";
        when 5 => kod <= "101";
        OTHERS_DALI
      end case;
    end if;
  end process;
end rtl;`;

export const ekHafta6: Soru[] = [
  ...turet(6, "saat-kenar", "saat-periyot", [
    {
      id: "t6-periyot-mhz", zorluk: 1, tip: "fill",
      soru: "Periyodu 5 ns olan bir saatin frekansı kaç MHz'dir?",
      bosluklar: [["200", "200 MHz", "200MHz"]],
      aciklama: "f = 1 / T; ns cinsinden periyotla MHz cinsinden frekans 1000 / T'dir: 1000 / 5 = 200 MHz.",
    },
    {
      id: "t6-frekans-periyot", zorluk: 1, tip: "fill", yedek: true,
      soru: "250 MHz'lik bir saatin periyodu kaç ns'dir?",
      bosluklar: [["4", "4 ns", "4ns"]],
      aciklama: "T = 1 / f. MHz cinsinden frekansla ns cinsinden periyot 1000 / f'dir: 1000 / 250 = 4 ns.",
    },
    {
      id: "t6-kenar-sayisi", zorluk: 2, tip: "fill", yedek: true,
      soru: "25 ns periyotlu bir saat 2 µs boyunca kaç kez yükselir?",
      bosluklar: [["80"]],
      aciklama: "Bir sürede kaç kenar olduğu süre / periyot ile bulunur: 2000 / 25 = 80.",
      dogrulama: esz(
        "  signal clk : std_logic := '0';\n  signal n : integer := 0;",
        "  clk <= not clk after 12.5 ns when now < 2 us;\n  process (clk) begin\n    if rising_edge(clk) then n <= n + 1; end if;\n  end process;",
        "    wait for 2 us;\n    assert n = 80 severity failure;",
      ),
    },
    {
      id: "t6-gorev-orani", zorluk: 2, tip: "mcq", yedek: true,
      soru: "Bir saat her periyotta 30 ns 1, 10 ns 0 kalıyor. Periyodu ve görev oranı nedir?",
      secenekler: ["T = 30 ns, %50", "T = 40 ns, %75", "T = 40 ns, %25", "T = 20 ns, %75"],
      dogru: 1,
      aciklama: "Periyot yüksek ve alçak sürenin toplamıdır: 30 + 10 = 40 ns. Görev oranı yüksek sürenin periyoda oranıdır: 30 / 40 = %75.",
    },
  ]),

  ...turet(6, "saat-kenar", "kenar-tetikleme", [
    {
      id: "t6-ilk-kenar", zorluk: 2, tip: "tf",
      soru: "İlk değeri verilmemiş bir ~std_logic~ saat sinyali benzetimde ~'U'~ ile başlar. Bu saat ilk kez ~'1'~ olduğunda ~clk'event and clk = '1'~ koşulu doğru olur.",
      dogru: true,
      aciklama: "~'event~ yazımı önceki değere bakmaz: sinyal değişti ve yeni değeri 1. Bu yüzden ~'U'~'dan ~'1'~'e geçiş bir kenar sayılır. ~rising_edge~ ise önceki değerin '0' ya da 'L' olmasını ister ve bu geçişi saymaz. Saate ~:= '0'~ vermek sorunu önler.",
      dogrulama: esz(
        "  signal clk : std_logic;\n  signal a, b : integer := 0;",
        "  process (clk) begin\n    if clk'event and clk = '1' then a <= a + 1; end if;\n    if rising_edge(clk) then b <= b + 1; end if;\n  end process;",
        "    wait for 1 ns;\n    clk <= '1';\n    wait for 1 ns;\n    assert a = 1 and b = 0 severity failure;",
      ),
    },
    {
      id: "t6-falling-esdeger", zorluk: 1, tip: "mcq", yedek: true,
      soru: "~falling_edge(clk)~ yerine kullanılabilen klasik yazım hangisidir?",
      secenekler: ["~clk = '0'~", "~clk'event and clk = '1'~", "~clk'event and clk = '0'~", "~not clk'event~"],
      dogru: 2,
      aciklama: "~clk'event~ sinyalin o anda değiştiğini, ~clk = '0'~ yeni değerin 0 olduğunu söyler: 1'den 0'a geçiş, yani düşen kenar.",
    },
    {
      id: "t6-dusen-zaman", zorluk: 2, tip: "fill",
      soru: "~clk~ 0'dan başlıyor ve ~clk <= not clk after 8 ns;~ ile sürülüyor. Bir flip-flop ~if falling_edge(clk) then q <= d; end if;~ ile çalışıyor; ~q~ ve ~d~ 0'dan başlıyor ve ~d~ 18 ns'de 1 oluyor. ~q~ kaçıncı ns'de 1 olur?",
      bosluklar: [["32", "32 ns", "32ns"]],
      aciklama: "T = 16 ns: yükselen kenarlar 8, 24, 40 ns'de; düşen kenarlar 16, 32 ns'de. 18 ns'den sonraki ilk düşen kenar 32 ns'dedir.",
      dogrulama: esz(
        "  signal clk, d : std_logic := '0';\n  signal q : std_logic := '0';",
        "  clk <= not clk after 8 ns when now < 100 ns;\n  d <= '1' after 18 ns;\n  process (clk) begin\n    if falling_edge(clk) then q <= d; end if;\n  end process;",
        "    wait until q = '1';\n    assert now = 32 ns severity failure;",
      ),
    },
    {
      id: "t6-h-gecis", zorluk: 3, tip: "mcq", yedek: true,
      soru: "Bir ~std_logic~ saat ~'0'~ değerinden zayıf ~'H'~ değerine geçiyor. Bu anda hangisi doğrudur?",
      secenekler: [
        "Yalnızca ~clk'event and clk = '1'~",
        "Yalnızca ~rising_edge(clk)~",
        "İkisi de",
        "Hiçbiri",
      ],
      dogru: 1,
      aciklama: "~rising_edge~ değerleri ~'0'~/~'1'~'e indirger: 'H' 1, önceki '0' 0 sayılır ve kenar doğrudur. ~clk = '1'~ ise 'H' ile '1'i farklı karakterler olarak karşılaştırır ve yanlıştır.",
      dogrulama: esz(
        "  signal clk : std_logic := '0';\n  signal a, b : integer := 0;",
        "  process (clk) begin\n    if clk'event and clk = '1' then a <= a + 1; end if;\n    if rising_edge(clk) then b <= b + 1; end if;\n  end process;",
        "    wait for 1 ns;\n    clk <= 'H';\n    wait for 1 ns;\n    assert a = 0 and b = 1 severity failure;",
      ),
    },
  ]),

  ...turet(6, "sayicilar", "sayac-yapisi", [
    {
      id: "t6-testere-periyot", zorluk: 2, tip: "fill",
      soru: "6 bitlik bir sayıcı 4 ns periyotlu bir saatle 0'dan en büyük değerine sayıp yeniden 0'dan başlıyor. Testere dişinin periyodu kaç ns'dir?",
      bosluklar: [["256", "256 ns", "256ns"]],
      aciklama: "n bitlik sayıcı 2ⁿ değer dolaşır: 2⁶ = 64. Periyot 64 · 4 = 256 ns.",
    },
    {
      id: "t6-sayac-deger", zorluk: 2, tip: "fill", yedek: true,
      soru: "3 bitlik bir ~unsigned~ sayıcı 0'dan başlıyor ve her yükselen kenarda bir artıyor. 21 kenardan sonra kaç gösterir (ondalık)?",
      bosluklar: [["5"]],
      aciklama: "3 bit 8 değer tutar; her 8 kenarda başa döner. 21 = 2 · 8 + 5: 5.",
      dogrulama: esz(
        "  signal clk : std_logic := '0';\n  signal q : unsigned(2 downto 0) := \"000\";",
        "  process (clk) begin\n    if rising_edge(clk) then q <= q + 1; end if;\n  end process;",
        `${darbe(21)}\n    assert q = 5 severity failure;`,
      ),
    },
    {
      id: "t6-inout-neden", zorluk: 1, tip: "mcq", yedek: true,
      soru: "~std_logic_unsigned~ ile yazılmış bir sayıcıda ~count~ portu ~inout~ yapılmış ve ~count <= count + 1;~ yazılmış. Port neden ~inout~?",
      secenekler: [
        "Sayıcı dışarıdan da yüklenebilsin diye",
        "~out~ port okunamadığı için; sağ taraf ~count~'u okuyor",
        "~std_logic_unsigned~ yalnızca ~inout~ portlarla çalıştığı için",
        "Saat girişi olmadığı için",
      ],
      dogru: 1,
      aciklama: "VHDL-93'te ~out~ port okunamaz; ~count + 1~ ise ~count~'u okur. Port bu yüzden ~inout~ yapılmıştır. Daha iyisi iç bir ~unsigned~ sinyalde sayıp çıkışa yalnızca atamaktır.",
    },
  ]),

  ...turet(6, "sayicilar", "mod-n-sayac", [
    {
      id: "t6-mod-esik", zorluk: 2, tip: "mcq",
      soru: "Bir sayıcı her yükselen kenarda şunu yapıyor:\n\n~~~vhdl\nif sayi = 5 then\n  sayi <= (others => '0');\nelse\n  sayi <= sayi + 1;\nend if;\n~~~\n\nKaç farklı değer dolaşır?",
      secenekler: ["5", "6", "7", "8"],
      dogru: 1,
      aciklama: "Sayı 0, 1, 2, 3, 4, 5 değerlerini alır; 5'ten sonra 0'a döner. 6 değer: mod-6 bir sayıcı. Karşılaştırma son değerle (N - 1) yapılır.",
      dogrulama: esz(
        "  signal clk : std_logic := '0';\n  signal sayi : unsigned(3 downto 0) := \"0000\";",
        MOD6,
        `    for i in 1 to 5 loop\n      clk <= '1'; wait for 1 ns; clk <= '0'; wait for 1 ns;\n      assert sayi = i severity failure;\n    end loop;\n${darbe(1)}\n    assert sayi = 0 severity failure;`,
      ),
    },
    {
      id: "t6-mod-deger", zorluk: 2, tip: "fill", yedek: true,
      soru: "0'dan 5'e sayıp 0'a dönen bir sayıcı 0'dan başlıyor. 40 kenardan sonra kaç gösterir?",
      bosluklar: [["4"]],
      aciklama: "6 durum vardır; her 6 kenarda başa dönülür. 40 = 6 · 6 + 4: 4.",
      dogrulama: esz(
        "  signal clk : std_logic := '0';\n  signal sayi : unsigned(3 downto 0) := \"0000\";",
        MOD6,
        `${darbe(40)}\n    assert sayi = 4 severity failure;`,
      ),
    },
    {
      id: "t6-reset-tut", zorluk: 2, tip: "tf", yedek: true,
      soru: "~process (clk, rst) begin if rst = '1' then sayi <= (others => '0'); elsif rising_edge(clk) then sayi <= sayi + 1; end if; end process;~ sayıcısında ~rst = '1'~ kaldığı sürece saat kenarları gelse de sayı 0'da kalır.",
      dogru: true,
      aciklama: "Reset sayma koşulundan önce denetlenir: ~rst = '1'~ iken ~elsif~ dalına hiç girilmez. Sayma ancak reset 0 olunca ve yükselen kenarda olur.",
      dogrulama: esz(
        "  signal clk : std_logic := '0';\n  signal rst : std_logic := '1';\n  signal sayi : unsigned(3 downto 0) := \"0111\";",
        "  process (clk, rst) begin\n    if rst = '1' then sayi <= (others => '0');\n    elsif rising_edge(clk) then sayi <= sayi + 1;\n    end if;\n  end process;",
        `${darbe(4)}\n    assert sayi = 0 severity failure;\n    rst <= '0';\n${darbe(2)}\n    assert sayi = 2 severity failure;`,
      ),
    },
    {
      id: "t6-bit-sayisi", zorluk: 1, tip: "fill", yedek: true,
      soru: "0'dan 99'a sayan bir sayıcı en az kaç bit olmalıdır?",
      bosluklar: [["7"]],
      aciklama: "6 bit 0..63'ü tutar, yetmez; 7 bit 0..127'yi tutar.",
    },
  ]),

  ...turet(6, "sayicilar", "saat-bolme", [
    {
      id: "t6-bolme-n", zorluk: 2, tip: "fill",
      soru: "12 MHz'lik bir saatten 1 kHz hızında gelen bir tik üretmek için mod-N sayıcının N değeri kaç olmalıdır?",
      bosluklar: [["12000", "12 000", "12.000"]],
      aciklama: "N = f_saat / f_tik = 12 000 000 / 1 000 = 12 000. Sayıcı 0'dan 11 999'a sayar.",
    },
    {
      id: "t6-yavas-periyot", zorluk: 2, tip: "fill", yedek: true,
      soru: "Mod-5 bir sayıcının tiki her geldiğinde tersine çevrilen bir sinyalin periyodu kaç saat periyodudur?",
      bosluklar: [["10"]],
      aciklama: "Tik her 5 saatte bir gelir; sinyal bir tikte 1'e, bir sonrakinde 0'a döner. Bir tam periyot iki tik, yani 2 · 5 = 10 saat sürer.",
    },
    {
      id: "t6-enable-neden", zorluk: 2, tip: "mcq", yedek: true,
      soru: "Hızlı bir saatten türetilen yavaş bir işlem için hangisi önerilir?",
      secenekler: [
        "Sayıcıdan bir tik üretip aynı hızlı saatle çalışan flip-flop'larda ~if tik = '1' then~ ile kullanmak",
        "Sayıcının bir bitini doğrudan diğer flip-flop'ların saat girişine bağlamak",
        "Saati bir AND kapısından geçirip yavaşlatmak",
        "Yavaş işlemi bir ~wait for~ ile geciktirmek",
      ],
      dogru: 0,
      aciklama: "Bu yönteme saat etkinleştirme denir: bütün flip-flop'lar aynı saati görür, tik yalnızca hangi kenarda iş yapılacağını seçer. Mantıktan üretilmiş bir sinyali saat olarak kullanmak saatin yongada gecikmeli ve dengesiz dağılmasına yol açar. ~wait for~ sentezlenmez.",
    },
  ]),

  ...turet(6, "sayicilar", "ucgen-dalga", [
    {
      id: "t6-ucgen-periyot", zorluk: 2, tip: "fill",
      soru: "Bir üçgen dalga sayıcısı 20 ns'lik bir saatle 0'dan 25'e çıkıp yeniden 0'a iniyor. Üçgenin periyodu kaç ns'dir?",
      bosluklar: [["1000", "1000 ns", "1 µs", "1 us"]],
      aciklama: "Bir periyot 2 · tepe saat sürer: 2 · 25 = 50 saat. 50 · 20 ns = 1000 ns = 1 µs.",
    },
    {
      id: "t6-ucgen-tepe2", zorluk: 2, tip: "fill", yedek: true,
      soru: "40 ns'lik bir saatle 8 µs periyotlu bir üçgen dalga üretilecek. Sayıcının tepe değeri kaç olmalıdır?",
      bosluklar: [["100"]],
      aciklama: "Bir periyotta 8000 / 40 = 200 saat var; yarısı çıkış, yarısı iniş: tepe = 100.",
    },
    {
      id: "t6-ucgen-sira", zorluk: 3, tip: "fill", yedek: true,
      soru: "Tepe değeri 3 olan doğru çalışan bir üçgen sayıcı 0'dan yukarı yönde başlıyor (yön ~sayi = 2~'de aşağıya, ~sayi = 1~'de yukarıya çevriliyor). 8 kenardan sonra sayı kaçtır?",
      bosluklar: [["2"]],
      aciklama: "Değerler: 0, 1, 2, 3, 2, 1, 0, 1, 2. Her kenar bir adım; 8. kenardan sonra 2.",
      dogrulama: esz(
        "  signal clk : std_logic := '0';\n  signal sayi : unsigned(1 downto 0) := \"00\";\n  signal yukari : std_logic := '1';",
        UCGEN3,
        `${darbe(3)}\n    assert sayi = 3 severity failure;\n${darbe(5)}\n    assert sayi = 2 severity failure;`,
      ),
    },
  ]),

  ...turet(6, "uygulamalar", "tek-cift", [
    {
      id: "t6-tek-sonuc", zorluk: 1, tip: "fill",
      soru: "~tek <= x(0);~ ile çalışan bir devrede ~x = \"1101\"~ (3 downto 0) iken ~tek~ kaçtır?",
      bosluklar: [bit("1")],
      aciklama: "x(0) en sağdaki bittir: 1. \"1101\" = 13, tek bir sayı.",
    },
    {
      id: "t6-mod2", zorluk: 2, tip: "tf", yedek: true,
      soru: "~x : std_logic_vector(3 downto 0)~ için ~to_integer(unsigned(x)) mod 2 = 1~ ve ~x(0) = '1'~ koşulları her değer için aynı sonucu verir.",
      dogru: true,
      aciklama: "Bir sayının 2'ye bölümünden kalan en düşük bitidir; diğer bitlerin ağırlıkları (8, 4, 2) çifttir. Sentez aracı da ~mod 2~'yi tek bir bite indirger.",
      dogrulama: esz(
        "  signal x : std_logic_vector(3 downto 0);",
        "",
        "    for k in 0 to 15 loop\n      x <= std_logic_vector(to_unsigned(k, 4));\n      wait for 1 ns;\n      assert (to_integer(unsigned(x)) mod 2 = 1) = (x(0) = '1') severity failure;\n    end loop;",
      ),
    },
    {
      id: "t6-artan-indeks", zorluk: 3, tip: "mcq", yedek: true,
      soru: "~x : std_logic_vector(0 to 3)~ olarak tanımlanmış bir vektörde ~unsigned(x)~'in en düşük ağırlıklı biti hangisidir?",
      secenekler: ["~x(0)~", "~x(1)~", "~x(3)~", "~x'left~"],
      dogru: 2,
      aciklama: "Vektörün en solundaki eleman en yüksek ağırlıklıdır. ~(0 to 3)~ tanımında en soldaki ~x(0)~, en sağdaki ~x(3)~'tür; tekliği ~x(3)~ söyler. ~x'left~ = ~x(0)~ olur.",
      dogrulama: esz(
        "  signal x : std_logic_vector(0 to 3) := \"0001\";",
        "",
        "    wait for 1 ns;\n    assert to_integer(unsigned(x)) = 1 and x(3) = '1' severity failure;",
      ),
    },
  ]),

  ...turet(6, "uygulamalar", "isaretli-karsilastirma", [
    {
      id: "t6-isaretli-sonuc", zorluk: 2, tip: "fill",
      soru: "~a = \"0011\"~ ve ~b = \"1110\"~ (ikisi de ~std_logic_vector(3 downto 0)~) **işaretli** karşılaştırılıyor; küçük olanın değeri ~to_integer(signed(...))~ ile veriliyor. Sonuç kaçtır?",
      bosluklar: [["-2"]],
      aciklama: "İşaretli yorumda \"0011\" = 3, \"1110\" = 14 - 16 = -2. Küçük olan b'dir: -2.",
      dogrulama: esz(
        "  signal a : std_logic_vector(3 downto 0) := \"0011\";\n  signal b : std_logic_vector(3 downto 0) := \"1110\";\n  signal y : integer;",
        "  y <= to_integer(signed(a)) when signed(a) < signed(b) else to_integer(signed(b));",
        "    wait for 1 ns;\n    assert y = -2 severity failure;",
      ),
    },
    {
      id: "t6-isaretli-buyuk", zorluk: 2, tip: "tf", yedek: true,
      soru: "4 bitlik \"1000\" ve \"0111\" için ~unsigned~ karşılaştırmada \"1000\" büyük, ~signed~ karşılaştırmada \"1000\" küçük çıkar.",
      dogru: true,
      aciklama: "~unsigned~: 8 > 7. ~signed~: en soldaki bit işarettir, \"1000\" = -8 < 7. Aynı bitler, farklı yorum.",
      dogrulama: esz(
        "  constant a : std_logic_vector(3 downto 0) := \"1000\";\n  constant b : std_logic_vector(3 downto 0) := \"0111\";",
        "",
        "    assert unsigned(a) > unsigned(b) and signed(a) < signed(b) severity failure;",
      ),
    },
    {
      id: "t6-port-genislik", zorluk: 1, tip: "fill", yedek: true,
      soru: "~input1 : in std_logic_vector(4 downto 0)~ portu kaç bitliktir?",
      bosluklar: [["5"]],
      aciklama: "4'ten 0'a beş indis vardır: 4, 3, 2, 1, 0. 4 bitlik bir giriş ~(3 downto 0)~ olur.",
    },
  ]),

  ...turet(6, "uygulamalar", "odul-kodu", [
    {
      id: "t6-odul-katilim", zorluk: 1, tip: "fill",
      soru: "Ödül kodunda (süre < 10 ise \"111\"; değilse sıra 1..5 için \"001\"..\"101\", diğerleri için \"110\") süre = 14 ve sıra = 6 olan yarışmacının kodu nedir?",
      bosluklar: [vektor("110")],
      aciklama: "14 < 10 yanlış; sıra 6 ilk beşte değil ve ~when others~ dalına düşer: \"110\", katılım belgesi.",
      dogrulama: {
        calismali: `${IEEE}${ODUL.replace("OTHERS_DALI", "when others => kod <= \"110\";")}
library ieee;
use ieee.std_logic_1164.all;
entity tb is end tb;
architecture z of tb is
  signal sure : integer range 0 to 99 := 14;
  signal sira : integer range 1 to 99 := 6;
  signal kod : std_logic_vector(2 downto 0);
begin
  uut : entity work.odul port map (sure => sure, sira => sira, kod => kod);
  process begin
    wait for 1 ns;
    assert kod = "110" severity failure;
    wait;
  end process;
end z;`,
      },
    },
    {
      id: "t6-odul-others", zorluk: 2, tip: "tf", yedek: true,
      soru: "Ödül kodunu üreten ~case sira is~ deyiminde ~sira~ ~integer range 1 to 99~ tipinde ve yalnızca ~when 1~ ... ~when 5~ dalları var; ~when others~ yazılmamış. Bu kod derlenmez.",
      dogru: true,
      aciklama: "~case~ seçicinin bütün değerlerini kapsamalıdır; 6..99 değerleri hiçbir dalda yok. ~when others~ bu değerleri kapsar ve her yolda ~kod~'a değer atandığı için latch'i de önler.",
      dogrulama: { derlenmemeli: `${IEEE}${ODUL.replace("OTHERS_DALI", "")}` },
    },
    {
      id: "t6-odul-ikili", zorluk: 1, tip: "fill", yedek: true,
      soru: "Ödül kodunda madalyalar sırayla 1'den 5'e ikilik kodlarla gösteriliyor (1. sıra \"001\"). 5. sıranın 3 bitlik kodu nedir?",
      bosluklar: [vektor("101")],
      aciklama: "5 ikilik olarak 101'dir: 4 + 1.",
    },
  ]),
];
