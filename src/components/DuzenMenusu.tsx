// Simülasyon alanının "Düzen" menüsü: varsayılana dönme, düzeni adıyla kaydetme
// ve kayıtlı düzenleri uygulama. Misafirin düzenleri bu tarayıcıda, üyeninkiler
// hesabında saklanır. O anki düzen her durumda bu tarayıcıda hatırlanır.

import { useEffect, useRef, useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { uye, useOturum } from "../lib/oturum";
import {
  DUZEN_ADI_UZUNLUK, EN_COK_DUZEN, VARSAYILAN_DUZEN, duzenDuzelt, duzenleriDenetle, type Duzen, type KayitliDuzen,
} from "../../shared/duzen";

const AKTIF = "fpga-pratik:sim-duzen";
const YEREL_LISTE = "fpga-pratik:sim-duzenleri";

function oku<T>(anahtar: string, varsayilan: T): T {
  try {
    const v = localStorage.getItem(anahtar);
    return v ? (JSON.parse(v) as T) : varsayilan;
  } catch {
    return varsayilan;
  }
}

function yaz(anahtar: string, v: unknown) {
  try {
    localStorage.setItem(anahtar, JSON.stringify(v));
  } catch {
    // gizli pencere: oturum boyunca bellekte kalır
  }
}

export function useDuzen() {
  const [duzen, setDuzen] = useState<Duzen>(() => duzenDuzelt(oku<unknown>(AKTIF, VARSAYILAN_DUZEN)));
  useEffect(() => yaz(AKTIF, duzen), [duzen]);
  return [duzen, setDuzen] as const;
}

function useKayitliDuzenler() {
  const { me } = useOturum();
  const hesapta = uye(me);
  const [liste, setListe] = useState<KayitliDuzen[] | null>(null);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    setListe(null);
    if (hesapta) {
      api.ayarlar.duzenler().then(setListe, () => (setListe([]), setHata("Kayıtlı düzenler yüklenemedi.")));
    } else {
      const d = duzenleriDenetle(oku<unknown>(YEREL_LISTE, []));
      setListe("duzenler" in d ? d.duzenler : []);
    }
  }, [hesapta]);

  const kaydet = async (yeni: KayitliDuzen[]): Promise<boolean> => {
    setHata(null);
    if (!hesapta) {
      yaz(YEREL_LISTE, yeni);
      setListe(yeni);
      return true;
    }
    const r = await api.ayarlar.duzenleriKaydet(yeni);
    if (!r.ok) {
      setHata(r.hata.error);
      return false;
    }
    setListe(r.data);
    return true;
  };

  return { liste, kaydet, hata, hesapta };
}

interface Props {
  duzen: Duzen;
  uygula: (d: Duzen) => void;
  durum: (s: string) => void;
}

export function DuzenMenusu({ duzen, uygula, durum }: Props) {
  const [acik, setAcik] = useState(false);
  const [ad, setAd] = useState("");
  const kutu = useRef<HTMLDivElement>(null);
  const { liste, kaydet, hata, hesapta } = useKayitliDuzenler();

  useEffect(() => {
    if (!acik) return;
    const disari = (e: MouseEvent) => !kutu.current?.contains(e.target as Node) && setAcik(false);
    const tus = (e: KeyboardEvent) => e.key === "Escape" && setAcik(false);
    window.addEventListener("mousedown", disari);
    window.addEventListener("keydown", tus);
    return () => {
      window.removeEventListener("mousedown", disari);
      window.removeEventListener("keydown", tus);
    };
  }, [acik]);

  const temizAd = ad.trim();
  const ayni = liste?.find((k) => k.ad.toLocaleLowerCase("tr") === temizAd.toLocaleLowerCase("tr"));
  const dolu = !!liste && liste.length >= EN_COK_DUZEN && !ayni;

  const gonder = async (e: FormEvent) => {
    e.preventDefault();
    if (!liste || !temizAd || dolu) return;
    if (ayni && !confirm(`"${ayni.ad}" düzeninin üzerine yazılsın mı?`)) return;
    const yeni = ayni ? liste.map((k) => (k === ayni ? { ad: k.ad, duzen } : k)) : [...liste, { ad: temizAd, duzen }];
    if (await kaydet(yeni)) {
      setAd("");
      durum(`"${temizAd}" düzeni ${hesapta ? "hesabına" : "bu tarayıcıya"} kaydedildi`);
    }
  };

  const sil = async (k: KayitliDuzen) => {
    if (!liste || !confirm(`"${k.ad}" düzeni silinsin mi?`)) return;
    if (await kaydet(liste.filter((x) => x !== k))) durum(`"${k.ad}" düzeni silindi`);
  };

  return (
    <div className="acilir" ref={kutu}>
      <button aria-haspopup="dialog" aria-expanded={acik} onClick={() => setAcik(!acik)}>Düzen ▾</button>
      {acik && (
        <div className="acilir-kutu duzen-menusu" role="dialog" aria-label="Pencere düzeni">
          <button
            className="duzen-varsayilan"
            onClick={() => {
              uygula(VARSAYILAN_DUZEN);
              durum("Varsayılan pencere düzenine dönüldü");
            }}
          >
            ⟲ Varsayılan düzene dön
          </button>
          <p className="hint">Panelleri başlıklarından sürükleyerek yerlerini, aralarındaki çizgileri sürükleyerek boyutlarını değiştir.</p>

          <h4>Kayıtlı düzenler</h4>
          {!liste ? (
            <p className="hint">Yükleniyor…</p>
          ) : liste.length === 0 ? (
            <p className="hint">Henüz kayıtlı düzen yok.</p>
          ) : (
            <ul className="duzen-listesi">
              {liste.map((k) => (
                <li key={k.ad}>
                  <button
                    className="baglanti-dugme"
                    onClick={() => {
                      uygula(k.duzen);
                      setAcik(false);
                      durum(`"${k.ad}" düzeni uygulandı`);
                    }}
                  >
                    {k.ad}
                  </button>
                  <button className="icon" aria-label={`${k.ad} düzenini sil`} onClick={() => sil(k)}>×</button>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={gonder} className="duzen-kaydet">
            <input
              aria-label="Düzen adı"
              placeholder="Bu düzene bir ad ver"
              value={ad}
              maxLength={DUZEN_ADI_UZUNLUK}
              onChange={(e) => setAd(e.target.value)}
            />
            <button type="submit" className="primary" disabled={!temizAd || dolu || !liste}>{ayni ? "Üzerine yaz" : "Kaydet"}</button>
          </form>
          {dolu && <p className="hint">En fazla {EN_COK_DUZEN} düzen kaydedebilirsin; yer açmak için birini sil.</p>}
          {hata && <p className="bad">{hata}</p>}
          <p className="hint">
            {hesapta ? "Düzenler hesabına kaydedilir, her cihazda kullanabilirsin." : "Düzenler bu tarayıcıda saklanır. Giriş yaparsan hesabına kaydedilir."}
          </p>
        </div>
      )}
    </div>
  );
}
