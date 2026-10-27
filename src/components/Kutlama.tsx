import { useEffect, useState, type CSSProperties } from "react";
import { KUTLAMA_OLAYI, type KutlamaAyrinti } from "../lib/kutlama";

const SURE_MS = 5000;
const PARCA = 16;

// Ekranın altında birkaç saniye kalan kutlama; hareket azaltma tercihinde konfeti yok (CSS)
export function KutlamaBildirimi() {
  const [k, setK] = useState<(KutlamaAyrinti & { n: number }) | null>(null);

  useEffect(() => {
    let sayac = 0;
    let zaman: ReturnType<typeof setTimeout> | undefined;
    const dinle = (e: Event) => {
      const d = (e as CustomEvent<KutlamaAyrinti>).detail;
      setK({ ...d, n: ++sayac });
      clearTimeout(zaman);
      zaman = setTimeout(() => setK(null), SURE_MS);
    };
    window.addEventListener(KUTLAMA_OLAYI, dinle);
    return () => {
      window.removeEventListener(KUTLAMA_OLAYI, dinle);
      clearTimeout(zaman);
    };
  }, []);

  return (
    <div className="kutlama-alani" role="status" aria-live="polite">
      {k && (
        <div key={k.n} className={`kutlama kutlama-${k.tur}`}>
          <span className="kutlama-konfeti" aria-hidden="true">
            {Array.from({ length: PARCA }, (_, i) => (
              <i key={i} style={{ "--a": `${(360 / PARCA) * i}deg`, "--r": `${46 + (i % 3) * 14}px` } as CSSProperties} />
            ))}
          </span>
          <span className="kutlama-ikon" aria-hidden="true">{k.tur === "alev" ? "🔥" : "🎯"}</span>
          <span>
            {k.tur === "alev" ? (
              <>
                <strong>Bugün alev aldın!</strong> {k.dogru} doğru cevap. Takvimde bugünün kutusu yanıyor.
              </>
            ) : (
              <>
                <strong>Günlük hedef tamam!</strong> Bugün {k.dogru} doğru cevap verdin.
              </>
            )}
          </span>
          <button type="button" className="icon kutlama-kapat" onClick={() => setK(null)} aria-label="Kapat">×</button>
        </div>
      )}
    </div>
  );
}
