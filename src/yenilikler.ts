// Sitedeki yenilikler, en yenisi en üstte. Kullanıcıya görünen her değişiklik
// (her PR) buraya bir kayıt ekler; yenilikler.test.ts sırayı ve biçimi denetler.
// Maddeler kullanıcının diliyle yazılır: ne değişti, sana ne kazandırır.
// Markdown alt kümesi kullanılabilir (`kod`, **kalın**).

export interface Yenilik {
  // Değişikliği getiren PR'ın numarası; kaydın kimliği de budur
  pr: number;
  // YYYY-AA-GG
  tarih: string;
  baslik: string;
  maddeler: string[];
}

export const YENILIKLER: Yenilik[] = [
  {
    pr: 33,
    tarih: "2026-10-28",
    baslik: "Derslerde ilerlemen kaydediliyor",
    maddeler: [
      "Her ders bölümünün sonunda **Bu bölümü bitirdim** düğmesi var. Bitirdiğin bölümler içindekiler listesinde işaretleniyor; yanlışlıkla bastıysan **Geri al** ile kaldırabilirsin.",
      "Dersler sayfasında her haftanın kaç bölümünü bitirdiğin görünüyor ve en son okuduğun bölüm **Kaldığın yer** kutusunda duruyor; **Devam et** ile oraya dönüyorsun. İstediğin bölümü içindekilerden yeniden açabilirsin.",
      "Giriş yapmadan da çalışır: ilerlemen bu tarayıcıda saklanır, hesabına giriş yapınca hesabına taşınır.",
      "Soru havuzu artık açılınca çözmediğin soruları gösteriyor. Derste, tekrarda ya da havuzda çözdüğün sorular gizli; **Tümü**'ne basınca \"✓ Çözdün\" işaretiyle görünüyor. Derslerdeki sorularda da aynı işaret var.",
    ],
  },
  {
    pr: 32,
    tarih: "2026-10-28",
    baslik: "Sorular kendi başına anlaşılır oldu",
    maddeler: [
      "\"Aynı kodda\", \"Hafta 4_1'de\" gibi başka bir soruya ya da slayta dayanan sorular artık gereken kodu ve bilgiyi kendi içinde veriyor. NAND zinciri sorularında kod görünüyor, `y`'nin sinyal olduğu yazıyor.",
      "Soru kartının köşesindeki slayt adı yerine **Derste oku** bağlantısı var: sorunun konusunun anlatıldığı ders bölümüne götürüyor.",
      "Aynı bilgiyi soran ikiz sorulardan soru havuzunda yalnızca biri görünüyor; daha önce birini çözdüysen o kalıyor.",
      "Derste çözümlü örnek olarak gösterilen değerler (ör. `7 mod (-3)`, `X\"333\"`) artık sorularda sorulmuyor; sorular başka sayılarla geliyor.",
    ],
  },
  {
    pr: 31,
    tarih: "2026-10-28",
    baslik: "Kod editöründe girinti düzeltildi",
    maddeler: [
      "Enter'a basınca yeni satır bir önceki satırın hizasından başlıyor; `wait;` ya da `wait for 0 ns;` sonrasında imleç artık kaymıyor.",
      "`then`, `begin`, `is`, `loop`, `=>` gibi blok açan satırlardan sonra girinti bir kademe artıyor.",
      "`end`, `else`, `elsif`, `when` ve `begin` yazınca satır kendiliğinden geri geliyor; `end case;` ve `end if;` açtıkları satırın hizasına oturuyor.",
    ],
  },
  {
    pr: 30,
    tarih: "2026-10-28",
    baslik: "Soru kartları ve ders benzetimleri düzenlendi",
    maddeler: [
      "Soru havuzunda ve tekrarda bütün soru kartları aynı genişlikte; kodlu ve kodsuz sorular artık düzensiz durmuyor.",
      "Sağ sütuna sığmayan kod yana kaydırılmak yerine sorunun altında tam genişlikte gösteriliyor.",
      "Doğru/yanlış sorularında sonuç artık açık: \"Cevabın doğru: bu ifade yanlış.\" gibi.",
      "Hata mesajlarındaki kod alıntılarında Türkçe karakterler (ç, ş, ğ, ı) bozulmuyor.",
      "Derslerdeki benzetimlerde mesaj alanı sürüklenerek büyütülebiliyor. Geniş ekranda **Yan yana** seçilirse mesajlar ve dalga ekranı kodun sağına geçiyor; tercih hatırlanıyor.",
    ],
  },
  {
    pr: 29,
    tarih: "2026-10-27",
    baslik: "5. hafta dersi derinleşti",
    maddeler: [
      "Ders 6 bölüme ayrıldı; durum makineleri kendi bölümünü aldı.",
      "Son else'i olmayan when/else'in geri beslemesi, std_logic seçicinin 81 değeri, process'in yaşam döngüsü, eksik hassasiyetin dalgası, açılan for döngüsü, next ve exit, flip-flop, iki reset türü, sayaç ve kaydırmalı kayıtçı gibi 14 yeni şekil eklendi.",
      "**Durum makinesi adımlayıcı:** \"101\" dedektörüne bit bit giriş ver; etkin durum ve son geçiş diyagramda vurgulanır.",
      "İki yeni benzetim: eksik hassasiyet listesi ve \"101\" dizi dedektörü.",
      "Her bölümde çözümlü örnek, sık hatalar ve **Kendini dene** soruları var.",
    ],
  },
  {
    pr: 28,
    tarih: "2026-10-27",
    baslik: "4. hafta dersi derinleşti",
    maddeler: [
      "Ders 7 bölüme ayrıldı; delta döngüsü ile bit dizgileri ve sayı tabanları kendi bölümlerini aldı.",
      "Kapsam haritası, sinyal ve değişkenle takas, hatalı birler sayacının adım adım tablosu, std_logic güç merdiveni, çözümleme tablosunun tamamı, çekme direnci, tip dönüşüm haritası gibi 17 yeni şekil eklendi.",
      "**Delta adımlayıcı:** bir process'i satır satır ilerlet; değişkenin hemen, sinyalin bir delta sonra değiştiğini gör.",
      "Üç yeni benzetim: delta adımları, bit dizgileri ve diziler.",
      "Her bölümde çözümlü örnek, sık hatalar ve **Kendini dene** soruları var.",
    ],
  },
  {
    pr: 27,
    tarih: "2026-10-27",
    baslik: "3. hafta dersi derinleşti",
    maddeler: [
      "Ders 8 bölüme ayrıldı; toplayıcılar ve numeric_std aritmetiği kendi bölümlerini aldı, öznitelikler üç bölümde anlatılıyor.",
      "Port modları, tam toplayıcının kapıları, 4 bitlik elde zinciri, operatör öncelik merdiveni, bit bit kaydırma, sayı doğrusunda mod ve rem, taşmayı gösteren sayı çemberi gibi 17 yeni şekil eklendi.",
      "**Öznitelik gezgini:** bir aralık ve bir öznitelik seç; 'left, 'high, 'range gibi özniteliklerin hangi kutuyu gösterdiğini ve sonucunu gör.",
      "Beş yeni benzetim: 4 bitlik toplayıcı, taşma, dizi öznitelikleri, saat kenarları ve sayım tipleri.",
      "Her bölümde çözümlü örnek, sık hatalar ve **Kendini dene** soruları var.",
    ],
  },
  {
    pr: 26,
    tarih: "2026-10-27",
    baslik: "2. hafta dersi derinleşti",
    maddeler: [
      "Aynı iki fonksiyon PROM, PAL ve PLA'ya adım adım yerleştiriliyor; hangi bağlantının programlandığını şekilde görebilirsin.",
      "Tarihçe zaman çizgisi, CPLD'nin içi, CLB'de kayıtlı ve kayıtsız yolun dalgası, 3 girişli LUT'un çoklayıcı ağacı ve FPGA'nın kaynak haritası eklendi.",
      "**LUT'a bit yaz, kapıyı gör:** tablodaki bitlere tıklayınca LUT'un hangi kapıya dönüştüğünü görürsün.",
      "Tasarım akışı aynı tam toplayıcı üzerinde adım adım anlatılıyor. Üç modelleme biçimi yan yana, bir benzetimle de üçünün aynı sonucu verdiği gösteriliyor.",
      "Her bölümde çözümlü örnek, sık hatalar ve **Kendini dene** soruları var.",
    ],
  },
  {
    pr: 25,
    tarih: "2026-10-27",
    baslik: "Yenilikler üst çubukta da görünüyor",
    maddeler: [
      "Son ziyaretinden sonra yeni bir şey eklendiyse üst çubukta **Yeni** yazısı ve sayısı çıkar; telefonda menüyü açmadan da görürsün. Tıklayınca Yenilikler sayfasına gidersin.",
    ],
  },
  {
    pr: 24,
    tarih: "2026-10-27",
    baslik: "Yenilikler sayfası",
    maddeler: [
      "Sitede neyin değiştiğini artık bu sayfadan görebilirsin. Her güncelleme buraya kısa bir not ekler.",
      "Son ziyaretinden sonra yeni bir şey eklendiyse menüdeki **Yenilikler** yanında bir sayı görünür. Bu bilgi yalnızca kendi tarayıcında tutulur.",
    ],
  },
  {
    pr: 23,
    tarih: "2026-10-27",
    baslik: "Ortalanmış sayfalar ve ayarlanabilir metin boyutu",
    maddeler: [
      "Sayfalar artık pencerenin ortasında duruyor; geniş ekranda sağ taraf boş kalmıyor.",
      "Üst çubuktaki **A−** ve **A+** ile yazıları %85 ile %150 arasında küçültüp büyütebilirsin. Seçimin tarayıcında saklanır, hesabınla girdiysen her cihazda aynı boyut gelir. Aynı ayar Ayarlar sayfasında da var.",
      "Geniş ekranda kod içeren sorular iki sütuna ayrılır: soru ve şıklar solda, kod sağda.",
      "Simülasyon alanında panel düzeni olduğu gibi kalır, editör ve mesaj yazıları seçtiğin boyutla büyür.",
    ],
  },
  {
    pr: 22,
    tarih: "2026-10-27",
    baslik: "Simülasyon alanında iki düzeltme",
    maddeler: [
      "Dalga ekranını ortaya taşıyıp sonra tekrar sağa almak artık sorunsuz: paneller yine satırı doldurur.",
      "Soru çözerken simülasyon alanına geçip geri döndüğünde cevapların ve kaldığın yer korunur. Simülasyon alanındaki kod ve dalgalar da başka sayfaya geçince kaybolmaz.",
    ],
  },
  {
    pr: 21,
    tarih: "2026-10-27",
    baslik: "1. hafta dersi derinleşti",
    maddeler: [
      "1. hafta dersi beş bölüme ayrıldı; her bölümde yeni şekiller, tablolar ve \"Dikkat\", \"Sık hata\" gibi not kutuları var.",
      "FPGA ile ASIC maliyet şekli etkileşimli: değerleri değiştirip kesişme noktasının nasıl kaydığını görebilirsin.",
      "Her bölümün sonunda **Kendini dene** soruları var; konu sonu testinden ayrı, o bölümü pekiştirmek için.",
    ],
  },
  {
    pr: 20,
    tarih: "2026-10-27",
    baslik: "Ders ve soru taraması",
    maddeler: [
      "315 sorunun tamamı derslerle karşılaştırıldı; cevabı derste geçmeyen bilgiler 1-5. hafta derslerine eklendi.",
      "5. haftaya \"Saat ile çalışan devreler\" bölümü eklendi.",
      "Editörde Shift ile seçtiğin metin artık görünüyor.",
      "Boşluk doldurma sorularında her boşluk ayrı değerlendirilir: doğru boşluklar yerinde kalır, yalnızca yanlışları düzeltirsin.",
    ],
  },
  {
    pr: 19,
    tarih: "2026-10-27",
    baslik: "Yaklaşık 300 soru ve yedek havuz",
    maddeler: [
      "Soru sayısı 315'e çıktı. Bir kısmı soru havuzunda görünmez; bir konuda yanlış yapınca Tekrar sayfasında daha önce görmediğin sorular olarak gelir.",
      "Nasıl kullanılır ve S.S.S. sayfaları güncellendi.",
    ],
  },
  {
    pr: 18,
    tarih: "2026-10-27",
    baslik: "Aralıklı tekrar",
    maddeler: [
      "Yeni **Tekrar** sayfası: yanlış yaptığın sorular 1, 3, 7, 14 ve 30 gün arayla yeniden karşına çıkar.",
      "Her soru bir kavrama bağlı; tekrar, zorlandığın kavramlara göre seçilir.",
    ],
  },
  {
    pr: 17,
    tarih: "2026-10-27",
    baslik: "Günlük hedef, seri ve rozetler",
    maddeler: [
      "Ayarlardan günlük doğru cevap hedefi seçebilirsin; hedefe ulaşınca kısa bir kutlama görürsün.",
      "Etkinlik takviminde çok çalıştığın günler kıvılcım, parıltı ya da alevle işaretlenir. Seriler ve rozetler yalnızca sana görünür.",
    ],
  },
  {
    pr: 16,
    tarih: "2026-10-27",
    baslik: "Ders şekilleri",
    maddeler: ["Derslerde konuları anlatan kendi çizimimiz şekiller var. Her şeklin bir kodu var (ör. `G-H1-01`); hata görürsen bu kodla bildirebilirsin."],
  },
  {
    pr: 15,
    tarih: "2026-10-27",
    baslik: "İngilizce terimler ve şık karıştırma",
    maddeler: [
      "Terimlerin İngilizcesi her geçtiği yerde parantez içinde yazılır; hepsi yeni **Terimler** sayfasında.",
      "Şıklar her açılışta karışık sırayla gelir, doğru cevabın yerini ezberleyemezsin.",
    ],
  },
  {
    pr: 14,
    tarih: "2026-10-27",
    baslik: "Küçük iyileştirmeler",
    maddeler: [
      "Dersin içindekiler listesindeki başlıklar bağlantı oldu.",
      "Ders ve kod sorularındaki editör sürüklenerek uzatılabilir; dalga ekranındaki imleç sürüklenebilir.",
    ],
  },
  {
    pr: 13,
    tarih: "2026-10-26",
    baslik: "Etkinlik takvimi ve soru süzgeçleri",
    maddeler: [
      "İlerlemem sayfasında son 12 haftanın takvimi, zayıf olduğun konular ve yanlış yaptığın sorular var.",
      "Cevap verdikten sonra o soruyu herkesin ne oranda doğru yaptığını görürsün.",
      "Soru havuzunda çözmediklerim, yanlışlarım, tür, zorluk ve arama süzgeçleri var.",
    ],
  },
  {
    pr: 12,
    tarih: "2026-10-26",
    baslik: "Taşınabilir paneller, Nasıl kullanılır ve S.S.S.",
    maddeler: [
      "Simülasyon alanındaki panelleri sürükleyip boyutlandırabilir, düzenini kaydedebilirsin.",
      "Yeni gelenler için **Nasıl kullanılır** ve **S.S.S.** sayfaları eklendi.",
    ],
  },
  {
    pr: 11,
    tarih: "2026-10-26",
    baslik: "Ders sayfaları",
    maddeler: ["1-5. haftaların konu anlatımları, denenebilir kod örnekleri ve konu sonu testleriyle **Dersler** bölümü açıldı."],
  },
  {
    pr: 10,
    tarih: "2026-10-26",
    baslik: "Yeni arayüz",
    maddeler: ["Sol menü sadeleşti ve daraltılabilir oldu; profil, avatar ve ayarlar daha kolay kullanılıyor."],
  },
  {
    pr: 9,
    tarih: "2026-10-25",
    baslik: "Topluluk testbench'leri",
    maddeler: ["Kod sorularındaki sonucunu paylaşabilir, başkalarının yazdığı testbench'leri **Topluluk** sayfasında çözebilirsin."],
  },
  {
    pr: 8,
    tarih: "2026-10-25",
    baslik: "Soru önerisi ve mesajlar",
    maddeler: ["Aklına gelen bir soruyu önerebilir, yöneticiye mesaj yazabilirsin."],
  },
  {
    pr: 7,
    tarih: "2026-10-25",
    baslik: "Simülasyon alanı yenilendi",
    maddeler: ["Hazır örnekler, sağ tık menüsü, klasör açma ve anlaşılır hata açıklamaları eklendi."],
  },
  {
    pr: 6,
    tarih: "2026-10-25",
    baslik: "Kod yazma soruları",
    maddeler: ["Bazı sorularda kodu kendin yazarsın; tasarımın tarayıcında gizli bir testbench'e karşı denenir. Kodun sunucuya gönderilmez."],
  },
  {
    pr: 4,
    tarih: "2026-10-25",
    baslik: "Hesaplar ve karanlık tema",
    maddeler: ["Hesap açıp ilerlemeni her cihazda görebilirsin; profil ve avatar seçebilirsin. Karanlık tema eklendi."],
  },
  {
    pr: 3,
    tarih: "2026-10-24",
    baslik: "Soru havuzu",
    maddeler: ["1-5. haftaların konularından ilk 137 soru eklendi."],
  },
  {
    pr: 1,
    tarih: "2026-10-24",
    baslik: "Site açıldı",
    maddeler: ["VHDL kodunu tarayıcında derleyip simüle edebileceğin simülasyon alanıyla site yayına girdi."],
  },
];
