import { REPO_URL } from "../lib/api";

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
        simülatörüyle analiz edilir ve simüle edilir. Kodun sunucuya gönderilmez.
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
      <h3>Katkı</h3>
      <p>
        Kaynak kodu GPL-3.0 lisansıyla <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub'da</a>. Beğendiysen
        depoyu yıldızlayabilir, bir hata ya da yanlış soru gördüğünde{" "}
        <a href={`${REPO_URL}/issues/new`} target="_blank" rel="noreferrer">sorun bildirebilirsin</a>.
      </p>
    </div>
  );
}
