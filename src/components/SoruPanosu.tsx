// Panelde soru listesinin üstündeki pano: durum sayıları, son 7 günün cevapları,
// en çok yanlış yapılan sorular ve kod sorularında en sık takılınan kontrol noktaları.

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { href } from "../lib/router";
import { inline } from "./Markdown";
import type { PanelOzet, PanelPano } from "../../shared/yonetim";

const kisa = (p: string) => p.replace(/```[\s\S]*?```/g, "[kod]").replace(/\s+/g, " ").slice(0, 90);
const gunEtiketi = (g: string) => new Date(`${g}T12:00:00`).toLocaleDateString("tr-TR", { weekday: "short" });

interface Props {
  // Durum kartına basınca liste o duruma süzülür
  durumSec: (d: "" | "yayinda" | "taslak" | "gizli") => void;
  durum: string;
}

export function SoruPanosu({ durumSec, durum }: Props) {
  const [o, setO] = useState<PanelOzet | null>(null);
  const [p, setP] = useState<PanelPano | null>(null);
  useEffect(() => {
    api.yonetim.ozet().then(setO, () => {});
    api.yonetim.pano().then(setP, () => {});
  }, []);
  if (!o || !p) return null;

  const enCok = Math.max(1, ...p.gunluk.map((g) => g.deneme));
  const haftalik = p.gunluk.reduce((s, g) => s + g.deneme, 0);
  const haftalikDogru = p.gunluk.reduce((s, g) => s + g.dogru, 0);

  const durumKarti = (d: "" | "yayinda" | "taslak" | "gizli", sayi: number, ad: string) => (
    <button type="button" className="pano-sayi" aria-pressed={durum === d} onClick={() => durumSec(durum === d ? "" : d)}>
      <strong>{sayi}</strong>
      <span>{ad}</span>
    </button>
  );
  const kuyruk = (bolum: "oneriler" | "mesajlar" | "bildirimler", sayi: number, ad: string) => (
    <a className={`pano-sayi${sayi > 0 ? " bekliyor" : ""}`} href={href({ page: "yonetim", bolum })}>
      <strong>{sayi}</strong>
      <span>{ad}</span>
    </a>
  );

  return (
    <section className="soru-panosu" aria-label="Soru panosu">
      <div className="pano-kart pano-durumlar">
        <h4>Sorular</h4>
        <div className="pano-sayilar">
          {durumKarti("", o.soru.toplam, "toplam")}
          {durumKarti("yayinda", o.soru.yayinda, "yayında")}
          {durumKarti("taslak", o.soru.taslak, "taslak")}
          {durumKarti("gizli", o.soru.gizli, "gizli")}
        </div>
        <h4>Bekleyen işler</h4>
        <div className="pano-sayilar">
          {kuyruk("oneriler", o.bekleyenOneri, "öneri")}
          {kuyruk("mesajlar", o.okunmamisMesaj, "okunmamış mesaj")}
          {kuyruk("bildirimler", o.acikBildirim, "bildirilen içerik")}
        </div>
      </div>

      <div className="pano-kart">
        <h4>Son 7 gün</h4>
        <p className="pano-baslik-sayi">
          <strong>{haftalik}</strong> cevap
          {haftalik > 0 && <span className="hint"> · %{Math.round((haftalikDogru / haftalik) * 100)} doğru</span>}
        </p>
        <ol className="pano-cubuklar" aria-label="Günlük cevap sayısı">
          {p.gunluk.map((g) => (
            <li key={g.gun} title={`${g.gun}: ${g.deneme} cevap, ${g.dogru} doğru`}>
              <span className="cubuk-alan">
                <span className="cubuk" style={{ height: `${(g.deneme / enCok) * 100}%` }} />
              </span>
              <span className="cubuk-deger">{g.deneme}</span>
              <span className="cubuk-gun">{gunEtiketi(g.gun)}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="pano-kart">
        <h4>En çok yanlış yapılanlar</h4>
        {p.enCokYanlis.length === 0 ? (
          <p className="empty">En az 3 denemesi olan ve yanlış yapılan soru yok.</p>
        ) : (
          <ol className="pano-liste">
            {p.enCokYanlis.map((s) => {
              const oran = Math.round((s.yanlis / s.deneme) * 100);
              return (
                <li key={s.id}>
                  <a href={href({ page: "yonetim", bolum: "sorular", soru: s.id })} className="mono">{s.id}</a>
                  <span className="pano-oran">%{oran} yanlış <span className="hint">({s.yanlis}/{s.deneme})</span></span>
                  <span className="pano-oran-cubuk" aria-hidden><span style={{ width: `${oran}%` }} /></span>
                  <span className="hint pano-metin">{inline(kisa(s.prompt))}</span>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <div className="pano-kart">
        <h4>Kod sorularında takılınan yer</h4>
        {p.kodHatalari.length === 0 ? (
          <p className="empty">Başarısız kod denemesi yok.</p>
        ) : (
          <ol className="pano-liste">
            {p.kodHatalari.map((s) => (
              <li key={s.id}>
                <a href={href({ page: "yonetim", bolum: "sorular", soru: s.id })} className="mono">{s.id}</a>
                <span className="pano-oran">
                  kontrol noktası #{s.kontrol} <span className="hint">({s.sayi}/{s.basarisiz} başarısız deneme)</span>
                </span>
                <span className="hint pano-metin">{inline(kisa(s.prompt))}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
