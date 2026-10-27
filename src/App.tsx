import { useEffect, useState } from "react";
import { Shell } from "./components/Shell";
import { useRoute, type Route } from "./lib/router";
import { api } from "./lib/api";
import { OturumSaglayici } from "./lib/oturum";
import { Sandbox } from "./pages/Sandbox";
import { Ders } from "./pages/Ders";
import { Terimler } from "./pages/Terimler";
import { Sss, Tanitim } from "./pages/Tanitim";
import { Questions } from "./pages/Questions";
import { Progress } from "./pages/Progress";
import { Tekrar } from "./pages/Tekrar";
import { About } from "./pages/About";
import { Gizlilik } from "./pages/Gizlilik";
import { Giris } from "./pages/Giris";
import { Kayit } from "./pages/Kayit";
import { SifreSifirla } from "./pages/SifreSifirla";
import { Profil } from "./pages/Profil";
import { Ayarlar } from "./pages/Ayarlar";
import { Yonetim } from "./pages/Yonetim";
import { Oner } from "./pages/Oner";
import { Mesajlar } from "./pages/Mesajlar";
import { Topluluk, ToplulukTb } from "./pages/Topluluk";
import type { Topic } from "../shared/api";

function baslik(route: Route, topicTitle?: string): string {
  switch (route.page) {
    case "pratik": return "PRATİK - Simülasyon alanı";
    case "sorular": return `SORU HAVUZU - ${topicTitle ?? (route.hafta ? `${route.hafta}. hafta` : "Tüm sorular")}`;
    case "ders": return route.hafta ? `DERS - ${route.hafta}. hafta` : "DERSLER";
    case "ilerleme": return "İLERLEME - Konu bazlı durum";
    case "tekrar": return "TEKRAR - Aralıklı tekrar";
    case "hakkinda": return "HAKKINDA";
    case "tanitim": return "NASIL KULLANILIR";
    case "sss": return "SIK SORULAN SORULAR";
    case "terimler": return "TERİMLER - Türkçe ve İngilizce";
    case "gizlilik": return "GİZLİLİK";
    case "giris": return "HESAP - Giriş";
    case "kayit": return "HESAP - Kayıt";
    case "sifre-sifirla": return "HESAP - Parola sıfırlama";
    case "profil": return `PROFİL - ${route.ad}`;
    case "ayarlar": return "HESAP - Ayarlar";
    case "oner": return "SORU ÖNER";
    case "mesajlar": return "MESAJLAR - Yöneticiyle yazışmalar";
    case "topluluk": return "TOPLULUK - Üyelerin testbench'leri";
    case "topluluk-tb": return route.id === "yeni" ? "TOPLULUK - Testbench yaz" : "TOPLULUK - Testbench";
    case "yonetim": return "YÖNETİM";
    case "bulunamadi": return "SAYFA BULUNAMADI";
  }
}

export function App() {
  const route = useRoute();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [status, setStatus] = useState("Hazır");
  const [duyuru, setDuyuru] = useState<string | null>(null);

  useEffect(() => {
    api.topics().then(
      (r) => {
        setTopics(r.topics);
        setCurrentWeek(r.currentWeek);
        setDuyuru(r.announcement);
      },
      // API yoksa (ör. yalnızca statik önizleme) pratik alanı yine çalışır
      () => setTopics([]),
    );
  }, []);

  // Simülasyon alanı ve soru havuzu başka bir sayfaya geçilince kapanmaz, gizlenir:
  // yazılan kod, dalga ekranı, soruların cevapları ve kaydırma yeri korunur
  const [pratikAcildi, setPratikAcildi] = useState(route.page === "pratik");
  const [sonSorular, setSonSorular] = useState<{ topic?: string; hafta?: number } | null>(null);
  useEffect(() => {
    if (route.page === "pratik") setPratikAcildi(true);
    if (route.page === "sorular") setSonSorular({ topic: route.topic, hafta: route.hafta });
  }, [route]);
  const sorularProps = route.page === "sorular" ? { topic: route.topic, hafta: route.hafta } : sonSorular;

  const topicTitle = route.page === "sorular" && route.topic ? topics.find((t) => t.id === route.topic)?.title : undefined;
  const title = baslik(route, topicTitle);

  useEffect(() => {
    document.title = `${title} · FPGA Pratik`;
  }, [title]);

  return (
    <OturumSaglayici>
      <Shell route={route} currentWeek={currentWeek} title={title} status={status} duyuru={duyuru}>
        {(route.page === "pratik" || pratikAcildi) && (
          <div className="sayfa-tut" hidden={route.page !== "pratik"}>
            <Sandbox onStatus={setStatus} aktif={route.page === "pratik"} />
          </div>
        )}
        {sorularProps && (
          <div className="sayfa-tut" hidden={route.page !== "sorular"}>
            <Questions topic={sorularProps.topic} hafta={sorularProps.hafta} topics={topics} />
          </div>
        )}
        {route.page === "ders" && <Ders hafta={route.hafta} />}
        {route.page === "ilerleme" && <Progress />}
        {route.page === "tekrar" && <Tekrar />}
        {route.page === "hakkinda" && <About />}
        {route.page === "tanitim" && <Tanitim />}
        {route.page === "sss" && <Sss />}
        {route.page === "terimler" && <Terimler />}
        {route.page === "gizlilik" && <Gizlilik />}
        {route.page === "giris" && <Giris sonra={route.sonra} />}
        {route.page === "kayit" && <Kayit />}
        {route.page === "sifre-sifirla" && <SifreSifirla />}
        {route.page === "profil" && <Profil ad={route.ad} />}
        {route.page === "ayarlar" && <Ayarlar sekme={route.sekme} />}
        {route.page === "oner" && <Oner />}
        {route.page === "mesajlar" && <Mesajlar id={route.id} />}
        {route.page === "topluluk" && <Topluluk konu={route.konu} />}
        {route.page === "topluluk-tb" && <ToplulukTb id={route.id} />}
        {route.page === "yonetim" && <Yonetim bolum={route.bolum} soru={route.soru} alt={route.alt} />}
        {route.page === "bulunamadi" && (
          <p className="empty">
            Bu adreste bir sayfa yok. <a href="/sorular">Sorulara git</a>
          </p>
        )}
      </Shell>
    </OturumSaglayici>
  );
}
