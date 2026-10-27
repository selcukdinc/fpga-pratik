import { UST, md, type Ders } from "./tipler";

export const HAFTA_1: Ders = {
  hafta: 1,
  baslik: "FPGA nedir? FPGA, ASIC ve işlemci",
  ozet: "FPGA'nın ne olduğunu, ASIC ve işlemciyle farkını ve ne zaman tercih edildiğini öğren.",
  bolumler: [
    {
      baslik: "FPGA: sahada programlanabilen kapı dizisi",
      metin: md(`
**FPGA** (Field Programmable Gate Array), üretildikten sonra kullanıcının içindeki bağlantıları yeniden kurabildiği bir entegre devredir. Yonganın içinde binlerce küçük mantık bloğu, bunları birbirine bağlayan programlanabilir yollar ve dış dünyayla konuşan giriş/çıkış blokları vardır.

[[G-H1-01]]

Bir FPGA'ya "program" yüklediğimizde aslında bir yazılım çalıştırmayız; hangi mantık bloğunun hangi işlevi göreceğini ve blokların nasıl bağlanacağını belirleyen bir yapılandırma dosyası (**bitstream**) yükleriz. Yani FPGA, istediğimiz sayısal devreye dönüşen boş bir devre kartı gibi düşünülebilir.

- Yapılandırma değiştirilerek aynı yonga başka bir devreye dönüştürülebilir.
- Hata bulunduğunda yeni bir yonga üretmeye gerek kalmaz, tasarım güncellenip yeniden yüklenir.
`),
    },
    {
      baslik: "ASIC ile karşılaştırma",
      metin: md(`
**ASIC** (Application Specific Integrated Circuit) tek bir iş için özel olarak tasarlanıp üretilen yongadır. Devre silikona bir kez kazınır ve sonradan değiştirilemez.

- **Bir kerelik maliyet (NRE):** ASIC'te maske ve üretim hazırlığı çok pahalıdır. FPGA'da bu maliyet yoktur; hazır yongayı satın alıp kullanırsın.
- **Birim maliyet:** Yüz binlerce adet üretildiğinde ASIC'in tanesi FPGA'dan ucuza gelir. Az sayıda ürün için FPGA daha ekonomiktir.
- **Performans ve güç:** Aynı işi yapan ASIC genellikle daha hızlıdır ve daha az güç harcar, çünkü yalnızca gereken transistörleri içerir.
- **Esneklik:** FPGA sahada güncellenebilir. ASIC'te bir hata, yeni bir üretim turu demektir.
- **Analog devreler:** ASIC aynı kalıpta analog alıcı-verici gibi tam analog devreler barındırabilir. FPGA'larda ADC ya da PLL gibi bazı özel bloklar bulunur, ama tam analog devreler bulunmaz; programlanabilir kısım sayısaldır.

[[G-H1-02]]

Bu yüzden FPGA'lar sık sık **prototip** olarak da kullanılır: bir ASIC tasarımı silikona gönderilmeden önce FPGA üzerinde çalıştırılıp doğrulanır.
`),
    },
    {
      baslik: "İşlemci (CPU) ile karşılaştırma",
      metin: md(`
Bir işlemci, belleğindeki komutları **sırayla** okuyup yürütür. Aynı donanım her komutta farklı bir iş yapar.

FPGA'da ise yazdığın her parça kendi donanımına dönüşür ve hepsi **aynı anda** çalışır. Bir toplayıcı, bir karşılaştırıcı ve bir sayaç tasarladıysan üçü her saat çevriminde birlikte çalışır.

[[G-H1-03]]

- Paralel işlerde (görüntü işleme, sinyal işleme, haberleşme) FPGA, aynı saat hızındaki işlemciden çok daha fazla iş çıkarabilir.
- Zamanlaması kesin olmalı olan arayüzlerde FPGA öngörülebilir davranır; araya bir işletim sistemi girmez.
- Karmaşık, sırayla ilerleyen ve sık değişen işlerde işlemci daha pratiktir.
- İşlemci kayan noktalı sayılar gibi veri tiplerini ek bir tasarım yapmadan, doğrudan işler. FPGA'da bunun için ayrıca donanım tasarlamak gerekir.

Dört seçenek **en esnekten en verimliye** şöyle sıralanır: **CPU → GPU → FPGA → ASIC**. Bu sırada sağa gittikçe esneklik ve kullanım kolaylığı azalır, performans ve güç verimliliği artar. GPU, çok sayıda basit çekirdeğiyle işlemciden daha paralel ama FPGA kadar özelleştirilemeyen bir ara noktadır.

VHDL yazarken bu farkı akılda tutmak önemlidir: VHDL bir programlama dili gibi görünse de bir **donanım tanımlama dilidir**.
`),
    },
    {
      baslik: "Entegre devre ölçekleri",
      metin: md(`
Entegre devreler içerdikleri kapı sayısına göre sınıflanır. Derste verilen aralıklar şunlardır:

- **SSI** (küçük ölçek): 1-20 kapı. Örnek: dört tane iki girişli NAND içeren 7400.
- **MSI** (orta ölçek): 20-100 kapı. Sayıcılar, çoklayıcılar, kod çözücüler. Örnek: 74LS90 sayıcı entegresi.
- **LSI** (büyük ölçek): 100-5000 kapı. İlk mikroişlemciler.
- **VLSI** (çok büyük ölçek): 5000 ve üzeri kapı. Günümüz işlemcileri ve FPGA'lar bu sınırın çok üstündedir.

CPLD ya da FPGA bir ölçek değil, programlanabilir mantık türüdür.

Programlanabilir mantık, bu ölçeklerdeki hazır parçaları kartta bir araya getirmek yerine tek bir yongada istediğin devreyi kurmanı sağladı.
`),
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
