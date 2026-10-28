import { IEEE, bit, vektor, type Soru } from "./tipler.ts";

export const hafta5: Soru[] = [
  // ---------- Eşzamanlı atamalar ----------
  {
    id: "h5-with-select-mux", konu: "esz-atamalar", hafta: 5, kaynak: "original", zorluk: 1,
    ref: "Hafta 5, Hafta 5_1 (with/select ile mux)", tip: "fill",
    soru: "Bir 4'e 1 çoklayıcı (multiplexer):\n\n~~~vhdl\nwith S select\n  O <= IN_1 when \"00\",\n       IN_2 when \"01\",\n       IN_3 when \"10\",\n       IN_4 when others;\n~~~\n\n~IN_1 = \"0001\"~, ~IN_2 = \"0010\"~, ~IN_3 = \"0100\"~, ~IN_4 = \"1000\"~ ve ~S = \"10\"~ iken O nedir?",
    bosluklar: [vektor("0100")],
    aciklama: "S = \"10\" seçeneği IN_3'ü seçer.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture z of tb is
  signal IN_1 : std_logic_vector(3 downto 0) := "0001";
  signal IN_2 : std_logic_vector(3 downto 0) := "0010";
  signal IN_3 : std_logic_vector(3 downto 0) := "0100";
  signal IN_4 : std_logic_vector(3 downto 0) := "1000";
  signal S : std_logic_vector(1 downto 0) := "10";
  signal O : std_logic_vector(3 downto 0);
begin
  with S select
    O <= IN_1 when "00", IN_2 when "01", IN_3 when "10", IN_4 when others;
  process begin
    wait for 1 ns;
    assert O = "0100" severity failure;
    wait;
  end process;
end z;`,
    },
  },
  {
    id: "h5-when-else-latch", konu: "esz-atamalar", hafta: 5, kaynak: "original", zorluk: 3,
    ref: "Hafta 5, Hafta 5_2 (when/else ile mux)", tip: "mcq",
    soru: "when/else ile yazılmış bir 4'e 1 çoklayıcıda son satır da koşullu bırakılmış:\n\n~~~vhdl\nO <= IN_1 when S = \"00\" else\n     IN_2 when S = \"01\" else\n     IN_3 when S = \"10\" else\n     IN_4 when S = \"11\";\n~~~\n\nBu yazımla ilgili hangisi doğrudur?",
    secenekler: [
      "Kod derlenmez, ~when~ ile bitemez",
      "S tanımsızken (ör. \"X1\") O eski değerini korur, kilitleme oluşur",
      "S = \"11\" iken O, IN_1'i alır",
      "with/select ile tamamen aynı devreyi üretir, hiçbir fark yoktur",
    ],
    dogru: 1,
    aciklama: "VHDL-93 son koşullu dalı kabul eder, kod derlenir. Son satırı koşulsuz ~else IN_4~ yapmak daha doğrudur. Ama hiçbir koşul doğru olmadığında atama yapılmaz ve sinyal değerini saklar. Bu, kombinasyonel bir mux'ta istenmeyen bir bellek davranışıdır. Benzetimde S başlangıçta \"UU\" iken O de 'U' olarak kalır.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture z of tb is
  signal IN_1 : std_logic_vector(3 downto 0) := "0001";
  signal IN_2 : std_logic_vector(3 downto 0) := "0010";
  signal IN_3 : std_logic_vector(3 downto 0) := "0100";
  signal IN_4 : std_logic_vector(3 downto 0) := "1000";
  signal S : std_logic_vector(1 downto 0) := "01";
  signal O : std_logic_vector(3 downto 0);
begin
  O <= IN_1 when S = "00" else
       IN_2 when S = "01" else
       IN_3 when S = "10" else
       IN_4 when S = "11";
  process begin
    wait for 1 ns;
    assert O = "0010" severity failure;
    S <= "X1";
    wait for 1 ns;
    assert O = "0010" report "O eski degerini korumadi" severity failure;
    wait;
  end process;
end z;`,
    },
  },
  {
    id: "h5-oncelikli-mux-or", konu: "esz-atamalar", hafta: 5, kaynak: "original", zorluk: 3,
    ref: "Hafta 5, priority_mux örneği", tip: "mcq",
    soru: "Bir ~priority_mux~ örneği:\n\n~~~vhdl\noutput <= i3 when i3 = '1' else\n          i2 when i2 = '1' else\n          i1 when i1 = '1' else\n          i0 when i0 = '1' else\n          '0';\n~~~\n\nGirişler sadece '0' ya da '1' aldığında bu devre aslında hangi kapıya eşdeğerdir?",
    secenekler: ["4 girişli AND", "4 girişli OR", "4 girişli XOR", "i3'ü seçen bir tampon"],
    dogru: 1,
    aciklama: "Her dal, seçtiği giriş '1' iken o girişi yani '1'i verir. Hiçbiri '1' değilse '0' verilir. Sonuç, girişlerden en az biri '1' ise '1' olur, yani bir OR kapısıdır. Öncelik yapısını gerçekten kullanmak için seçim sinyalleri ile veri girişleri ayrı olmalıdır (sonraki soru).",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture z of tb is
  signal i : std_logic_vector(3 downto 0) := "0000";
  signal output : std_logic;
begin
  output <= i(3) when i(3) = '1' else
            i(2) when i(2) = '1' else
            i(1) when i(1) = '1' else
            i(0) when i(0) = '1' else
            '0';
  process begin
    for k in 0 to 15 loop
      i <= std_logic_vector(to_unsigned(k, 4));
      wait for 1 ns;
      assert output = (i(3) or i(2) or i(1) or i(0)) severity failure;
    end loop;
    wait;
  end process;
end z;`,
    },
  },
  {
    id: "h5-oncelikli-secim", konu: "esz-atamalar", hafta: 5, kaynak: "derived", zorluk: 2,
    ref: "Hafta 5, when/else önceliği", tip: "fill",
    soru: "Öncelikli seçici:\n\n~~~vhdl\ny <= d3 when s(3) = '1' else\n     d2 when s(2) = '1' else\n     d1 when s(1) = '1' else\n     d0;\n~~~\n\n~s = \"0110\"~, ~d3 = \"11\"~, ~d2 = \"10\"~, ~d1 = \"01\"~, ~d0 = \"00\"~ iken y nedir?",
    bosluklar: [vektor("10")],
    aciklama: "Koşullar yukarıdan aşağı denetlenir. s(3) = 0 olduğu için ilk dal atlanır; s(2) = 1 olduğu için d2 seçilir. s(1)'in de 1 olması önemli değildir, çünkü daha yüksek öncelikli koşul önce sağlandı.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture z of tb is
  signal s : std_logic_vector(3 downto 0) := "0110";
  signal d3 : std_logic_vector(1 downto 0) := "11";
  signal d2 : std_logic_vector(1 downto 0) := "10";
  signal d1 : std_logic_vector(1 downto 0) := "01";
  signal d0 : std_logic_vector(1 downto 0) := "00";
  signal y : std_logic_vector(1 downto 0);
begin
  y <= d3 when s(3) = '1' else d2 when s(2) = '1' else d1 when s(1) = '1' else d0;
  process begin
    wait for 1 ns;
    assert y = "10" severity failure;
    wait;
  end process;
end z;`,
    },
  },
  {
    id: "h5-with-others-zorunlu", konu: "esz-atamalar", hafta: 5, kaynak: "original", zorluk: 2,
    ref: "Hafta 5, with/select (when others)", tip: "tf",
    soru: "Seçicisi ~std_logic_vector(1 downto 0)~ olan bir ~with ... select~ ifadesinde \"00\", \"01\", \"10\" ve \"11\" yazılıp ~when others~ yazılmazsa kod derlenmez.",
    dogru: true,
    aciklama: "with/select bütün olası değerleri kapsamalıdır. ~std_logic~ 9 değerli olduğu için 2 bitlik bir vektörün 81 olası değeri vardır; dört ikilik değer yetmez. Bu yüzden ~when others~ gerekir.",
    dogrulama: {
      derlenmemeli: IEEE + `
entity tb is end tb;
architecture z of tb is
  signal S : std_logic_vector(1 downto 0);
  signal a, b, c, d, O : std_logic;
begin
  with S select
    O <= a when "00", b when "01", c when "10", d when "11";
end z;`,
    },
  },
  {
    id: "h5-select-oncelik", konu: "esz-atamalar", hafta: 5, kaynak: "original", zorluk: 2,
    ref: "Hafta 5, with/select ve when/else", tip: "mcq",
    soru: "with/select ile when/else arasındaki fark için hangisi doğrudur?",
    secenekler: [
      "with/select'te seçeneklerin sırası önemlidir, when/else'te önemli değildir",
      "with/select'te sıra önemsizdir; when/else'te koşullar yukarıdan aşağı öncelikle denetlenir",
      "İkisinde de sadece tek bir sinyal sorgulanabilir",
      "when/else sadece process içinde kullanılabilir",
    ],
    dogru: 1,
    aciklama: "with/select tek bir ifadenin değerine göre seçer, seçenekler birbirini dışlar (sentezde genelde case tabanlı mux). when/else'te ilk doğru koşul kazanır ve her koşul farklı sinyalleri sorgulayabilir (öncelikli yapı).",
  },
  {
    id: "h5-select-tekrar", konu: "esz-atamalar", hafta: 5, kaynak: "derived", zorluk: 3,
    ref: "Hafta 5, with/select", tip: "tf",
    soru: "Bir with/select ifadesinde aynı seçim değeri iki kez yazılırsa ilk yazılan geçerli olur.",
    dogru: false,
    aciklama: "with/select'te seçenekler birbirini dışlamak zorundadır; aynı değerin iki kez yazılması derleme hatasıdır. \"İlk eşleşen kazanır\" mantığı when/else'e aittir.",
    dogrulama: {
      derlenmemeli: IEEE + `
entity tb is end tb;
architecture z of tb is
  signal S : std_logic_vector(1 downto 0);
  signal a, b, c, O : std_logic;
begin
  with S select
    O <= a when "00", b when "00", c when others;
end z;`,
    },
  },
  {
    id: "h5-others-hepsi", konu: "esz-atamalar", hafta: 5, kaynak: "original", zorluk: 1,
    ref: "Hafta 5, others kullanarak sinyal değeri atama", tip: "fill",
    soru: "~signal sinyal_2 : std_logic_vector(3 downto 0);~ için ~sinyal_2 <= (others => '1');~ sonrası sinyal_2 nedir?",
    bosluklar: [vektor("1111")],
    aciklama: "~others~ belirtilmeyen tüm elemanları kapsar. Vektörün genişliğinden bağımsız olduğu için sıfırlama ve doldurmada çok kullanılır.",
  },
  {
    id: "h5-others-karisik", konu: "esz-atamalar", hafta: 5, kaynak: "derived", zorluk: 2,
    ref: "Hafta 5, others kullanarak sinyal değeri atama", tip: "fill",
    soru: "~signal x : std_logic_vector(7 downto 0);~ için ~x <= (7 => '1', 0 => '1', others => '0');~ sonrası x nedir?",
    bosluklar: [vektor("10000001")],
    aciklama: "7 ve 0 indeksli bitler 1, geri kalanlar 0 olur. ~7 downto 0~ aralığında 7 en soldadır.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture z of tb is
  signal x : std_logic_vector(7 downto 0);
begin
  x <= (7 => '1', 0 => '1', others => '0');
  process begin
    wait for 1 ns;
    assert x = "10000001" severity failure;
    wait;
  end process;
end z;`,
    },
  },
  {
    id: "h5-kosullu-z", konu: "esz-atamalar", hafta: 5, kaynak: "original", zorluk: 2,
    ref: "Hafta 5, Şartlı sinyal atamaları", tip: "fill",
    soru: "Şu şartlı atama verilmiş:\n\n~~~vhdl\nsinyal_cikis <= sinyal_1 when sinyal_secme = '0'\n           else sinyal_2 when sinyal_secme = '1'\n           else '0';\n~~~\n\n~sinyal_1 = '1'~, ~sinyal_2 = '1'~ ve ~sinyal_secme = 'Z'~ iken sinyal_cikis nedir?",
    bosluklar: [bit("0")],
    aciklama: "'Z' ne '0' ne de '1''e eşittir, bu yüzden iki koşul da yanlıştır ve son ~else~ dalı '0' verir.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture z of tb is
  signal sinyal_1, sinyal_2 : std_logic := '1';
  signal sinyal_secme : std_logic := 'Z';
  signal sinyal_cikis : std_logic;
begin
  sinyal_cikis <= sinyal_1 when sinyal_secme = '0'
             else sinyal_2 when sinyal_secme = '1'
             else '0';
  process begin
    wait for 1 ns;
    assert sinyal_cikis = '0' severity failure;
    wait;
  end process;
end z;`,
    },
  },
  {
    id: "h5-secilmis-x", konu: "esz-atamalar", hafta: 5, kaynak: "derived", zorluk: 2,
    ref: "Hafta 5, Seçilmiş sinyal atama", tip: "fill",
    soru: "Şu seçilmiş atama verilmiş:\n\n~~~vhdl\nwith sinyal_secme select\n  sinyal_sonuc <= sinyal_1 when '0',\n                  sinyal_2 when others;\n~~~\n\n~sinyal_1 = '1'~, ~sinyal_2 = '0'~ ve ~sinyal_secme = 'X'~ iken sinyal_sonuc nedir?",
    bosluklar: [bit("0")],
    aciklama: "'X' değeri '0' seçeneğine uymaz, ~others~ dalına düşer ve sinyal_2 = '0' seçilir.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture z of tb is
  signal sinyal_1 : std_logic := '1';
  signal sinyal_2 : std_logic := '0';
  signal sinyal_secme : std_logic := 'X';
  signal sinyal_sonuc : std_logic;
begin
  with sinyal_secme select
    sinyal_sonuc <= sinyal_1 when '0', sinyal_2 when others;
  process begin
    wait for 1 ns;
    assert sinyal_sonuc = '0' severity failure;
    wait;
  end process;
end z;`,
    },
  },

  // ---------- Sıralı kod ----------
  {
    id: "h5-process-tetik", konu: "sirali-kod", hafta: 5, kaynak: "original", zorluk: 1,
    ref: "Hafta 5, Sıralı söz dizimleri", tip: "tf",
    soru: "Hassasiyet listesi olan bir process, listedeki sinyallerden biri değiştiğinde çalışır.",
    dogru: true,
    aciklama: "Process tetiklenince baştan sona çalışır ve sonra listedeki bir sinyal yeniden değişene kadar bekler.",
  },
  {
    id: "h5-eksik-hassasiyet", konu: "sirali-kod", hafta: 5, kaynak: "derived", zorluk: 3,
    ref: "Hafta 5, Hafta 5_3 (hassasiyet listesi sadece in_giris_3)", tip: "fill",
    soru: "Aşağıdaki process'in hassasiyet listesinde sadece ~c~ var:\n\n~~~vhdl\nprocess (c)\nbegin\n  y <= (a and b) or c;\nend process;\n~~~\n\nGirişler 10 ns arayla şu sırayla veriliyor (a, b, c):\n\n~~~\n1. adım: 0 1 1\n2. adım: 1 0 0\n3. adım: 1 1 0\n4. adım: 0 1 0\n5. adım: 1 0 1\n~~~\n\nBoşluk 1: 3. adımda y kaçtır?\n\nBoşluk 2: Hassasiyet listesi ~(a, b, c)~ olsaydı 3. adımda y kaç olurdu?",
    bosluklar: [bit("0"), bit("1")],
    aciklama: "2. adımda c 1'den 0'a değişir, process çalışır ve y = 0 olur. 3. adımda a ve b değişir ama c değişmez, process çalışmaz ve y 0'da kalır. Tam listeyle (1 and 1) or 0 = 1 olurdu. Sentez araçları hassasiyet listesini genelde yok sayıp kombinasyonel devre kurduğu için bu, simülasyon ile donanımın farklı davranmasına yol açar.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture z of tb is
  signal a, b, c : std_logic := '0';
  signal y, y_tam : std_logic;
begin
  process (c) begin
    y <= (a and b) or c;
  end process;
  process (a, b, c) begin
    y_tam <= (a and b) or c;
  end process;
  process begin
    a <= '0'; b <= '1'; c <= '1'; wait for 10 ns;
    assert y = '1' severity failure;
    a <= '1'; b <= '0'; c <= '0'; wait for 10 ns;
    assert y = '0' severity failure;
    a <= '1'; b <= '1'; c <= '0'; wait for 10 ns;
    assert y = '0' and y_tam = '1' severity failure;
    a <= '0'; b <= '1'; c <= '0'; wait for 10 ns;
    assert y = '0' severity failure;
    a <= '1'; b <= '0'; c <= '1'; wait for 10 ns;
    assert y = '1' severity failure;
    wait;
  end process;
end z;`,
    },
  },
  {
    id: "h5-if-oncelik", konu: "sirali-kod", hafta: 5, kaynak: "derived", zorluk: 2,
    ref: "Hafta 5, If söz dizimi", tip: "mcq",
    soru: "~a = '1'~ ve ~b = '1'~ iken aşağıdaki process sonunda y ne olur?\n\n~~~vhdl\nprocess (a, b)\nbegin\n  if a = '1' then\n    y <= \"01\";\n  elsif b = '1' then\n    y <= \"10\";\n  else\n    y <= \"00\";\n  end if;\nend process;\n~~~",
    secenekler: ["~\"01\"~", "~\"10\"~", "~\"11\"~", "~\"00\"~"],
    dogru: 0,
    aciklama: "if/elsif zincirinde ilk doğru koşulun dalı çalışır, diğerlerine bakılmaz. a = '1' olduğu için y = \"01\".",
  },
  {
    id: "h5-case-others", konu: "sirali-kod", hafta: 5, kaynak: "original", zorluk: 2,
    ref: "Hafta 5, Case söz dizimi", tip: "tf",
    soru: "~std_logic_vector(1 downto 0)~ üzerinde bir ~case~ ifadesinde \"00\", \"01\", \"10\" ve \"11\" seçenekleri yazıldıysa ~when others~ gerekmez.",
    dogru: false,
    aciklama: "case de with/select gibi tüm olası değerleri kapsamalıdır. ~std_logic~'in 'U', 'X', 'Z' gibi değerleri yüzünden ~when others~ zorunludur.",
    dogrulama: {
      derlenmemeli: IEEE + `
entity tb is end tb;
architecture z of tb is
  signal s : std_logic_vector(1 downto 0);
  signal y : std_logic;
begin
  process (s) begin
    case s is
      when "00" => y <= '0';
      when "01" => y <= '1';
      when "10" => y <= '1';
      when "11" => y <= '0';
    end case;
  end process;
end z;`,
    },
  },
  {
    id: "h5-case-sinyal", konu: "sirali-kod", hafta: 5, kaynak: "derived", zorluk: 2,
    ref: "Hafta 5, Case söz dizimi", tip: "tf",
    soru: "~case~ ifadesinde ~when~ seçeneği olarak bir sinyal kullanılabilir (ör. ~when b =>~).",
    dogru: false,
    aciklama: "case seçenekleri sabit (yerel statik) değerler olmalıdır: ~when \"01\" =>~, ~when 3 =>~, bir ~constant~ ya da ~when others =>~. Değişken bir değerle karşılaştırma gerekiyorsa if/elsif kullanılır.",
    dogrulama: {
      derlenmemeli: IEEE + `
entity tb is end tb;
architecture z of tb is
  signal s, b : std_logic_vector(1 downto 0);
  signal y : std_logic;
begin
  process (s, b) begin
    case s is
      when b => y <= '1';
      when others => y <= '0';
    end case;
  end process;
end z;`,
    },
  },
  {
    id: "h5-for-sayi", konu: "sirali-kod", hafta: 5, kaynak: "original", zorluk: 1,
    ref: "Hafta 5, Loop söz dizimi", tip: "fill",
    soru: "~for i in 7 downto 0 loop~ döngüsü kaç kez çalışır?",
    bosluklar: [["8"]],
    aciklama: "7, 6, 5, 4, 3, 2, 1, 0: sekiz tur. Döngü değişkeni i ayrıca bildirilmez ve döngü içinde değiştirilemez.",
  },
  {
    id: "h5-arama-modulu", konu: "sirali-kod", hafta: 5, kaynak: "original", zorluk: 3,
    ref: "Hafta 5, VHDL arama modülü tasarımı", tip: "fill",
    soru: "Arama modülü için yazılmış bir çözüm:\n\n~~~vhdl\nprocess (input16, input4)\n  variable idx : integer;\nbegin\n  idx := 0;\n  for i in 15 downto 3 loop\n    if input16(i downto i-3) = input4 then\n      idx := i;\n      exit;\n    end if;\n  end loop;\n  konum <= idx;\nend process;\n~~~\n\n~input16 = X\"1A5A\"~ (0001 1010 0101 1010) iken konum kaç olur?\n\nBoşluk 1: ~input4 = \"1010\"~, Boşluk 2: ~input4 = \"1111\"~",
    bosluklar: [["11"], ["0"]],
    aciklama: "Arama MSB tarafından başlar. i=15: 0001, i=14: 0011, i=13: 0110, i=12: 1101, i=11: 1010 eşleşir ve ~exit~ döngüden çıkar, konum = 11. \"1111\" hiçbir 4 bitlik pencerede yoktur, idx başlangıç değeri 0 kalır.",
    dogrulama: {
      calismali: IEEE + `
entity tb is end tb;
architecture z of tb is
  function ara(input16 : std_logic_vector(15 downto 0); input4 : std_logic_vector(3 downto 0)) return integer is
    variable idx : integer;
  begin
    idx := 0;
    for i in 15 downto 3 loop
      if input16(i downto i-3) = input4 then
        idx := i;
        exit;
      end if;
    end loop;
    return idx;
  end ara;
begin
  process begin
    assert ara(X"1A5A", "1010") = 11 severity failure;
    assert ara(X"1A5A", "1111") = 0 severity failure;
    wait;
  end process;
end z;`,
    },
  },
  {
    id: "h5-for-statik", konu: "sirali-kod", hafta: 5, kaynak: "derived", zorluk: 2,
    ref: "Hafta 5, Loop söz dizimi", tip: "tf",
    soru: "Sentezlenebilir bir ~for~ döngüsünün aralığı derleme zamanında bilinen sabit değerler olmalıdır.",
    dogru: true,
    aciklama: "Sentez aracı döngüyü açarak (her tur için ayrı donanım) devre kurar. Bu yüzden tur sayısı sabit olmalıdır. Aralığı bir giriş sinyaline bağlı döngüler sentezlenemez.",
  },
  {
    id: "h5-variable-yeri", konu: "sirali-kod", hafta: 5, kaynak: "original", zorluk: 1,
    ref: "Hafta 5, Sıralı söz dizimleri (process yapısı)", tip: "mcq",
    soru: "Bir process içinde kullanılacak variable nerede tanımlanır?",
    secenekler: [
      "Process'in ~begin~ satırından sonra",
      "~process (...)~ satırı ile ~begin~ arasında",
      "Architecture'ın ~begin~ satırından sonra",
      "Entity'nin port listesinde",
    ],
    dogru: 1,
    aciklama: "Process'in bildirim bölümü ~process (...)~ ile ~begin~ arasıdır; variable, constant ve process'e özel tipler burada tanımlanır.",
  },
  {
    id: "h5-wait-liste", konu: "sirali-kod", hafta: 5, kaynak: "derived", zorluk: 3,
    ref: "Hafta 5, Sıralı söz dizimleri (wait)", tip: "tf",
    soru: "Hassasiyet listesi olan bir process içinde ~wait~ ifadesi de kullanılabilir.",
    dogru: false,
    aciklama: "Bir process ya hassasiyet listesiyle ya da ~wait~ ifadeleriyle askıya alınır, ikisi birlikte kullanılamaz. Testbench'lerdeki listesiz process'ler bu yüzden ~wait for 10 ns;~ gibi satırlar içerir.",
    dogrulama: {
      derlenmemeli: IEEE + `
entity tb is end tb;
architecture z of tb is
  signal a, y : std_logic;
begin
  process (a) begin
    y <= a;
    wait for 1 ns;
  end process;
end z;`,
    },
  },
];
