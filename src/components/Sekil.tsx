import { gorselBul } from "../gorseller";
import { ETKILESIMLER } from "./etkilesim";

// Ders metnindeki [[G-H1-01]] satırlarının yerine konan şekil
export function Sekil({ kod }: { kod: string }) {
  const g = gorselBul(kod);
  if (!g) return null;
  const Etkilesim = g.etkilesim ? ETKILESIMLER[g.etkilesim] : undefined;
  return (
    <figure className="sekil" id={`sekil-${kod}`}>
      <div className="sekil-kutu">
        {Etkilesim ? (
          <Etkilesim g={g} />
        ) : (
          <svg viewBox={`0 0 ${g.en} ${g.boy}`} role="img" aria-label={`${g.baslik}. ${g.aciklama}`} dangerouslySetInnerHTML={{ __html: g.icerik }} />
        )}
      </div>
      <figcaption>
        <span className="sekil-kod">{g.kod}</span> {g.baslik}
        {Etkilesim && <span className="tag">etkileşimli</span>}
      </figcaption>
    </figure>
  );
}
