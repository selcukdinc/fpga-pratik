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
  ozet: "PROM, PAL, PLA, CPLD ve FPGA yapısını; bir LUT'un nasıl her kapıya dönüşebildiğini ve bir tasarımın koddan yongaya nasıl gittiğini öğren.",
  bolumler: [
    {
      baslik: "Çarpımların toplamı: PROM, PAL ve PLA",
      metin: md(`
**Neden önemli?** İlk programlanabilir yongaların hepsi aynı fikre dayanır: her mantık fonksiyonu VE'lerin VEYA'sı olarak yazılabilir. Bu fikri bir kez görürsen PROM, PAL ve PLA arasındaki farkı ezberlemen gerekmez; hangi dizinin programlandığına bakman yeter.

Her mantık fonksiyonu **çarpımların toplamı** biçiminde yazılabilir: önce girişlerin VE'leri (**çarpım terimleri**), sonra bu terimlerin VEYA'sı. Bir doğruluk tablosundan başlayalım:

[[G-H2-06]]

Tabloda F1'in 1 olduğu dört satır var. Her satırı tek başına bir çarpım terimi olarak yazarsan (bunlara **minterim** denir) F1 dört terimin toplamı olur. Şekildeki mavi satırlar (001 ve 101) yalnızca A'da farklıdır; A ne olursa olsun B = 0 ve C = 1 iken F1 = 1'dir, yani bu iki satır tek bir **B'C** terimine sığar. Yeşil satırlar da (110 ve 111) **AB** terimine sığar. Sonuç: F1 = B'C + AB.

İlk programlanabilir yongalar bu yapıyı doğrudan donanıma koydu: girişlerden çarpım terimlerini üreten bir **VE dizisi** ve onun ardından terimleri toplayan bir **VEYA dizisi**. Üç klasik yapı, hangi dizinin programlanabildiğine göre ayrılır:

[[G-H2-01]]

| Yapı | VE dizisi | VEYA dizisi | Sonuç |
| --- | --- | --- | --- |
| PROM | Sabit: tüm 2^n minterim | Programlanır | n girişte 2^n terim; sadeleştirmeye gerek yok |
| PAL | Programlanır | Sabit | Her çıkışın kendine ayrılmış birkaç terimi var; terimler paylaşılamaz |
| PLA | Programlanır | Programlanır | Bir terim birden çok çıkışta kullanılabilir; en esnek ama daha yavaş ve pahalı |

Şimdi aynı iki fonksiyonu, **F1 = AB + B'C** ve **F2 = AB + BC'**, üç yapıya da yerleştirelim. Şekillerde üstteki sütunlar girişler ve tersleridir (A, A', B, B', C, C'). Her yatay çizgi bir VE kapısına, yani bir çarpım terimine gider. Bir çizgiyle sütunun kesiştiği yerdeki **×** programlanmış bir bağlantıdır, **nokta** ise üretimde sabitlenmiş bir bağlantı.

[[G-H2-07]]

PROM'da VE dizisi sabittir ve 3 giriş için 2³ = 8 minterimin hepsini üretir. Biz yalnızca VEYA dizisinde hangi minterimin hangi çıkışa gideceğini seçeriz: F1 için 4, F2 için 3 bağlantı. Sadeleştirme bir şey kazandırmaz, çünkü her minterim zaten hazırdır.

[[G-H2-08]]

PAL'de terimleri kendimiz kurarız ama her çıkışın terimleri üretimde ona ayrılmıştır. AB terimi iki çıkışta da gerektiği için **iki kez** kurulur.

[[G-H2-09]]

PLA'da iki dizi de programlanır. AB terimi bir kez kurulur ve iki VEYA sütununa birden bağlanır, böylece 3 terim yeter. Bu esnekliğin bedeli, iki programlanır dizinin daha fazla anahtar ve daha uzun bir sinyal yolu gerektirmesidir: PLA daha yavaş ve daha pahalıdır.

> **Çözümlü örnek:** Yukarıdaki PLA'da A = 1, B = 0, C = 1 iken F1 ve F2 kaçtır?
>
> 1. Önce terimleri hesapla: AB = 1·0 = 0, B'C = 1·1 = 1, BC' = 0·0 = 0.
> 2. F1, AB ve B'C terimlerine bağlı: F1 = 0 + 1 = 1.
> 3. F2, AB ve BC' terimlerine bağlı: F2 = 0 + 0 = 0.
>
> Terim sayısı sorulursa farklı terimleri say: AB, B'C, BC' üç terimdir. PLA'da ortak terim bir kez kurulduğu için 3, PAL'de AB iki kez kurulduğu için 4 VE kapısı gerekir.

> **Sık hata:** PROM'un VE dizisinin programlandığını sanmak. PROM'da VE dizisi sabittir (tüm minterimler hazır), programlanan VEYA dizisidir. PAL'de tam tersi: VE programlanır, VEYA sabittir.
`),
      dene: ["h2-prom-terim", "h2-pla-terim-sayisi"],
    },
    {
      baslik: "Tarihçe ve CPLD",
      metin: md(`
**Neden önemli?** Her yeni yapı, bir öncekinin sınırına çözüm olarak doğdu. Bu sırayı bilmek, FPGA'nın neden bugünkü biçimde olduğunu anlamayı kolaylaştırır.

Derste verilen tarihçeye göre bu cihazlar şu sırayla ortaya çıktı:

[[G-H2-10]]

1. **PROM** (1966): VE dizisi sabit, VEYA dizisi programlanır.
2. **PLA** (1975): İki dizi de programlanır.
3. **PAL** (1980): VE dizisi programlanır, VEYA sabit; PLA'dan daha hızlı ve ucuz.
4. **CPLD** (1982): Birkaç PAL benzeri blok ve aralarında bir bağlantı matrisi.
5. **FPGA** (1985): Küçük LUT'lu blokların ızgarası ve programlanabilir bağlantılar.

**CPLD neden doğdu?** Tek bir PAL'in giriş, çıkış ve terim sayısı sınırlıdır. Tasarımlar büyüdükçe birkaç PAL'i kartta yan yana koymak yerine hepsini tek yongaya almak gerekti:

[[G-H2-11]]

**CPLD**, PAL benzeri birkaç mantık bloğunun ortak bir **bağlantı matrisiyle** birleştirilmiş halidir. Bloklar birbirine yalnızca ortadaki matris üzerinden bağlanır. Her bloğun çıkışında, sonucu doğrudan ya da bir flip-flop üzerinden veren **makro hücreler** bulunur.

FPGA aynı fikri çok daha ince taneli hale getirir: birkaç büyük blok yerine binlerce küçük blok ve onları her yönde bağlayan bir yol ağı. Bu yüzden FPGA'lar çok daha büyük devreleri alabilir.

> **Dikkat:** Sıra sorulduğunda PAL'in PLA'dan **sonra** geldiğine dikkat et: PLA 1975, PAL 1980. PAL, PLA'nın yavaşlığına çözüm olarak VEYA dizisini sabitledi.
`),
      dene: ["h2-tarihce-sira", "h2-cpld"],
    },
    {
      baslik: "FPGA'nın içi: CLB, LUT ve bağlantılar",
      metin: md(`
**Neden önemli?** Yazdığın her VHDL satırı sonunda LUT'lara ve flip-floplara dönüşür. Bir LUT'un yalnızca küçük bir tablo olduğunu görmek, sentez raporlarını okurken ve "bu tasarım kaç LUT tutar?" sorusunda işini kolaylaştırır.

FPGA dizi yapısı yerine çok sayıda küçük blok kullanır. Üç temel yapı taşı vardır:

- **CLB** (yapılandırılabilir mantık bloğu): Mantık işlevlerinin kurulduğu temel blok. İçinde LUT'lar, flip-floplar ve çoklayıcılar bulunur.
- **IOB** (giriş/çıkış bloğu): Yonganın bacaklarıyla iç mantık arasındaki bağlantıyı kurar.
- **Programlanabilir bağlantılar:** Blokları birbirine bağlayan anahtarlı yollar.

[[G-H2-02]]

Bir CLB'nin içinde sinyal şu yolu izler:

- **LUT** kombinasyonel mantık fonksiyonunu gerçekler: girişlere bakıp doğruluk tablosundaki çıkışı verir.
- LUT'un ardından gelen **D flip-flop**, bu sonucu **saat kenarında yakalayıp saklar**. Sonuç bir sonraki saat kenarına kadar sabit kalır; sayaçlar ve kayıtçılar bu flip-floplarla kurulur.
- Çıkıştaki **MUX** (çoklayıcı), CLB çıkışının flip-floptan mı (kayıtlı, saate bağlı) yoksa doğrudan LUT'tan mı (kombinasyonel) alınacağını seçer.

İki yolun farkı dalgada açıkça görünür:

[[G-H2-12]]

Seçim 0 iken çıkış, LUT çıkışı f değiştiği anda değişir. Seçim 1 iken çıkış yalnızca saatin yükselen kenarlarında (↑) f'nin o anki değerini alır ve bir sonraki kenara kadar tutar.

**LUT nedir?** k girişli bir **LUT** (arama tablosu), 2^k bitlik küçük bir bellektir. Girişler adres olur, çıkış o adresteki bittir. Doğruluk tablosunu bu belleğe yazarak k girişli **her** fonksiyonu kurabilirsin.

| Giriş sayısı (k) | Bellek (2^k bit) |
| --- | --- |
| 2 | 4 |
| 3 | 8 |
| 4 | 16 |
| 6 | 64 |

[[G-H2-03]]

Bellekteki bitlerden birini seçen şey bir çoklayıcıdır. Giriş sayısı arttıkça bu çoklayıcı, 2'ye 1 çoklayıcılardan oluşan bir ağaç gibi düşünülebilir:

[[G-H2-13]]

Her kademe bir girişe bakar ve iki yoldan birini seçer. Üç kademeden sonra sekiz hücreden yalnızca biri çıkışa ulaşır.

> **Çözümlü örnek:** 2 girişli LUT'ta OR kapısı için TABLO ne olmalı? Ders örneğinde TABLO soldan sağa ba = 11, 10, 01, 00 sırasıyla yazılır.
>
> 1. OR, en az bir giriş 1 iken 1'dir: ba = 11 → 1, 10 → 1, 01 → 1, 00 → 0.
> 2. Bu sırayla yan yana yaz: **"1110"**.
>
> Aynı yöntemle her kapının tablosunu bulabilirsin. Aşağıdaki şekilde bitlere tıklayıp dene.

[[G-H2-14]]

Modern FPGA'larda CLB'lere ek olarak sık kullanılan işler için hazır bloklar da vardır: **blok RAM** (hazır bellek), **DSP dilimleri** (hızlı çarpıcılar) ve saat üreten **PLL**'ler. Bunlar yongada sütunlar halinde, CLB'lerin arasına yerleşir:

[[G-H2-15]]

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
      dene: ["t2-lut-nand", "t2-clb-ff"],
    },
    {
      baslik: "Tasarım akışı",
      metin: md(`
**Neden önemli?** Vivado'da bir düğmeye basınca arka planda birçok adım çalışır. Hangi adımın neyi alıp neyi ürettiğini bilirsen bir hata mesajının hangi aşamadan geldiğini ve nereye dönmen gerektiğini hemen anlarsın.

Bir FPGA tasarımı şu adımlardan geçer:

1. **Tasarım girişi:** Devreyi VHDL gibi bir donanım tanımlama diliyle ya da şematikle tanımlarsın.
2. **Benzetim (simülasyon):** Bir testbench ile devrenin davranışını bilgisayarda denersin. Hataları yongaya gitmeden yakalamanın en ucuz yolu budur.
3. **Sentez:** Araç, kodunu kapılardan, LUT'lardan ve flip-floplardan oluşan bir bağlantı listesine (**netlist**) çevirir.
4. **Eşleme:** Netlist'teki elemanlar yonganın gerçek kaynak türlerine, yani LUT ve flip-floplara dağıtılır.
5. **Yerleştirme:** Eşlenen her parçaya yonga üzerinde belirli bir yer, yani hangi CLB'de çalışacağı seçilir.
6. **Yönlendirme:** Yerleştirilen bloklar ve bacaklar arasındaki bağlantılar programlanabilir yollar üzerinden kurulur. Bağlantıların gerçek gecikmeleri burada belli olur, zamanlama burada kontrol edilir.
7. **Bitstream üretimi ve yükleme:** Ortaya çıkan yapılandırma dosyası yongaya yüklenir.

Vivado eşleme, yerleştirme ve yönlendirmeyi birlikte **uygulama** (implementation) diye adlandırır.

[[G-H2-04]]

Aynı tam toplayıcıyı akış boyunca izleyelim:

[[G-H2-16]]

| Adım | Girdi | Çıktı |
| --- | --- | --- |
| Sentez | VHDL kodu | Netlist: iki XOR, iki AND, bir OR |
| Eşleme | Netlist | İki adet 3 girişli LUT (biri s, biri cout için) |
| Yerleştirme | Eşlenmiş LUT'lar | Her LUT için bir CLB, her port için bir bacak |
| Yönlendirme | Yerleşmiş bloklar | Teller ve gerçek gecikmeler |
| Bitstream | Yönlendirilmiş tasarım | Yongaya yüklenecek dosya |

Tam toplayıcının her çıkışı yalnızca üç girişe bağlı olduğu için beş kapı, eşlemede iki LUT'a sığar. Sentezdeki kapı sayısı ile kullanılan LUT sayısı bu yüzden aynı değildir.

> **Sık hata:** Eşleme, yerleştirme ve yönlendirmeyi karıştırmak. Kısa yol: **eşleme** "hangi tür kaynak?" (LUT mı, flip-flop mu), **yerleştirme** "yongada nerede?" (hangi CLB), **yönlendirme** "aralarına hangi tel?" sorusunun cevabıdır.

> **Dikkat:** Benzetim sentezden **önce** gelir. Hatalı bir tasarımı sentezleyip yonga üzerinde aramak çok daha zahmetlidir.
`),
      dene: ["h2-yonlendirme", "t2-yerlestirme"],
    },
    {
      baslik: "Modelleme yaklaşımları ve Vivado",
      metin: md(`
**Neden önemli?** Sınavlarda ve gerçek projelerde bir kodu görüp "bu hangi modelleme?" diye tanıman gerekir. Üç yaklaşımın aynı devreyi tanımlayabildiğini görmek, hangisini ne zaman seçeceğine karar vermeni sağlar.

Bir devreyi tanımlamanın üç temel yolu vardır:

- **Yapısal modelleme:** Devreyi daha küçük bileşenlerin (component) port map ile birbirine bağlanmasıyla kurarsın, tıpkı bir şema çizer gibi. Örneğin iki yarım toplayıcı ve bir VEYA kapısından tam toplayıcı.
- **Veri akışı modellemesi:** Process kullanmadan, eşzamanlı sinyal atamalarıyla verinin girişlerden çıkışa nasıl aktığını yazarsın. Örneğin ~y <= (a and b) or c;~ ya da ~s <= a + b;~
- **Davranışsal modelleme:** Devrenin ne yapacağını bir **process** içinde if, case gibi sıralı komutlarla anlatırsın, nasıl kurulacağını sentez aracına bırakırsın.

[[G-H2-05]]

Aynı tam toplayıcıyı üç biçimde de yazalım:

[[G-H2-17]]

Bir kodun hangi modelleme olduğunu anlamak için şuna bak: ~port map~ ile bileşenler bağlanıyorsa yapısal, process yoksa ve yalnızca ~<=~ atamaları varsa veri akışı, process içinde if ve case gibi komutlar varsa davranışsaldır.

Gerçek tasarımlarda bu yaklaşımlar birlikte kullanılır: üst seviyede bileşenler yapısal olarak bağlanır, her bileşenin içi davranışsal yazılır.

**Vivado'da proje kurmak.** Vivado yukarıdaki akışın hepsini tek bir arayüzde toplar:

[[G-H2-18]]

- Yeni proje sihirbazında **RTL Project** türü seçilir. Bu tür, VHDL kaynaklarından başlayıp sentez, uygulama ve bitstream üretimine kadar gider.
- Hedef yonga (part) proje oluşturulurken ya da proje ayarlarından seçilir. Derste kullanılan **Nexys 4** kartında Artix-7 ailesinden **xc7a100tcsg324-1** yongası vardır. Parça yanlış seçilirse kısıt dosyası (XDC) ve bitstream karta uymaz.
- Sentezden sonra **RTL şemasına** bakıp kodun hangi bloklara dönüştüğünü görebilirsin.

Bu sitedeki simülasyon alanı ise ilk iki adımı, yani tasarım girişini ve benzetimi tarayıcında yapar. Aşağıdaki örnek, üç modellemenin sekiz giriş birleşiminin hepsinde aynı sonucu verdiğini bir testbench ile kontrol ediyor.
`),
      sim: {
        top: "tb",
        sure: "100ns",
        gorev: "veri_akisi mimarisinde cout satırını \"cout <= (a and b) or cin;\" yap ve çalıştır. Hangi girişlerde fark çıktığını dalgada bul.",
        kod: `${UST}
-- Yarim toplayici: yapisal modelin parcasi
entity ha is
  port (x, y : in std_logic; s, c : out std_logic);
end entity;

architecture rtl of ha is
begin
  s <= x xor y;
  c <= x and y;
end architecture;

library ieee;
use ieee.std_logic_1164.all;

entity tam_toplayici is
  port (a, b, cin : in std_logic; s, cout : out std_logic);
end entity;

-- 1) Yapisal: iki yarim toplayici ve bir VEYA
architecture yapisal of tam_toplayici is
  signal s1, c1, c2 : std_logic;
begin
  u1 : entity work.ha port map (a, b, s1, c1);
  u2 : entity work.ha port map (s1, cin, s, c2);
  cout <= c1 or c2;
end architecture;

-- 2) Veri akisi: eszamanli atamalar
architecture veri_akisi of tam_toplayici is
begin
  s    <= a xor b xor cin;
  cout <= (a and b) or (cin and (a xor b));
end architecture;

-- 3) Davranissal: girislerdeki 1'leri say
architecture davranissal of tam_toplayici is
begin
  process (a, b, cin)
    variable n : integer;
  begin
    n := 0;
    if a = '1' then n := n + 1; end if;
    if b = '1' then n := n + 1; end if;
    if cin = '1' then n := n + 1; end if;
    if n mod 2 = 1 then s <= '1'; else s <= '0'; end if;
    if n >= 2 then cout <= '1'; else cout <= '0'; end if;
  end process;
end architecture;

library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity tb is
end entity;

architecture sim of tb is
  signal a, b, cin : std_logic := '0';
  signal s1, c1, s2, c2, s3, c3 : std_logic;
begin
  m1 : entity work.tam_toplayici(yapisal)     port map (a, b, cin, s1, c1);
  m2 : entity work.tam_toplayici(veri_akisi)  port map (a, b, cin, s2, c2);
  m3 : entity work.tam_toplayici(davranissal) port map (a, b, cin, s3, c3);

  process
    variable g : unsigned(2 downto 0);
  begin
    for i in 0 to 7 loop
      g := to_unsigned(i, 3);
      a <= g(2); b <= g(1); cin <= g(0);
      wait for 10 ns;
      assert s1 = s2 and s2 = s3 and c1 = c2 and c2 = c3
        report "mimariler farkli sonuc verdi" severity error;
    end loop;
    report "uc mimari 8 girisin hepsinde ayni sonucu verdi";
    wait;
  end process;
end architecture;
`,
      },
      dene: ["h2-modelleme-kod", "h2-vivado-rtl"],
    },
  ],
  test: ["h2-pal-dizi", "h2-pla-dizi", "h2-clb-lut", "h2-lut-bit", "h2-akis-sira", "h2-sentez"],
};
