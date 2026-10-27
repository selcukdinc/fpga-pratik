// Sıkça sorulan sorular. Gerçek sorular gelmeye başladıkça bu liste güncellenir.
// Cevaplar Markdown alt kümesiyle yazılır (`kod`, **kalın**, "- " listeleri).

export interface SssBolumu {
  baslik: string;
  sorular: { soru: string; cevap: string }[];
}

export const SSS: SssBolumu[] = [
  {
    baslik: "Genel",
    sorular: [
      {
        soru: "Site ücretli mi?",
        cevap: "Hayır. Site ücretsiz ve açık kaynaklıdır (GPL-3.0). Reklam yoktur.",
      },
      {
        soru: "Kullanmak için hesap açmam gerekiyor mu?",
        cevap:
          "Hayır. Dersleri okuyabilir, soruları çözebilir ve simülasyon alanını hesapsız kullanabilirsin. Hesap açarsan ilerlemen her cihazda seninle gelir; ayrıca soru önerebilir, sonuçlarını paylaşabilir ve testbench yazabilirsin.",
      },
      {
        soru: "Sorular nereden geliyor?",
        cevap:
          "Sorular haftalık ders konularından ve geçmiş sınavların konularından derlenir, kendi cümlelerimizle yazılır. Bir sunumdaki soruya dayananlar **Orijinal**, aynı konudan yeni türetilenler **Türetilmiş** etiketi taşır.",
      },
      {
        soru: "Neden bazı haftaların soruları görünmüyor?",
        cevap:
          "Sorular derste işlenen haftaya göre açılır. Menüdeki Soru havuzu yanında yazan `H5` gibi rozet, soruların kaçıncı haftaya kadar açık olduğunu gösterir.",
      },
    ],
  },
  {
    baslik: "Sorular ve ilerleme",
    sorular: [
      {
        soru: "Çözmediğim ya da yanlış yaptığım soruları nasıl bulurum?",
        cevap:
          "Soru havuzunun üstündeki süzgeçlerden **Çözmediklerim** ya da **Yanlışlarım**'ı seç. Tür, zorluk ve arama ile daraltabilirsin; süzgeçler adreste tutulduğu için bağlantıyı kaydedip sonra aynı listeye dönebilirsin. İlerlemem sayfasındaki **Hepsini tekrar çöz** düğmesi de yanlış yaptığın soruları tek listede açar.",
      },
      {
        soru: "Sorunun altında çıkan yüzde ne anlama geliyor?",
        cevap:
          "Cevabını gönderdikten sonra, o soruyu deneyenlerin ilk denemelerinde ne kadarının doğru yaptığı gösterilir; çoktan seçmelide her şıkkın ne sıklıkla seçildiği de görünür. Her kişinin yalnızca ilk denemesi sayılır, misafirler de dahildir. Bunlar anonim toplamlardır; kimin ne cevap verdiği görünmez.",
      },
      {
        soru: "\"Tekrar etmen gereken konular\" nasıl seçiliyor?",
        cevap:
          "İlerlemem sayfasında, en az bir sorusunu denediğin ama henüz bitirmediğin konular doğru oranına göre sıralanır; en düşük üçü gösterilir. **Tekrar et** o konunun yalnızca çözmediğin sorularını açar.",
      },
      {
        soru: "Etkinlik takvimi ve günlük seri neyi sayıyor?",
        cevap:
          "Takvim, son 12 haftada her gün kaç cevap gönderdiğini Türkiye saatine göre gösterir; renk koyulaştıkça o gün daha çok çalışmışsındır. Günlük seri, bugünden (bugün henüz bir şey çözmediysen dünden) geriye kesintisiz çalıştığın gün sayısıdır.",
      },
      {
        soru: "Tekrar sayfası nasıl çalışıyor?",
        cevap:
          "Yanlış yaptığın her soru tekrar kutusuna girer ve ertesi gün **Tekrar** sayfasında yeniden sorulur. Doğru cevapladıkça soru bir sonraki kutuya geçer ve 3, 7, 14, 30 gün arayla tekrar gelir; 5. kutuyu da geçince öğrenilmiş sayılır. Yanlış cevap soruyu 1. kutuya döndürür. Bir soruyu ilk kez yanlış yaptığında aynı kavramdan henüz görmediğin iki soru da eklenir. Günde en çok 20 tekrar yapılır, menüdeki sayı bugün kaç soru beklediğini gösterir. E-posta ile hatırlatma yapılmaz.",
      },
      {
        soru: "Günlük hedef, alev ve rozetler nedir?",
        cevap:
          "Günlük hedef, bir günde vermek istediğin doğru cevap sayısıdır (başlangıçta 10). Hedefe ulaştığın an kısa bir kutlama görürsün; hedefi **Ayarlar**'dan değiştirebilir ya da kapatabilirsin. Takvimde 10 doğru yaptığın günlerde kıvılcım, 25'te parıltı görünür; 50 doğruya ulaştığın günün kutusu alev alır. Rozetler 7, 30 ve 100 günlük seriler gibi kişisel hedeflerdir. Bunları yalnızca sen görürsün; sıralama ya da başkalarıyla karşılaştırma yoktur.",
      },
    ],
  },
  {
    baslik: "Simülasyon ve kod",
    sorular: [
      {
        soru: "Kodum bir sunucuya gönderiliyor mu?",
        cevap:
          "Hayır. VHDL kodun senin tarayıcında, WebAssembly'ye derlenmiş NVC simülatörüyle derlenir ve çalıştırılır. Kod sorularını sınarken sunucuya yalnızca testbench'in okuduğu çıkış değerleri gider. Kodunu yalnızca sen \"Kodumu da ekle\" dersen paylaşırsın.",
      },
      {
        soru: "Hangi VHDL sürümü kullanılıyor?",
        cevap:
          "Ders VHDL-93 ile işlendiği için varsayılan VHDL-93'tür. Simülasyon alanında araç çubuğundan 2008'e geçebilirsin. Aritmetik için `ieee.numeric_std` kullanılır.",
      },
      {
        soru: "Bu site Vivado'nun yerine geçer mi?",
        cevap:
          "Hayır. Burada yazdığın kodu derleyip benzetimini yapabilirsin ama sentez, yerleştirme ve bir karta yükleme yapılmaz. Amaç, VHDL'i ve benzetimi hızlıca denemek ve sınava hazırlanmaktır.",
      },
      {
        soru: "Simülasyon \"zaman sınırını aştı\" diyor. Ne yapmalıyım?",
        cevap:
          "Genellikle testbench'te `wait;` ile bitmeyen bir process, sonsuz bir döngü ya da kendini tetikleyen bir atama vardır. Süre kutusundaki değeri küçültmeyi ve process'lerin sonunda `wait;` olduğunu kontrol etmeyi dene.",
      },
      {
        soru: "Simülasyon alanındaki dosyalarım nerede saklanıyor?",
        cevap:
          "Bu tarayıcıda saklanır. Başka bir cihazda çalışmak için Proje menüsünden zip olarak indirebilir ya da bilgisayarındaki bir klasörü açıp doğrudan oraya kaydedebilirsin (Chrome ve Edge'de).",
      },
      {
        soru: "Pencereleri karıştırdım, eski düzene nasıl dönerim?",
        cevap:
          "Simülasyon alanında Düzen menüsünden \"Varsayılan düzene dön\"e bas. Beğendiğin bir düzeni aynı menüden adıyla kaydedebilirsin; giriş yaptıysan hesabına kaydedilir.",
      },
    ],
  },
  {
    baslik: "Hesap ve gizlilik",
    sorular: [
      {
        soru: "Hangi çerezler kullanılıyor?",
        cevap:
          "Yalnızca oturumunu tutan tek bir çerez. Analitik, reklam ya da takip çerezi yoktur. Ayrıntılar gizlilik sayfasında.",
      },
      {
        soru: "Hesabımı nasıl silerim?",
        cevap: "Ayarlar → Hesabı sil sekmesinden. Hesabın, denemelerin ve paylaşımların kalıcı olarak silinir.",
      },
      {
        soru: "Bir soruda hata buldum. Ne yapmalıyım?",
        cevap:
          "Giriş yaptıysan menüdeki Mesajlarım'dan yöneticiye yazabilirsin. GitHub'ı kullanıyorsan Hakkında sayfasındaki bağlantıdan sorun da bildirebilirsin.",
      },
      {
        soru: "Ben de soru ekleyebilir miyim?",
        cevap: "Evet. Giriş yaptıktan sonra Soru öner sayfasından gönderebilirsin; yönetici inceleyip uygun bulursa havuza ekler.",
      },
    ],
  },
];
