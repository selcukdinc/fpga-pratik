// Hesap formlarının ortak parçaları

import { useEffect, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { parolaGucu } from "../../shared/hesap";

interface AlanProps extends InputHTMLAttributes<HTMLInputElement> {
  etiket: string;
  hata?: string | null;
  not?: ReactNode;
  onDeger: (v: string) => void;
}

export function Alan({ etiket, hata, not, onDeger, ...input }: AlanProps) {
  const id = useId();
  const notId = `${id}-not`;
  return (
    <div className="alan">
      <label htmlFor={id}>{etiket}</label>
      <input
        id={id}
        {...input}
        onChange={(e) => onDeger(e.target.value)}
        aria-invalid={hata ? true : undefined}
        aria-describedby={hata || not ? notId : undefined}
      />
      {(hata || not) && (
        <div id={notId} className={hata ? "alan-hata" : "alan-not"}>
          {hata ?? not}
        </div>
      )}
    </div>
  );
}

const SEVIYE = ["Kabul edilmez", "Zayıf", "Orta", "Güçlü"] as const;

export function ParolaGucuCubugu({ parola, ilgili }: { parola: string; ilgili: string[] }) {
  if (!parola) return null;
  const g = parolaGucu(parola, ilgili);
  return (
    <div className={`parola-gucu seviye-${g.seviye}`} aria-live="polite">
      <div className="parola-gucu-cubuk" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <span key={i} className={g.seviye >= i ? "dolu" : undefined} />
        ))}
      </div>
      <span className="parola-gucu-ad">{SEVIYE[g.seviye]}</span>
      {g.ipucu && <span className="parola-gucu-ipucu">{g.ipucu}</span>}
    </div>
  );
}

// "Kodu yeniden gönder" için geri sayım
export function useGeriSayim(baslangic: number): [number, (s: number) => void] {
  const [kalan, setKalan] = useState(baslangic);
  useEffect(() => {
    if (kalan <= 0) return;
    const t = setTimeout(() => setKalan((k) => k - 1), 1000);
    return () => clearTimeout(t);
  }, [kalan]);
  return [kalan, setKalan];
}

export function KodAlani({ kod, setKod, hata }: { kod: string; setKod: (k: string) => void; hata?: string | null }) {
  return (
    <Alan
      etiket="4 haneli kod"
      className="kod-girisi mono"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9]{4}"
      maxLength={4}
      value={kod}
      onDeger={(v) => setKod(v.replace(/\D/g, "").slice(0, 4))}
      hata={hata}
      autoFocus
    />
  );
}

export function FormHatasi({ hata }: { hata: string | null }) {
  if (!hata) return null;
  return (
    <p className="form-hata" role="alert">
      {hata}
    </p>
  );
}
