import { IEEE, bit, vektor, type Soru } from "./tipler.ts";

export const hafta4: Soru[] = [
  // ---------- Veri nesneleri ----------
  {
    id: "h4-variable-yer", konu: "veri-nesneleri", hafta: 4, kaynak: "original", zorluk: 1,
    ref: "Hafta 4, VARIABLE", tip: "mcq",
    soru: "VHDL-93'te sıradan (shared olmayan) bir VARIABLE nerede bildirilir?",
    secenekler: [
      "Architecture'ın bildirim bölümünde",
      "Entity'nin port listesinde",
      "Process'in (ya da fonksiyon/prosedürün) bildirim bölümünde, ~begin~'den önce",
      "Bir package içinde",
    ],
    dogru: 2,
    aciklama: "Variable yereldir; sadece sıralı kodun içinde, process, function ya da procedure'ün bildirim bölümünde tanımlanır. Değerini process dışına taşımak için bir sinyale atanır.",
  },
  {
    id: "h4-signal-guncelleme", konu: "veri-nesneleri", hafta: 4, kaynak: "original", zorluk: 1,
    ref: "Hafta 4, Signal ve variable farkı", tip: "tf",
    soru: "Bir process içinde sinyale ~<=~ ile yapılan atama, bir sonraki satırda o sinyal okunduğunda yeni değeri verir.",
    dogru: false,
    aciklama: "Sinyal atamaları process askıya alınınca (sonunda ya da bir ~wait~'te) uygulanır. Process içinde sinyal okunduğunda hep eski değer görülür.",
  },
  {
    id: "h4-variable-guncelleme", konu: "veri-nesneleri", hafta: 4, kaynak: "original", zorluk: 1,
    ref: "Hafta 4, Signal ve variable farkı", tip: "tf",
    soru: "Bir variable'a ~:=~ ile yapılan atama hemen geçerli olur; bir sonraki satırda yeni değer okunur.",
    dogru: true,
    aciklama: "Variable'lar sıradan programlama dillerindeki değişkenler gibi anında güncellenir. Ara hesaplamalarda bu yüzden variable önerilir.",
  },
  {
    id: "h4-uc-atama", konu: "veri-nesneleri", hafta: 4, kaynak: "derived", zorluk: 3,
    ref: "Hafta 4, Signal ve variable farkı", tip: "fill",
    soru: "Simülasyon başında ~t~ = 0 ve ~v~ = 0'dır. Aşağıdaki iki process simülasyonun başında birer kez çalıştıktan sonra t ve v kaç olur?\n\n~~~vhdl\nsignal t : integer := 0;\n...\np1 : process (tetik)\nbegin\n  t <= t + 1;\n  t <= t + 1;\n  t <= t + 1;\nend process;\n\np2 : process (tetik)\n  variable v : integer := 0;\nbegin\n  v := v + 1;\n  v := v + 1;\n  v := v + 1;\n  sonuc <= v;\nend process;\n~~~\n\nBoşluk 1: t, Boşluk 2: v (sonuc)",
    bosluklar: [["1"], ["3"]],
    aciklama: "Üç sinyal atamasının üçü de t'nin eski değerini (0) okur ve hepsi aynı ~t <= 1~ ataması olur; son atama geçerlidir, t = 1. Variable ise her satırda güncellenir: 1, 2, 3.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is
  signal tetik : std_logic := '0';
  signal t : integer := 0;
  signal sonuc : integer := 0;
begin
  p1 : process (tetik) begin
    t <= t + 1; t <= t + 1; t <= t + 1;
  end process;
  p2 : process (tetik)
    variable v : integer := 0;
  begin
    v := v + 1; v := v + 1; v := v + 1;
    sonuc <= v;
  end process;
  process begin
    wait for 1 ns;
    assert t = 1 and sonuc = 3 report "t=" & integer'image(t) severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-birler-signal", konu: "veri-nesneleri", hafta: 4, kaynak: "original", zorluk: 3,
    ref: "Hafta 4, SIGNAL vs VARIABLE (count_ones, not_ok)", tip: "mcq",
    soru: "Sunumdaki hatalı birler sayacında ~temp~ bir sinyaldir ve başta 0'dır:\n\n~~~vhdl\nPROCESS (din)\nBEGIN\n  temp <= 0;\n  FOR i IN 0 TO 7 LOOP\n    IF (din(i) = '1') THEN\n      temp <= temp + 1;\n    END IF;\n  END LOOP;\n  ones <= temp;\nEND PROCESS;\n~~~\n\n~din~ \"10110001\" olduğunda process bir kez çalıştıktan hemen sonra ~temp~ kaç olur?",
    secenekler: ["4", "1", "0", "8"],
    dogru: 1,
    aciklama: "Döngüdeki her ~temp <= temp + 1~ temp'in eski değerini (0) okur, yani hepsi ~temp <= 1~ olur. Son yapılan atama geçerlidir: temp = 1, doğru cevap 4 olmasına rağmen. ~ones~ ise temp'in o anki eski değerini (0) alır. Çözüm temp'i variable yapmaktır.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is
  signal din : std_logic_vector(7 downto 0) := "00000000";
  signal temp : integer range 0 to 8 := 0;
  signal ones : integer range 0 to 8;
begin
  process (din) begin
    temp <= 0;
    for i in 0 to 7 loop
      if din(i) = '1' then temp <= temp + 1; end if;
    end loop;
    ones <= temp;
  end process;
  process begin
    wait for 1 ns;
    din <= "10110001";
    wait for 1 ns;
    assert temp = 1 report "temp=" & integer'image(temp) severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-birler-variable", konu: "veri-nesneleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, Hafta 4_2 (birler sayacı)", tip: "fill",
    soru: "8 bitlik girişteki '1' sayısını variable ile sayan doğru bir devrede (Hafta 4_2) aşağıdaki girişler için çıkış kaç olur?\n\nBoşluk 1: ~\"01011111\"~, Boşluk 2: ~\"10100101\"~",
    bosluklar: [["6"], ["4"]],
    aciklama: "Variable her adımda güncellendiği için döngü gerçekten sayar. ~01011111~ altı, ~10100101~ dört adet 1 içerir.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is
  function say(d : std_logic_vector) return integer is
    variable artis : integer := 0;
  begin
    for n_i in d'range loop
      artis := artis + to_integer(unsigned'(d(n_i) & ""));
    end loop;
    return artis;
  end say;
begin
  process begin
    assert say("01011111") = 6 and say("10100101") = 4 severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-nand-variable", konu: "veri-nesneleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, Hafta 4_1 (NAND zinciri)", tip: "fill",
    soru: "Hafta 4_1'deki process'te ~in_giris~ = \"11001110\" iken döngü bittiğinde ~v_nand_sonuc~ kaç olur?\n\n~~~vhdl\nv_nand_sonuc := in_giris(0);\nfor n_i in 1 to 7 loop\n  v_nand_sonuc := not (v_nand_sonuc and in_giris(n_i));\nend loop;\n~~~",
    bosluklar: [bit("1")],
    aciklama: "Başlangıç in_giris(0) = 0. Adım adım: n=1 → 1, n=2 → 0, n=3 → 1, n=4 → 1, n=5 → 1, n=6 → 0, n=7 → 1. Sunumdaki tablonun son satırı da 1'dir.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is begin
  process
    variable g : std_logic_vector(7 downto 0) := "11001110";
    variable v : std_logic;
  begin
    v := g(0);
    for n_i in 1 to 7 loop v := not (v and g(n_i)); end loop;
    assert v = '1' severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-nand-variable-2", konu: "veri-nesneleri", hafta: 4, kaynak: "derived", zorluk: 3,
    ref: "Hafta 4, Hafta 4_1 (NAND zinciri)", tip: "fill",
    soru: "Aynı process'te ~in_giris~ = \"10110011\" olursa döngü bittiğinde ~v_nand_sonuc~ kaç olur?",
    bosluklar: [bit("0")],
    aciklama: "Başlangıç in_giris(0) = 1. n=1: not(1·1) = 0; n=2: not(0·0) = 1; n=3: not(1·0) = 1; n=4: not(1·1) = 0; n=5: not(0·1) = 1; n=6: not(1·0) = 1; n=7: not(1·1) = 0.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is begin
  process
    variable g : std_logic_vector(7 downto 0) := "10110011";
    variable v : std_logic;
  begin
    v := g(0);
    for n_i in 1 to 7 loop v := not (v and g(n_i)); end loop;
    assert v = '0' severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-nand-signal-sabit", konu: "veri-nesneleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, Hafta 4_1 (NAND zinciri)", tip: "tf",
    soru: "Hafta 4_1'de benzetim process içinde adım adım ilerletildiğinde ~s_nand_sonuc~ sinyalinin okunan değeri döngü boyunca değişmez.",
    dogru: true,
    aciklama: "Döngüdeki her ~s_nand_sonuc <= ...~ ataması sadece planlanır; process askıya alınana kadar sinyal eski değerinde kalır. Sunumdaki tabloda s_nand_sonuc sütununun hep aynı kalmasının nedeni budur.",
  },
  {
    id: "h4-variable-disarida", konu: "veri-nesneleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, Hafta 4_1 (variable porta atanamaz)", tip: "tf",
    soru: "Bir process içinde bildirilen variable, process dışındaki eşzamanlı bir atamada (ör. ~out_cikis <= v_nand_sonuc;~) kullanılabilir.",
    dogru: false,
    aciklama: "Variable sadece bildirildiği process'in içinde görünür. Dışarı aktarmak için process içinde bir sinyale atanır, port da o sinyalden sürülür.",
    dogrulama: {
      derlenmemeli: IEEE + `
entity tb is end tb;
architecture x of tb is
  signal a, out_cikis : std_logic;
begin
  process (a)
    variable v_nand_sonuc : std_logic;
  begin
    v_nand_sonuc := not a;
  end process;
  out_cikis <= v_nand_sonuc;
end x;`,
    },
  },
  {
    id: "h4-out-okuma-cozum", konu: "veri-nesneleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, SIGNAL vs VARIABLE (BUFFER notu)", tip: "mcq",
    soru: "Bir çıkış portunun değeri mimari içinde de okunmak isteniyor (VHDL-93). Ders notlarında önerilen iyi uygulama hangisidir?",
    secenekler: [
      "Portu ~in~ yapmak",
      "Portu ~out~ bırakıp iç bir yardımcı sinyal kullanmak, portu da bu sinyalden sürmek",
      "Portu ~inout~ yapmak",
      "Port yerine bir variable kullanmak",
    ],
    dogru: 1,
    aciklama: "~buffer~ da çalışır, ama gerçekte tek yönlü olan bir çıkış için iç sinyal kullanmak daha temiz bir tasarım pratiğidir. ~inout~ çift yönlü veri yolları içindir.",
  },
  {
    id: "h4-isim-gecerli", konu: "veri-nesneleri", hafta: 4, kaynak: "original", zorluk: 1,
    ref: "Hafta 4, İsimlendirme kuralları", tip: "mcq",
    soru: "Aşağıdakilerden hangisi geçerli bir VHDL tanımlayıcısıdır?",
    secenekler: ["~_kelime~", "~kelime__10~", "~kelime_10~", "~10kelime~"],
    dogru: 2,
    aciklama: "Tanımlayıcı harfle başlamalı, alt çizgiyle bitmemeli ve arka arkaya iki alt çizgi içermemelidir. Ayrıca bir VHDL anahtar sözcüğü olamaz.",
  },
  {
    id: "h4-isim-gecersiz", konu: "veri-nesneleri", hafta: 4, kaynak: "derived", zorluk: 2,
    ref: "Hafta 4, İsimlendirme kuralları", tip: "mcq",
    soru: "Aşağıdakilerden hangisi **geçersiz** bir tanımlayıcıdır?",
    secenekler: ["~Sayac2~", "~s_ayac~", "~SAYAC~", "~sayac_~"],
    dogru: 3,
    aciklama: "~sayac_~ alt çizgiyle bittiği için geçersizdir. VHDL büyük/küçük harf duyarsız olduğundan ~SAYAC~ ile ~sayac~ aynı isimdir ama ikisi de geçerlidir.",
    dogrulama: {
      derlenmemeli: IEEE + `
entity tb is end tb;
architecture x of tb is
  signal sayac_ : std_logic;
begin
end x;`,
    },
  },
  {
    id: "h4-anahtar-sozcuk", konu: "veri-nesneleri", hafta: 4, kaynak: "original", zorluk: 1,
    ref: "Hafta 4, İsimlendirme kuralları", tip: "tf",
    soru: "~signal entity : bit;~ geçerli bir sinyal bildirimidir.",
    dogru: false,
    aciklama: "~entity~ bir VHDL anahtar sözcüğüdür ve isim olarak kullanılamaz.",
    dogrulama: {
      derlenmemeli: IEEE + `
entity tb is end tb;
architecture x of tb is
  signal entity : bit;
begin
end x;`,
    },
  },

  // ---------- Veri tipleri ----------
  {
    id: "h4-std-ulogic-deger", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 1,
    ref: "Hafta 4, STD_ULOGIC", tip: "fill",
    soru: "IEEE 1164'teki ~std_ulogic~ (ve ~std_logic~) tipi kaç farklı değer alabilir?",
    bosluklar: [["9"]],
    aciklama: "Değerler: 'U', 'X', '0', '1', 'Z', 'W', 'L', 'H', '-'.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is begin
  process begin
    assert std_ulogic'pos(std_ulogic'high) + 1 = 9 severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-u-degeri", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, STD_LOGIC değerleri tablosu", tip: "mcq",
    soru: "Aşağıdaki ~std_logic~ değerlerinden hangisi donanımda karşılığı olmayan, sadece simülasyonda anlamlı bir değerdir?",
    secenekler: ["'0'", "'1'", "'Z'", "'U'"],
    dogru: 3,
    aciklama: "'U' (tanımlanmamış), simülasyonda henüz hiç değer atanmamış sinyali gösterir. 'Z' ise üç durumlu çıkışlarla donanımda gerçeklenebilir.",
  },
  {
    id: "h4-cozumleme", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, STD_LOGIC çözümleme tablosu", tip: "fill",
    soru: "Bir ~std_logic~ sinyali iki kaynak tarafından aynı anda sürülüyor. Çözümleme tablosuna göre sonuç nedir?\n\nBoşluk 1: '0' ile '1', Boşluk 2: 'Z' ile '1', Boşluk 3: 'L' ile 'H'",
    bosluklar: [bit("X"), bit("1"), bit("W")],
    aciklama: "Güçlü 0 ile güçlü 1 çakışırsa bilinmeyen ('X') olur. 'Z' (yüksek empedans) diğer sürücüye yol verir. Zayıf 0 ile zayıf 1 çakışırsa zayıf bilinmeyen ('W') olur.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is begin
  process begin
    assert resolved(std_ulogic_vector'("01")) = 'X' severity failure;
    assert resolved(std_ulogic_vector'("Z1")) = '1' severity failure;
    assert resolved(std_ulogic_vector'("LH")) = 'W' severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-ulogic-coklu", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 3,
    ref: "Hafta 4, STD_ULOGIC", tip: "tf",
    soru: "~std_ulogic~ tipindeki bir sinyal iki ayrı eşzamanlı atamayla sürülürse hata alınır; ~std_logic~ ise çözümlenmiş (resolved) bir tip olduğu için buna izin verir.",
    dogru: true,
    aciklama: "~std_logic~, ~std_ulogic~'in çözümleme fonksiyonu eklenmiş alt tipidir. Çözümlenmemiş tiplerde birden fazla sürücü hatadır; bu, iki çıkışı yanlışlıkla birbirine bağlamayı yakalamaya yarar.",
    dogrulama: {
      calisirken_hata: IEEE + `
entity tb is end tb;
architecture x of tb is
  signal a, b, y : std_ulogic;
begin
  y <= a;
  y <= b;
end x;`,
    },
  },
  {
    id: "h4-bit-toplama", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 1,
    ref: "Hafta 4, VHDL skaler veri tipleri", tip: "tf",
    soru: "BIT tipindeki iki sinyal doğrudan ~+~ ile toplanabilir.",
    dogru: false,
    aciklama: "BIT bir mantık tipidir; aritmetik işlemler onun için tanımlı değildir. Toplama için ~integer~, ~unsigned~ ya da ~signed~ kullanılır.",
    dogrulama: {
      derlenmemeli: IEEE + `
entity tb is end tb;
architecture x of tb is
  signal a, b, y : bit;
begin
  y <= a + b;
end x;`,
    },
  },
  {
    id: "h4-to-indeks", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, BIT_VECTOR (0 TO 7)", tip: "fill",
    soru: "~signal w : bit_vector(0 to 7);~ ve ~w <= \"01110001\";~ ataması yapılıyor.\n\nBoşluk 1: ~w(0)~, Boşluk 2: ~w(7)~",
    bosluklar: [bit("0"), bit("1")],
    aciklama: "Dizgi değeri soldan sağa indeks sırasıyla yerleşir. ~0 to 7~ aralığında en soldaki bit w(0), en sağdaki w(7)'dir.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is
  signal w : bit_vector(0 to 7);
begin
  w <= "01110001";
  process begin
    wait for 1 ns;
    assert w(0) = '0' and w(7) = '1' severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-hex-oktal", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, Çoklu veri nesnesine değer atanması", tip: "mcq",
    soru: "12 bitlik bir sinyale yapılan ~kelime <= X\"333\";~ ataması aşağıdakilerden hangisiyle aynıdır?",
    secenekler: ["~kelime <= O\"333\";~", "~kelime <= O\"1463\";~", "~kelime <= \"333\";~", "~kelime <= B\"0011_0011\";~"],
    dogru: 1,
    aciklama: "X\"333\" = 0011 0011 0011. Bunu üçerli gruplarsak 001 100 110 011 = O\"1463\". B\"0011_0011\" sadece 8 bittir.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is
  constant k1 : bit_vector(11 downto 0) := X"333";
  constant k2 : bit_vector(11 downto 0) := O"1463";
  constant k3 : bit_vector(11 downto 0) := "001100110011";
begin
  process begin
    assert k1 = k2 and k2 = k3 severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-sayi-tabani", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, Sayı gösterimleri", tip: "fill",
    soru: "Aşağıdaki değerlerin onluk karşılığı nedir?\n\nBoşluk 1: ~X\"2F\"~, Boşluk 2: ~O\"57\"~",
    bosluklar: [["47"], ["47"]],
    aciklama: "X\"2F\" = 2·16 + 15 = 47. O\"57\" = 5·8 + 7 = 47. İkisi de ikilik olarak 101111'dir.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is begin
  process begin
    assert to_integer(unsigned(std_logic_vector'(X"2F"))) = 47 severity failure;
    assert to_integer(unsigned(std_logic_vector'(O"57"))) = 47 severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-alt-cizgi", konu: "veri-tipleri", hafta: 4, kaynak: "derived", zorluk: 2,
    ref: "Hafta 4, Sayı gösterimleri", tip: "tf",
    soru: "~B\"1010_0101\"~ ile ~\"10100101\"~ aynı değerdir; alt çizgi sadece okunabilirlik içindir.",
    dogru: true,
    aciklama: "Taban belirtilen bit dizgilerinde (B, O, X) alt çizgi okunabilirlik için kullanılabilir ve değeri etkilemez. Tabansız ~\"1010_0101\"~ yazımında ise alt çizgi kullanılamaz.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is
  constant a : bit_vector(7 downto 0) := B"1010_0101";
begin
  process begin
    assert a = "10100101" severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-signed-deger", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, SIGNED ve UNSIGNED", tip: "fill",
    soru: "4 bitlik değerlerin onluk karşılığı nedir?\n\nBoşluk 1: ~signed(\"1010\")~, Boşluk 2: ~unsigned(\"1010\")~, Boşluk 3: ~signed(\"1101\")~",
    bosluklar: [["-6"], ["10"], ["-3"]],
    aciklama: "Signed değerler ikiye tümleyendir. 1010 → tersi 0101, +1 = 0110 = 6, yani -6. 1101 → tersi 0010, +1 = 0011 = 3, yani -3. Dikkat: sunumdaki bir slaytta \"1101\" için 3 yazıyor; doğrusu -3'tür.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is begin
  process begin
    assert to_integer(signed'("1010")) = -6 severity failure;
    assert to_integer(unsigned'("1010")) = 10 severity failure;
    assert to_integer(signed'("1101")) = -3 severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-signed-karsilastirma", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, Hafta 4_4", tip: "mcq",
    soru: "Hafta 4_4'te ~a1~ ve ~b1~ ~signed(3 downto 0)~, ~a2~ ve ~b2~ ~unsigned(3 downto 0)~ tipindedir. ~a1 = a2 = \"1010\"~ ve ~b1 = b2 = \"0101\"~ iken çıkışlar ne olur?\n\n~~~vhdl\nc <= (a1 > b1);\nd <= (a2 > b2);\n~~~",
    secenekler: ["c = true, d = true", "c = false, d = true", "c = true, d = false", "c = false, d = false"],
    dogru: 1,
    aciklama: "Aynı bitler farklı tiplerde farklı sayıdır. Signed: -6 > 5 yanlış, c = false. Unsigned: 10 > 5 doğru, d = true.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is
  signal a1 : signed(3 downto 0) := "1010";
  signal a2 : unsigned(3 downto 0) := "1010";
  signal b1 : signed(3 downto 0) := "0101";
  signal b2 : unsigned(3 downto 0) := "0101";
  signal c, d : boolean;
begin
  c <= (a1 > b1);
  d <= (a2 > b2);
  process begin
    wait for 1 ns;
    assert c = false and d = true severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-unsigned-and", konu: "veri-tipleri", hafta: 4, kaynak: "derived", zorluk: 3,
    ref: "Hafta 4, Signed ve unsigned ile izin verilen işlemler", tip: "tf",
    soru: "~ieee.numeric_std~ paketi kullanıldığında iki ~unsigned~ sinyal arasında ~and~ işlemi yapılabilir.",
    dogru: true,
    aciklama: "~numeric_std~, ~signed~ ve ~unsigned~ için mantıksal operatörleri de tanımlar. Sunumdaki \"signed/unsigned ile AND yasal değil\" örneği eski ~std_logic_arith~ paketi içindir. Ders ~numeric_std~ kullandığı için bu işlem geçerlidir.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is
  signal a : unsigned(3 downto 0) := "1100";
  signal b : unsigned(3 downto 0) := "1010";
  signal y : unsigned(3 downto 0);
begin
  y <= a and b;
  process begin
    wait for 1 ns;
    assert y = "1000" severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-slv-toplama", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, Tip dönüşümleri", tip: "mcq",
    soru: "~a~, ~b~ ve ~y~ ~std_logic_vector(7 downto 0)~ tipinde ve ~numeric_std~ kullanılıyor. Hangi atama doğrudur?",
    secenekler: [
      "~y <= a + b;~",
      "~y <= unsigned(a + b);~",
      "~y <= std_logic_vector(unsigned(a) + unsigned(b));~",
      "~y <= to_integer(a) + b;~",
    ],
    dogru: 2,
    aciklama: "Önce iki vektör ~unsigned~'a dönüştürülür, toplanır, sonuç yeniden ~std_logic_vector~'e çevrilir. ~to_integer~ ~std_logic_vector~ almaz, önce ~unsigned(a)~ gerekir.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is
  signal a : std_logic_vector(7 downto 0) := X"0F";
  signal b : std_logic_vector(7 downto 0) := X"01";
  signal y : std_logic_vector(7 downto 0);
begin
  y <= std_logic_vector(unsigned(a) + unsigned(b));
  process begin
    wait for 1 ns;
    assert y = X"10" severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-to-integer", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, Tip dönüşümleri", tip: "fill",
    soru: "~d~ ~std_logic_vector(7 downto 0)~, ~n~ ise ~integer~ tipindedir. Boşlukları doldurun:\n\n~~~vhdl\nn <= ____(unsigned(d));\nd <= std_logic_vector(to_unsigned(n, ____));\n~~~",
    bosluklar: [["to_integer"], ["8", "d'length"]],
    aciklama: "~to_integer~ ~unsigned~/~signed~ değeri tam sayıya çevirir. ~to_unsigned~ ise tam sayıyı verilen bit genişliğinde ~unsigned~'a çevirir; genişlik hedefle aynı olmalıdır (8 ya da ~d'length~).",
  },
  {
    id: "h4-tek-bit-to-integer", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, Tip dönüşümleri", tip: "tf",
    soru: "Tek bitlik bir ~std_logic~ değer doğrudan ~to_integer()~ fonksiyonuna verilebilir.",
    dogru: false,
    aciklama: "~to_integer~ sadece ~signed~ ve ~unsigned~ alır. Tek biti önce 1 elemanlı bir vektöre çevirmek gerekir, Hafta 4_2'deki ~unsigned'(bit & \"\")~ hilesi bunun içindir.",
    dogrulama: {
      derlenmemeli: IEEE + `
entity tb is end tb;
architecture x of tb is
  signal b : std_logic := '1';
  signal n : integer;
begin
  n <= to_integer(b);
end x;`,
    },
  },
  {
    id: "h4-bit-vektor-hilesi", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 3,
    ref: "Hafta 4, Hafta 4_2", tip: "mcq",
    soru: "Hafta 4_2'deki ~artis := artis + to_integer(unsigned'(in_giris(n_i) & \"\"));~ satırında ~& \"\"~ ne işe yarar?",
    secenekler: [
      "Biti tersler",
      "Tek biti boş bir dizgiyle birleştirip 1 elemanlı bir vektör yapar, böylece ~unsigned~ olarak yorumlanabilir",
      "Bitin değerini sıfırlar",
      "Bir sözdizimi süsüdür, hiçbir etkisi yoktur",
    ],
    dogru: 1,
    aciklama: "~unsigned~ bir vektör tipidir, tek bir ~std_logic~ değeri doğrudan ~unsigned~ olamaz. Boş dizgiyle birleştirme 1 bitlik bir dizi üretir, ~unsigned'(...)~ onu niteler, ~to_integer~ de 0 ya da 1 döndürür.",
  },
  {
    id: "h4-tip-uyumu", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, İzin verilen ve verilmeyen işlemler", tip: "mcq",
    soru: "Bildirimler:\n\n~~~vhdl\nSIGNAL a : BIT;\nSIGNAL b : BIT_VECTOR(7 DOWNTO 0);\nSIGNAL c : STD_LOGIC;\nSIGNAL d : STD_LOGIC_VECTOR(7 DOWNTO 0);\nSIGNAL e : INTEGER RANGE 0 TO 255;\n~~~\n\nHangi atama geçerlidir?",
    secenekler: ["~a <= c;~", "~b <= d;~", "~c <= d(5);~", "~e <= d;~"],
    dogru: 2,
    aciklama: "~d(5)~ bir ~STD_LOGIC~ bittir ve c ile aynı tiptedir. Diğerlerinde tipler uyuşmaz: BIT ile STD_LOGIC, BIT_VECTOR ile STD_LOGIC_VECTOR, INTEGER ile STD_LOGIC_VECTOR. VHDL güçlü tiplidir, örtük dönüşüm yapmaz.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is
  signal c : std_logic;
  signal d : std_logic_vector(7 downto 0) := "00100000";
begin
  c <= d(5);
  process begin
    wait for 1 ns;
    assert c = '1' severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-subtype-atama", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 3,
    ref: "Hafta 4, SUBTYPE", tip: "mcq",
    soru: "Bildirimler:\n\n~~~vhdl\nSUBTYPE my_logic IS STD_LOGIC RANGE '0' TO '1';\nSIGNAL a : BIT;\nSIGNAL b : STD_LOGIC;\nSIGNAL c : my_logic;\n~~~\n\nHangi atama geçerlidir?",
    secenekler: ["~b <= a;~", "~a <= b;~", "~b <= c;~", "~a <= c;~"],
    dogru: 2,
    aciklama: "Alt tip, temel tipiyle aynı tiptir; sadece değer aralığı kısıtlıdır. Bu yüzden ~b <= c~ geçerlidir. BIT ise STD_LOGIC'ten tamamen farklı bir tiptir.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is
  subtype my_logic is std_logic range '0' to '1';
  signal b : std_logic;
  signal c : my_logic := '1';
begin
  b <= c;
  process begin
    wait for 1 ns;
    assert b = '1' severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-subtype-aralik", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 3,
    ref: "Hafta 4, SUBTYPE", tip: "fill",
    soru: "~SUBTYPE my_logic IS STD_LOGIC RANGE '0' TO 'Z';~ alt tipi kaç farklı değer içerir?",
    bosluklar: [["3"]],
    aciklama: "~std_ulogic~ değerlerinin sırası 'U', 'X', '0', '1', 'Z', 'W', 'L', 'H', '-' şeklindedir. '0' ile 'Z' arası: '0', '1', 'Z', yani 3 değer.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture x of tb is
  subtype my_logic is std_logic range '0' to 'Z';
begin
  process begin
    assert my_logic'pos(my_logic'high) - my_logic'pos(my_logic'low) + 1 = 3 severity failure;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-integer-bit", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, INTEGER tipi", tip: "fill",
    soru: "Sentezde aşağıdaki aralıklar için kaç bit kullanılır?\n\nBoşluk 1: ~integer range -63 to 63~, Boşluk 2: ~integer range 0 to 255~",
    bosluklar: [["7"], ["8"]],
    aciklama: "-63..63 için 6 değer biti ve 1 işaret biti gerekir: 7 bit. 0..255 negatif değer içermediği için 8 bitlik işaretsiz sayıyla gösterilir. Aralık verilmezse integer 32 bit olarak sentezlenir.",
  },
  {
    id: "h4-aralik-disi", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, Hafta 4_6", tip: "mcq",
    soru: "Hafta 4_6'da ~in_giris_1 : in integer range 0 to 15~ tanımlı. Davranışsal simülasyonda bu porta 20 değeri verilirse ne olur?",
    secenekler: [
      "Değer 4 bite kırpılır, 4 olur",
      "Simülasyon \"aralık dışı\" hatasıyla durur",
      "Değer sessizce 15'e sabitlenir",
      "Hiçbir şey olmaz, 20 değeri kullanılır",
    ],
    dogru: 1,
    aciklama: "Simülatör aralık kısıtını çalışma sırasında denetler ve ihlalde hata verip durur. Sentezlenmiş devrede ise denetim yoktur; sentez sonrası simülasyonda değer sadece bitlerin taşıyabildiği kadarıyla görünür.",
    dogrulama: {
      calisirken_hata: IEEE + `
entity tb is end tb;
architecture x of tb is
  signal in_giris_1 : integer range 0 to 15;
begin
  process begin
    in_giris_1 <= 20;
    wait for 1 ns;
    wait;
  end process;
end x;`,
    },
  },
  {
    id: "h4-carpim-aralik", konu: "veri-tipleri", hafta: 4, kaynak: "derived", zorluk: 3,
    ref: "Hafta 4, Hafta 4_6", tip: "fill",
    soru: "~in_giris_1 : integer range 0 to 15~ ve ~in_giris_2 : integer range 0 to 31~ için ~out_cikis_1 <= in_giris_1 * in_giris_2;~ yazılıyor. Simülasyonun hiçbir girişte aralık hatası vermemesi için ~out_cikis_1~'in aralığının üst sınırı **en az** kaç olmalıdır?",
    bosluklar: [["465"]],
    aciklama: "En büyük çarpım 15 · 31 = 465'tir. Sunumdaki ~range 0 to 511~ bu yüzden yeterlidir (9 bit). Örneğin ~0 to 255~ olsaydı büyük girişlerde simülasyon hata verirdi.",
  },
  {
    id: "h4-dizi-atama", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 3,
    ref: "Hafta 4, ARRAYS (uygun ve uygun olmayan atamalar)", tip: "mcq",
    soru: "Bildirimler:\n\n~~~vhdl\nTYPE row    IS ARRAY (7 DOWNTO 0) OF STD_LOGIC;\nTYPE array1 IS ARRAY (0 TO 3) OF row;\nTYPE array2 IS ARRAY (0 TO 3) OF STD_LOGIC_VECTOR(7 DOWNTO 0);\nTYPE array3 IS ARRAY (0 TO 3, 7 DOWNTO 0) OF STD_LOGIC;\nSIGNAL x : row;\nSIGNAL y : array1;\nSIGNAL v : array2;\nSIGNAL w : array3;\n~~~\n\nHangi atama geçerlidir?",
    secenekler: ["~x <= v(1);~", "~x <= w(2);~", "~x <= y(0);~", "~y(1) <= v(3);~"],
    dogru: 2,
    aciklama: "~y(0)~ ~row~ tipindedir ve x de ~row~'dur. ~v(1)~ ~std_logic_vector~'dür; yapısı aynı olsa da ~row~'dan farklı bir tiptir. w 2 boyutlu olduğu için ~w(2)~ gibi tek indeksle bir satır alınamaz.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture z of tb is
  type row    is array (7 downto 0) of std_logic;
  type array1 is array (0 to 3) of row;
  signal x : row;
  signal y : array1 := (others => (others => '1'));
begin
  x <= y(0);
  process begin
    wait for 1 ns;
    assert x = row'(others => '1') severity failure;
    wait;
  end process;
end z;`,
    },
  },
  {
    id: "h4-2d-erisim", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, ARRAYS (2D dizi)", tip: "mcq",
    soru: "~TYPE array3 IS ARRAY (0 TO 3, 7 DOWNTO 0) OF STD_LOGIC;~ tipindeki w sinyalinin 2. satır 1. sütundaki elemanına nasıl erişilir?",
    secenekler: ["~w(2)(1)~", "~w(2, 1)~", "~w[2][1]~", "~w(2).1~"],
    dogru: 1,
    aciklama: "Gerçek 2 boyutlu dizide tek parantez ve virgül kullanılır: ~w(2, 1)~. ~y(1)(2)~ biçimi ise dizinin dizisi (1Dx1D) içindir.",
  },
  {
    id: "h4-bellek-tipi", konu: "veri-tipleri", hafta: 4, kaynak: "derived", zorluk: 2,
    ref: "Hafta 4, ARRAYS", tip: "fill",
    soru: "Her biri 8 bitlik 16 kelimelik bir bellek tipi tanımlamak için boşluğu doldurun:\n\n~~~vhdl\ntype bellek is array (0 to 15) of ____;\n~~~",
    bosluklar: [["std_logic_vector(7 downto 0)", "std_logic_vector(0 to 7)"]],
    aciklama: "Önceden tanımlı 1Dx1D dizi tipi yoktur; önce böyle bir tip tanımlanır, sonra ~signal ram : bellek;~ ile kullanılır. Bir kelimeye ~ram(3)~, bir bite ~ram(3)(7)~ ile erişilir.",
  },
  {
    id: "h4-port-dizisi", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, PORT ARRAYS", tip: "mcq",
    soru: "Bir entity portunun vektör dizisi (örneğin 4 adet 8 bitlik vektör) olması isteniyor. Bu dizi tipi nerede tanımlanmalıdır?",
    secenekler: [
      "Entity'nin içinde, port listesinden önce",
      "Bir PACKAGE içinde; sonra ~use work.paket_adi.all;~ ile entity'ye görünür yapılır",
      "Architecture'ın bildirim bölümünde",
      "Process içinde",
    ],
    dogru: 1,
    aciklama: "Port listesi architecture'dan önce okunur, bu yüzden tip ondan önce görünür olmalıdır. Kullanıcı tipleri bir package'ta tanımlanıp USE ile tasarıma açılır.",
  },
  {
    id: "h4-shift-and-add", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 3,
    ref: "Hafta 4, Hafta 4_7 (shift_and_add)", tip: "fill",
    soru: "Hafta 4_7'deki ~shift_and_add~ devresinde ~SHIFT_AMOUNT = 2~ ve ~NEGATIVE_VAL = -5~ alınıyor. Giriş önce 2 bit sağa kaydırılıyor (boşalan yerlere 0), sonra -5 ile işaretli olarak toplanıyor. Çıkışlar 16 bitlik onaltılık olarak nedir?\n\nBoşluk 1: ~input_data = X\"0050\"~, Boşluk 2: ~input_data = X\"0004\"~",
    bosluklar: [["000F", "x\"000f\""], ["FFFC", "x\"fffc\""]],
    aciklama: "X\"0050\" = 80 → sağa 2 bit = 20 → 20 - 5 = 15 = X\"000F\". X\"0004\" = 4 → 1 → 1 - 5 = -4; 16 bitlik ikiye tümleyende -4 = X\"FFFC\".",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture z of tb is
  constant SHIFT_AMOUNT : natural := 2;
  constant NEGATIVE_VAL : integer := -5;
  function f(d : std_logic_vector(15 downto 0)) return std_logic_vector is
  begin
    return std_logic_vector(signed(std_logic_vector(shift_right(unsigned(d), SHIFT_AMOUNT)))
                            + to_signed(NEGATIVE_VAL, 16));
  end f;
begin
  process begin
    assert f(X"0050") = X"000F" severity failure;
    assert f(X"0004") = X"FFFC" severity failure;
    wait;
  end process;
end z;`,
    },
  },
  {
    id: "h4-hafta4-3-d", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 2,
    ref: "Hafta 4, Hafta4_3", tip: "fill",
    soru: "Hafta4_3 devresi:\n\n~~~vhdl\nF <= B(0) and A;\nG <= B(1) or F;\nD <= C(2) & G & C(0);\n~~~\n\nTablodaki şu satırlar için D (3 bit) nedir?\n\nBoşluk 1: A = 1, B = \"10\", C = \"010\"\n\nBoşluk 2: A = 1, B = \"00\", C = \"011\"",
    bosluklar: [vektor("010"), vektor("001")],
    aciklama: "1. satır: F = 0 and 1 = 0, G = 1 or 0 = 1, D = C(2) & G & C(0) = 0 & 1 & 0 = 010. 2. satır: F = 0, G = 0 or 0 = 0, D = 0 & 0 & 1 = 001.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture z of tb is
  function d_hesapla(A : bit; B : bit_vector(1 downto 0); C : bit_vector(2 downto 0)) return bit_vector is
    variable F, G : bit;
  begin
    F := B(0) and A;
    G := B(1) or F;
    return C(2) & G & C(0);
  end d_hesapla;
begin
  process begin
    assert d_hesapla('1', "10", "010") = "010" severity failure;
    assert d_hesapla('1', "00", "011") = "001" severity failure;
    assert d_hesapla('1', "01", "100") = "110" severity failure;
    assert d_hesapla('0', "11", "110") = "110" severity failure;
    wait;
  end process;
end z;`,
    },
  },
  {
    id: "h4-multiple-driven", konu: "veri-tipleri", hafta: 4, kaynak: "original", zorluk: 3,
    ref: "Hafta4_3 (E is multiple driven)", tip: "mcq",
    soru: "Hafta4_3'te E ~bit_vector(2 downto 0)~ tipinde bir çıkıştır ve şu iki eşzamanlı atama yapılmıştır:\n\n~~~vhdl\nE <= not H;\nE(2) <= '0';\n~~~\n\nAraç \"E is multiple driven\" hatası verir. Neden?",
    secenekler: [
      "~not~ operatörü ~bit_vector~ için tanımlı değildir",
      "E(2) biti iki ayrı eşzamanlı atama tarafından sürülüyor ve BIT çözümlenmemiş bir tiptir",
      "H sinyaline başlangıç değeri verilmemiştir",
      "Çıkış portuna sabit değer atanamaz",
    ],
    dogru: 1,
    aciklama: "Her eşzamanlı atama ayrı bir sürücüdür. İlk atama E'nin tüm bitlerini, ikincisi E(2)'yi sürer, yani E(2)'nin iki sürücüsü olur. Doğru çözüm tek atamada birleştirmektir: ~E <= '0' & not H(1 downto 0);~",
    dogrulama: {
      calisirken_hata: IEEE + `
entity tb is end tb;
architecture z of tb is
  signal H, E : bit_vector(2 downto 0);
begin
  H <= "101";
  E <= not H;
  E(2) <= '0';
end z;`,
    },
  },
  {
    id: "h4-hafta4-3-e", konu: "veri-tipleri", hafta: 4, kaynak: "derived", zorluk: 2,
    ref: "Hafta4_3", tip: "fill",
    soru: "\"E'nin MSB'sini 1 yapın\" isteği tek bir atamayla şöyle yazılıyor. ~H = \"101\"~ iken E nedir?\n\n~~~vhdl\nE <= '1' & not H(1 downto 0);\n~~~",
    bosluklar: [vektor("110")],
    aciklama: "H(1 downto 0) = 01, tersi 10. Başına '1' eklenince E = 110 olur. Tek atama olduğu için çoklu sürücü hatası da yoktur.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture z of tb is
  signal H : bit_vector(2 downto 0) := "101";
  signal E : bit_vector(2 downto 0);
begin
  E <= '1' & not H(1 downto 0);
  process begin
    wait for 1 ns;
    assert E = "110" severity failure;
    wait;
  end process;
end z;`,
    },
  },
];
