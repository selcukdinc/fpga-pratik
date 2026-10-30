import { IEEE, bit, vektor, type Soru } from "./tipler.ts";

// Testbench gövdesi: bildirimler, eşzamanlı deyimler ve denetleyen process
const tb = (bildirim: string, eszamanli: string, govde: string, degisken = "") => ({
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

// Ödül kodunu üreten devre; KOSUL "< 10" ya da "<= 10"
const odul = (kosul = "< 10") => `
entity race_results is
  port (
    finish_time : in  integer;
    ranking     : in  integer;
    award_code  : out std_logic_vector(2 downto 0)
  );
end race_results;
architecture rtl of race_results is
begin
  process (finish_time, ranking)
  begin
    if finish_time ${kosul} then
      award_code <= "111";
    else
      case ranking is
        when 1 => award_code <= "001";
        when 2 => award_code <= "010";
        when 3 => award_code <= "011";
        when 4 => award_code <= "100";
        when 5 => award_code <= "101";
        when others => award_code <= "110";
      end case;
    end if;
  end process;
end rtl;
`;

// Ödül devresini verilen girişlerle sınayan testbench
const odulSinama = (kosul: string, sure: number, sira: number, beklenen: string) => ({
  calismali: `${IEEE}${odul(kosul)}
library ieee;
use ieee.std_logic_1164.all;
entity tb is end tb;
architecture z of tb is
  signal t, r : integer := 0;
  signal k : std_logic_vector(2 downto 0);
begin
  uut : entity work.race_results port map (finish_time => t, ranking => r, award_code => k);
  process begin
    t <= ${sure}; r <= ${sira};
    wait for 1 ns;
    assert k = "${beklenen}" severity failure;
    wait;
  end process;
end z;`,
});

const ODUL_KOD = `~~~vhdl
process (finish_time, ranking)
begin
  if finish_time < 10 then
    award_code <= "111";
  else
    case ranking is
      when 1 => award_code <= "001";
      when 2 => award_code <= "010";
      when 3 => award_code <= "011";
      when 4 => award_code <= "100";
      when 5 => award_code <= "101";
      when others => award_code <= "110";
    end case;
  end if;
end process;
~~~`;

const SECICI = `~~~vhdl
process (in_clk)
begin
  if rising_edge(in_clk) then
    if in_giris_secme = '0' then
      out_cikis <= in_giris_1;
    else
      out_cikis <= in_giris_2;
    end if;
  end if;
end process;
~~~`;

export const hafta6: Soru[] = [
  // ---------- Saat darbesi ve kenarlar ----------
  {
    id: "h6-saat-frekans", konu: "saat-kenar", hafta: 6, kaynak: "derived", zorluk: 1, kavram: "saat-periyot",
    ref: "Hafta 6, Saat darbesi kullanımı", tip: "fill",
    soru: "Periyodu 40 ns olan bir saat darbesinin frekansı kaç MHz'dir?",
    bosluklar: [["25", "25 MHz", "25MHz"]],
    aciklama: "f = 1 / T. Periyot ns cinsindeyken frekans MHz cinsinden 1000 / T olur: 1000 / 40 = 25 MHz.",
  },
  {
    id: "h6-tb-yari-periyot", konu: "saat-kenar", hafta: 6, kaynak: "derived", zorluk: 2, kavram: "saat-periyot",
    ref: "Hafta 6, Saat darbesi kullanımı", tip: "fill",
    soru: "Bir testbench'te saat şöyle üretiliyor:\n\n~~~vhdl\nsignal clk : std_logic := '0';\n...\nclk <= not clk after 4 ns;\n~~~\n\nBu saatin periyodu kaç ns'dir?",
    bosluklar: [["8", "8 ns", "8ns"]],
    aciklama: "~after~'daki süre yarım periyottur: sinyal her 4 ns'de bir kez değişir. Bir periyot bir yüksek ve bir alçak süreden oluştuğu için T = 2 · 4 = 8 ns.",
    dogrulama: tb(
      "  signal clk : std_logic := '0';",
      "  clk <= not clk after 4 ns when now < 100 ns;",
      "    wait until rising_edge(clk);\n    t1 := now;\n    wait until rising_edge(clk);\n    assert now - t1 = 8 ns severity failure;",
      "    variable t1 : time;",
    ),
  },
  {
    id: "h6-kenar-sozdizimi", konu: "saat-kenar", hafta: 6, kaynak: "original", zorluk: 1, kavram: "kenar-tetikleme",
    ref: "Hafta 6, Saat darbesi kullanımı", tip: "mcq",
    soru: "~in_clk~ sinyalinin **düşen** kenarında koşul ifadelerini çalıştıran ~if~ koşulu hangisidir?",
    secenekler: [
      "~in_clk'event and in_clk = '1'~",
      "~in_clk'event and in_clk = '0'~",
      "~rising_edge(in_clk)~",
      "~in_clk = '0'~",
    ],
    dogru: 1,
    aciklama: "~'event~ sinyalin o anda değiştiğini, ~in_clk = '0'~ yeni değerin 0 olduğunu söyler: 1'den 0'a geçiş. Aynı işi ~falling_edge(in_clk)~ de yapar. ~in_clk = '0'~ tek başına bir kenar değil, bir seviyedir.",
  },
  {
    id: "h6-rising-esdeger", konu: "saat-kenar", hafta: 6, kaynak: "original", zorluk: 1, kavram: "kenar-tetikleme",
    ref: "Hafta 6, Saat darbesi kullanımı", tip: "tf",
    soru: "~if in_clk'event and in_clk = '1' then~ ve ~if rising_edge(in_clk) then~ yazımlarının ikisi de ~in_clk~ 0'dan 1'e geçtiğinde koşul ifadelerini çalıştırır.",
    dogru: true,
    aciklama: "İkisi de 0'dan 1'e geçişte doğrudur ve sentezde aynı flip-flop'u üretir. Fark yalnızca 'X' ya da 'U'dan 1'e gibi geçişlerde ortaya çıkar: ~rising_edge~ bunları kenar saymaz.",
    dogrulama: tb(
      "  signal clk : std_logic := '0';\n  signal a, b : integer := 0;",
      "  clk <= not clk after 5 ns when now < 100 ns;\n  process (clk) begin\n    if clk'event and clk = '1' then a <= a + 1; end if;\n    if rising_edge(clk) then b <= b + 1; end if;\n  end process;",
      "    wait for 101 ns;\n    assert a = 10 and b = 10 severity failure;",
    ),
  },
  {
    id: "h6-x-gecis", konu: "saat-kenar", hafta: 6, kaynak: "derived", zorluk: 3, kavram: "kenar-tetikleme",
    ref: "Hafta 6, Saat darbesi kullanımı", tip: "mcq",
    soru: "Bir ~std_logic~ saat sinyali ~'X'~ değerinden ~'1'~'e geçiyor. Bu anda hangi koşul doğrudur?",
    secenekler: [
      "Yalnızca ~clk'event and clk = '1'~",
      "Yalnızca ~rising_edge(clk)~",
      "İkisi de",
      "Hiçbiri",
    ],
    dogru: 0,
    aciklama: "~clk'event and clk = '1'~ önceki değere bakmaz; sinyal değişti ve yeni değer 1, koşul doğrudur. ~rising_edge~ önceki değerin '0' (ya da 'L') olmasını da ister; 'X'ten gelen geçişi kenar saymaz.",
    dogrulama: tb(
      "  signal clk : std_logic := 'X';\n  signal a, b : integer := 0;",
      "  process (clk) begin\n    if clk'event and clk = '1' then a <= a + 1; end if;\n    if rising_edge(clk) then b <= b + 1; end if;\n  end process;",
      "    wait for 1 ns;\n    clk <= '1';\n    wait for 1 ns;\n    assert a = 1 and b = 0 severity failure;",
    ),
  },
  {
    id: "h6-dusen-secici", konu: "saat-kenar", hafta: 6, kaynak: "original", zorluk: 2, kavram: "kenar-tetikleme",
    ref: "Hafta 6, Sinyal seçme", tip: "mcq",
    soru: `Kayıtlı bir seçici:\n\n${SECICI}\n\n~rising_edge(in_clk)~ yerine ~falling_edge(in_clk)~ yazılırsa ne değişir?`,
    secenekler: [
      "Kod derlenmez; ~falling_edge~ yalnızca testbench'te kullanılabilir",
      "Girişler düşen kenarlarda örneklenir; çıkış yarım periyot kayar",
      "~out_cikis~ saatten bağımsız, kombinasyonel bir çıkış olur",
      "Hiçbir şey değişmez; iki yazım aynı anlarda çalışır",
    ],
    dogru: 1,
    aciklama: "Devre yine bir flip-flop'tur, yalnızca örnekleme anları yarım periyot kayar. Yavaş değişen girişlerde çıkış aynı değerleri yarım periyot önce ya da sonra gösterir; iki kenar arasında başlayıp biten kısa bir olayı ise yalnızca o sırada gelen kenar görür.",
  },
  {
    id: "h6-secici-deger", konu: "saat-kenar", hafta: 6, kaynak: "original", zorluk: 3, kavram: "kenar-tetikleme",
    ref: "Hafta 6, Sinyal seçme", tip: "fill",
    soru: `Kayıtlı bir seçici:\n\n${SECICI}\n\n~in_clk~ 0'dan başlıyor ve ~in_clk <= not in_clk after 10 ns;~ ile sürülüyor. ~in_giris_1 = '1'~ ve ~in_giris_2 = '0'~ sabit; ~in_giris_secme~ 0'dan başlıyor ve 25 ns'de 1 oluyor.\n\n35 ns'de ~out_cikis~ (1) bu kodla, (2) ~rising_edge~ yerine ~falling_edge~ yazılmış haliyle kaçtır?`,
    bosluklar: [bit("0"), bit("1")],
    aciklama: "T = 20 ns: yükselen kenarlar 10, 30 ns'de; düşen kenarlar 20, 40 ns'de. (1) 30 ns'deki yükselen kenarda seçme 1'dir, out_cikis giris_2'yi (0) alır. (2) Son düşen kenar 20 ns'dedir; o anda seçme hâlâ 0'dır ve out_cikis giris_1'i (1) tutar. Bir sonraki düşen kenar 40 ns'de gelir.",
    dogrulama: tb(
      "  signal clk : std_logic := '0';\n  signal g1 : std_logic := '1';\n  signal g2 : std_logic := '0';\n  signal sec : std_logic := '0';\n  signal y_r, y_d : std_logic;",
      "  clk <= not clk after 10 ns when now < 100 ns;\n  sec <= '1' after 25 ns;\n  process (clk) begin\n    if rising_edge(clk) then\n      if sec = '0' then y_r <= g1; else y_r <= g2; end if;\n    end if;\n    if falling_edge(clk) then\n      if sec = '0' then y_d <= g1; else y_d <= g2; end if;\n    end if;\n  end process;",
      "    wait for 35 ns;\n    assert y_r = '0' and y_d = '1' severity failure;",
    ),
  },
  {
    id: "h6-cift-kenar", konu: "saat-kenar", hafta: 6, kaynak: "derived", zorluk: 2, kavram: "kenar-tetikleme",
    ref: "Hafta 6, Saat darbesi kullanımı", tip: "tf",
    soru: "~if clk'event then q <= d; end if;~ (değer koşulu olmadan) iki kenarda da çalışan bir yapı tarif eder ve FPGA'da sıradan bir D flip-flop olarak sentezlenir.",
    dogru: false,
    aciklama: "~'event~ yön bilgisi taşımaz; koşul hem yükselen hem düşen kenarda doğrudur. FPGA'daki flip-flop'lar tek bir kenarla tetiklenir, bu yüzden bu yazım sıradan bir D flip-flop olarak sentezlenmez. Yön ~clk = '1'~ ya da ~clk = '0'~ ile ya da ~rising_edge~ / ~falling_edge~ ile verilmelidir.",
  },

  // ---------- Sayıcılar ----------
  {
    id: "h6-sayac-rtl", konu: "sayicilar", hafta: 6, kaynak: "original", zorluk: 1, kavram: "sayac-yapisi",
    ref: "Hafta 6, Sayıcı", tip: "mcq",
    soru: "Her yükselen kenarda ~counter_reg <= counter_reg + 1;~ çalıştıran 4 bitlik bir sayıcının RTL şemasında hangi bloklar görülür?",
    secenekler: [
      "Bir toplayıcı ve çıkışı toplayıcıya geri beslenen bir kayıtçı",
      "Bir çoklayıcı ve seçim girişini süren bir latch",
      "Bir karşılaştırıcı ve çıkışını çözen bir kod çözücü",
      "Saatle sürülen dört AND kapısı ve bir OR kapısı",
    ],
    dogru: 0,
    aciklama: "Kayıtçı (dört D flip-flop) sayıyı tutar; toplayıcı kayıtçının çıkışına 1 ekler ve sonucu kayıtçının girişine verir. Bir sonraki kenarda kayıtçı yeni değeri yükler. Çıkış bu geri besleme döngüsünden alınır.",
  },
  {
    id: "h6-sayac-out-okuma", konu: "sayicilar", hafta: 6, kaynak: "original", zorluk: 2, kavram: "sayac-yapisi",
    ref: "Hafta 6, Sayıcı", tip: "mcq",
    soru: "VHDL-93 ile derlenen bir sayıcı:\n\n~~~vhdl\nentity sayac is\n  port (clk : in std_logic;\n        count : out std_logic_vector(3 downto 0));\nend sayac;\narchitecture rtl of sayac is\nbegin\n  process (clk)\n  begin\n    if rising_edge(clk) then\n      if count = \"1001\" then\n        count <= \"0000\";\n      else\n        count <= std_logic_vector(unsigned(count) + 1);\n      end if;\n    end if;\n  end process;\nend rtl;\n~~~\n\nBu kod neden derlenmez?",
    secenekler: [
      "~out~ modundaki ~count~ mimari içinde okunamaz",
      "~unsigned~ bir değere 1 eklenemez",
      "~rising_edge~ yalnızca ~std_ulogic~ ile kullanılabilir",
      "Hassasiyet listesinde ~count~ yok",
    ],
    dogru: 0,
    aciklama: "Karşılaştırma ve sağ taraf ~count~'u okuyor; VHDL-93'te ~out~ port okunamaz. Doğrusu sayımı iç bir ~unsigned~ sinyalde yapıp ~count <= std_logic_vector(sayi);~ ile dışarı vermektir. Portu ~inout~ yapmak da derlenir ama önerilmez.",
    dogrulama: {
      derlenmemeli: IEEE + `
entity sayac is
  port (clk : in std_logic;
        count : out std_logic_vector(3 downto 0));
end sayac;
architecture rtl of sayac is
begin
  process (clk)
  begin
    if rising_edge(clk) then
      if count = "1001" then
        count <= "0000";
      else
        count <= std_logic_vector(unsigned(count) + 1);
      end if;
    end if;
  end process;
end rtl;
entity tb is end tb;
architecture z of tb is
begin
end z;`,
    },
  },
  {
    id: "h6-std-logic-unsigned", konu: "sayicilar", hafta: 6, kaynak: "original", zorluk: 2, kavram: "sayac-yapisi",
    ref: "Hafta 6, Sayıcı", tip: "mcq",
    soru: "Bir sayıcı şöyle yazılmış:\n\n~~~vhdl\nuse ieee.std_logic_unsigned.all;\n...\ncount : inout std_logic_vector(3 downto 0) := (others => '0');\n...\nif rising_edge(clk) then\n  count <= count + 1;\nend if;\n~~~\n\nHangisi doğrudur?",
    secenekler: [
      "~std_logic_unsigned~ bir IEEE standardı değildir; önerilen yol ~numeric_std~ ve iç bir ~unsigned~ sinyaldir",
      "~inout~ zorunludur; bir sayıcı başka türlü yazılamaz",
      "Bu sayıcı 15'ten sonra 0'a dönmez, 16'ya çıkar",
      "Bu yazım sentezde toplayıcı üretmez, yalnızca benzetimde çalışır",
    ],
    dogru: 0,
    aciklama: "Kod çalışır ve aynı toplayıcı + kayıtçıyı üretir; 4 bit 15'ten sonra 0'a sarar. Ama ~std_logic_unsigned~ standart dışıdır ve ~numeric_std~ ile çakışabilir. ~inout~ de yalnızca port okunabilsin diye seçilmiştir; iki yönlü bir hat değildir. İç bir ~unsigned~ sinyal ve ~numeric_std~ aynı işi standart biçimde yapar.",
  },
  {
    id: "h6-sayac-periyot", konu: "sayicilar", hafta: 6, kaynak: "derived", zorluk: 2, kavram: "sayac-yapisi",
    ref: "Hafta 6, Sayıcı", tip: "fill",
    soru: "3 bitlik bir sayıcı 25 ns periyotlu bir saatle sayıyor: 0'dan 7'ye, sonra yeniden 0'dan. Dalga ekranında analog gösterimle görülen testere dişinin periyodu kaç ns'dir?",
    bosluklar: [["200", "200 ns", "200ns"]],
    aciklama: "3 bit 2³ = 8 değer dolaşır; her değer bir saat periyodu sürer. Periyot 8 · 25 = 200 ns.",
    dogrulama: tb(
      "  signal clk : std_logic := '0';\n  signal q : unsigned(2 downto 0) := \"000\";",
      "  clk <= not clk after 12.5 ns when now < 1 us;\n  process (clk) begin\n    if rising_edge(clk) then q <= q + 1; end if;\n  end process;",
      "    wait until q = 0 and q'event;\n    t1 := now;\n    wait until q = 0 and q'event;\n    assert now - t1 = 200 ns severity failure;",
      "    variable t1 : time;",
    ),
  },
  {
    id: "h6-mod12-bit", konu: "sayicilar", hafta: 6, kaynak: "original", zorluk: 1, kavram: "mod-n-sayac",
    ref: "Hafta 6, Soru 4", tip: "fill",
    soru: "0-11 arası sayan bir sayıcının çıkışı en az kaç bit olmalıdır?",
    bosluklar: [["4"]],
    aciklama: "En büyük değer 11'dir. 3 bit 0..7'yi tutar ve yetmez; 4 bit 0..15'i tutar. 12..15 değerlerine hiç uğranmaz.",
  },
  {
    id: "h6-mod12-deger", konu: "sayicilar", hafta: 6, kaynak: "original", zorluk: 2, kavram: "mod-n-sayac",
    ref: "Hafta 6, Soru 4", tip: "fill",
    soru: "0'dan 11'e sayıp yeniden 0'a dönen bir sayıcı 0'dan başlıyor; reset hep 0. 30 yükselen kenardan sonra sayıcı kaç gösterir (ondalık)?",
    bosluklar: [["6"]],
    aciklama: "Sayıcının 12 durumu vardır; her 12 kenarda bir başa döner. 30 = 2 · 12 + 6, yani iki tam tur ve 6 kenar: 6.",
    dogrulama: tb(
      "  signal clk : std_logic := '0';\n  signal q : unsigned(3 downto 0) := \"0000\";",
      "  process (clk) begin\n    if rising_edge(clk) then\n      if q = 11 then q <= (others => '0'); else q <= q + 1; end if;\n    end if;\n  end process;",
      "    for i in 1 to 30 loop\n      clk <= '1'; wait for 1 ns; clk <= '0'; wait for 1 ns;\n    end loop;\n    assert q = 6 severity failure;",
    ),
  },
  {
    id: "h6-mod12-reset", konu: "sayicilar", hafta: 6, kaynak: "original", zorluk: 2, kavram: "mod-n-sayac",
    ref: "Hafta 6, Soru 4", tip: "mcq",
    soru: "0-11 arası sayan bir sayıcı isteniyor: reset girişi ~'1'~ iken sayıcı sıfırlanmalı ve çıkış sıfır kalmalı; sayma yalnızca reset ~'0'~ iken ve saatin yükselen kenarında olmalı. ~sayi : unsigned(3 downto 0)~ için doğru process hangisidir?",
    secenekler: [
      "~process (clk) begin if rising_edge(clk) then if sayi = 12 then sayi <= (others => '0'); else sayi <= sayi + 1; end if; end if; end process;~",
      "~process (clk, rst) begin if rst = '1' then sayi <= (others => '0'); elsif rising_edge(clk) then if sayi = 11 then sayi <= (others => '0'); else sayi <= sayi + 1; end if; end if; end process;~",
      "~process (clk, rst) begin if rst = '1' then sayi <= (others => '0'); elsif rising_edge(clk) then if sayi = 12 then sayi <= (others => '0'); else sayi <= sayi + 1; end if; end if; end process;~",
      "~process (clk, rst) begin if rst = '0' then sayi <= (others => '0'); elsif rising_edge(clk) then if sayi = 11 then sayi <= (others => '0'); else sayi <= sayi + 1; end if; end if; end process;~",
    ],
    dogru: 1,
    aciklama: "Reset sayma koşulundan önce denetlenir ve 1 iken sayıyı sıfırda tutar. Son değer 11 olduğu için karşılaştırma 11 ile yapılır; 12 ile yapılsaydı sayıcı 0..12 arası 13 durum sayardı. Birinci seçenekte reset yok, dördüncüde reset tersine bağlı: rst = '0' iken sıfırlar.",
    dogrulama: tb(
      "  signal clk : std_logic := '0';\n  signal rst : std_logic := '1';\n  signal sayi : unsigned(3 downto 0);",
      "  process (clk, rst) begin\n    if rst = '1' then sayi <= (others => '0');\n    elsif rising_edge(clk) then\n      if sayi = 11 then sayi <= (others => '0'); else sayi <= sayi + 1; end if;\n    end if;\n  end process;",
      "    for i in 1 to 3 loop\n      clk <= '1'; wait for 1 ns; clk <= '0'; wait for 1 ns;\n    end loop;\n    assert sayi = 0 report \"reset tutmadi\" severity failure;\n    rst <= '0';\n    for i in 1 to 11 loop\n      clk <= '1'; wait for 1 ns; clk <= '0'; wait for 1 ns;\n    end loop;\n    assert sayi = 11 severity failure;\n    clk <= '1'; wait for 1 ns; clk <= '0'; wait for 1 ns;\n    assert sayi = 0 report \"11'den sonra donmedi\" severity failure;",
    ),
  },
  {
    id: "h6-saat-bolme", konu: "sayicilar", hafta: 6, kaynak: "derived", zorluk: 2, kavram: "saat-bolme",
    ref: "Hafta 6, Sayıcı", tip: "fill",
    soru: "50 MHz'lik bir saatten 1 kHz hızında gelen bir tik (saat etkinleştirme) üretilecek. Mod-N sayıcının N değeri kaç olmalıdır?",
    bosluklar: [["50000", "50 000", "50.000"]],
    aciklama: "N iki frekansın oranıdır: 50 000 000 / 1 000 = 50 000. Sayıcı 0'dan 49 999'a sayar ve tik son değerde bir saat boyunca 1 olur.",
  },
  {
    id: "h6-saat-bolme-bit", konu: "sayicilar", hafta: 6, kaynak: "derived", zorluk: 2, kavram: "saat-bolme",
    ref: "Hafta 6, Sayıcı", tip: "fill",
    soru: "0'dan 49 999'a sayıp başa dönen bir sayıcı en az kaç bit olmalıdır?",
    bosluklar: [["16"]],
    aciklama: "k bit 0..2ᵏ - 1 aralığını tutar. 2¹⁵ = 32 768 yetmez; 2¹⁶ = 65 536 yeter. 16 bit gerekir.",
  },
  {
    id: "h6-ucgen-tepe", konu: "sayicilar", hafta: 6, kaynak: "original", zorluk: 2, kavram: "ucgen-dalga",
    ref: "Hafta 6, Üçgen sinyal", tip: "fill",
    soru: "100 ns periyotlu bir saat sinyali kullanılarak 10 µs periyotlu bir üçgen sinyal üretilecek. Sayıcı 0'dan başlayıp her kenarda bir adım atarak kaça kadar çıkmalı ve yeniden 0'a inmelidir?",
    bosluklar: [["50"]],
    aciklama: "Bir periyotta 10 000 / 100 = 100 saat var. Yarısı çıkış, yarısı iniş: tepe = 100 / 2 = 50. Periyot = 2 · 50 · 100 ns = 10 µs.",
    dogrulama: tb(
      "  signal clk : std_logic := '0';\n  signal sayi : unsigned(6 downto 0) := (others => '0');\n  signal yukari : std_logic := '1';",
      "  clk <= not clk after 50 ns when now < 30 us;\n  process (clk) begin\n    if rising_edge(clk) then\n      if yukari = '1' then\n        if sayi = 49 then yukari <= '0'; end if;\n        sayi <= sayi + 1;\n      else\n        if sayi = 1 then yukari <= '1'; end if;\n        sayi <= sayi - 1;\n      end if;\n    end if;\n  end process;",
      "    wait until sayi = 50;\n    t1 := now;\n    wait until sayi = 49;\n    wait until sayi = 50;\n    assert now - t1 = 10 us severity failure;",
      "    variable t1 : time;",
    ),
  },
  {
    id: "h6-ucgen-bit", konu: "sayicilar", hafta: 6, kaynak: "original", zorluk: 2, kavram: "ucgen-dalga",
    ref: "Hafta 6, Üçgen sinyal", tip: "fill",
    soru: "0'dan 50'ye çıkıp yeniden 0'a inen bir üçgen dalga sayıcısı en az kaç bit olmalıdır?",
    bosluklar: [["6"]],
    aciklama: "5 bit 0..31'i tutar ve 50'ye yetmez; 6 bit 0..63'ü tutar. 7 bit de çalışır ama bir bit boşa gider.",
  },
  {
    id: "h6-ucgen-donus", konu: "sayicilar", hafta: 6, kaynak: "derived", zorluk: 3, kavram: "ucgen-dalga",
    ref: "Hafta 6, Üçgen sinyal", tip: "mcq",
    soru: "~sayi : unsigned(2 downto 0) := \"000\"~ ve ~yukari : std_logic := '1'~ ile bir üçgen üreteci:\n\n~~~vhdl\nif rising_edge(clk) then\n  if yukari = '1' then\n    if sayi = 6 then yukari <= '0'; end if;\n    sayi <= sayi + 1;\n  else\n    if sayi = 0 then yukari <= '1'; end if;\n    sayi <= sayi - 1;\n  end if;\nend if;\n~~~\n\nAnalog gösterimde ne görülür?",
    secenekler: [
      "Sayı 7'ye kadar çıkar; dipte 0'dan sonra 7'ye sıçrayan bir iğne olur",
      "Tepesi 6, dibi 0 olan, iki yönde de düzgün bir üçgen",
      "Sayı 6'ya gelince yön değişir ama sayı orada takılı kalır",
      "Kod derlenmez; ~unsigned~ bir sinyal azaltılamaz",
    ],
    dogru: 0,
    aciklama: "~yukari~ bir kenar geç güncellenir. Sayı 6'dayken yön değiştirilir ama aynı kenarda sayı 7 olur. İnişte 0'da yön değiştirilir, aynı kenarda 0 - 1 hesaplanır ve 3 bitlik ~unsigned~ 7'ye sarar. Doğrusu yönü ~sayi = 5~ (tepe - 1) ve ~sayi = 1~ ile değiştirmektir.",
    dogrulama: tb(
      "  signal clk : std_logic := '0';\n  signal sayi : unsigned(2 downto 0) := \"000\";\n  signal yukari : std_logic := '1';",
      "  process (clk) begin\n    if rising_edge(clk) then\n      if yukari = '1' then\n        if sayi = 6 then yukari <= '0'; end if;\n        sayi <= sayi + 1;\n      else\n        if sayi = 0 then yukari <= '1'; end if;\n        sayi <= sayi - 1;\n      end if;\n    end if;\n  end process;",
      "    for i in 1 to 7 loop\n      clk <= '1'; wait for 1 ns; clk <= '0'; wait for 1 ns;\n    end loop;\n    assert sayi = 7 report \"tepe 7 degil\" severity failure;\n    for i in 1 to 7 loop\n      clk <= '1'; wait for 1 ns; clk <= '0'; wait for 1 ns;\n    end loop;\n    assert sayi = 0 severity failure;\n    clk <= '1'; wait for 1 ns; clk <= '0'; wait for 1 ns;\n    assert sayi = 7 report \"dipte sicrama yok\" severity failure;",
    ),
  },

  // ---------- Uygulamalar ----------
  {
    id: "h6-tek-cift", konu: "uygulamalar", hafta: 6, kaynak: "original", zorluk: 1, kavram: "tek-cift",
    ref: "Hafta 6, Soru 1", tip: "mcq",
    soru: "~x : std_logic_vector(3 downto 0)~ girişinin **tek** sayı olduğunu hangi koşul doğru söyler?",
    secenekler: ["~x(3) = '1'~", "~x(0) = '1'~", "~x = \"0001\"~", "~x(0) = '0'~"],
    dogru: 1,
    aciklama: "Ağırlıklar 8, 4, 2, 1'dir; yalnızca en düşük bitin ağırlığı tektir. Sayı, en düşük biti (~x(0)~) 1 ise tektir. ~x(3)~ işaretli yorumda işaret bitidir, tekliği söylemez.",
    dogrulama: tb(
      "  signal x : std_logic_vector(3 downto 0);",
      "",
      "    for k in 0 to 15 loop\n      x <= std_logic_vector(to_unsigned(k, 4));\n      wait for 1 ns;\n      assert (x(0) = '1') = (k mod 2 = 1) severity failure;\n    end loop;",
    ),
  },
  {
    id: "h6-isaretli-kucuk", konu: "uygulamalar", hafta: 6, kaynak: "original", zorluk: 2, kavram: "isaretli-karsilastirma",
    ref: "Hafta 6, Soru 2", tip: "fill",
    soru: "İki girişten küçük olanının integer değerini veren kod (karşılaştırma işaretli):\n\n~~~vhdl\nentity compare_smaller is\n  port (input1, input2 : in  std_logic_vector(3 downto 0);\n        output_int     : out integer);\nend compare_smaller;\narchitecture rtl of compare_smaller is\nbegin\n  process (input1, input2)\n  begin\n    if signed(input1) < signed(input2) then\n      output_int <= to_integer(signed(input1));\n    else\n      output_int <= to_integer(signed(input2));\n    end if;\n  end process;\nend rtl;\n~~~\n\n~input1 = \"0110\"~ ve ~input2 = \"1010\"~ iken ~output_int~ kaçtır?",
    bosluklar: [["-6"]],
    aciklama: "İşaretli yorumda \"0110\" = 6, \"1010\" = -6 (en soldaki bit işarettir: 10 - 16 = -6). -6 < 6 olduğu için küçük olan input2'dir ve output_int = -6.",
    dogrulama: tb(
      "  signal input1 : std_logic_vector(3 downto 0) := \"0110\";\n  signal input2 : std_logic_vector(3 downto 0) := \"1010\";\n  signal output_int : integer;",
      "  process (input1, input2) begin\n    if signed(input1) < signed(input2) then\n      output_int <= to_integer(signed(input1));\n    else\n      output_int <= to_integer(signed(input2));\n    end if;\n  end process;",
      "    wait for 1 ns;\n    assert output_int = -6 severity failure;",
    ),
  },
  {
    id: "h6-isaretli-unsigned", konu: "uygulamalar", hafta: 6, kaynak: "derived", zorluk: 2, kavram: "isaretli-karsilastirma",
    ref: "Hafta 6, Soru 2", tip: "fill",
    soru: "~input1 = \"0110\"~ ve ~input2 = \"1010\"~ (ikisi de ~std_logic_vector(3 downto 0)~) **işaretsiz** karşılaştırılıyor ve küçük olan ~to_integer(unsigned(...))~ ile veriliyor. Çıkış kaçtır?",
    bosluklar: [["6"]],
    aciklama: "İşaretsiz yorumda \"0110\" = 6, \"1010\" = 10. Küçük olan input1'dir: 6. Aynı bitler işaretli karşılaştırılsaydı \"1010\" = -6 olur ve sonuç -6 çıkardı.",
    dogrulama: tb(
      "  signal input1 : std_logic_vector(3 downto 0) := \"0110\";\n  signal input2 : std_logic_vector(3 downto 0) := \"1010\";\n  signal y : integer;",
      "  y <= to_integer(unsigned(input1)) when unsigned(input1) < unsigned(input2) else to_integer(unsigned(input2));",
      "    wait for 1 ns;\n    assert y = 6 severity failure;",
    ),
  },
  {
    id: "h6-odul-kod", konu: "uygulamalar", hafta: 6, kaynak: "original", zorluk: 1, kavram: "odul-kodu",
    ref: "Hafta 6, Ödül kodu", tip: "fill",
    soru: `Bir koşu yarışında ödül kodunu üreten process (~award_code : std_logic_vector(2 downto 0)~):\n\n${ODUL_KOD}\n\n~finish_time = 11~ ve ~ranking = 3~ olan yarışmacının kodu nedir?`,
    bosluklar: [vektor("011")],
    aciklama: "11 < 10 yanlıştır, rekor dalı atlanır. ~case~ 3 değerini ~when 3~ dalında bulur: \"011\" (gümüş madalya).",
    dogrulama: odulSinama("< 10", 11, 3, "011"),
  },
  {
    id: "h6-odul-rekor", konu: "uygulamalar", hafta: 6, kaynak: "original", zorluk: 1, kavram: "odul-kodu",
    ref: "Hafta 6, Ödül kodu", tip: "fill",
    soru: `Bir koşu yarışında ödül kodunu üreten process (~award_code : std_logic_vector(2 downto 0)~):\n\n${ODUL_KOD}\n\nYarışı 9 saniyede bitirip 7. olan yarışmacının kodu nedir?`,
    bosluklar: [vektor("111")],
    aciklama: "Rekor koşulu sıradan önce denetlenir: 9 < 10 doğrudur ve kod \"111\" olur. Sıranın ilk beşte olmaması önemli değildir.",
    dogrulama: odulSinama("< 10", 9, 7, "111"),
  },
  {
    id: "h6-odul-002", konu: "uygulamalar", hafta: 6, kaynak: "original", zorluk: 2, kavram: "odul-kodu",
    ref: "Hafta 6, Ödül kodu", tip: "mcq",
    soru: "Ödül kodunu üreten kodda 2. sıra için ~when 2 => award_code <= \"002\";~ yazılmış (~award_code : std_logic_vector(2 downto 0)~). Ne olur?",
    secenekler: [
      "Kod derlenmez: ~'2'~ bir ~std_logic~ değeri değildir",
      "~award_code~ \"010\" olur; derleyici sayıyı ikiliğe çevirir",
      "~award_code~ benzetimde \"002\" olarak görünür",
      "Derleyici uyarı verir ve ~'2'~ yerine ~'X'~ koyar",
    ],
    dogru: 0,
    aciklama: "~std_logic_vector~ bir ~std_logic~ dizisidir; dizginin her karakteri ~'U'~, ~'X'~, ~'0'~, ~'1'~, ~'Z'~, ~'W'~, ~'L'~, ~'H'~ ya da ~'-'~ olmalıdır. ~'2'~ bunlardan biri değildir ve kod derlenmez. 2. sıranın kodu ikilik olarak \"010\" yazılır.",
    dogrulama: {
      derlenmemeli: IEEE + `
entity tb is end tb;
architecture z of tb is
  signal award_code : std_logic_vector(2 downto 0);
begin
  award_code <= "002";
end z;`,
    },
  },
  {
    id: "h6-odul-sinir", konu: "uygulamalar", hafta: 6, kaynak: "derived", zorluk: 2, kavram: "odul-kodu",
    ref: "Hafta 6, Ödül kodu", tip: "tf",
    soru: "Ödül kodunda rekor koşulu ~if finish_time <= 10 then~ diye yazılırsa yarışı tam 10 saniyede bitiren bir yarışmacı da \"111\" kodunu alır.",
    dogru: true,
    aciklama: "10 <= 10 doğrudur, rekor dalı çalışır. Kural \"10 saniyenin altında\" dediği için doğru koşul ~finish_time < 10~ olmalıdır.",
    dogrulama: odulSinama("<= 10", 10, 2, "111"),
  },
];
