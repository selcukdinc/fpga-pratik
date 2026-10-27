import { IEEE, bit, vektor, type Soru } from "./tipler.ts";

export const hafta3: Soru[] = [
  // ---------- VHDL yapısı ----------
  {
    id: "h3-uc-bolum", konu: "vhdl-temel", hafta: 3, kaynak: "original", zorluk: 1,
    ref: "Hafta 3, Temel VHDL yapısı", tip: "mcq",
    soru: "Bir VHDL tasarımının temel üç bölümü hangisidir?",
    secenekler: ["PROCESS, SIGNAL, VARIABLE", "LIBRARY, ENTITY, ARCHITECTURE", "PACKAGE, FUNCTION, PROCEDURE", "ENTITY, PORT MAP, COMPONENT"],
    dogru: 1,
    aciklama: "LIBRARY bildirimleri kullanılacak paketleri görünür yapar, ENTITY dış arayüzü (portları) tanımlar, ARCHITECTURE ise devrenin işlevini anlatır.",
  },
  {
    id: "h3-std-work", konu: "vhdl-temel", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Library bildirimi", tip: "mcq",
    soru: "Hangi iki kütüphane her tasarımda varsayılan olarak görünürdür, yani bildirilmesine gerek yoktur?",
    secenekler: ["ieee ve std", "ieee ve work", "std ve work", "numeric_std ve std_logic_1164"],
    dogru: 2,
    aciklama: "~std~ (içinde ~standard~ paketi, BIT, INTEGER, BOOLEAN gibi tipler) ve ~work~ (kendi tasarım dosyaların) her zaman görünürdür. ~ieee~ kütüphanesi ise ~library ieee;~ ile açıkça bildirilmelidir.",
  },
  {
    id: "h3-port-inout", konu: "vhdl-temel", hafta: 3, kaynak: "original", zorluk: 1,
    ref: "Hafta 3, Entity ve port modları", tip: "mcq",
    soru: "Hem dışarıdan sürülebilen hem de devre tarafından sürülebilen, çift yönlü port modu hangisidir?",
    secenekler: ["IN", "OUT", "BUFFER", "INOUT"],
    dogru: 3,
    aciklama: "INOUT çift yönlüdür (örneğin üç durumlu bir veri yolu). BUFFER ise sadece dışarı veri verir ama içeride okunabilir.",
  },
  {
    id: "h3-out-okuma", konu: "vhdl-temel", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Entity ve port modları", tip: "tf",
    soru: "VHDL-93'te ~out~ modundaki bir port, mimari içinde bir atamanın sağ tarafında okunabilir.",
    dogru: false,
    aciklama: "VHDL-93'te ~out~ portu sadece yazılabilir. Okumak gerekiyorsa iç bir sinyal kullanılır ve port bu sinyalden sürülür. (VHDL-2008 bu kısıtı kaldırdı, ama ders VHDL-93 esaslıdır.)",
    dogrulama: {
      derlenmemeli: IEEE + `
entity tb is
  port (a : in std_logic; y : out std_logic; z : out std_logic);
end tb;
architecture t of tb is
begin
  y <= a;
  z <= not y;  -- out portu okunuyor
end t;`,
    },
  },
  {
    id: "h3-entity-hata", konu: "vhdl-temel", hafta: 3, kaynak: "derived", zorluk: 2,
    ref: "Hafta 3, Entity", tip: "mcq",
    soru: "Aşağıdaki entity bildirimi derlenmez. Hata nedir?\n\n~~~vhdl\nentity ornek is\n  port ( a, b : in  std_logic;\n         y    : out std_logic; );\nend ornek;\n~~~",
    secenekler: [
      "a ve b aynı satırda bildirilemez",
      "Son porttan sonra noktalı virgül konmaz",
      "Entity adı ~ornek~ olamaz",
      "Port listesinde ~in~ ve ~out~ birlikte kullanılamaz",
    ],
    dogru: 1,
    aciklama: "Port bildirimleri birbirinden noktalı virgülle ayrılır, sonuncusundan sonra noktalı virgül konmaz. Doğrusu: ~y : out std_logic );~",
    dogrulama: {
      derlenmemeli: IEEE + `
entity tb is
  port ( a, b : in  std_logic;
         y    : out std_logic; );
end tb;
architecture t of tb is begin end t;`,
    },
  },
  {
    id: "h3-architecture-of", konu: "vhdl-temel", hafta: 3, kaynak: "derived", zorluk: 1,
    ref: "Hafta 3, Architecture", tip: "fill",
    soru: "Boşluğu doldurun:\n\n~~~vhdl\narchitecture davranis ____ yarim_toplayici is\nbegin\n  ...\nend davranis;\n~~~",
    bosluklar: [["of"]],
    aciklama: "Sözdizimi ~architecture mimari_adi of entity_adi is~ biçimindedir.",
  },
  {
    id: "h3-yarim-toplayici", konu: "vhdl-temel", hafta: 3, kaynak: "original", zorluk: 1,
    ref: "Hafta 3, Örnek 1 (yarım toplayıcı)", tip: "fill",
    soru: "Yarım toplayıcıda A = 1, B = 1 için toplam (S) ve elde (CO) çıkışları nedir?\n\nBoşluk 1: S, Boşluk 2: CO",
    bosluklar: [bit("0"), bit("1")],
    aciklama: "S = A xor B = 0, CO = A and B = 1. 1 + 1 = 10 (ikilik).",
  },
  {
    id: "h3-yarim-toplayici-kod", konu: "vhdl-temel", hafta: 3, kaynak: "original", zorluk: 1,
    ref: "Hafta 3, Örnek 1 (yarım toplayıcı)", tip: "mcq",
    soru: "Yarım toplayıcıyı doğru gerçekleyen atama çifti hangisidir?",
    secenekler: [
      "~S <= A or B;  CO <= A and B;~",
      "~S <= A and B; CO <= A xor B;~",
      "~S <= A xor B; CO <= A and B;~",
      "~S <= A xnor B; CO <= A or B;~",
    ],
    dogru: 2,
    aciklama: "Toplam biti girişler farklıyken 1 olur (XOR). Elde biti sadece ikisi de 1'ken 1 olur (AND).",
  },
  {
    id: "h3-tam-toplayici", konu: "vhdl-temel", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Örnek 2 (tam toplayıcı)", tip: "fill",
    soru: "1 bitlik tam toplayıcıda A = 1, B = 0, Cin = 1 için S ve Cout nedir?\n\nBoşluk 1: S, Boşluk 2: Cout",
    bosluklar: [bit("0"), bit("1")],
    aciklama: "1 + 0 + 1 = 2 = 10 (ikilik). S = A xor B xor Cin = 0, Cout = AB + Cin(A xor B) = 0 + 1·1 = 1.",
  },
  {
    id: "h3-tam-toplayici-cout", konu: "vhdl-temel", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Örnek 2 (tam toplayıcı)", tip: "mcq",
    soru: "Tam toplayıcının elde çıkışı için hangi VHDL ifadesi doğrudur?",
    secenekler: [
      "~Cout <= A xor B xor Cin;~",
      "~Cout <= (A or B) and Cin;~",
      "~Cout <= (A and B) xor Cin;~",
      "~Cout <= (A and B) or (Cin and (A xor B));~",
    ],
    dogru: 3,
    aciklama: "Sunumdaki formül Cout = AB + Cin(A ⊕ B). ~A xor B xor Cin~ toplam bitidir, elde değil. ~(A or B) and Cin~, A=B=1 ve Cin=0'da 0 verir (yanlış). ~(A and B) xor Cin~ ise A=B=Cin=1'de 0 verir (yanlış).",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture t of tb is begin
  process
    variable a, b, c, s, co : std_logic;
    variable n : integer;
  begin
    for i in 0 to 7 loop
      n := i;
      a := '0'; b := '0'; c := '0';
      if n >= 4 then a := '1'; n := n - 4; end if;
      if n >= 2 then b := '1'; n := n - 2; end if;
      if n = 1 then c := '1'; end if;
      co := (a and b) or (c and (a xor b));
      s := a xor b xor c;
      assert (co = '1') = (i = 3 or i >= 5) report "cout hatali" severity failure;
      assert (s = '1') = (i = 1 or i = 2 or i = 4 or i = 7) report "s hatali" severity failure;
    end loop;
    wait;
  end process;
end t;`,
    },
  },

  // ---------- Operatörler ----------
  {
    id: "h3-atama-variable", konu: "operatorler", hafta: 3, kaynak: "original", zorluk: 1,
    ref: "Hafta 3, Atama operatörleri", tip: "mcq",
    soru: "Bir VARIABLE'a değer atamak için hangi operatör kullanılır?",
    secenekler: ["~<=~", "~:=~", "~=>~", "~=~"],
    dogru: 1,
    aciklama: "~:=~ variable, constant ve generic'lere değer atar, ayrıca başlangıç değeri verir. ~<=~ sinyal atamasıdır. ~=>~ ise ~others => '0'~ gibi eleman eşlemede kullanılır.",
  },
  {
    id: "h3-others-to", konu: "operatorler", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Atama operatörleri", tip: "mcq",
    soru: "~signal w : std_logic_vector(0 to 7);~ için ~w <= (0 => '1', others => '0');~ ataması hangi değere eşittir?",
    secenekler: ["~\"00000001\"~", "~\"10000000\"~", "~\"11111110\"~", "~\"01111111\"~"],
    dogru: 1,
    aciklama: "~0 to 7~ aralığında 0 indeksi en soldadır. Dizgi değeri soldan sağa indeks sırasıyla yazılır, bu yüzden sonuç ~\"10000000\"~ olur.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture t of tb is
  signal w : std_logic_vector(0 to 7);
begin
  w <= (0 => '1', others => '0');
  process begin
    wait for 1 ns;
    assert w = "10000000" report "beklenmeyen w" severity failure;
    wait;
  end process;
end t;`,
    },
  },
  {
    id: "h3-not-oncelik", konu: "operatorler", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Lojik işlemler", tip: "mcq",
    soru: "~y <= not a and b;~ ifadesi hangisine eşittir?",
    secenekler: ["(a · b)'", "a' · b", "a' · b'", "(a + b)'"],
    dogru: 1,
    aciklama: "NOT diğer mantıksal operatörlerden önceliklidir, yani önce ~not a~ hesaplanır, sonra b ile AND'lenir. (a·b)' için ~not (a and b)~ yazmak gerekir.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture t of tb is begin
  process
    variable a, b : std_logic;
  begin
    -- a=0, b=0: (a'.b) = 0, ama (a.b)' = 1 olurdu
    a := '0'; b := '0';
    assert (not a and b) = '0' severity failure;
    a := '0'; b := '1';
    assert (not a and b) = '1' severity failure;
    wait;
  end process;
end t;`,
    },
  },
  {
    id: "h3-karisik-op", konu: "operatorler", hafta: 3, kaynak: "derived", zorluk: 2,
    ref: "Hafta 3, Lojik işlemler", tip: "tf",
    soru: "~y <= a and b or c;~ ifadesi parantez kullanılmadan VHDL'de derlenir.",
    dogru: false,
    aciklama: "VHDL'de and, or, xor gibi ikili mantık operatörleri aynı önceliktedir. Farklı operatörleri parantezsiz arka arkaya yazmak hatadır: ~(a and b) or c~ yazılmalıdır. (Aynı operatörün tekrarı serbesttir: ~a and b and c~.) Not: Bu sitedeki simülatör (NVC) bu kuralı denetlemez ve kodu kabul eder; Vivado ve GHDL ise hata verir.",
  },
  {
    id: "h3-nand-zincir", konu: "operatorler", hafta: 3, kaynak: "derived", zorluk: 3,
    ref: "Hafta 3, Lojik işlemler", tip: "tf",
    soru: "Üç girişli NAND için ~y <= a nand b nand c;~ yazılabilir.",
    dogru: false,
    aciklama: "NAND ve NOR birleşme özelliğine sahip değildir; (a nand b) nand c ile a nand (b nand c) farklıdır. Bu yüzden VHDL bu zinciri yasaklar. Üç girişli NAND için ~y <= not (a and b and c);~ yazılır.",
    dogrulama: {
      derlenmemeli: IEEE + `
entity tb is end tb;
architecture t of tb is
  signal a, b, c, y : std_logic;
begin
  y <= a nand b nand c;
end t;`,
    },
  },
  {
    id: "h3-mod-rem-pozitif", konu: "operatorler", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Örnek 4 ve 5 (mod ve rem)", tip: "fill",
    soru: "~in_giris_3 = 19~ ve ~in_giris_2 = \"0100\"~ (4) iken aşağıdaki çıkışlar kaç olur?\n\n~~~vhdl\nout_cikis_bolme <= in_giris_3 / to_integer(signed(in_giris_2));\nout_cikis_mod   <= in_giris_3 mod to_integer(signed(in_giris_2));\nout_cikis_rem   <= in_giris_3 rem to_integer(signed(in_giris_2));\n~~~\n\nBoşluk 1: bölme, Boşluk 2: mod, Boşluk 3: rem",
    bosluklar: [["4"], ["3"], ["3"]],
    aciklama: "19 / 4 = 4 (tam sayı bölmesinde kesirli kısım atılır). İki sayı da pozitif olduğunda mod ve rem aynı sonucu verir: 19 = 4·4 + 3.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture t of tb is begin
  process
    variable b : integer;
  begin
    b := to_integer(signed(std_logic_vector'("0100")));
    assert 19 / b = 4 severity failure;
    assert 19 mod b = 3 severity failure;
    assert 19 rem b = 3 severity failure;
    wait;
  end process;
end t;`,
    },
  },
  {
    id: "h3-mod-rem-negatif-bolen", konu: "operatorler", hafta: 3, kaynak: "derived", zorluk: 3,
    ref: "Hafta 3, Örnek 4 ve 5 (mod ve rem)", tip: "fill",
    soru: "Aynı kodda ~in_giris_2 = \"1100\"~ olursa (~signed~ olarak -4) çıkışlar kaç olur?\n\nBoşluk 1: ~19 / (-4)~, Boşluk 2: ~19 mod (-4)~, Boşluk 3: ~19 rem (-4)~",
    bosluklar: [["-4"], ["-1"], ["3"]],
    aciklama: "Bölme sıfıra doğru keser: 19 / -4 = -4,75 → -4. ~rem~ sonucu bölünenin (19) işaretini alır: 19 - (-4)(-4) = 3. ~mod~ sonucu bölenin (-4) işaretini alır: 19 = (-4)(-5) + (-1), yani -1.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture t of tb is begin
  process
    variable b : integer;
  begin
    b := to_integer(signed(std_logic_vector'("1100")));
    assert b = -4 severity failure;
    assert 19 / b = -4 severity failure;
    assert 19 mod b = -1 severity failure;
    assert 19 rem b = 3 severity failure;
    wait;
  end process;
end t;`,
    },
  },
  {
    id: "h3-mod-rem-negatif-bolunen", konu: "operatorler", hafta: 3, kaynak: "derived", zorluk: 3,
    ref: "Hafta 3, Aritmetik işlemler (mod, rem)", tip: "fill",
    soru: "~(-19) mod 4~ ve ~(-19) rem 4~ kaçtır?\n\nBoşluk 1: mod, Boşluk 2: rem",
    bosluklar: [["1"], ["-3"]],
    aciklama: "~rem~ bölünenin işaretini alır: -19 = 4·(-4) + (-3), sonuç -3. ~mod~ bölenin işaretini alır: -19 = 4·(-5) + 1, sonuç 1.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture t of tb is begin
  process
    variable a : integer := -19;
  begin
    assert a mod 4 = 1 severity failure;
    assert a rem 4 = -3 severity failure;
    wait;
  end process;
end t;`,
    },
  },
  {
    id: "h3-mod-rem-isaret", konu: "operatorler", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Aritmetik işlemler (mod, rem)", tip: "mcq",
    soru: "~a mod b~ ve ~a rem b~ sonuçlarının işareti neye göre belirlenir?",
    secenekler: [
      "mod: a'nın işareti, rem: b'nin işareti",
      "mod: b'nin işareti, rem: a'nın işareti",
      "İkisi de her zaman pozitiftir",
      "İkisi de a'nın işaretini alır",
    ],
    dogru: 1,
    aciklama: "~mod~ sonucu bölenin (b), ~rem~ sonucu bölünenin (a) işaretini taşır. İşaretler aynıysa iki sonuç eşittir.",
  },
  {
    id: "h3-bolme-sentez", konu: "operatorler", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Aritmetik işlemler", tip: "mcq",
    soru: "Sentez araçları ~/~ (bölme) operatörünü genellikle hangi durumda doğrudan kabul eder?",
    secenekler: [
      "Her durumda, bölücü ne olursa olsun",
      "Bölen 2'nin sabit bir kuvveti olduğunda",
      "Sadece REAL tipinde",
      "Hiçbir durumda, bölme sentezlenemez",
    ],
    dogru: 1,
    aciklama: "2'nin kuvvetine bölme sadece bitleri kaydırmaktır. Genel bölme pahalı bir devre gerektirir ve doğrudan desteklenmez. ~mod~, ~rem~ ve ~abs~ için de destek sınırlıdır.",
  },
  {
    id: "h3-ornek3", konu: "operatorler", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Örnek 3", tip: "fill",
    soru: "~a = \"0111\"~ ve ~b = \"0011\"~ için çıkışlar nedir?\n\n~~~vhdl\ne <= std_logic_vector(unsigned(a) + unsigned(b));\nf <= std_logic_vector(signed(a) - signed(b));\ng <= a(1 downto 0) & b(3 downto 2);\n~~~\n\nBoşluk 1: e, Boşluk 2: f, Boşluk 3: g (4 bitlik ikilik)",
    bosluklar: [vektor("1010"), vektor("0100"), vektor("1100")],
    aciklama: "e = 7 + 3 = 10 = ~1010~. f = 7 - 3 = 4 = ~0100~. g, a'nın alt iki biti (~11~) ile b'nin üst iki bitinin (~00~) birleşimidir: ~1100~.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture t of tb is
  signal a : std_logic_vector(3 downto 0) := "0111";
  signal b : std_logic_vector(3 downto 0) := "0011";
  signal e, f, g : std_logic_vector(3 downto 0);
begin
  e <= std_logic_vector(unsigned(a) + unsigned(b));
  f <= std_logic_vector(signed(a) - signed(b));
  g <= a(1 downto 0) & b(3 downto 2);
  process begin
    wait for 1 ns;
    assert e = "1010" and f = "0100" and g = "1100" severity failure;
    wait;
  end process;
end t;`,
    },
  },
  {
    id: "h3-ornek3-tasma", konu: "operatorler", hafta: 3, kaynak: "derived", zorluk: 3,
    ref: "Hafta 3, Örnek 3", tip: "fill",
    soru: "Aynı kodda ~a = \"1001\"~ ve ~b = \"0110\"~ olursa e, f ve g ne olur?\n\nBoşluk 1: e, Boşluk 2: f, Boşluk 3: g (4 bitlik ikilik)",
    bosluklar: [vektor("1111"), vektor("0011"), vektor("0101")],
    aciklama: "e: işaretsiz 9 + 6 = 15 = ~1111~. f: işaretli olarak a = -7, b = 6, fark -13. Bu 4 bite sığmaz (aralık -8..7), sonuç 16'ya göre sarar: -13 + 16 = 3 = ~0011~. Taşma uyarı vermez, sessizce olur. g = ~01~ & ~01~ = ~0101~.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture t of tb is
  signal a : std_logic_vector(3 downto 0) := "1001";
  signal b : std_logic_vector(3 downto 0) := "0110";
  signal e, f, g : std_logic_vector(3 downto 0);
begin
  e <= std_logic_vector(unsigned(a) + unsigned(b));
  f <= std_logic_vector(signed(a) - signed(b));
  g <= a(1 downto 0) & b(3 downto 2);
  process begin
    wait for 1 ns;
    assert e = "1111" and f = "0011" and g = "0101" severity failure;
    wait;
  end process;
end t;`,
    },
  },
  {
    id: "h3-slv-toplama", konu: "operatorler", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Aritmetik operatörler", tip: "tf",
    soru: "~ieee.std_logic_1164~ ve ~ieee.numeric_std~ kullanılan bir tasarımda iki ~std_logic_vector~ doğrudan ~a + b~ şeklinde toplanabilir.",
    dogru: false,
    aciklama: "~numeric_std~ toplamayı ~signed~ ve ~unsigned~ için tanımlar, ~std_logic_vector~ için tanımlamaz. Önce dönüştürmek gerekir: ~std_logic_vector(unsigned(a) + unsigned(b))~. Eski ~std_logic_unsigned~ paketi buna izin verir ama standart değildir ve derste önerilmez.",
    dogrulama: {
      derlenmemeli: IEEE + `
entity tb is end tb;
architecture t of tb is
  signal a, b, y : std_logic_vector(3 downto 0);
begin
  y <= a + b;
end t;`,
    },
  },
  {
    id: "h3-kaydirma", konu: "operatorler", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Kaydırma operatörleri", tip: "fill",
    soru: "~signal x : bit_vector(3 downto 0) := \"1011\";~ için ~x sll 1~ ve ~x srl 2~ sonuçları nedir?\n\nBoşluk 1: ~x sll 1~, Boşluk 2: ~x srl 2~",
    bosluklar: [vektor("0110"), vektor("0010")],
    aciklama: "~sll~ sola kaydırır ve sağdan '0' ekler: ~1011~ → ~0110~. ~srl~ sağa kaydırır ve soldan '0' ekler: ~1011~ → ~0101~ → ~0010~.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture t of tb is
  signal x : bit_vector(3 downto 0) := "1011";
begin
  process begin
    assert (x sll 1) = "0110" severity failure;
    assert (x srl 2) = "0010" severity failure;
    wait;
  end process;
end t;`,
    },
  },
  {
    id: "h3-esit-degil", konu: "operatorler", hafta: 3, kaynak: "original", zorluk: 1,
    ref: "Hafta 3, Karşılaştırma operatörleri", tip: "mcq",
    soru: "VHDL'de \"eşit değildir\" operatörü hangisidir?",
    secenekler: ["~!=~", "~<>~", "~/=~", "~=/~"],
    dogru: 2,
    aciklama: "VHDL'de eşit değildir ~/=~ ile yazılır. ~!=~ C dilinden, ~<>~ ise bazı başka dillerden gelen bir alışkanlıktır.",
  },
  {
    id: "h3-kucuk-esit", konu: "operatorler", hafta: 3, kaynak: "derived", zorluk: 2,
    ref: "Hafta 3, Karşılaştırma operatörleri", tip: "tf",
    soru: "~if a <= b then~ satırındaki ~<=~ bir sinyal ataması değil, \"küçük veya eşit\" karşılaştırmasıdır.",
    dogru: true,
    aciklama: "Aynı simge iki anlamda kullanılır. Bir koşul ifadesinin içinde ~<=~ karşılaştırmadır; bir satırın başında, hedef sinyalden sonra ise atamadır.",
  },
  {
    id: "h3-birlestirme", konu: "operatorler", hafta: 3, kaynak: "derived", zorluk: 1,
    ref: "Hafta 3, Operatörler (birleştirme)", tip: "fill",
    soru: "~\"10\" & \"011\"~ ifadesinin sonucu nedir?",
    bosluklar: [vektor("10011")],
    aciklama: "~&~ birleştirme operatörüdür; sol operand üst bitlere, sağ operand alt bitlere gider ve 5 bitlik ~10011~ oluşur.",
  },

  // ---------- Nitelikler ve generic ----------
  {
    id: "h3-attr-downto", konu: "nitelikler", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Veri öznitelikleri (Örnek 1)", tip: "fill",
    soru: "~signal d : std_logic_vector(7 downto 0);~ için:\n\nBoşluk 1: ~d'LOW~, Boşluk 2: ~d'HIGH~, Boşluk 3: ~d'LEFT~, Boşluk 4: ~d'RIGHT~, Boşluk 5: ~d'LENGTH~",
    bosluklar: [["0"], ["7"], ["7"], ["0"], ["8"]],
    aciklama: "LOW ve HIGH yönden bağımsız olarak en küçük ve en büyük indeksi verir. LEFT ve RIGHT ise yazıldığı sıradaki sol ve sağ sınırdır: ~7 downto 0~ için LEFT = 7, RIGHT = 0. LENGTH eleman sayısıdır.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture t of tb is
  signal d : std_logic_vector(7 downto 0);
begin
  process begin
    assert d'low = 0 and d'high = 7 and d'left = 7 and d'right = 0 and d'length = 8 severity failure;
    wait;
  end process;
end t;`,
    },
  },
  {
    id: "h3-attr-to", konu: "nitelikler", hafta: 3, kaynak: "derived", zorluk: 2,
    ref: "Hafta 3, Veri öznitelikleri", tip: "fill",
    soru: "~signal x : std_logic_vector(3 to 10);~ için:\n\nBoşluk 1: ~x'LEFT~, Boşluk 2: ~x'HIGH~, Boşluk 3: ~x'LENGTH~",
    bosluklar: [["3"], ["10"], ["8"]],
    aciklama: "~3 to 10~ yazımında sol sınır 3, en büyük indeks 10'dur. Eleman sayısı 10 - 3 + 1 = 8.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture t of tb is
  signal x : std_logic_vector(3 to 10);
begin
  process begin
    assert x'left = 3 and x'high = 10 and x'length = 8 severity failure;
    wait;
  end process;
end t;`,
    },
  },
  {
    id: "h3-attr-reverse", konu: "nitelikler", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Veri öznitelikleri (Örnek 1)", tip: "mcq",
    soru: "~signal d : std_logic_vector(7 downto 0);~ için ~d'REVERSE_RANGE~ neyi verir?",
    secenekler: ["~7 downto 0~", "~0 to 7~", "~8~", "~0 downto 7~"],
    dogru: 1,
    aciklama: "~d'RANGE~ = ~7 downto 0~, ~d'REVERSE_RANGE~ ise aynı aralığın ters yönlüsüdür: ~0 to 7~.",
  },
  {
    id: "h3-attr-dongu", konu: "nitelikler", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Veri öznitelikleri (Örnek 2)", tip: "mcq",
    soru: "~signal x : std_logic_vector(0 to 7);~ için aşağıdaki döngülerden hangisi i'yi 0'dan 7'ye **sırayla** dolaştırmaz?",
    secenekler: [
      "~for i in 0 to 7 loop~",
      "~for i in x'RANGE loop~",
      "~for i in x'REVERSE_RANGE loop~",
      "~for i in 0 to x'LENGTH - 1 loop~",
    ],
    dogru: 2,
    aciklama: "~x'REVERSE_RANGE~ = ~7 downto 0~ olduğu için döngü 7'den 0'a iner. Diğer üçü 0'dan 7'ye çıkar. Sunumdaki dört eşdeğer döngü örneği de bu fikre dayanır.",
  },
  {
    id: "h3-kenar-algilama", konu: "nitelikler", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Sinyal öznitelikleri", tip: "mcq",
    soru: "Aşağıdakilerden hangisi saatin **yalnızca yükselen kenarını** algılamaz?",
    secenekler: [
      "~if clk'EVENT and clk = '1' then~",
      "~if not clk'STABLE and clk = '1' then~",
      "~if clk'EVENT then~",
      "~if rising_edge(clk) then~",
    ],
    dogru: 2,
    aciklama: "~clk'EVENT~ tek başına her değişimde, yani hem yükselen hem düşen kenarda doğrudur. Diğer üçü sunumdaki eşdeğer yükselen kenar yazımlarıdır.",
  },
  {
    id: "h3-sentezlenebilir-nitelik", konu: "nitelikler", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Sinyal öznitelikleri", tip: "mcq",
    soru: "Sinyal niteliklerinden hangi ikisi sentezlenebilir?",
    secenekler: ["~'LAST_VALUE~ ve ~'QUIET~", "~'EVENT~ ve ~'STABLE~", "~'LAST_EVENT~ ve ~'ACTIVE~", "~'DELAYED~ ve ~'TRANSACTION~"],
    dogru: 1,
    aciklama: "Sinyal niteliklerinin çoğu sadece simülasyon içindir. ~'EVENT~ ve ~'STABLE~ sentezlenebilir; özellikle ~'EVENT~ kenar algılamada çok kullanılır.",
  },
  {
    id: "h3-last-value", konu: "nitelikler", hafta: 3, kaynak: "derived", zorluk: 3,
    ref: "Hafta 3, Sinyal öznitelikleri", tip: "tf",
    soru: "~s'LAST_VALUE~, s sinyalinin son olaydan (değişimden) önceki değerini verir.",
    dogru: true,
    aciklama: "Örneğin s '0'dan '1'e geçtiyse ~s'LAST_VALUE~ = '0' olur. Simülasyonda kullanışlıdır, sentezlenmez.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture t of tb is
  signal s : std_logic := '0';
begin
  process begin
    s <= '1';
    wait for 1 ns;
    assert s = '1' and s'last_value = '0' severity failure;
    wait;
  end process;
end t;`,
    },
  },
  {
    id: "h3-enum-encoding", konu: "nitelikler", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, Numaralandırılmış tip kodlama", tip: "fill",
    soru: "~type color is (red, green, blue, white);~ tipinde:\n\nBoşluk 1: Varsayılan sıralı kodlamada ~blue~ hangi koda karşılık gelir?\n\nBoşluk 2: ~attribute enum_encoding of color : type is \"11 00 10 01\";~ yazıldıktan sonra ~green~ hangi koda karşılık gelir?",
    bosluklar: [vektor("10"), vektor("00")],
    aciklama: "Varsayılan kodlama sıraya göredir: red = 00, green = 01, blue = 10, white = 11. ~enum_encoding~ dizgisindeki kodlar da aynı sırayla değerlere verilir: red = 11, green = 00, blue = 10, white = 01.",
  },
  {
    id: "h3-pos-val", konu: "nitelikler", hafta: 3, kaynak: "derived", zorluk: 2,
    ref: "Hafta 3, Numaralandırılmış tip öznitelikleri", tip: "fill",
    soru: "~type durum is (bekle, ileri, geri, dur);~ için:\n\nBoşluk 1: ~durum'POS(geri)~, Boşluk 2: ~durum'VAL(3)~",
    bosluklar: [["2"], ["dur"]],
    aciklama: "Konumlar 0'dan başlar: bekle = 0, ileri = 1, geri = 2, dur = 3. POS değerden konuma, VAL konumdan değere gider.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture t of tb is
  type durum is (bekle, ileri, geri, dur);
begin
  process begin
    assert durum'pos(geri) = 2 and durum'val(3) = dur severity failure;
    wait;
  end process;
end t;`,
    },
  },
  {
    id: "h3-generic-atama", konu: "nitelikler", hafta: 3, kaynak: "original", zorluk: 1,
    ref: "Hafta 3, GENERIC", tip: "mcq",
    soru: "Bir GENERIC parametresine varsayılan değer hangi operatörle verilir?",
    secenekler: ["~<=~", "~=>~", "~:=~", "~=~"],
    dogru: 2,
    aciklama: "Örnek: ~generic (n : integer := 8);~. Bileşen kullanılırken değer ~generic map (n => 16)~ ile değiştirilebilir.",
  },
  {
    id: "h3-generic-yer", konu: "nitelikler", hafta: 3, kaynak: "original", zorluk: 2,
    ref: "Hafta 3, GENERIC", tip: "mcq",
    soru: "GENERIC bildirimi nerede yapılır?",
    secenekler: [
      "Architecture'ın ~begin~ satırından sonra",
      "Entity içinde, PORT bildiriminden önce",
      "Process'in bildirim bölümünde",
      "Package body içinde",
    ],
    dogru: 1,
    aciklama: "GENERIC, entity'nin parametresidir ve ~port (...)~ listesinden önce yazılır. Böylece port genişlikleri generic'e bağlanabilir.",
  },
  {
    id: "h3-generic-genislik", konu: "nitelikler", hafta: 3, kaynak: "derived", zorluk: 2,
    ref: "Hafta 3, GENERIC", tip: "fill",
    soru: "Aşağıdaki entity ~generic map (N => 12)~ ile kullanılıyor. x portu için ~x'HIGH~ kaçtır?\n\n~~~vhdl\nentity kaydirici is\n  generic (N : integer := 8);\n  port (x : in std_logic_vector(N-1 downto 0));\nend kaydirici;\n~~~",
    bosluklar: [["11"]],
    aciklama: "N = 12 olduğunda port ~std_logic_vector(11 downto 0)~ olur. HIGH en büyük indekstir: 11. Varsayılan 8 sadece generic map verilmezse kullanılır.",
    dogrulama: {
      calismali: IEEE + `
entity kaydirici is
  generic (N : integer := 8);
  port (x : in std_logic_vector(N-1 downto 0));
end kaydirici;
architecture a of kaydirici is begin
  process begin
    assert x'high = 11 severity failure;
    wait;
  end process;
end a;
library ieee; use ieee.std_logic_1164.all;
entity tb is end tb;
architecture t of tb is
  signal s : std_logic_vector(11 downto 0) := (others => '0');
begin
  u : entity work.kaydirici generic map (N => 12) port map (x => s);
end t;`,
    },
  },
  {
    id: "h3-overload", konu: "nitelikler", hafta: 3, kaynak: "original", zorluk: 3,
    ref: "Hafta 3, Operatör aşırı yükleme", tip: "tf",
    soru: "VHDL'de ~+~ gibi bir operatör yeni tip kombinasyonları için aşırı yüklenebilir. Bunun için adı tırnak içinde yazılmış bir fonksiyon tanımlanır: ~function \"+\" (a : integer; b : bit) return integer~.",
    dogru: true,
    aciklama: "Sunumdaki örnek, INTEGER ile BIT toplamayı tanımlayan böyle bir fonksiyondur. Derleyici hangi ~+~'nın çağrılacağını operand tiplerine bakarak seçer.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture t of tb is
  function "+" (a : integer; b : bit) return integer is
  begin
    if b = '1' then return a + 1; else return a; end if;
  end "+";
begin
  process begin
    assert (5 + '1') = 6 and (5 + '0') = 5 severity failure;
    wait;
  end process;
end t;`,
    },
  },
  {
    id: "h3-kullanici-nitelik", konu: "nitelikler", hafta: 3, kaynak: "original", zorluk: 3,
    ref: "Hafta 3, Kullanıcı tanımlı öznitelikler", tip: "mcq",
    soru: "~attribute number_of_inputs : integer;~ bildiriminden sonra, ~nand3~ sinyaline bu niteliği 3 olarak vermek için hangi yazım doğrudur?",
    secenekler: [
      "~attribute number_of_inputs of nand3 : signal is 3;~",
      "~nand3'number_of_inputs := 3;~",
      "~attribute nand3 of number_of_inputs : integer is 3;~",
      "~signal nand3 : number_of_inputs := 3;~",
    ],
    dogru: 0,
    aciklama: "Belirtim sözdizimi ~attribute nitelik_adi of hedef : sinif is deger;~ şeklindedir. Değer daha sonra ~nand3'number_of_inputs~ ile okunur.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture t of tb is
  signal nand3 : std_logic;
  attribute number_of_inputs : integer;
  attribute number_of_inputs of nand3 : signal is 3;
begin
  process begin
    assert nand3'number_of_inputs = 3 severity failure;
    wait;
  end process;
end t;`,
    },
  },
];
