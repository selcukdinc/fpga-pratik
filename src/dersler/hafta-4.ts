import { UST, md, type Ders } from "./tipler";

export const HAFTA_4: Ders = {
  hafta: 4,
  baslik: "Veri nesneleri ve veri tipleri",
  ozet: "constant, signal ve variable farkını, delta döngüsünü, std_logic'in dokuz değerini, numeric_std dönüşümlerini, bit dizgilerini ve dizileri öğren.",
  bolumler: [
    {
      baslik: "constant, signal, variable",
      metin: md(`
**Neden önemli?** Aynı hesabı sinyalle ya da değişkenle yazmak bambaşka sonuçlar verebilir. Derste "hatalı birler sayacı" diye geçen örnek tam olarak bu farktan doğar; farkı bir kez resimde görürsen bu hatayı bir daha yapmazsın.

VHDL'de değer tutan üç tür nesne vardır:

- **constant:** Bir kez değer alır, sonra değişmez. ~constant GENISLIK : integer := 8;~
- **signal:** Donanımdaki bir teli ya da yazmacı temsil eder. ~<=~ ile atanır. Mimarinin bildirim bölümünde (ya da port olarak) tanımlanır.
- **variable:** Yalnızca bir ~process~ (ya da function, procedure) içinde, ~process~ ile ~begin~ arasındaki bildirim bölümünde tanımlanır ve kullanılır. ~:=~ ile atanır.

Hangi nesneyi kimin görebildiğini şekildeki kapsam haritası gösteriyor:

[[G-H4-04]]

Mimarinin bildirim bölümündeki sabit ve sinyal iki process'ten de görünür (yeşil oklar). Değişken ise yalnızca kendi process'inde yaşar: p2, p1'in ~v1~'ini göremez. Değişkenin değerini dışarı taşımak için process içinde bir sinyale atanır.

En önemli fark, değerin **ne zaman** güncellendiğidir:

- Değişkene atanan değer **hemen** geçerli olur; bir sonraki satır yeni değeri görür.
- Sinyale atanan değer process **beklemeye geçtiğinde** (sonuna ulaştığında ya da ~wait~'te) güncellenir. Aynı process içinde aynı sinyale birden çok atama yapılırsa **sonuncusu** geçerli olur.

[[G-H4-01]]

Şekilde soldaki değişken her satırda bir öncekinin sonucunu görüyor: 1, 2, 20. Sağdaki sinyal ise process içindeyken hep 0; atamalar yalnızca planlanıyor ve process beklemeye geçince s = 1, s_sonuc = 0 oluyor.

**Takas.** Bu yüzden aynı process'te ~a <= b; b <= a;~ yazmak iki sinyalin değerini **takas eder**: iki satır da eski değerleri okur. Değişkenlerle aynı şey olmaz:

[[G-H4-05]]

~v1 := v2; v2 := v1;~ sonrası ikisi de aynı değeri taşır; takas için üçüncü bir değişken gerekir.

**Birler sayacı.** Bir vektördeki 1'leri sayan döngü, sayaç sinyal olursa yanlış çalışır:

[[G-H4-06]]

Döngünün her adımında ~temp <= temp + 1~ temp'in **eski** değerini (0) okur, yani her biri ~temp <= 1~ planlar ve son plan geçerli olur: dört tane 1 olmasına rağmen temp = 1. Değişken ise her satırda güncellendiği için gerçekten sayar: 1, 1, 1, 1, 2, 3, 3, 4. Çözüm sayacı değişken yapmak ve döngüden sonra sonucu sinyale atamaktır.

Bir process'in değişkenleri benzetim başında bir kez ilklenir ve process her uyandığında **kaldıkları değerden devam eder**; değerlerini process çalışmaları arasında korurlar.

Bir ~out~ portu mimarinin içinden okunamadığı için, değeri hem çıkışa vermek hem içeride kullanmak gerektiğinde bir **iç sinyal** tanımlanır: hesap iç sinyalle yapılır, port da ~y <= ic;~ ile bu sinyalden sürülür. ~buffer~ da çalışır ama iç sinyal daha temiz bir yoldur.

> **Çözümlü örnek:** t sinyali ve v değişkeni 0 iken bir process'te ~t <= t + 1;~ üç kez, ardından ~v := v + 1;~ üç kez çalışıyor. Process beklemeye geçince t ve v kaçtır?
>
> 1. Üç sinyal ataması da t'nin eski değerini (0) okur; her biri ~t <= 1~ planlar. Son plan geçerli: t = 1.
> 2. Değişken her satırda güncellenir: 1, 2, 3. v = 3.

> **Sık hata:** Sinyale atadıktan sonraki satırda yeni değeri okuyacağını sanmak. Process içinde sinyal, process beklemeye geçene kadar eski değerini verir. Ara sonuç gerekiyorsa değişken kullan.

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
      dene: ["t4-swap", "h4-birler-signal", "t4-var-sayac"],
    },
    {
      baslik: "Delta döngüsü",
      metin: md(`
**Neden önemli?** Benzetimde bir sinyalin "aynı anda" iki farklı değeri varmış gibi görünmesinin nedeni delta döngüsüdür. Dalga ekranında ya da mesajlarda ~10ns+2~ gibi bir zaman gördüğünde ne olduğunu anlamak, testbench hatalarını çözmeyi kolaylaştırır.

Sinyal ataması bir sonraki **delta döngüsünde** etkili olur. Delta döngüsü, benzetim zamanı ilerlemeden atılan sıfır süreli adımdır. Benzetici bir anda şunları tekrarlar: değişen sinyalleri güncelle, bu sinyalleri okuyan process'leri ve eşzamanlı atamaları çalıştır, onların yaptığı yeni atamaları bir sonraki delta'ya planla. Değişen sinyal kalmayınca zaman ilerler.

[[G-H4-07]]

Şekilde uyarıcı process 10 ns'de ~a <= '1';~ çalıştırıyor. a, 10 ns + 1'de değişir. a'yı okuyan ~b <= not a;~ çalışır ve b, 10 ns + 2'de değişir. b'yi okuyan ~c <= b and en;~ çalışır ve c, 10 ns + 3'te değişir. Üç adımın hepsi aynı 10 ns anındadır; gerçek donanımda bu, kapı gecikmesi sıfır kabul edilmiş bir zincirdir.

Delta döngüsünü process içinde adım adım izleyelim. Aşağıdaki şekilde **İleri** düğmesine bas; her satırda değişkenlerin ve sinyalin ne olduğunu gör:

[[G-H4-08]]

Atamadan hemen sonra ~x := s;~ yazarsan hâlâ eski değeri okursun. ~wait for 0 ns;~ zamanı ilerletmez ama process'i bir delta bekletir; bu sürede planlanan değer uygulanır ve sonraki ~x := s;~ yeni değeri okur.

**after ve sentez.** ~s <= a after 5 ns;~ gibi gecikmeler yalnızca benzetimde anlamlıdır. Sentez aracı ~after~'ı yok sayar; gerçek gecikmeyi kullanılan donanım belirler.

> **Çözümlü örnek:** s sinyali '0' iken process içinde ~s <= '1';~ ve hemen ardından ~x := s;~ çalışıyor. x kaçtır? Araya ~wait for 0 ns;~ eklenirse ne değişir?
>
> 1. Atama yalnızca planlanır; s bu delta'da hâlâ '0'. x = '0'.
> 2. ~wait for 0 ns;~ bir delta bekletir, s = '1' olur. Sonraki ~x := s;~ '1' okur.

> **Sık hata:** Bir process'te aynı sinyale iki kez atayıp ilkinin "bir anlığına" görüneceğini sanmak. ~y <= '0'; y <= '1';~ ardışık yazılırsa ilk plan ezilir; y hiç '0' olmaz, process beklemeye geçince '1' olur.

Aşağıdaki benzetim adımlayıcıdaki process'i ve şekildeki a, b, c zincirini çalıştırır. Mesajlardaki ~+1~, ~+2~, ~+3~ eklerine bak: bunlar delta numaralarıdır.
`),
      sim: {
        top: "tb",
        sure: "20ns",
        gorev: "izle process'ini kaldırıp dalga ekranında a, b ve c'ye bak: üçü de 10 ns'de değişmiş görünür, çünkü delta adımları zaman eksenine yer kaplamaz.",
        kod: `entity tb is
end entity;

architecture sim of tb is
  signal s       : integer := 0;
  signal a, b, c : bit := '0';
  signal en      : bit := '1';
begin
  -- Eşzamanlı zincir: a değişince b, b değişince c bir delta sonra hesaplanır
  b <= not a;
  c <= b and en;

  adimlar : process
    variable v, x : integer := 0;
  begin
    v := 1;
    v := v + 1;
    s <= v;
    s <= s + 1;  -- s hâlâ 0: 1 planlanır, önceki plan ezilir
    x := s;      -- eski değer
    report "wait oncesi: v = " & integer'image(v) & ", x = " & integer'image(x) & ", s = " & integer'image(s);
    wait for 0 ns;
    x := s;
    report "bir delta sonra: x = " & integer'image(x) & ", s = " & integer'image(s);
    wait;
  end process;

  uyaran : process
  begin
    wait for 10 ns;
    a <= '1';
    wait;
  end process;

  izle : process (a, b, c)
  begin
    if now > 0 ns then
      report "a = " & bit'image(a) & ", b = " & bit'image(b) & ", c = " & bit'image(c);
    end if;
  end process;
end architecture;
`,
      },
      dene: ["t4-delta", "t4-son-atama"],
    },
    {
      baslik: "İsimlendirme kuralları",
      metin: md(`
**Neden önemli?** Geçersiz bir isim derleyicinin ilk satırda durmasına yol açar ve hata mesajı çoğu zaman ismi değil başka bir şeyi işaret eder. Kuralları bir kez görmek bu zaman kaybını önler.

VHDL büyük/küçük harf ayırmaz: ~Sayac~ ve ~SAYAC~ aynı isimdir. Bir isim:

- harfle başlamalıdır,
- harf, rakam ve alt çizgiden oluşur,
- alt çizgiyle bitemez ve iki alt çizgi yan yana gelemez,
- ~signal~, ~entity~, ~process~ gibi ayrılmış sözcüklerden biri olamaz.

[[G-H4-09]]

Örneğin ~veri_1~ geçerli; ~1veri~, ~veri_~ ve ~veri__1~ geçersizdir. Tire (~-~) VHDL'de açıklama başlangıcıdır (~--~), isimde kullanılamaz.

> **Sık hata:** Aynı mimaride ~Sayac~ ve ~SAYAC~ diye iki ayrı sinyal tanımlamaya çalışmak. İkisi aynı isimdir; derleyici ikinci bildirimi tekrar sayar.
`),
      dene: ["h4-isim-gecersiz", "t4-isim-cift-alt"],
    },
    {
      baslik: "std_logic ve dokuz değer",
      metin: md(`
**Neden önemli?** Ortak veri yolları, çekme dirençleri ve iki çıkışın yanlışlıkla aynı tele bağlanması gerçek kartlarda sık görülür. std_logic bunları benzetimde modelleyebildiği için hatayı karta yüklemeden görürsün: dalga ekranında kırmızı bir 'X' çoğu zaman bir çakışmadır.

~bit~ tipinin yalnızca ~'0'~ ve ~'1'~ değerleri vardır. Gerçek devrelerde bundan fazlasına ihtiyaç duyulur, bu yüzden ~std_ulogic~ dokuz değer tanımlar:

- ~'U'~ başlangıç değeri verilmemiş (atanmamış). Yalnızca benzetimde görülür; donanımda karşılığı yoktur.
- ~'X'~ güçlü bilinmeyen (çakışma), ~'0'~ ve ~'1'~ güçlü değerler
- ~'Z'~ yüksek empedans: hattı hiçbir kaynak sürmüyor. Üç durumlu (tri-state) çıkışlarla donanımda gerçeklenebilir.
- ~'W'~, ~'L'~, ~'H'~ zayıf bilinmeyen, zayıf 0, zayıf 1. Çekme dirençleri (pull-up, pull-down) ~'H'~ ve ~'L'~ ile modellenir.
- ~'-'~ önemsiz (don't care): sentez aracına sadeleştirme serbestliği verir.

Değerleri bir güç merdiveninde düşünmek işi kolaylaştırır:

[[G-H4-10]]

Bir hattı birden çok kaynak sürdüğünde merdivende yukarıda olan kazanır. Aynı basamaktaki iki değer çelişirse o basamağın "bilinmeyen"i çıkar: güçlüde ~'X'~, zayıfta ~'W'~. ~'Z'~ en altta durur ve hattı hiç sürmez.

Değerlerin tanımlı sırası 'U', 'X', '0', '1', 'Z', 'W', 'L', 'H', '-' şeklindedir. Bu sıra alt tip aralıklarında önemlidir: ~subtype s3 is std_ulogic range '0' to 'Z';~ yalnızca '0', '1' ve 'Z' değerlerini içerir.

~bit~ yalnızca bir mantık tipidir; onun için aritmetik tanımlı değildir. Toplama için ~integer~, ~unsigned~ ya da ~signed~ kullanılır.

**Çözümleme.** ~std_logic~, ~std_ulogic~'in **çözümlenmiş** alt tipidir: aynı sinyali birden çok kaynak sürerse bir çözümleme fonksiyonu sonucu belirler. Fonksiyonun kullandığı tablonun tamamı:

[[G-H4-11]]

Kurallar tablodan okunur:

- İki güçlü değer çelişirse güçlü bilinmeyen: ~'0'~ ile ~'1'~ → ~'X'~.
- ~'Z'~ hattı sürmez, sonucu diğer kaynak belirler: ~'Z'~ ile ~'1'~ → ~'1'~.
- Güçlü değer zayıfı yener: ~'0'~ ile ~'H'~ → ~'0'~.
- İki zayıf değer çelişirse zayıf bilinmeyen: ~'L'~ ile ~'H'~ → ~'W'~.

Üçüncü kuralın donanımdaki karşılığı çekme direncidir:

[[G-H4-12]]

Sürücü hattı bıraktığında (~'Z'~) direnç onu zayıf 1'e çeker ve hat ~'H'~ olur. Sürücü güçlü bir ~'0'~ verdiğinde direnç bunu yenemez ve hat ~'0'~ olur. I²C gibi ortak hatlar bu ilkeyle çalışır.

İki üç durumlu tamponun çıkışları aynı hatta bağlanınca da tablonun ilk iki satırı devreye girer:

[[G-H4-03]]

**Çoklu sürücü.** ~std_ulogic~ (ve ~bit~ gibi çözümlenmemiş tipler) için birden çok sürücü hatadır. Bu, iki çıkışı yanlışlıkla birbirine bağlamayı yakalar. Dikkat: mimarideki **her eşzamanlı atama ayrı bir sürücüdür**.

[[G-H4-13]]

~bit_vector~ tipindeki E için ~E <= not H;~ ve ardından ~E(2) <= '0';~ yazarsan E(2)'nin iki sürücüsü olur ve "multiple driven" hatası alırsın. Çözüm tek atamada birleştirmektir: ~E <= '0' & not H(1 downto 0);~

> **Çözümlü örnek:** Bir hattı üç kaynak sürüyor: ~'Z'~, ~'H'~ ve ~'0'~. Hat kaçtır?
>
> 1. ~'Z'~ hattı sürmez; geriye ~'H'~ ve ~'0'~ kalır.
> 2. ~'0'~ güçlü, ~'H'~ zayıf: güçlü kazanır.
> 3. Hat = ~'0'~. Tabloda ~'0'~ satırı ile ~'H'~ sütununun kesişimi de ~'0'~'dır.

> **Sık hata:** ~'U'~ ile ~'X'~'i karıştırmak. ~'U'~ "hiç değer atanmadı" demektir ve genellikle başlangıç değeri unutulmuş bir sinyali gösterir. ~'X'~ ise iki sürücünün çakıştığını ya da bilinmeyen bir girişin yayıldığını gösterir.

Aşağıda iki üç durumlu tamponun çıkışları (~s1~ ve ~s2~) aynı hatta bağlanıyor. Hattın değerini, std_logic_1164 paketinin kullandığı çözümleme fonksiyonu ~resolved~ ile hesaplıyoruz; iki sürücü aynı sinyale atandığında benzetici de arka planda tam olarak bunu yapar. ~en1~ ve ~en2~'nin birlikte '1' olduğu anda hattın ~'X'~ olduğunu gör.
`),
      sim: {
        top: "tb",
        sure: "40ns",
        gorev: "s2'nin '1' yerine 'H' sürmesini sağla ve en1 ile en2 birlikteyken hattın '0' olduğunu gör.",
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
      dene: ["h4-u-degeri", "t4-coz-z1", "h4-multiple-driven"],
    },
    {
      baslik: "numeric_std: signed, unsigned ve dönüşümler",
      metin: md(`
**Neden önemli?** VHDL'de derleme hatalarının büyük kısmı tip uyuşmazlığıdır. Dört tip arasındaki yolları bir harita gibi bilirsen hangi fonksiyonu yazman gerektiğini aramadan bulursun.

~std_logic_vector~ yalnızca bir bit dizisidir; sayı olarak yorumlanmaz. Aritmetik için ~ieee.numeric_std~ paketindeki ~unsigned~ ve ~signed~ tipleri kullanılır. Derste ~std_logic_arith~ ve ~std_logic_unsigned~ yerine bu paket tercih edilir, çünkü standarttır.

VHDL tiplere çok sıkı bakar; farklı tipler arasında açık dönüşüm gerekir. Yollar şu haritada:

[[G-H4-14]]

- ~unsigned(v)~ / ~signed(v)~: ~std_logic_vector~'ü sayıya çevirir (aynı bitler, yeni yorum).
- ~std_logic_vector(u)~: geri çevirir.
- ~to_integer(u)~: ~unsigned~ ya da ~signed~'ı tamsayıya çevirir.
- ~to_unsigned(n, genislik)~ / ~to_signed(n, genislik)~: tamsayıyı verilen genişlikte vektöre çevirir.

Haritanın ortasındaki kesik çizgi önemli: ~std_logic_vector~ ile ~integer~ arasında doğrudan yol yoktur. ~to_integer~ yalnızca ~signed~ ve ~unsigned~ alır, ~std_logic_vector~ almaz: önce ~to_integer(unsigned(v))~ yazılır. Tamsayıyı vektöre çevirmek için de önce ~to_unsigned(n, 8)~ ile genişlik verilir, sonra ~std_logic_vector(...)~ ile çevrilir: ~std_logic_vector(to_unsigned(n, 8))~.

Tek bir ~std_logic~ bitini sayıya çevirmek için onu boş dizgiyle birleştirip 1 elemanlı bir vektör yaparsın: ~to_integer(unsigned'(b & ""))~ 0 ya da 1 döndürür. Bu dönüşümler donanımda hiçbir şey eklemez; kablolar aynı kalır, yalnızca bitlerin yorumu değişir.

**Aynı bitler, iki sayı.** ~"1111"~, ~unsigned~ olarak 15, ~signed~ olarak -1'dir:

[[G-H4-02]]

**İkiye tümleyen:** ~signed~ değerler ikiye tümleyendir. n bitlik signed aralığı -2^(n-1) ile 2^(n-1) - 1 arasıdır; 4 bitte -8..7, 8 bitte -128..127. En soldaki bit -2^(n-1) ağırlığındadır. Negatif bir sayıyı yazmak ya da okumak için "tersle, 1 ekle" kuralı kullanılır:

[[G-H4-15]]

- ~"1000"~ signed olarak -8, unsigned olarak 8'dir.
- ~"1110"~ = -8 + 4 + 2 = -2. ~"1010"~: tersi 0101, +1 = 0110 = 6, yani -6.
- ~to_signed(-3, 4)~: 3 = 0011, tersi 1100, +1 = ~"1101"~.

**resize.** ~resize(x, n)~ genişliği değiştirir ve değeri korur:

[[G-H4-16]]

~signed~ için işaret bitini çoğaltır (-6 = ~"1010"~ → ~"11111010"~), ~unsigned~ için sola sıfır ekler (~"1010"~ → ~"00001010"~). numeric_std, ~signed~ ve ~unsigned~ için ~and~, ~or~ gibi mantıksal operatörleri de tanımlar.

**Tip uyumu:** VHDL güçlü tiplidir ve örtük dönüşüm yapmaz. ~bit~ ile ~std_logic~, ~bit_vector~ ile ~std_logic_vector~, ~integer~ ile ~std_logic_vector~ birbirine doğrudan atanamaz; ~unsigned~ bir sinyal de ~std_logic_vector~'e ancak ~std_logic_vector(u)~ ile atanır.

> **Çözümlü örnek:** ~d : std_logic_vector(7 downto 0)~ ve ~n : integer~. d'yi işaretsiz sayı olarak n'ye, sonra n + 1'i geri d'ye yaz.
>
> 1. Haritada slv'den integer'a doğrudan yol yok; unsigned'dan geçilir: ~n <= to_integer(unsigned(d));~
> 2. Geri dönüşte önce genişlik verilir, sonra tip çevrilir: ~d <= std_logic_vector(to_unsigned(n + 1, 8));~

> **Sık hata:** ~std_logic_vector(n)~ yazarak tamsayıyı doğrudan vektöre çevirmeye çalışmak. Tamsayının kaç bit olacağı belli değildir; ~to_unsigned(n, 8)~ gibi genişlik veren bir fonksiyon şarttır.

Aşağıdaki kod aynı bitlerin iki yorumunu ve 4 bitlik toplamada taşmayı gösterir.
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
      dene: ["h4-tek-bit-to-integer", "t4-int-slv", "t4-signed-aralik"],
    },
    {
      baslik: "Bit dizgileri ve sayı tabanları",
      metin: md(`
**Neden önemli?** Kayıtçı adresleri, maskeler ve başlangıç değerleri neredeyse her zaman onaltılık yazılır. 32 biti tek tek ikilik yazmak hem uzun hem hataya açıktır.

Bir vektöre değer verirken bitleri tabanla gruplayabilirsin:

- ~B"1010"~ ikilik, ~O"17"~ sekizlik (her basamak 3 bit), ~X"A5"~ onaltılık (her basamak 4 bit) yazımdır. ~X"A5"~ 8 bittir; ~X"3C"~ = ~"00111100"~; ~O"17"~ = ~"001111"~.
- Taban belirtilen dizgilerde okunabilirlik için alt çizgi kullanılabilir: ~X"FF_00"~, ~B"1010_0101"~. Tabansız ~"1010_0101"~ yazımında alt çizgi kullanılamaz.

Farklı tabanlar aynı bitleri verebilir. Şekilde aynı 12 bit iki türlü gruplanıyor:

[[G-H4-17]]

~X"333"~ = 0011 0011 0011. Aynı bitleri üçerli gruplayınca 001 100 110 011 = ~O"1463"~ çıkar. Bir tabandan ötekine geçmenin en kolay yolu önce ikiliğe açmak, sonra yeniden gruplamaktır.

Tamsayılar da tabanla yazılabilir: ~16#FF#~ = 255, ~2#1010#~ = 10. Bu yazım bir **tamsayı** verir, bit dizgisi değil; ~X"FF"~ ise 8 bitlik bir vektördür.

> **Çözümlü örnek:** ~X"2F"~ ve ~O"57"~ onluk olarak kaçtır?
>
> 1. ~X"2F"~: 2 · 16 + 15 = 47.
> 2. ~O"57"~: 5 · 8 + 7 = 47.
> 3. İkisi de ikilik 101111'dir; yalnızca gruplama farklı.

> **Sık hata:** ~X"A5"~'in 2 bit olduğunu sanmak. Her onaltılık basamak 4 bittir: 2 basamak 8 bit eder. Hedef vektörün genişliği de buna uymalıdır.

Aşağıdaki kod şekildeki eşitlikleri benzetimde sınar.
`),
      sim: {
        top: "tb",
        sure: "1ns",
        gorev: "K2'yi O\"1462\" yapıp eşitliğin bozulduğunu gör. Sonra X\"2F\" yerine kendi seçtiğin bir değeri yaz ve sonucu önce kafandan hesapla.",
        kod: `${UST}
entity tb is
end entity;

architecture sim of tb is
  constant K1 : std_logic_vector(11 downto 0) := X"333";
  constant K2 : std_logic_vector(11 downto 0) := O"1463";
  constant B1 : std_logic_vector(7 downto 0)  := B"1010_0101";
begin
  process
  begin
    if K1 = K2 then
      report "X""333"" ile O""1463"" ayni 12 bit";
    end if;
    if B1 = X"A5" then
      report "B""1010_0101"" = X""A5""";
    end if;
    report "X""2F"" = " & integer'image(to_integer(unsigned'(X"2F")));
    report "O""57"" = " & integer'image(to_integer(unsigned'(O"57")));
    report "16#FF# = " & integer'image(16#FF#) & ", 2#1010# = " & integer'image(2#1010#);
    wait;
  end process;
end architecture;
`,
      },
      dene: ["h4-hex-oktal", "t4-hex-ikili"],
    },
    {
      baslik: "Diziler ve alt tipler",
      metin: md(`
**Neden önemli?** Bellekler, kayıtçı dosyaları ve tablolar dizi tipleriyle yazılır. Bir tamsayının aralığı ise sentezde kaç bit harcanacağını belirler; gereksiz geniş bir aralık boşa giden flip-flop demektir.

Kendi dizi tiplerini tanımlayabilirsin. Bir bellek, kelimelerden oluşan bir dizidir:

~~~
type bellek_t is array (0 to 15) of std_logic_vector(7 downto 0);
signal ram : bellek_t;
~~~

[[G-H4-18]]

Şekilde solda ~ram~'ın ilk dört kelimesi var. ~ram(3)~ dördüncü kelimeyi, ~ram(3)(0)~ o kelimenin en düşük bitini verir. Dizi tipinde önce indeks aralığı (kelime sayısı), sonra eleman tipi (kelime genişliği) yazılır. ~ram'length~ kelime sayısıdır (16), kelime genişliği bunu etkilemez. VHDL'de hazır bir bellek tipi yoktur; önce böyle bir tip tanımlanır.

Bu bir **dizinin dizisidir** (1Dx1D) ve elemanlara iki ayrı parantezle erişilir: ~y(1)(2)~. Şeklin sağındaki gerçek **2 boyutlu** dizide ise tek parantez ve virgül kullanılır, tek indeksle bir satır alınamaz:

~~~
type matris_t is array (0 to 3, 0 to 3) of std_logic;
signal w : matris_t;   -- w(2, 1) bir bittir
~~~

Yapısı aynı olan iki dizi tipi yine de **farklı tiplerdir**: ~type row is array (7 downto 0) of std_logic;~ ile tanımlı bir sinyal, aynı genişlikteki ~std_logic_vector~'e atanamaz.

Bir port kendi tanımladığın bir dizi tipinde olacaksa, tip port listesinden **önce** görünür olmalıdır. Architecture'da tanımlanan tip entity'den sonra geldiği için yetmez; tip bir **package** içinde tanımlanır ve ~use work.paket_adi.all;~ ile tasarıma açılır.

**Vektör indisleri ve dilimler:** Bir dizgi değeri soldan sağa **indis sırasıyla** yerleşir. ~downto~ ile bildirilen vektörde soldaki bit en büyük indistir; ~to~ ile bildirilen vektörde en küçük indis (ör. ~b(0)~) soldadır.

[[G-H4-19]]

Dilimin yönü vektörün bildirildiği yönle aynı olmalıdır: ~a : std_logic_vector(7 downto 0)~ için ~a(7 downto 4)~ soldaki dört bittir, ~a(4 to 7)~ ise hatadır. Dilimler birleştirilebilir: ~a(1 downto 0) & a(3 downto 2)~ alt iki biti sola, üst iki biti sağa yazar.

**Alt tip** (subtype), var olan bir tipin değer aralığını daraltır ama tipi değiştirmez: ~subtype rakam is integer range 0 to 9;~ ile tanımlı bir nesne ~integer~ ile serbestçe karışır. ~type~ ile bildirilen bir tamsayı tipi ise ~type r_t is range 0 to 9;~ gibi **yeni ve bağımsız** bir tiptir; ~integer~'a atamak için ~integer(r)~ dönüşümü gerekir.

**Aralık ve bit sayısı:** Tamsayılara aralık vermek sentezde bit sayısını belirler:

[[G-H4-20]]

- ~integer range 0 to 15~ 4 bit (2^4 = 16 değer), ~0 to 100~ 7 bit (6 bit en çok 63'ü gösterir), ~0 to 255~ 8 bit.
- Negatif değer varsa ikiye tümleyen kullanılır: ~-8 to 7~ 4 bit, ~-63 to 63~ 6 değer biti ve 1 işaret biti, yani 7 bit.
- Aralık verilmezse ~integer~ 32 bit olarak sentezlenir.

Aralık dışı bir değer **benzetimde** hata verip benzetimi durdurur; 0 to 15 aralıklı bir sayaç 15'ten sonra 16 olursa benzetim durur. Sentezlenmiş devrede ise denetim yoktur, değer yalnızca bitlerin taşıyabildiği kadardır. Bu yüzden aralığı en büyük sonuca göre seç: 0..15 ve 0..31 aralıklı iki sayının çarpımı en çok 15 · 31 = 465'tir, ~range 0 to 511~ (9 bit) yeterlidir.

> **Çözümlü örnek:** Her biri 8 bit olan 4 kelimelik bir bellek tipi yaz ve 2. kelimenin en yüksek bitine eriş.
>
> 1. Önce kelime sayısı, sonra kelime tipi: ~type bellek4 is array (0 to 3) of std_logic_vector(7 downto 0);~
> 2. 2. kelime ~m(1)~'dir (indis 0'dan başlar); en yüksek biti ~m(1)(7)~.

> **Sık hata:** Gerçek 2 boyutlu bir diziye ~w(2)(1)~ diye erişmek. İki ayrı parantez yalnızca dizinin dizisi içindir; ~array (0 to 3, 0 to 3)~ biçiminde tanımlanan dizide ~w(2, 1)~ yazılır.

Aşağıdaki kod şekillerdeki bellek, matris ve dilim örneklerini benzetimde yazdırır.
`),
      sim: {
        top: "tb",
        sure: "2ns",
        gorev: "Sondaki r := r + 1; satırının başındaki -- işaretini sil ve aralık dışı değerin benzetimi nasıl durdurduğunu gör.",
        kod: `${UST}
entity tb is
end entity;

architecture sim of tb is
  type bellek_t is array (0 to 15) of std_logic_vector(7 downto 0);
  type matris_t is array (0 to 3, 0 to 3) of std_logic;
  subtype rakam is integer range 0 to 9;

  constant ram : bellek_t := (0 => X"12", 1 => X"A0", 2 => X"F0", 3 => X"5B", others => X"00");
  signal a     : std_logic_vector(7 downto 0) := "10110010";

  function bitler(s : std_logic_vector) return string is
    variable r : string(1 to s'length);
    variable k : positive := 1;
  begin
    for i in s'range loop
      r(k) := std_logic'image(s(i))(2);
      k := k + 1;
    end loop;
    return r;
  end function;
begin
  process
    variable w : matris_t := (others => (others => '0'));
    variable r : rakam := 9;
  begin
    report "ram'length = " & integer'image(ram'length);
    report "ram(3) = " & bitler(ram(3)) & ", ram(3)(0) = " & std_logic'image(ram(3)(0));
    w(2, 1) := '1';
    report "w(2, 1) = " & std_logic'image(w(2, 1));
    report "a(7 downto 4) = " & bitler(a(7 downto 4));
    report "a(1 downto 0) & a(3 downto 2) = " & bitler(a(1 downto 0) & a(3 downto 2));
    report "r = " & integer'image(r);
    -- r := r + 1;  -- açarsan r = 10 aralık dışı olur ve benzetim durur
    wait;
  end process;
end architecture;
`,
      },
      dene: ["h4-2d-erisim", "h4-integer-bit", "h4-port-dizisi"],
    },
  ],
  test: ["h4-variable-yer", "h4-signal-guncelleme", "h4-isim-gecerli", "h4-std-ulogic-deger", "h4-cozumleme", "h4-signed-deger", "h4-to-integer"],
};
