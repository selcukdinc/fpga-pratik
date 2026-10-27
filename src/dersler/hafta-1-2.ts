import { UST, md, type Ders } from "./tipler";

export const HAFTA_1: Ders = {
  hafta: 1,
  baslik: "FPGA nedir? FPGA, ASIC ve işlemci",
  ozet: "FPGA'nın içinde ne olduğunu, ASIC ve işlemciyle farkını, entegre ölçeklerini ve hangi işte hangisinin seçileceğini öğren.",
  bolumler: [
    {
      baslik: "FPGA: sahada programlanabilen kapı dizisi",
      metin: md(`
**Neden önemli?** Bu derste yazacağın her VHDL satırı sonunda bir FPGA'nın içinde gerçek bir devreye dönüşecek. FPGA'nın içini bir kez gözünde canlandırırsan, ilerideki "bu kod neden böyle sentezlendi?" sorularının çoğu kendiliğinden cevaplanır.

**FPGA** (Field Programmable Gate Array), üretildikten sonra kullanıcının içindeki bağlantıları yeniden kurabildiği bir entegre devredir. "Field programmable", yani **sahada programlanabilir** ifadesi, yonganın fabrikadan çıktıktan sonra, kullanıcının elinde yapılandırılabildiğini anlatır.

[[G-H1-01]]

Şekildeki üç yapı taşına bak:

- **CLB** (mantık bloğu): Izgara biçiminde dizilmiş kutular. Asıl mantık işlemleri bunların içinde yapılır. İçlerinde küçük tablolar (LUT), flip-floplar ve çoklayıcılar vardır; ayrıntısını 2. haftada göreceğiz.
- **IOB** (giriş/çıkış bloğu): Kenardaki küçük kutular. Yonganın bacaklarını içerideki mantığa bağlar.
- **Programlanabilir bağlantılar:** CLB'lerin arasındaki gri kanallar. Kesişim noktalarındaki **anahtar kutuları** hangi telin hangisine bağlanacağını belirler. Şekildeki mavi yol, yapılandırmayla kurulmuş örnek bir bağlantıdır: bir giriş bloğundan bir CLB'ye, oradan başka bir CLB'ye.

Bir anahtar kutusunu yakından inceleyelim. Dört yönden gelen teller kutuda buluşur ve aralarındaki her olası bağlantının bir anahtarı vardır. Her anahtarı küçük bir bellek hücresindeki tek bir bit açar ya da kapatır:

[[G-H1-05]]

Şekilde sol-üst ve sağ-alt bağlantılarının bitleri 1 olduğu için bu teller birbirine bağlanmış, diğerleri açık kalmış. Yonganın içinde bunun gibi milyonlarca bit vardır.

**Bitstream nedir?** Bir FPGA'ya "program" yüklediğimizde aslında bir yazılım çalıştırmayız. Bütün bu bitleri, yani hangi CLB'nin hangi işlevi göreceğini ve hangi anahtarın kapalı olacağını tek seferde yazan bir yapılandırma dosyası yükleriz. Bu dosyaya **bitstream** denir.

[[G-H1-04]]

Şekildeki iki bitstream aynı yongaya yükleniyor. A yüklendiğinde bazı CLB'ler ve yollar bir toplayıcı kuracak şekilde seçilir; B yüklendiğinde aynı yonga bir sayaca dönüşür. Yonga değişmedi, yalnızca yapılandırma değişti.

- Yapılandırma değiştirilerek aynı yonga başka bir devreye dönüştürülebilir.
- Hata bulunduğunda yeni bir yonga üretmeye gerek kalmaz, tasarım güncellenip yeniden yüklenir.
- Çoğu FPGA'da yapılandırma bitleri SRAM hücrelerinde durur ve güç kesilince silinir. Bu yüzden kartlarda bitstream ayrı bir flash bellekte saklanır ve her açılışta yongaya yeniden yüklenir.

> **Dikkat:** "FPGA'yı programlamak" ifadesi yanıltıcı olabilir. FPGA komut çalıştırmaz; yüklenen bitstream onu bir devreye dönüştürür. VHDL de bu yüzden bir programlama dili değil, bir **donanım tanımlama dilidir**.
`),
      dene: ["t1-donanim-tanim", "t1-asic-hata"],
    },
    {
      baslik: "ASIC ile karşılaştırma",
      metin: md(`
**Neden önemli?** Bir ürün tasarlarken ilk karar çoğu zaman "FPGA mı, ASIC mi?" sorusudur. Cevap tasarımın kendisinden çok üretim adedine ve tasarımın değişip değişmeyeceğine bağlıdır.

**ASIC** (Application Specific Integrated Circuit) tek bir iş için özel olarak tasarlanıp üretilen yongadır. Devre silikona bir kez kazınır ve sonradan değiştirilemez.

| Özellik | FPGA | ASIC |
| --- | --- | --- |
| Bir kerelik maliyet (NRE) | Yok denecek kadar az: hazır yonga alınır | Çok yüksek: tasarım, doğrulama, maske |
| Birim maliyet | Yüksek | Çok adette düşük |
| Performans ve güç | İyi | Daha hızlı, daha az güç |
| Sonradan değişiklik | Sahada yeniden yüklenir | İmkânsız, yeni üretim turu gerekir |
| Analog devre | ADC, PLL gibi bazı özel bloklar; tam analog devre yok | Analog alıcı-verici gibi tam analog devreler aynı kalıpta olabilir |
| Ürüne çıkış süresi | Kısa | Uzun |

ASIC'in daha hızlı ve az güç harcar olmasının nedeni, yalnızca gereken transistörleri içermesidir. FPGA'da programlanabilir bağlantılar ve kullanılmayan kaynaklar ek gecikme ve güç getirir.

**Hata düzeltmenin bedeli:** İki yolun en büyük farkı, bir hata bulunduğunda ne olduğudur.

[[G-H1-07]]

ASIC'te testte çıkan bir hata yeni bir maske ve üretim turu demektir; bu aylar sürer ve çok pahalıdır. FPGA'da kod düzeltilir, yeniden sentezlenir ve dakikalar içinde yüklenir. Bu yüzden FPGA'lar sık sık **prototip** olarak kullanılır: bir ASIC ya da işlemci tasarımı silikona gönderilmeden önce FPGA üzerinde çalıştırılıp doğrulanır.

**Maliyet ne zaman tersine döner?** Toplam maliyeti iki doğru olarak düşün. FPGA sıfırdan başlar ama her adette tane fiyatı kadar yükselir. ASIC yüksek bir NRE ile başlar ama yavaş yükselir.

[[G-H1-02]]

Kesişme noktasının solunda FPGA, sağında ASIC daha ucuzdur. Bu noktayı hesaplamak kolaydır:

> **Çözümlü örnek:** FPGA'nın tanesi 50 TL ve bir kerelik maliyeti yok. ASIC'in NRE'si 2.000.000 TL, tanesi 10 TL. Kaç adette eşitlenirler?
>
> 1. FPGA toplamı: 50·n. ASIC toplamı: 2.000.000 + 10·n.
> 2. Eşitle: 50·n = 2.000.000 + 10·n, yani 40·n = 2.000.000.
> 3. n = 50.000 adet. Bundan az üretimde FPGA, fazlasında ASIC ucuzdur.

Aşağıdaki şekil aynı hesabı ölçekli çizer. Adet kaydırıcısını oynatıp değerleri değiştirerek kesişme noktasının nasıl kaydığını gör:

[[G-H1-06]]

> **Sık hata:** "ASIC her zaman daha ucuzdur" demek. ASIC yalnızca çok adette ucuzdur. 20 adetlik bir laboratuvar cihazında NRE adetlere bölünemez ve FPGA açık ara ucuzdur.
`),
      dene: ["t1-nre-tanim", "h1-asic-seri-uretim"],
    },
    {
      baslik: "CPU, GPU, FPGA ve ASIC",
      metin: md(`
**Neden önemli?** FPGA ile işlemci arasındaki farkı anlamak, VHDL'i doğru düşünmenin anahtarıdır: VHDL'de yazdığın satırlar sırayla yürütülmez, hepsi aynı anda çalışan donanıma dönüşür.

Bir işlemci (CPU), belleğindeki komutları **sırayla** okuyup yürütür. Aynı donanım her komutta farklı bir iş yapar. FPGA'da ise yazdığın her parça kendi donanımına dönüşür ve hepsi **aynı anda** çalışır.

[[G-H1-03]]

Şekilde işlemci üç çevrimde toplama, karşılaştırma ve saymayı birer kez yapıyor. FPGA'da her işin kendi donanımı olduğu için aynı üç çevrimde her iş üçer kez yapılıyor.

Bu farkı sayılarla görelim. 8 bağımsız toplama yapılacak olsun:

[[G-H1-09]]

Üstteki saat dalgası çevrimleri gösteriyor. CPU'nun tek yürütme birimi her çevrimde bir toplama yapar ve işi 8 çevrimde bitirir. FPGA'da 8 ayrı toplayıcı kurulmuştur ve hepsi ilk saat kenarında birlikte çalışır: 8 toplama 1 çevrimde biter. FPGA'nın saat hızı işlemciden düşük olsa bile paralel işlerde çok daha fazla iş çıkarmasının nedeni budur.

**Kim nerede güçlü?**

- **FPGA:** Paralel işler (görüntü ve sinyal işleme, haberleşme) ve zamanlaması kesin olması gereken arayüzler. Araya bir işletim sistemi ya da kesme girmediği için her çevrimde aynı iş öngörülebilir biçimde yapılır.
- **CPU:** Karmaşık, sırayla ilerleyen ve sık değişen işler. İşlemci kayan noktalı sayılar gibi veri tiplerini ek bir tasarım yapmadan, doğrudan işler; FPGA'da bunun için ayrıca donanım tasarlamak gerekir.
- **GPU:** Çok sayıda basit çekirdekle aynı işlemi çok sayıda veriye uygular. İşlemciden daha paralel, ama FPGA kadar özelleştirilemez.

Dört seçenek tek bir eksende sıralanabilir:

[[G-H1-08]]

Sağa gittikçe performans ve güç verimliliği artar, sola gittikçe esneklik ve kullanım kolaylığı artar. Sıra: **CPU → GPU → FPGA → ASIC**.

> **Sık hata:** Sıralamada FPGA ile GPU'nun yerini karıştırmak. GPU hâlâ komut çalıştıran bir işlemcidir, bu yüzden FPGA'dan daha esnek ama daha az verimlidir.
`),
      dene: ["h1-esneklik-verim", "t1-paralel-sayi"],
    },
    {
      baslik: "Entegre devre ölçekleri",
      metin: md(`
**Neden önemli?** Programlanabilir mantığın neden ortaya çıktığını anlamak için önce entegrelerin nasıl büyüdüğüne bakmak gerekir: devreler büyüdükçe hazır parçaları kartta birleştirmek zorlaştı.

Entegre devreler içerdikleri mantık kapısı sayısına göre sınıflanır. Derste verilen aralıklar:

| Sınıf | Açılımı | Kapı sayısı | Örnek |
| --- | --- | --- | --- |
| SSI | küçük ölçek | 1-20 | 7400: dört NAND |
| MSI | orta ölçek | 20-100 | 74LS90 sayıcı, çoklayıcılar, kod çözücüler |
| LSI | büyük ölçek | 100-5000 | ilk mikroişlemciler |
| VLSI | çok büyük ölçek | 5000 ve üzeri | günümüz işlemcileri ve FPGA'lar |

Bu aralıklar her biri öncekinin katları olduğu için en iyi logaritmik bir eksende görünür:

[[G-H1-10]]

Şeritte her çentik 10 kat demektir. Günümüz FPGA'ları milyonlarca kapıya denk mantık içerir ve VLSI sınırının çok ötesindedir.

Bir SSI entegresinin içine bakalım:

[[G-H1-11]]

7400'ün 14 bacağı vardır. İçinde dört tane iki girişli NAND (VE DEĞİL) kapısı bulunur; örneğin 1 ve 2 numaralı bacaklar bir kapının girişi, 3 numara çıkışıdır. 14 besleme (VCC), 7 topraktır (GND). Toplam 4 kapı olduğu için SSI sınıfındadır.

> **Dikkat:** CPLD ve FPGA birer ölçek değil, programlanabilir mantık türüdür. "Sayıcı içeren onlarca kapılık entegre hangi ölçekte?" sorusunun cevabı MSI'dır, CPLD değil.

Programlanabilir mantık, bu ölçeklerdeki hazır parçaları kartta bir araya getirmek yerine tek bir yongada istediğin devreyi kurmanı sağladı. Bu yolculuğun ayrıntısı 2. haftanın konusu.
`),
      dene: ["h1-entegre-olcek", "t1-vlsi"],
    },
    {
      baslik: "Hangisini seçmeli?",
      metin: md(`
**Neden önemli?** Sınavda ve gerçek hayatta sorular çoğu zaman bir senaryo olarak gelir: "Şu cihaz için hangisi uygundur?" Doğru cevabı bulmak için birkaç soruyu sırayla sormak yeterlidir.

[[G-H1-12]]

Karar ağacını yukarıdan aşağı oku:

1. İş paralel mi, zamanlaması kesin mi? Değilse, yani iş sırayla ilerleyen ve sık değişen bir yazılımsa, işlemci en pratik seçimdir.
2. Paralelse: tasarım kesinleşti mi ve çok yüksek adette mi üretilecek? Evetse ASIC'in yüksek NRE'si adetlere bölünür ve birim maliyet en düşük olur. Değilse FPGA uygundur.
3. ASIC seçilse bile tasarım önce FPGA'da prototiplenir; hatalar pahalı üretim turundan önce ucuza bulunur.

Birkaç senaryoyu bu ağaçla çözelim:

| Senaryo | Seçim | Neden |
| --- | --- | --- |
| Tasarımı kesinleşmiş oyuncak kontrol devresi, 1 milyon adet | ASIC | NRE çok adede bölünür, birim maliyet en düşük |
| Algoritması birkaç yılda bir güncellenecek baz istasyonu | FPGA | Gerçek zamanlı paralel iş, sahada güncellenebilir |
| 20 adetlik, tasarımı değişebilecek ölçüm cihazı | FPGA | NRE karşılanamaz, değişiklik gerekecek |
| Sık değişen, adım adım ilerleyen masaüstü uygulaması | CPU | Sıralı iş, yazılımla değiştirmek kolay |
| Silikona gidecek yeni bir işlemci tasarımı | Önce FPGA, sonra ASIC | Hatalar prototipte ucuza bulunur |

> **İpucu:** Senaryoda "güncellenecek", "değişebilir" ya da "az adet" geçiyorsa FPGA'ya; "kesinleşmiş" ve "milyon adet" geçiyorsa ASIC'e; "sırayla", "sık değişen yazılım" geçiyorsa işlemciye yönel.
`),
      dene: ["h1-fpga-guncelleme", "t1-prototip-neden"],
    },
  ],
  test: ["h1-fpga-acilim", "h1-fpga-asic-nre", "h1-fpga-cpu-paralel", "h1-prototip", "h1-7400-ssi"],
};

export const HAFTA_2: Ders = {
  hafta: 2,
  baslik: "Programlanabilir mantık ve tasarım akışı",
  ozet: "PROM, PAL, PLA, CPLD ve FPGA yapısını; bir tasarımın koddan yongaya nasıl gittiğini öğren.",
  bolumler: [
    {
      baslik: "VE-VEYA dizileri: PROM, PAL ve PLA",
      metin: md(`
Her mantık fonksiyonu **çarpımların toplamı** biçiminde yazılabilir: önce girişlerin VE'leri (çarpım terimleri), sonra bu terimlerin VEYA'sı. İlk programlanabilir yongalar bu yapıyı doğrudan donanıma koydu: bir **VE dizisi** ve onun ardından bir **VEYA dizisi**.

Üç klasik yapı, hangi dizinin programlanabildiğine göre ayrılır:

- **PROM:** VE dizisi sabittir ve girişlerin tüm birleşimlerini (tüm minterimleri) üretir; VEYA dizisi programlanır. n girişte 2^n terim vardır.
- **PAL:** VE dizisi programlanır, VEYA dizisi sabittir. Her çıkış kendine ayrılmış birkaç terimi toplar; terimler çıkışlar arasında paylaşılamaz.
- **PLA:** Her iki dizi de programlanır. Bir çarpım terimi birden çok çıkışta kullanılabilir, bu yüzden en esnek olanıdır ama daha yavaş ve pahalıdır.

[[G-H2-01]]

**CPLD**, birkaç PAL benzeri bloğun ortak bir bağlantı matrisiyle birleştirilmiş halidir. İhtiyaçlar büyüdükçe tek bir PLD yetmeyince bu yol seçildi. FPGA ise aynı fikrin çok daha ince taneli ve büyük devamıdır.

Derste verilen tarihçeye göre bu cihazlar şu sırayla ortaya çıktı:

- **PROM:** 1966
- **PLA:** 1975
- **PAL:** 1980
- **CPLD:** 1982
- **FPGA:** 1985
`),
    },
    {
      baslik: "FPGA'nın içi: CLB, LUT ve bağlantılar",
      metin: md(`
FPGA dizi yapısı yerine çok sayıda küçük blok kullanır:

- **CLB** (yapılandırılabilir mantık bloğu): Mantık işlevlerinin kurulduğu temel blok. İçinde LUT'lar, flip-floplar ve çoklayıcılar bulunur; her birinin ayrı bir görevi vardır (aşağıda).
- **LUT** (arama tablosu): k girişli bir LUT, 2^k bitlik küçük bir bellektir. Girişler adres olur, çıkış o adresteki bittir. Doğruluk tablosunu bu belleğe yazarak k girişli **her** fonksiyonu kurabilirsin.
- **IOB:** Yonganın bacaklarıyla iç mantık arasındaki giriş/çıkış blokları.
- **Programlanabilir bağlantılar:** Blokları birbirine bağlayan anahtarlı yollar.

[[G-H2-02]]

Bir CLB'nin içinde sinyal şu yolu izler:

- **LUT** kombinasyonel mantık fonksiyonunu gerçekler: girişlere bakıp doğruluk tablosundaki çıkışı verir.
- LUT'un ardından gelen **D flip-flop**, bu sonucu **saat kenarında yakalayıp saklar**. Böylece sonuç bir sonraki saat kenarına kadar sabit kalır; sayaçlar ve kayıtçılar bu flip-floplarla kurulur.
- Çıkıştaki **MUX** (çoklayıcı), CLB çıkışının flip-floptan mı (kayıtlı, saate bağlı) yoksa doğrudan LUT'tan mı (kombinasyonel) alınacağını seçer.

Modern FPGA'larda bunlara ek olarak blok RAM, DSP (çarpıcı) dilimleri ve saat üreteçleri (PLL) de bulunur.

[[G-H2-03]]

Aşağıdaki örnekte 2 girişli bir LUT'u VHDL'de sabit bir tabloyla kuruyoruz. ~TABLO~ sabitini değiştirip aynı donanımı başka bir kapıya dönüştürebilirsin.
`),
      sim: {
        top: "tb",
        sure: "50ns",
        gorev: "TABLO'yu \"0110\" yapıp XOR'a, \"1110\" yapıp OR'a dönüştür. Dalga ekranında y'nin nasıl değiştiğine bak.",
        kod: `${UST}
-- 2 girişli LUT: a ve b adres olur, çıkış tablodaki bittir
entity lut2 is
  port (a, b : in std_logic; y : out std_logic);
end entity;

architecture rtl of lut2 is
  -- Sıra: (b,a) = 11, 10, 01, 00  ->  "1000" bir AND kapısıdır
  constant TABLO : std_logic_vector(3 downto 0) := "1000";
begin
  y <= TABLO(to_integer(unsigned'(b & a)));
end architecture;

library ieee;
use ieee.std_logic_1164.all;

entity tb is
end entity;

architecture sim of tb is
  signal a, b, y : std_logic := '0';
begin
  uut : entity work.lut2 port map (a => a, b => b, y => y);

  process
  begin
    a <= '0'; b <= '0'; wait for 10 ns;
    a <= '1'; b <= '0'; wait for 10 ns;
    a <= '0'; b <= '1'; wait for 10 ns;
    a <= '1'; b <= '1'; wait for 10 ns;
    report "LUT tablosu tarandi";
    wait;
  end process;
end architecture;
`,
      },
    },
    {
      baslik: "Tasarım akışı",
      metin: md(`
Bir FPGA tasarımı şu adımlardan geçer:

- **Tasarım girişi:** Devreyi VHDL gibi bir donanım tanımlama diliyle ya da şematikle tanımlarsın.
- **Benzetim (simülasyon):** Bir testbench ile devrenin davranışını bilgisayarda denersin. Hataları yongaya gitmeden yakalamanın en ucuz yolu budur.
- **Sentez:** Araç, kodunu kapılardan, LUT'lardan ve flip-floplardan oluşan bir bağlantı listesine (netlist) çevirir.
- **Eşleme:** Netlist'teki elemanlar yonganın gerçek kaynaklarına, yani CLB'lerdeki LUT ve flip-floplara dağıtılır.
- **Yerleştirme ve yönlendirme:** Eşlenen bloklar yonga üzerinde belirli yerlere **yerleştirilir** ve aralarındaki bağlantılar **yönlendirilir**. Bağlantıların gerçek gecikmeleri burada belli olur, zamanlama burada kontrol edilir. Vivado bu son adımları birlikte **uygulama** (implementation) diye adlandırır.
- **Bitstream üretimi ve yükleme:** Ortaya çıkan yapılandırma dosyası yongaya yüklenir.

[[G-H2-04]]

Vivado bu adımların hepsini tek bir arayüzde toplar:

- Yeni proje sihirbazında **RTL Project** türü seçilir. Bu tür, VHDL kaynaklarından başlayıp sentez, uygulama ve bitstream üretimine kadar gider.
- Hedef yonga (part) proje oluşturulurken ya da proje ayarlarından seçilir. Derste kullanılan **Nexys 4** kartında Artix-7 ailesinden **xc7a100tcsg324-1** yongası vardır. Parça yanlış seçilirse kısıt dosyası (XDC) ve bitstream karta uymaz.
- Sentezden sonra RTL şemasına bakıp kodun hangi bloklara dönüştüğünü görebilirsin.

Bu sitedeki simülasyon alanı ise ilk iki adımı tarayıcında yapar.
`),
    },
    {
      baslik: "Modelleme yaklaşımları",
      metin: md(`
Bir devreyi tanımlamanın üç temel yolu vardır:

- **Yapısal modelleme:** Devreyi daha küçük bileşenlerin (component) port map ile birbirine bağlanmasıyla kurarsın, tıpkı bir şema çizer gibi. Örneğin iki yarım toplayıcı ve bir VEYA kapısından tam toplayıcı.
- **Veri akışı modellemesi:** Process kullanmadan, eşzamanlı sinyal atamalarıyla verinin girişlerden çıkışa nasıl aktığını yazarsın. Örneğin ~y <= (a and b) or c;~ ya da ~s <= a + b;~
- **Davranışsal modelleme:** Devrenin ne yapacağını bir **process** içinde if, case gibi sıralı komutlarla anlatırsın, nasıl kurulacağını sentez aracına bırakırsın.

[[G-H2-05]]

Gerçek tasarımlarda bu yaklaşımlar birlikte kullanılır: üst seviyede bileşenler yapısal olarak bağlanır, her bileşenin içi davranışsal yazılır.
`),
    },
  ],
  test: ["h2-pal-dizi", "h2-pla-dizi", "h2-clb-lut", "h2-lut-bit", "h2-akis-sira", "h2-sentez"],
};
