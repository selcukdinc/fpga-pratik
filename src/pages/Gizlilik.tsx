// KVKK aydınlatma metni taslağı. Site sahibi tarafından gözden geçirilmeli.

export function Gizlilik() {
  return (
    <div className="about">
      <h2>Gizlilik ve kişisel veriler</h2>
      <p className="hint">Son güncelleme: Ekim 2026</p>
      <p>
        FPGA Pratik, bir FPGA dersine hazırlanmak için hazırlanmış, kâr amacı gütmeyen ve açık kaynaklı bir pratik
        sitesidir. Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında hangi verileri neden
        işlediğimizi anlatır.
      </p>

      <h3>Veri sorumlusu</h3>
      <p>Site, fpga.selcukdinc.dev alan adının sahibi tarafından yayımlanır. İletişim için GitHub deposundaki sorun bildirme sayfası kullanılabilir.</p>

      <h3>Hangi verileri tutuyoruz?</h3>
      <ul>
        <li>
          <strong>Misafir olarak:</strong> İlk cevabını gönderdiğinde rastgele bir kimlik oluşturulur ve tarayıcına tek
          bir oturum çerezi yazılır. Hangi soruyu ne zaman, hangi cevapla denediğin bu kimlikle saklanır. Kod sorularında yazdığın VHDL kodu, sen paylaşmayı seçmedikçe sunucuya gönderilmez: benzetim tarayıcında yapılır, sunucuya yalnızca testbench'in okuduğu çıkış değerleri gider ve kaç kontrol noktasını geçtiğin saklanır. Bir soruyu cevapladıktan sonra gösterilen doğru oranı ve şık dağılımı, herkesin ilk denemesinden hesaplanan anonim toplamlardır; kimin ne cevap verdiği görünmez. Aralıklı tekrar için yanlış yaptığın soruların hangi kutuda olduğu ve ne zaman yeniden sorulacağı da bu kimlikle saklanır; hesabını silince bunlar da silinir.
        </li>
        <li>
          <strong>Hesap açarsan:</strong> kullanıcı adın, e-posta adresin, parolanın geri çevrilemez özeti (parolanın
          kendisi saklanmaz), seçtiğin avatar ve gizlilik ayarın.
        </li>
        <li>
          <strong>Soru önerirsen ya da yöneticiye yazarsan:</strong> önerdiğin sorunun metni, cevabı ve açıklaması;
          yazışmalarındaki mesajlar ve tarihleri. Bunları yalnızca sen ve site yöneticisi görür. Önerin yayımlanırsa ve
          izin verdiysen sorunun altında kullanıcı adın görünür.
        </li>
        <li>
          <strong>Topluluk özelliklerini kullanırsan:</strong> bir kod sorusundaki sonucunu paylaşırsan skorun ve ilk
          takıldığın kontrol noktası; ayrıca işaretlersen kodun. Yayımladığın testbench'ler (çözümün değil, yalnızca
          testbench ve entity şablonu), beğenilerin, çözdüğün testbench'ler ve gönderdiğin bildirimler. Paylaştıkların
          giriş yapmış üyelere, testbench'lerin herkese görünür; bildirimlerini yalnızca yönetici görür.
        </li>
        <li>
          <strong>Güvenlik için:</strong> çok sayıda hatalı giriş ve kod isteğini sınırlamak amacıyla IP adresin, kısa
          süreli sayaçlarda tutulur ve süreleri dolunca silinir.
        </li>
      </ul>

      <h3>Ne için kullanıyoruz?</h3>
      <ul>
        <li>Cevaplarını kontrol etmek ve ilerlemeni göstermek için.</li>
        <li>E-postanı hesabını doğrulamak, parolanı unutursan sıfırlamak ve (Ayarlar'dan kapatabileceğin) yönetici cevap verdi bildirimi için. Bülten, reklam ya da başka bir amaçla e-posta gönderilmez.</li>
        <li>Profilini herkese açık yaparsan, kullanıcı adını, avatarını ve ilerlemeni diğer ziyaretçilere göstermek için.</li>
      </ul>

      <h3>Çerezler ve takip</h3>
      <p>
        Sitede reklam, analitik ya da üçüncü taraf takip çerezi yoktur. Kullanılan tek çerez oturum çerezidir ve
        sitenin çalışması için zorunludur. Tema tercihin, simülasyon alanındaki dosyaların ve pencere düzenin yalnızca
        senin tarayıcında (localStorage) durur, sunucuya gönderilmez. Giriş yapmışken adıyla kaydettiğin pencere
        düzenleri (yalnızca panellerin yeri ve boyutu) hesabında saklanır. Derslerde bitirdiğin bölümler ve kaldığın
        yer misafirken tarayıcında, giriş yapmışken hesabında tutulur.
      </p>

      <h3>Veriler nerede duruyor, kimlerle paylaşılıyor?</h3>
      <ul>
        <li>Veriler Cloudflare'in sunucularında (Workers ve D1 veritabanı) saklanır.</li>
        <li>E-postalar Resend aracılığıyla gönderilir; Resend'e yalnızca e-posta adresin ve e-postanın metni (kod ya da "cevap var" bildirimi) gider. Mesajlarının içeriği e-postaya konmaz.</li>
        <li>Bunların dışında hiçbir kişi ya da kurumla paylaşılmaz, satılmaz.</li>
      </ul>

      <h3>Ne kadar süre saklanıyor?</h3>
      <p>
        Hesabın açık kaldığı sürece. Hesabını Ayarlar sayfasından sildiğinde hesabın, tüm denemelerin, önerilerin,
        yazışmaların, paylaşımların, testbench'lerin ve oturumların hemen ve kalıcı olarak silinir. Yayımlanmış bir önerinin sorusu havuzda kalır ama
        artık adınla ilişkilendirilmez. Misafir oturum çerezi 180 gün sonra geçersiz olur; o misafirin denemeleri
        sadece rastgele bir kimlikle durur ve artık kimseyle ilişkilendirilemez.
      </p>

      <h3>Hakların</h3>
      <p>
        KVKK'nın 11. maddesi uyarınca verilerinin işlenip işlenmediğini öğrenme, düzeltilmesini ya da silinmesini
        isteme ve işlemeye itiraz etme hakların vardır. Hesabını silmek için Ayarlar sayfasını, diğer talepler için
        GitHub deposundaki sorun bildirme sayfasını kullanabilirsin.
      </p>
    </div>
  );
}
