import { REPO_URL } from "../lib/api";

const GELISTIRICI_URL = "https://github.com/selcukdinc";

export function About() {
  return (
    <div className="about">
      <h2>FPGA Pratik</h2>
      <p>
        FPGA dersinde vize ve finale hazırlanmak için açık kaynaklı bir pratik sitesi. Sorular haftalık ders notlarından
        ve geçmiş sınavlardan derlenir; aynı mantıkla türetilmiş sorular ayrıca etiketlenir.
      </p>
      <h3>Simülasyon nerede çalışıyor?</h3>
      <p>
        VHDL kodun senin tarayıcında, WebAssembly'ye derlenmiş <a href="https://www.nickg.me.uk/nvc/" target="_blank" rel="noreferrer">NVC</a>{" "}
        simülatörüyle analiz edilir ve simüle edilir. Kodun, sen paylaşmayı seçmedikçe sunucuya gönderilmez.
      </p>
      <h3>Gizlilik</h3>
      <ul>
        <li>Reklam yok, analitik ya da takip çerezi yok.</li>
        <li>İlk cevabını gönderdiğinde ilerlemeni tutmak için tek bir oturum çerezi yazılır.</li>
        <li>Pratik alanındaki dosyaların yalnızca bu tarayıcıda saklanır.</li>
      </ul>
      <p>
        Ayrıntılar <a href="/gizlilik">gizlilik metninde</a>.
      </p>
      <h3>Geliştirici</h3>
      <div className="kunye">
        {/* Fotoğraf sitenin kendisinden gelir; GitHub'a istek gitmez */}
        <img src="/gelistirici.jpg" alt="" width={72} height={72} className="kunye-foto" />
        <div>
          <strong className="kunye-ad">Selçuk Dinç</strong>
          <ul className="kunye-baglantilar">
            <li><a href={GELISTIRICI_URL} target="_blank" rel="noreferrer">GitHub profili</a></li>
            <li><a href={REPO_URL} target="_blank" rel="noreferrer">Projenin deposu</a> (GPL-3.0)</li>
          </ul>
        </div>
      </div>

      <h3>Proje</h3>
      <p>
        Kaynak kodu açık. Bir hata ya da yanlış soru gördüysen{" "}
        <a href={`${REPO_URL}/issues/new`} target="_blank" rel="noreferrer">GitHub'da bildirebilirsin</a>. Projeyi beğendiysen
        depoya <a href={REPO_URL} target="_blank" rel="noreferrer">yıldız verebilirsin</a>.
      </p>
    </div>
  );
}
