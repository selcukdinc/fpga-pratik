// Yazışma listesi ve tek yazışma görünümü: üyenin /mesajlar sayfası ile yönetim panelinde ortak.

import { useEffect, useId, useState, type FormEvent } from "react";
import { FormHatasi } from "./Form";
import { MESAJ_SINIRI, type Yazisma, type YazismaOzeti } from "../../shared/sosyal";
import type { Sonuc } from "../lib/api";

export const zaman = (ms: number) =>
  new Date(ms).toLocaleString("tr-TR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export function YazismaListesi({ liste, bag, bos }: { liste: YazismaOzeti[] | null; bag: (id: string) => string; bos: string }) {
  if (!liste) return <p className="empty">Yükleniyor…</p>;
  if (!liste.length) return <p className="empty">{bos}</p>;
  return (
    <ul className="yazisma-listesi">
      {liste.map((y) => (
        <li key={y.id} className={y.unread ? "yeni" : undefined}>
          <a href={bag(y.id)}>
            <span className="yazisma-konu">{y.subject}</span>
            {y.unread && <span className="tag yeni-rozet">yeni</span>}
            {y.status === "closed" && <span className="tag">kapalı</span>}
          </a>
          <span className="hint">
            {y.username !== undefined && <>@{y.username ?? "silinmiş"} · </>}
            {zaman(y.updatedAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}

interface GorunumProps {
  yukle: () => Promise<Yazisma>;
  gonder: (body: string) => Promise<Sonuc<unknown>>;
  // Yönetici tarafı: kendi mesajları "Sen", karşı taraf kullanıcı adıyla görünür
  panel?: boolean;
  durumDegistir?: (status: "open" | "closed") => Promise<Sonuc<unknown>>;
  geri: string;
}

export function YazismaGorunumu({ yukle, gonder, panel, durumDegistir, geri }: GorunumProps) {
  const [y, setY] = useState<Yazisma | null>(null);
  const [yok, setYok] = useState(false);
  const [metin, setMetin] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [mesgul, setMesgul] = useState(false);
  const id = useId();

  const tazele = () => yukle().then(setY, () => setYok(true));
  useEffect(() => {
    void tazele();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (yok) return <p className="empty">Bu yazışma bulunamadı. <a href={geri}>Listeye dön</a></p>;
  if (!y) return <p className="empty">Yükleniyor…</p>;

  const yolla = async (e: FormEvent) => {
    e.preventDefault();
    setMesgul(true);
    setHata(null);
    const r = await gonder(metin);
    setMesgul(false);
    if (!r.ok) return setHata(r.hata.error);
    setMetin("");
    void tazele();
  };

  const durum = async (s: "open" | "closed") => {
    const r = await durumDegistir!(s);
    if (!r.ok) return setHata(r.hata.error);
    void tazele();
  };

  const kim = (yonetici: boolean) => (panel ? (yonetici ? "Yönetici" : `@${y.username ?? "silinmiş"}`) : yonetici ? "Yönetici" : "Sen");
  // Kapalı yazışmaya üye yazamaz; yönetici yazarsa yeniden açılır
  const yazilabilir = panel || y.status === "open";

  return (
    <div className="yazisma">
      <p><a href={geri}>← Tüm yazışmalar</a></p>
      <h3 className="yazisma-baslik">
        {y.subject} {y.status === "closed" && <span className="tag">kapalı</span>}
      </h3>
      <ol className="mesajlar">
        {y.mesajlar.map((m) => (
          <li key={m.id} className={m.yonetici ? "yonetici" : "uye"}>
            <div className="mesaj-ust">
              <strong>{kim(m.yonetici)}</strong> <span className="hint">{zaman(m.createdAt)}</span>
            </div>
            <div className="mesaj-govde">{m.body}</div>
          </li>
        ))}
      </ol>
      {yazilabilir ? (
        <form className="mesaj-form" onSubmit={yolla}>
          <label htmlFor={id}>{panel ? "Cevap yaz" : "Mesaj yaz"}</label>
          <textarea id={id} rows={4} maxLength={MESAJ_SINIRI} value={metin} onChange={(e) => setMetin(e.target.value)} />
          <FormHatasi hata={hata} />
          <div className="form-dugmeler">
            <button className="primary" type="submit" disabled={!metin.trim() || mesgul}>Gönder</button>
            {durumDegistir && (
              <button type="button" onClick={() => durum(y.status === "open" ? "closed" : "open")}>
                {y.status === "open" ? "Yazışmayı kapat" : "Yeniden aç"}
              </button>
            )}
          </div>
        </form>
      ) : (
        <p className="hint">Bu yazışma kapatıldı. Yeni bir konu için <a href={geri}>yeni mesaj</a> başlatabilirsin.</p>
      )}
    </div>
  );
}
