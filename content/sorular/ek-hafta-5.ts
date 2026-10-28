// B6: 5. hafta için türetilmiş ek sorular. yedek: true olanlar yalnızca aralıklı tekrarda gelir.
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
    wait for 1 ns;
${govde}
    wait;
  end process;
end z;`,
});

// Derlenmemesi gereken deyimi boş bir mimariye yerleştirir
const hatali = (bildirim: string, deyim: string) => ({
  derlenmemeli: `${IEEE}
entity tb is end tb;
architecture z of tb is
${bildirim}
begin
${deyim}
end z;`,
});

// Bir saat darbesi: yükselen ve düşen kenar
const DARBE = "      clk <= '1'; wait for 1 ns; clk <= '0'; wait for 1 ns;";

const WITH_4 = `  with s select
    y <= "0001" when "00",
         "0010" when "01",
         "0100" when "10",
         "1000" when others;`;

const ONCELIK = `  y <= "11" when d(3) = '1' else
       "10" when d(2) = '1' else
       "01" when d(1) = '1' else
       "00";`;

export const ekHafta5: Soru[] = [
  ...turet(5, "esz-atamalar", "with-select", [
    {
      id: "t5-ws-sonuc", zorluk: 1, tip: "fill",
      soru: `Aşağıdaki kodda ~s = "10"~ iken ~y~ nedir?\n\n~~~\n${WITH_4}\n~~~`,
      bosluklar: [vektor("0100")],
      aciklama: "~with/select~ seçici değere eşit olan kolu seçer. ~s = \"10\"~ üçüncü koldur: 0100.",
      dogrulama: esz(
        "  signal s : std_logic_vector(1 downto 0) := \"10\";\n  signal y : std_logic_vector(3 downto 0);",
        WITH_4,
        "    assert y = \"0100\" severity failure;",
      ),
    },
    {
      id: "t5-ws-dekoder", zorluk: 2, tip: "fill", yedek: true,
      soru: `Aşağıdaki 2'den 4'e kod çözücüde ~s = "11"~ iken ~y~ nedir?\n\n~~~\n${WITH_4}\n~~~`,
      bosluklar: [vektor("1000")],
      aciklama: "\"11\" açıkça yazılmamıştır ve ~others~ koluna düşer: 1000.",
      dogrulama: esz(
        "  signal s : std_logic_vector(1 downto 0) := \"11\";\n  signal y : std_logic_vector(3 downto 0);",
        WITH_4,
        "    assert y = \"1000\" severity failure;",
      ),
    },
    {
      id: "t5-ws-coklu", zorluk: 2, tip: "mcq",
      soru: "~with/select~ içinde aynı değeri birden çok seçim için vermek istiyorsun. Seçimler hangi işaretle ayrılır?",
      secenekler: ["~,~", "~|~", "~or~", "~;~"],
      dogru: 1,
      aciklama: "~y <= a when \"00\" | \"11\",~ yazımında ~|~ \"ya da\" anlamındadır. Virgül kolları ayırır.",
    },
    {
      id: "t5-ws-process", zorluk: 2, tip: "tf", yedek: true,
      soru: "VHDL-93'te ~with/select~ deyimi bir process'in içinde kullanılabilir.",
      dogru: false,
      aciklama: "~with/select~ eşzamanlı bir deyimdir ve process dışında yazılır. Process içinde aynı işi ~case~ yapar. (VHDL-2008 sıralı biçimine izin verir.)",
      dogrulama: hatali(
        "  signal s : std_logic;\n  signal y : std_logic;",
        "  process (s) begin\n    with s select\n      y <= '1' when '1',\n           '0' when others;\n  end process;",
      ),
    },
  ]),

  ...turet(5, "esz-atamalar", "when-else", [
    {
      id: "t5-we-ilk-dogru", zorluk: 1, tip: "fill",
      soru: "~y <= \"00\" when a = '1' else \"01\" when b = '1' else \"10\";~ deyiminde ~a = '1'~ ve ~b = '1'~ iken ~y~ nedir?",
      bosluklar: [vektor("00")],
      aciklama: "~when/else~ koşulları sırayla dener ve doğru olan ilk kolu seçer. ~a = '1'~ ilk sırada olduğu için ~b~'ye bakılmaz.",
      dogrulama: esz(
        "  signal a : std_logic := '1';\n  signal b : std_logic := '1';\n  signal y : std_logic_vector(1 downto 0);",
        "  y <= \"00\" when a = '1' else \"01\" when b = '1' else \"10\";",
        "    assert y = \"00\" severity failure;",
      ),
    },
    {
      id: "t5-oncelik-kodlayici", zorluk: 2, tip: "fill",
      soru: `Aşağıdaki öncelik kodlayıcıda (priority encoder) ~d = "0110"~ iken ~y~ nedir?\n\n~~~\n${ONCELIK}\n~~~`,
      bosluklar: [vektor("10")],
      aciklama: "Önce en yüksek bit ~d(3)~ denenir ve 0'dır. Ardından ~d(2) = '1'~ bulunur; ~d(1)~'in de 1 olması sonucu değiştirmez.",
      dogrulama: esz(
        "  signal d : std_logic_vector(3 downto 0) := \"0110\";\n  signal y : std_logic_vector(1 downto 0);",
        ONCELIK,
        "    assert y = \"10\" severity failure;",
      ),
    },
    {
      id: "t5-oncelik-kodlayici2", zorluk: 2, tip: "fill", yedek: true,
      soru: `Aşağıdaki öncelik kodlayıcıda ~d = "0011"~ iken ~y~ nedir?\n\n~~~\n${ONCELIK}\n~~~`,
      bosluklar: [vektor("01")],
      aciklama: "~d(3)~ ve ~d(2)~ sıfırdır; ilk bir ~d(1)~'dedir. ~d(0)~'ın kodu yazılmadığından o da \"00\" verirdi.",
      dogrulama: esz(
        "  signal d : std_logic_vector(3 downto 0) := \"0011\";\n  signal y : std_logic_vector(1 downto 0);",
        ONCELIK,
        "    assert y = \"01\" severity failure;",
      ),
    },
  ]),

  ...turet(5, "sirali-kod", "process-hassasiyet", [
    {
      id: "t5-hassas-eksik", zorluk: 3, tip: "fill",
      soru: "~process (a) begin y <= a and b; end process;~ benzetimde ~a = '1'~, ~b = '0'~ ile başlıyor. Sonra yalnızca ~b~ 1 oluyor. ~y~ kaçtır?",
      bosluklar: [bit("0")],
      aciklama: "Process yalnızca ~a~ değişince uyanır. ~b~'nin değişimi process'i çalıştırmaz ve ~y~ eski değeri 0'da kalır. Sentezlenen devre ise AND kapısı olur; benzetim ile donanım ayrışır.",
      dogrulama: esz(
        "  signal a : std_logic := '1';\n  signal b : std_logic := '0';\n  signal y : std_logic;",
        "  process (a) begin\n    y <= a and b;\n  end process;",
        "    assert y = '0' severity failure;\n    b <= '1';\n    wait for 1 ns;\n    assert y = '0' severity failure;",
      ),
    },
    {
      id: "t5-hassas-wait", zorluk: 2, tip: "tf",
      soru: "Hassasiyet listesi olan bir process içinde ~wait~ deyimi kullanılabilir.",
      dogru: false,
      aciklama: "Bir process ya hassasiyet listesiyle ya da ~wait~ deyimleriyle askıya alınır; ikisi birlikte kullanılamaz.",
      dogrulama: hatali("  signal a : std_logic;", "  process (a) begin\n    wait for 1 ns;\n  end process;"),
    },
    {
      id: "t5-process-baslangic", zorluk: 2, tip: "tf", yedek: true,
      soru: "Her process, hassasiyet listesindeki sinyaller hiç değişmese bile benzetimin başında bir kez çalışır.",
      dogru: true,
      aciklama: "Benzetim başlarken tüm process'ler bir kez askıya alınana kadar çalışır. Bu yüzden kombinasyonel çıkışlar ilk anda da hesaplanır.",
      dogrulama: esz(
        "  signal a : std_logic := '0';\n  signal n : integer := 0;",
        "  process (a) begin\n    n <= n + 1;\n  end process;",
        "    assert n = 1 severity failure;",
      ),
    },
    {
      id: "t5-process-all", zorluk: 2, tip: "mcq", yedek: true,
      soru: "VHDL-2008'deki ~process (all)~ yazımı ne anlama gelir?",
      secenekler: [
        "Process tasarımdaki tüm sinyallerde uyanır",
        "Okunan tüm sinyaller listeye eklenir",
        "Process hiç askıya alınmaz",
        "Process tüm saat kenarlarında çalışır",
      ],
      dogru: 1,
      aciklama: "~all~, process'in okuduğu sinyalleri otomatik olarak listeye ekler ve eksik hassasiyet hatasını önler.",
    },
  ]),

  ...turet(5, "sirali-kod", "if-case", [
    {
      id: "t5-if-sonuc", zorluk: 1, tip: "fill",
      soru: "~if x > 10 then y := 2; elsif x > 5 then y := 1; else y := 0; end if;~ deyiminde ~x = 12~ iken ~y~ kaçtır?",
      bosluklar: [["2"]],
      aciklama: "İlk koşul ~12 > 10~ doğrudur; ~elsif~ ve ~else~ kollarına bakılmaz.",
      dogrulama: esz(
        "",
        "",
        "    x := 12;\n    if x > 10 then y := 2; elsif x > 5 then y := 1; else y := 0; end if;\n    assert y = 2 severity failure;",
        "    variable x, y : integer;",
      ),
    },
    {
      id: "t5-if-sonuc2", zorluk: 1, tip: "fill", yedek: true,
      soru: "~if x > 10 then y := 2; elsif x > 5 then y := 1; else y := 0; end if;~ deyiminde ~x = 7~ iken ~y~ kaçtır?",
      bosluklar: [["1"]],
      aciklama: "~7 > 10~ yanlış, ~7 > 5~ doğrudur; ikinci kol çalışır.",
      dogrulama: esz(
        "",
        "",
        "    x := 7;\n    if x > 10 then y := 2; elsif x > 5 then y := 1; else y := 0; end if;\n    assert y = 1 severity failure;",
        "    variable x, y : integer;",
      ),
    },
    {
      id: "t5-case-tekrar", zorluk: 2, tip: "tf",
      soru: "Bir ~case~ deyiminde aynı seçim değeri iki farklı kolda yazılabilir.",
      dogru: false,
      aciklama: "~case~ kollarının seçimleri çakışmamalı ve tüm değerleri kapsamalıdır. Aynı değeri iki kez yazmak derleme hatasıdır.",
      dogrulama: hatali(
        "  signal s : std_logic_vector(1 downto 0);\n  signal y : std_logic;",
        "  process (s) begin\n    case s is\n      when \"00\" => y <= '0';\n      when \"00\" => y <= '1';\n      when others => y <= '0';\n    end case;\n  end process;",
      ),
    },
    {
      id: "t5-case-aralik", zorluk: 2, tip: "mcq", yedek: true,
      soru: "~n : integer range 0 to 7~ için ~case~ deyiminde 0'dan 3'e kadar olan değerleri tek kolda toplamanın yolu hangisidir?",
      secenekler: ["~when 0 to 3 =>~", "~when 0..3 =>~", "~when (0, 3) =>~", "~when 0 - 3 =>~"],
      dogru: 0,
      aciklama: "Tamsayı seçimlerinde aralık ~to~ ile yazılır. Ayrık değerler için ~|~ kullanılır: ~when 0 | 2 =>~.",
    },
    {
      id: "t5-case-null", zorluk: 1, tip: "mcq", yedek: true,
      soru: "~case~ deyiminin bir kolunda hiçbir şey yapılmaması isteniyor. Bu kola ne yazılır?",
      secenekler: ["Hiçbir şey, kol boş bırakılır", "~null;~", "~exit;~", "~wait;~"],
      dogru: 1,
      aciklama: "Her kolun en az bir deyimi olmalıdır; \"hiçbir şey yapma\" ~null;~ ile söylenir, örneğin ~when others => null;~.",
    },
    {
      id: "t5-if-mandal", zorluk: 2, tip: "tf", yedek: true,
      soru: "Kombinasyonel bir process'te bir çıkış bazı koşullarda hiç atanmıyorsa sentez aracı bir mandal (latch) oluşturur.",
      dogru: true,
      aciklama: "Atanmayan yolda çıkış eski değerini korumak zorundadır ve bu bellek demektir. Önlemek için her kolda atama yapılır ya da process başında varsayılan değer verilir.",
    },
  ]),

  ...turet(5, "sirali-kod", "donguler", [
    {
      id: "t5-for-sayi", zorluk: 1, tip: "fill",
      soru: "~for i in 7 downto 2 loop~ döngüsü kaç kez çalışır?",
      bosluklar: [["6"]],
      aciklama: "i sırasıyla 7, 6, 5, 4, 3, 2 değerlerini alır: 6 tur.",
      dogrulama: esz("", "", "    for i in 7 downto 2 loop\n      n := n + 1;\n    end loop;\n    assert n = 6 severity failure;", "    variable n : integer := 0;"),
    },
    {
      id: "t5-birleri-say", zorluk: 2, tip: "fill",
      soru: "Bir ~for~ döngüsü ~a = \"10110100\"~ vektöründeki 1'leri sayıyor. Sonuç kaçtır?",
      bosluklar: [["4"]],
      aciklama: "1'ler 7, 5, 4 ve 2 numaralı bitlerdedir: toplam 4.",
      dogrulama: esz(
        "  signal a : std_logic_vector(7 downto 0) := \"10110100\";",
        "",
        "    for i in a'range loop\n      if a(i) = '1' then n := n + 1; end if;\n    end loop;\n    assert n = 4 severity failure;",
        "    variable n : integer := 0;",
      ),
    },
    {
      id: "t5-for-indeks-atama", zorluk: 2, tip: "tf", yedek: true,
      soru: "~for~ döngüsünün indeksine döngü içinde ~i := 3;~ gibi bir değer atanabilir.",
      dogru: false,
      aciklama: "Döngü indeksi döngü içinde sabit gibidir; okunabilir ama değiştirilemez.",
      dogrulama: hatali(
        "",
        "  process begin\n    for i in 0 to 7 loop\n      i := 3;\n    end loop;\n    wait;\n  end process;",
      ),
    },
    {
      id: "t5-exit-next", zorluk: 2, tip: "mcq", yedek: true,
      soru: "Döngünün o anki turunu atlayıp bir sonraki tura geçen deyim hangisidir?",
      secenekler: ["~exit~", "~next~", "~null~", "~return~"],
      dogru: 1,
      aciklama: "~next~ sonraki tura geçer, ~exit~ döngüden tamamen çıkar.",
    },
    {
      id: "t5-ters-cevir", zorluk: 3, tip: "fill", yedek: true,
      soru: "~for i in 0 to 7 loop y(i) <= a(7 - i); end loop;~ döngüsünde ~a = \"11010000\"~ ise ~y~ nedir?",
      bosluklar: [vektor("00001011")],
      aciklama: "Döngü bit sırasını ters çevirir: ~a~ sağdan sola okunur ve 00001011 elde edilir.",
      dogrulama: esz(
        "  signal a : std_logic_vector(7 downto 0) := \"11010000\";\n  signal y : std_logic_vector(7 downto 0);",
        "",
        "    for i in 0 to 7 loop\n      y(i) <= a(7 - i);\n    end loop;\n    wait for 0 ns;\n    assert y = \"00001011\" severity failure;",
      ),
    },
  ]),

  ...turet(5, "sirali-kod", "saatli-devre", [
    {
      id: "t5-sayac-18", zorluk: 2, tip: "fill",
      soru: "~q : unsigned(3 downto 0)~ sayacı 0'dan başlıyor ve her yükselen kenarda ~q <= q + 1;~ çalışıyor. 18 yükselen kenardan sonra ~q~ kaçtır (ondalık)?",
      bosluklar: [["2"]],
      aciklama: "4 bitlik sayaç 15'ten sonra 0'a döner. 18 mod 16 = 2.",
      dogrulama: esz(
        "  signal clk : std_logic := '0';\n  signal q : unsigned(3 downto 0) := \"0000\";",
        "  process (clk) begin\n    if rising_edge(clk) then\n      q <= q + 1;\n    end if;\n  end process;",
        `    for i in 1 to 18 loop\n${DARBE}\n    end loop;\n    assert q = 2 severity failure;`,
      ),
    },
    {
      id: "t5-kaydirma", zorluk: 3, tip: "fill",
      soru: "4 bitlik kaydırma yazmacı her yükselen kenarda ~q <= q(2 downto 0) & din;~ çalıştırıyor. ~q = \"0000\"~ iken ~din~ sırasıyla 1, 0, 1, 1 veriliyor. Dört kenardan sonra ~q~ nedir?",
      bosluklar: [vektor("1011")],
      aciklama: "Her kenarda bitler sola kayar ve yeni bit sağdan girer: 0001, 0010, 0101, 1011.",
      dogrulama: esz(
        "  signal clk, din : std_logic := '0';\n  signal q : std_logic_vector(3 downto 0) := \"0000\";",
        "  process (clk) begin\n    if rising_edge(clk) then\n      q <= q(2 downto 0) & din;\n    end if;\n  end process;",
        `    for i in 0 to 3 loop\n      if i = 1 then din <= '0'; else din <= '1'; end if;\n      wait for 1 ns;\n${DARBE}\n    end loop;\n    assert q = "1011" severity failure;`,
      ),
    },
    {
      id: "t5-asenkron-reset", zorluk: 2, tip: "mcq",
      soru: "Asenkron resetli bir D flip-flop için doğru process yapısı hangisidir?",
      secenekler: [
        "~process (clk) begin if rising_edge(clk) then if rst = '1' then q <= '0'; else q <= d; end if; end if; end process;~",
        "~process (clk, rst) begin if rst = '1' then q <= '0'; elsif rising_edge(clk) then q <= d; end if; end process;~",
        "~process (d) begin if rst = '1' then q <= '0'; else q <= d; end if; end process;~",
        "~process (rst) begin if rising_edge(clk) then q <= d; end if; end process;~",
      ],
      dogru: 1,
      aciklama: "Asenkron reset saati beklemez: ~rst~ hassasiyet listesinde olur ve saat kenarından önce denetlenir. İlk seçenek senkron resettir.",
    },
    {
      id: "t5-senkron-liste", zorluk: 2, tip: "tf", yedek: true,
      soru: "Senkron resetli bir D flip-flop'un process'inde hassasiyet listesine yalnızca ~clk~ yazmak yeterlidir.",
      dogru: true,
      aciklama: "Senkron reset yalnızca saat kenarında denetlenir; çıkış ancak ~clk~ değişince değişebileceği için ~rst~ ve ~d~ listeye gerekmez.",
    },
    {
      id: "t5-kenar-esdeger", zorluk: 1, tip: "mcq", yedek: true,
      soru: "~rising_edge(clk)~ yerine kullanılabilen klasik yazım hangisidir?",
      secenekler: ["~clk = '1'~", "~clk'event and clk = '1'~", "~clk'event and clk = '0'~", "~clk'stable~"],
      dogru: 1,
      aciklama: "~clk'event~ sinyalin o anda değiştiğini, ~clk = '1'~ yeni değerin 1 olduğunu söyler: yükselen kenar. ~rising_edge~ ayrıca 'X'ten 1'e geçişleri dışarıda bırakır.",
    },
  ]),
];
