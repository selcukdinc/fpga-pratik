// B6: 1. ve 2. hafta için türetilmiş ek sorular. yedek: true olanlar soru havuzunda
// görünmez, yalnızca aralıklı tekrarda aynı kavramdan görülmemiş soru olarak gelir.
import { bit, turet, vektor, type Soru } from "./tipler.ts";

export const ekHafta12: Soru[] = [
  ...turet(1, "fpga-giris", "fpga-asic", [
    {
      id: "t1-nre-tanim", zorluk: 1, tip: "mcq",
      soru: "NRE (non-recurring engineering) maliyeti neyi anlatır?",
      secenekler: [
        "Tasarım ve maske için bir kez ödenen maliyeti",
        "Üretilen her yonga için tekrar tekrar ödenen birim maliyeti",
        "Cihazın çalışırken harcadığı enerjinin maliyetini",
        "Sahadaki cihazlara güncelleme göndermenin maliyetini",
      ],
      dogru: 0,
      aciklama: "NRE bir kerelik maliyettir; kaç adet üretilirse üretilsin bir kez ödenir. ASIC'te çok yüksektir, FPGA'da hazır yonga kullanıldığı için yok denecek kadar azdır.",
    },
    {
      id: "t1-asic-hata", zorluk: 1, tip: "tf",
      soru: "Üretilmiş bir ASIC'te tasarım hatası bulunursa, yeni bir yapılandırma dosyası yüklenerek hata sahada düzeltilebilir.",
      dogru: false,
      aciklama: "ASIC'te devre silikona kazınmıştır, sonradan değiştirilemez. Hatayı düzeltmek yeni bir üretim turu demektir. Sahada yeniden yapılandırma FPGA'nın üstünlüğüdür.",
    },
    {
      id: "t1-dusuk-adet", zorluk: 2, tip: "mcq", yedek: true,
      soru: "Bir laboratuvar yalnızca 20 adet ölçüm cihazı üretecek ve tasarımın ileride değişmesi bekleniyor. Hangisi en uygundur?",
      secenekler: ["ASIC", "Maske programlı ROM", "FPGA", "Tam özel yonga"],
      dogru: 2,
      aciklama: "Az adet ve değişebilecek bir tasarımda ASIC'in yüksek NRE'si karşılanamaz ve sonradan değiştirilemez. FPGA hem bir kerelik maliyet gerektirmez hem de yeniden yapılandırılabilir.",
    },
    {
      id: "t1-asic-guc", zorluk: 2, tip: "tf", yedek: true,
      soru: "Aynı işlevi yapan bir ASIC, genellikle aynı işi yapan bir FPGA'dan daha az güç harcar.",
      dogru: true,
      aciklama: "ASIC yalnızca gereken transistörleri içerir; FPGA'daki programlanabilir bağlantılar ve kullanılmayan kaynaklar ek güç ve gecikme getirir.",
    },
    {
      id: "t1-kesisim", zorluk: 3, tip: "fill", yedek: true,
      soru: "Bir üründe FPGA'nın birim maliyeti 50 TL, bir kerelik maliyeti yok. ASIC'in bir kerelik maliyeti (NRE) 2.000.000 TL, birim maliyeti 10 TL. Kaç adet üretimde iki seçeneğin toplam maliyeti eşit olur?",
      bosluklar: [["50000", "50.000"]],
      aciklama: "Eşitlik: 50·n = 2.000.000 + 10·n, yani 40·n = 2.000.000 ve n = 50.000. Bundan fazla üretimde ASIC, daha azında FPGA ucuzdur.",
    },
    {
      id: "t1-prototip-neden", zorluk: 2, tip: "mcq",
      soru: "Bir ASIC tasarımının silikona gönderilmeden önce FPGA üzerinde çalıştırılmasının temel nedeni nedir?",
      secenekler: [
        "FPGA'nın aynı tasarımı ASIC'ten daha hızlı çalıştırması",
        "ASIC üretiminin bir FPGA yongası gerektirmesi",
        "FPGA'nın analog devreleri de barındırabilmesi",
        "Hataların pahalı üretim turundan önce ucuza bulunabilmesi",
      ],
      dogru: 3,
      aciklama: "ASIC'te bir hata yeni bir maske ve üretim turu demektir. FPGA prototipi tasarımı gerçek donanımda erkenden doğrulamayı sağlar.",
    },
  ]),

  ...turet(1, "fpga-giris", "fpga-cpu", [
    {
      id: "t1-paralel-sayi", zorluk: 2, tip: "mcq",
      soru: "Bir FPGA tasarımında birbirinden bağımsız 8 toplayıcı kurulmuş. Her saat çevriminde en çok kaç toplama yapılabilir?",
      secenekler: ["1", "2", "8", "Toplayıcılar sırayla çalıştığı için 1/8"],
      dogru: 2,
      aciklama: "FPGA'da her toplayıcı kendi donanımıdır ve hepsi aynı anda çalışır. 8 toplayıcı her çevrimde 8 toplama yapar.",
    },
    {
      id: "t1-donanim-tanim", zorluk: 1, tip: "tf",
      soru: "VHDL ile yazılan bir tasarım FPGA'da işlemci komutları gibi sırayla yürütülmez; yazılan yapı donanıma dönüşür.",
      dogru: true,
      aciklama: "VHDL bir donanım tanımlama dilidir. Sentez aracı kodu kapılara, LUT'lara ve flip-floplara çevirir; bunlar aynı anda çalışır.",
    },
    {
      id: "t1-cpu-uygun", zorluk: 2, tip: "mcq", yedek: true,
      soru: "Hangi iş için genel amaçlı bir işlemci FPGA'dan daha uygundur?",
      secenekler: [
        "Saniyede milyonlarca pikseli işleyen bir görüntü hattı",
        "Sık değişen, adım adım ilerleyen bir masaüstü uygulaması",
        "Kesin zamanlamalı bir haberleşme arayüzü",
        "Aynı anda çalışan yüzlerce sayısal filtre",
      ],
      dogru: 1,
      aciklama: "Karmaşık, sırayla ilerleyen ve sık değişen işler işlemcide daha pratiktir. Paralel ve zamanlaması kesin işler FPGA'nın güçlü olduğu alanlardır.",
    },
    {
      id: "t1-zamanlama", zorluk: 2, tip: "tf", yedek: true,
      soru: "FPGA'da kurulan bir arayüzün zamanlaması, araya bir işletim sistemi girmediği için öngörülebilirdir.",
      dogru: true,
      aciklama: "FPGA'daki devre her saat çevriminde aynı işi yapar; işletim sistemi zamanlayıcısı ya da kesmeler araya girmez.",
    },
  ]),

  ...turet(1, "fpga-giris", "entegre-olcek", [
    {
      id: "t1-vlsi", zorluk: 1, tip: "mcq",
      soru: "Yüz binlerce ve daha fazla kapı içeren günümüz işlemcileri ve FPGA'lar hangi ölçekte sınıflanır?",
      secenekler: ["SSI", "MSI", "LSI", "VLSI"],
      dogru: 3,
      aciklama: "VLSI (çok büyük ölçekli tümleşik devre) yüz binlerce ve daha fazla kapıyı kapsar.",
    },
    {
      id: "t1-msi-ornek", zorluk: 2, tip: "mcq", yedek: true,
      soru: "Sayıcı, çoklayıcı ya da kod çözücü içeren, onlarca kapılık entegreler hangi ölçektedir?",
      secenekler: ["SSI", "MSI", "VLSI", "CPLD"],
      dogru: 1,
      aciklama: "Onlarca kapılık bu tür işlevsel bloklar MSI (orta ölçek) sınıfındadır. CPLD bir ölçek değil, bir programlanabilir mantık türüdür.",
    },
  ]),

  ...turet(2, "pld", "fpga-yapi", [
    {
      id: "t2-bitstream", zorluk: 1, tip: "mcq",
      soru: "FPGA'ya yüklenen ve hangi bloğun ne iş yapacağını, blokların nasıl bağlanacağını belirleyen dosyaya ne denir?",
      secenekler: ["Netlist", "Testbench", "Bitstream", "Kısıt dosyası"],
      dogru: 2,
      aciklama: "Bitstream, tasarım akışının sonunda üretilen yapılandırma dosyasıdır. FPGA'ya bir program değil, bu yapılandırma yüklenir.",
    },
    {
      id: "t2-iob", zorluk: 1, tip: "mcq", yedek: true,
      soru: "FPGA'da yonganın bacaklarıyla içerideki mantık arasında bağlantıyı kuran bloklar hangileridir?",
      secenekler: ["CLB", "LUT", "DSP dilimleri", "IOB"],
      dogru: 3,
      aciklama: "IOB (giriş/çıkış bloğu) yonganın dış dünyayla bağlantısını sağlar. Mantık işlevleri CLB'lerde kurulur.",
    },
    {
      id: "t2-ek-kaynak", zorluk: 2, tip: "mcq",
      soru: "Modern FPGA'larda CLB'lere ek olarak hangi özel bloklar bulunur?",
      secenekler: [
        "Blok RAM ve DSP dilimleri",
        "PROM'daki gibi sabit AND ve OR dizileri",
        "Yalnızca SSI kapıları",
        "Bir kez yakılabilen sigortalar",
      ],
      dogru: 0,
      aciklama: "Bellek ve çarpma gibi sık kullanılan işler için FPGA'larda blok RAM, DSP dilimleri ve saat üreteçleri (PLL) gibi hazır bloklar vardır.",
    },
    {
      id: "t2-yeniden", zorluk: 1, tip: "tf", yedek: true,
      soru: "Bir FPGA'ya farklı bir bitstream yüklenerek aynı yonga başka bir devreye dönüştürülebilir.",
      dogru: true,
      aciklama: "FPGA'nın adındaki \"field programmable\" bunu anlatır: yapılandırma sahada değiştirilebilir.",
    },
  ]),

  ...turet(2, "pld", "pld-diziler", [
    {
      id: "t2-pal-or-sabit", zorluk: 1, tip: "tf", yedek: true,
      soru: "PAL yapısında AND dizisi programlanabilir, OR dizisi sabittir.",
      dogru: true,
      aciklama: "PAL'de çarpım terimleri (AND dizisi) programlanır, her çıkış kendine ayrılmış terimleri sabit bir OR ile toplar.",
    },
    {
      id: "t2-prom-4giris", zorluk: 2, tip: "fill",
      soru: "4 girişli bir PROM'un sabit AND dizisi kaç çarpım terimi üretir?",
      bosluklar: [["16"]],
      aciklama: "PROM'un AND dizisi girişlerin tüm birleşimlerini üretir: 2^4 = 16 minterim.",
    },
    {
      id: "t2-prom-minterim", zorluk: 2, tip: "mcq", yedek: true,
      soru: "PROM'da AND dizisinin sabit olmasının sonucu nedir?",
      secenekler: [
        "Hiç çarpım terimi üretilmez",
        "Girişlerin tüm minterimleri her zaman üretilir",
        "Yalnızca iki çarpım terimi üretilir",
        "OR dizisinin de sabit olması gerekir",
      ],
      dogru: 1,
      aciklama: "Sabit AND dizisi n girişin 2^n minterimini üretir; fonksiyon, programlanabilir OR dizisinde hangi minterimlerin toplanacağı seçilerek kurulur.",
    },
    {
      id: "t2-pla-dezavantaj", zorluk: 2, tip: "mcq",
      soru: "PLA en esnek yapı olduğu halde neden her yerde tercih edilmez?",
      secenekler: [
        "Çarpım terimi üretemez",
        "Yalnızca tek çıkışı olabilir",
        "Daha yavaş ve daha pahalıdır",
        "Programlanamaz",
      ],
      dogru: 2,
      aciklama: "İki programlanabilir dizi daha fazla anahtar ve daha uzun sinyal yolu demektir; bu da hız ve maliyet açısından bedel öder.",
    },
    {
      id: "t2-sop", zorluk: 2, tip: "mcq", yedek: true,
      soru: "Önce bir AND dizisi, ardından bir OR dizisi kullanan yapılar fonksiyonu hangi biçimde gerçekler?",
      secenekler: ["Toplamların çarpımı", "Çarpımların toplamı", "Yalnızca XOR terimleri", "Doğruluk tablosunun tümleyeni"],
      dogru: 1,
      aciklama: "AND dizisi çarpım terimlerini, OR dizisi bunların toplamını üretir: çarpımların toplamı (sum of products).",
    },
  ]),

  ...turet(2, "pld", "pla-tasarim", [
    {
      id: "t2-pla-paylasim-sayi", zorluk: 3, tip: "fill",
      soru: "F1 = AB + BC ve F2 = BC + A'C fonksiyonları bir PLA ile gerçeklenecek. AND dizisinde **en az** kaç çarpım terimi gerekir?",
      bosluklar: [["3"]],
      aciklama: "Farklı terimler AB, BC ve A'C'dir. PLA'da BC terimi iki çıkışta ortak kullanılabildiği için 3 terim yeter.",
    },
    {
      id: "t2-pal-terim-sayi", zorluk: 3, tip: "fill", yedek: true,
      soru: "F1 = AB + BC ve F2 = BC + A'C fonksiyonları her çıkışın yalnızca kendi terimlerini kullanabildiği bir PAL'de gerçekleniyor. Toplam kaç AND kapısı (çarpım terimi) kullanılır?",
      bosluklar: [["4"]],
      aciklama: "PAL'de terimler paylaşılamaz: F1 için AB ve BC, F2 için yine BC ve A'C gerekir. BC iki kez kurulur, toplam 4 terim.",
    },
    {
      id: "t2-pla-deger", zorluk: 2, tip: "fill",
      soru: "Bir PLA'da P1 = AB, P2 = B'C ve F = P1 + P2 programlanmış. A = 0, B = 0, C = 1 iken F kaçtır?",
      bosluklar: [bit("1")],
      aciklama: "P1 = 0·0 = 0. P2 = B'·C = 1·1 = 1. F = 0 + 1 = 1.",
    },
  ]),

  ...turet(2, "pld", "lut-clb", [
    {
      id: "t2-lut-4", zorluk: 1, tip: "fill",
      soru: "4 girişli bir LUT, doğruluk tablosu için kaç bitlik bellek tutar?",
      bosluklar: [["16"]],
      aciklama: "k girişli LUT 2^k bitlik bir bellektir: 2^4 = 16.",
    },
    {
      id: "t2-lut-xor", zorluk: 3, tip: "fill", yedek: true,
      soru: "Ders örneğindeki 2 girişli LUT'ta tablo sırası (b,a) = 11, 10, 01, 00 biçiminde yazılıyor ve \"1000\" bir AND kapısı veriyor. XOR kapısı için TABLO sabiti ne olmalıdır?",
      bosluklar: [vektor("0110")],
      aciklama: "XOR, girişler farklıyken 1'dir: ba = 11 → 0, 10 → 1, 01 → 1, 00 → 0. Bu sırayla \"0110\".",
    },
    {
      id: "t2-lut-nand", zorluk: 3, tip: "fill",
      soru: "Aynı 2 girişli LUT'ta (sıra: ba = 11, 10, 01, 00) NAND kapısı için TABLO sabiti ne olmalıdır?",
      bosluklar: [vektor("0111")],
      aciklama: "NAND yalnızca iki giriş 1 iken 0'dır: ba = 11 → 0, diğerleri 1. Bu sırayla \"0111\".",
    },
    {
      id: "t2-lut-her-fonksiyon", zorluk: 2, tip: "tf", yedek: true,
      soru: "k girişli bir LUT, k girişli her mantık fonksiyonunu gerçekleyebilir.",
      dogru: true,
      aciklama: "LUT, doğruluk tablosunun tamamını saklar. Hangi tablo yazılırsa o fonksiyon elde edilir.",
    },
    {
      id: "t2-clb-ff", zorluk: 2, tip: "mcq",
      soru: "Bir CLB'de LUT çıkışından sonra gelen flip-flop ne işe yarar?",
      secenekler: [
        "LUT'un giriş sayısını iki katına çıkarır",
        "Sonucu saat kenarında saklar",
        "Bitstream'i saklar",
        "Analog sinyali sayısala çevirir",
      ],
      dogru: 1,
      aciklama: "Flip-flop, LUT'un kombinasyonel sonucunu saat kenarında yakalar. Bir çoklayıcı, çıkışın kayıtlı ya da doğrudan olacağını seçer.",
    },
  ]),

  ...turet(2, "tasarim-akisi", "tasarim-akisi", [
    {
      id: "t2-yerlestirme", zorluk: 2, tip: "mcq",
      soru: "Netlist'teki mantığın yonganın hangi gerçek kaynaklarında (hangi CLB'lerde) çalışacağının seçildiği adım hangisidir?",
      secenekler: ["Sentez", "Benzetim", "Bitstream yükleme", "Yerleştirme"],
      dogru: 3,
      aciklama: "Uygulama aşamasında önce yerleştirme yapılır: her mantık parçasına yongada bir yer seçilir. Ardından yönlendirme bu yerler arasındaki bağlantıları kurar.",
    },
    {
      id: "t2-benzetim-erken", zorluk: 1, tip: "tf", yedek: true,
      soru: "Benzetim, tasarım hatalarını yongaya yüklemeden önce yakalamanın en ucuz yoludur.",
      dogru: true,
      aciklama: "Benzetim bilgisayarda yapılır; sentez ve uygulama gibi uzun adımları beklemeden ve donanım gerekmeden hata bulunur.",
    },
    {
      id: "t2-zamanlama-adim", zorluk: 3, tip: "mcq", yedek: true,
      soru: "Bağlantıların gerçek gecikmeleriyle zamanlamanın kontrol edildiği adım hangisidir?",
      secenekler: ["Tasarım girişi", "Yerleştirme ve yönlendirme", "Davranışsal benzetim", "Kütüphane bildirimi"],
      dogru: 1,
      aciklama: "Gerçek gecikmeler, mantığın nereye yerleştirildiği ve bağlantıların nasıl yönlendirildiği belli olunca bilinir. Zamanlama bu yüzden uygulamada kontrol edilir.",
    },
    {
      id: "t2-akis-sonraki", zorluk: 2, tip: "mcq",
      soru: "Tasarım akışında sentezden hemen sonra gelen adım hangisidir?",
      secenekler: ["Tasarım girişi", "Benzetim", "Yerleştirme ve yönlendirme", "Testbench yazma"],
      dogru: 2,
      aciklama: "Sıra: tasarım girişi, benzetim, sentez, uygulama, bitstream üretimi ve yükleme.",
    },
  ]),

  ...turet(2, "tasarim-akisi", "modelleme", [
    {
      id: "t2-davranissal-kod", zorluk: 2, tip: "mcq",
      soru: "~s <= a + b;~ satırı hangi modelleme yaklaşımına örnektir?",
      secenekler: ["Yapısal", "Şematik", "Davranışsal", "Fiziksel yerleşim"],
      dogru: 2,
      aciklama: "Devrenin ne yapacağı anlatılıyor, nasıl kurulacağı sentez aracına bırakılıyor: davranışsal modelleme.",
    },
    {
      id: "t2-yapisal-ornek", zorluk: 2, tip: "mcq", yedek: true,
      soru: "Tam toplayıcıyı iki yarım toplayıcı ve bir OR kapısını birbirine bağlayarak kurmak hangi modellemedir?",
      secenekler: ["Davranışsal", "Yapısal", "Algoritmik", "Zamanlama"],
      dogru: 1,
      aciklama: "Devre, daha küçük bileşenlerin bağlanmasıyla, bir şema çizer gibi kuruluyor: yapısal modelleme.",
    },
    {
      id: "t2-karma", zorluk: 1, tip: "tf",
      soru: "Gerçek tasarımlarda üst seviyede bileşenler yapısal olarak bağlanır, bileşenlerin içi çoğunlukla davranışsal yazılır.",
      dogru: true,
      aciklama: "İki yaklaşım birlikte kullanılır: hiyerarşi yapısal, en alttaki bloklar davranışsal tanımlanır.",
    },
  ]),

  ...turet(2, "tasarim-akisi", "vivado", [
    {
      id: "t2-rtl-sema", zorluk: 2, tip: "mcq", yedek: true,
      soru: "Vivado'da sentezden sonra kodun hangi bloklara ve kapılara dönüştüğünü görmek için neye bakılır?",
      secenekler: ["Testbench'in dalga ekranına", "Bitstream dosyasına", "RTL şemasına", "Proje klasöründeki .vhd dosyasına"],
      dogru: 2,
      aciklama: "Şema görünümü, sentezin ürettiği devreyi bloklar ve bağlantılar olarak gösterir.",
    },
    {
      id: "t2-part-secim", zorluk: 1, tip: "tf",
      soru: "Vivado'da hedef FPGA yongası (part) proje oluşturulurken ya da proje ayarlarından seçilir.",
      dogru: true,
      aciklama: "Sentez ve uygulama hedef yonganın kaynaklarına göre yapılır; bu yüzden part seçimi projenin bir ayarıdır.",
    },
  ]),
];
