// /tanitim: sitenin ne işe yaradığını, kimler için olduğunu ve nasıl
// kullanılacağını ekran görüntüleriyle anlatan sayfa. /sss: sık sorulanlar.

import { useEffect } from "react";
import { href } from "../lib/router";
import { Markdown } from "../components/Markdown";
import { SSS } from "../sss";
import { TANITIM_GORULDU } from "../components/Shell";

const KITLELER = [
  {
    baslik: "FPGA dersini alan öğrenciler",
    metin: "Vize ve finale hazırlanırken konuyu ders ders tekrar et, haftaya göre açılan sorularla kendini dene; ilerleme sayfası zayıf konularını ve yanlış yaptığın soruları önüne getirir.",
  },
  {
    baslik: "VHDL'e yeni başlayanlar",
    metin: "Hiçbir şey kurmadan tarayıcında VHDL yaz ve benzetimini çalıştır. Kısa ders sayfalarındaki örnekleri değiştirip sonucu dalga ekranında hemen gör.",
  },
  {
    baslik: "Dersi tekrar edenler ve kendi başına çalışanlar",
    metin: "Kod sorularında yazdığın tasarım gizli bir testbench'le sınanır; nerede takıldığını kontrol noktası kontrol noktası gösterir.",
  },
  {
    baslik: "Eğitmenler ve asistanlar",
    metin: "Öğrencilerini konuya ya da haftaya göre soru havuzuna yönlendirebilir, yeni soru önerebilirsin.",
  },
];

const ADIMLAR = [
  {
    gorsel: "ders",
    baslik: "1. Konuyu Dersler'den oku",
    metin: "Her hafta için kısa bir anlatım var. İçindeki örnekleri düzenleyip ▶ Çalıştır'a basınca benzetim tarayıcında çalışır; dersin sonunda kısa bir test seni bekler.",
    bag: { page: "ders" } as const,
    bagMetni: "Derslere git",
  },
  {
    gorsel: "sorular",
    baslik: "2. Soru havuzunda kendini dene",
    metin: "Sayfanın üstünden hafta ve konu seç; türe, zorluğa göre süz, ara ya da yalnızca çözmediklerini göster. Cevabın hemen kontrol edilir; açıklamanın yanında soruyu ilk denemede doğru yapanların oranını ve şıkların nasıl dağıldığını görürsün.",
    bag: { page: "sorular" } as const,
    bagMetni: "Soru havuzunu aç",
  },
  {
    gorsel: "kod",
    baslik: "3. Kod sorularında tasarım yaz",
    metin: "Şablondaki mimariyi doldur, Sına'ya bas. Tasarımın her seferinde rastgele girişlerle bir referans modele karşı denenir; takıldığın kontrol noktası ve bir ipucu gösterilir.",
    bag: { page: "sorular", topic: "vhdl-temel" } as const,
    bagMetni: "Bir kod sorusu dene",
  },
  {
    gorsel: "pratik",
    baslik: "4. Simülasyon alanında serbest çalış",
    metin: "Kendi tasarımını ve testbench'ini yaz ya da hazır bir örnek ekle. Pencereleri sürükleyip boyutlandırarak düzenini kurabilir, dosyalarını klasöre ya da zip olarak alabilirsin.",
    bag: { page: "pratik" } as const,
    bagMetni: "Simülasyon alanına git",
  },
  {
    gorsel: "ilerleme",
    baslik: "5. İlerlemeni takip et",
    metin: "Son 12 haftalık etkinlik takviminde ne kadar düzenli çalıştığını gör. En zayıf üç konuna \"Tekrar et\" ile dön, yanlış yaptığın soruları tek tıkla yeniden çöz. Hesap açarsan ilerlemen her cihazda seninle gelir.",
    bag: { page: "ilerleme" } as const,
    bagMetni: "İlerlemene bak",
  },
];

export function Tanitim() {
  useEffect(() => {
    try {
      localStorage.setItem(TANITIM_GORULDU, "1");
    } catch {
      // gizli pencere
    }
  }, []);
  return (
    <div className="tanitim">
      <header className="tanitim-ust">
        <h2>VHDL'i tarayıcında yazarak öğren</h2>
        <p>
          FPGA Pratik, FPGA ve sayısal tasarım dersine hazırlanmak için ücretsiz ve açık kaynaklı bir çalışma alanı. Kısa
          dersler, haftalara ayrılmış sorular, otomatik sınanan kod soruları ve tarayıcında çalışan bir VHDL simülatörü tek
          yerde. Kurulum gerekmez; yazdığın kod bilgisayarından çıkmaz.
        </p>
        <div className="tanitim-dugmeler">
          <a className="buton primary" href={href({ page: "ders" })}>Derslerle başla</a>
          <a className="buton" href={href({ page: "sorular" })}>Sorulara geç</a>
          <a className="buton" href={href({ page: "pratik" })}>Simülasyon alanı</a>
        </div>
      </header>

      <section>
        <h3>Kimler için?</h3>
        <div className="kitleler">
          {KITLELER.map((k) => (
            <div key={k.baslik} className="kitle">
              <strong>{k.baslik}</strong>
              <p>{k.metin}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>Nasıl kullanılır?</h3>
        <ol className="adimlar">
          {ADIMLAR.map((a, i) => (
            <li key={a.gorsel} className={i % 2 ? "ters" : undefined}>
              <figure>
                <img src={`/tanitim/${a.gorsel}.webp`} alt={`${a.baslik.replace(/^\d\. /, "")}: ekran görüntüsü`} width={1070} height={724} loading="lazy" />
              </figure>
              <div>
                <h4>{a.baslik}</h4>
                <p>{a.metin}</p>
                <a href={href(a.bag)}>{a.bagMetni} →</a>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="tanitim-alt">
        <h3>Senin için ne değişir?</h3>
        <ul>
          <li><strong>Kurulum yok:</strong> Vivado kurmadan, herhangi bir bilgisayarda ya da telefonda çalışabilirsin.</li>
          <li><strong>Hemen geri bildirim:</strong> cevabının doğru olup olmadığını ve nedenini aynı anda görürsün.</li>
          <li><strong>Gizlilik:</strong> reklam ve takip çerezi yok; kodun sen paylaşmadıkça tarayıcında kalır.</li>
        </ul>
        <p>
          Aklına takılan bir şey mi var? <a href={href({ page: "sss" })}>Sık sorulan sorulara</a> göz at.
        </p>
      </section>
    </div>
  );
}

export function Sss() {
  return (
    <div className="sss">
      <p className="hint">Sorunun cevabı burada yoksa giriş yapıp Mesajlarım'dan yöneticiye yazabilirsin.</p>
      {SSS.map((b) => (
        <section key={b.baslik}>
          <h3>{b.baslik}</h3>
          {b.sorular.map((s) => (
            <details key={s.soru} className="sss-soru">
              <summary>{s.soru}</summary>
              <Markdown text={s.cevap} />
            </details>
          ))}
        </section>
      ))}
    </div>
  );
}
