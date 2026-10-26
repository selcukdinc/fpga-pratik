// Avatar ve zemin rengini seçme penceresi. Ayarlar ve kendi profil sayfandan açılır;
// seçim kaydedilene kadar sadece önizlemede görünür.

import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { useOturum } from "../lib/oturum";
import { AVATARLAR, AVATAR_ZEMINLERI } from "../../shared/avatarlar";
import { Avatar } from "./Avatar";
import { FormHatasi } from "./Form";
import type { Me } from "../../shared/api";

const GRUPLAR = [...new Set(AVATARLAR.map((a) => a.grup))];

interface Props {
  me: Me;
  kapat: () => void;
}

export function AvatarSecici({ me, kapat }: Props) {
  const { setMe } = useOturum();
  const pencere = useRef<HTMLDialogElement>(null);
  const [avatar, setAvatar] = useState(me.avatar ?? AVATARLAR[0]!.id);
  const [zemin, setZemin] = useState<string | null>(me.avatarBg);
  const [grup, setGrup] = useState(AVATARLAR.find((a) => a.id === me.avatar)?.grup ?? GRUPLAR[0]!);
  const [hata, setHata] = useState<string | null>(null);
  const [mesgul, setMesgul] = useState(false);

  useEffect(() => {
    const d = pencere.current;
    if (d && !d.open) d.showModal();
  }, []);

  const kaydet = async () => {
    setMesgul(true);
    setHata(null);
    const r = await api.ayarlar.profil({ avatar, avatarBg: zemin });
    setMesgul(false);
    if (!r.ok) return setHata(r.hata.error);
    setMe(r.data);
    kapat();
  };

  const secili = AVATARLAR.find((a) => a.id === avatar);

  return (
    <dialog ref={pencere} className="avatar-pencere" aria-labelledby="avatar-baslik" onClose={kapat}
      onClick={(e) => e.target === pencere.current && pencere.current.close()}>
      <div className="pencere-ic">
        <h3 id="avatar-baslik">Avatarını seç</h3>
        <div className="avatar-onizleme">
          <Avatar id={avatar} bg={zemin} size={72} />
          <div>
            <strong>{secili?.ad}</strong>
            <fieldset className="zeminler">
              <legend>Zemin rengi</legend>
              <label className={`zemin${zemin === null ? " secili" : ""}`} title="Zeminsiz">
                <input type="radio" name="zemin" checked={zemin === null} onChange={() => setZemin(null)} />
                <span className="zemin-yok" aria-hidden="true" />
                <span className="sr-only">Zeminsiz</span>
              </label>
              {AVATAR_ZEMINLERI.map((z) => (
                <label key={z} className={`zemin${zemin === z ? " secili" : ""}`} title={z}>
                  <input type="radio" name="zemin" checked={zemin === z} onChange={() => setZemin(z)} />
                  <span style={{ background: z }} aria-hidden="true" />
                  <span className="sr-only">Renk {z}</span>
                </label>
              ))}
            </fieldset>
          </div>
        </div>

        <div className="sekmeler" role="tablist" aria-label="Avatar grubu">
          {GRUPLAR.map((g) => (
            <button key={g} type="button" role="tab" aria-selected={grup === g} onClick={() => setGrup(g)}>{g}</button>
          ))}
        </div>
        <div className="avatar-grup" role="radiogroup" aria-label={grup}>
          {AVATARLAR.filter((a) => a.grup === grup).map((a) => (
            <label key={a.id} className={`avatar-sec${avatar === a.id ? " secili" : ""}`} title={a.ad}>
              <input type="radio" name="avatar" checked={avatar === a.id} onChange={() => setAvatar(a.id)} />
              <Avatar id={a.id} bg={zemin} size={44} />
              <span className="sr-only">{a.ad}</span>
            </label>
          ))}
        </div>

        <FormHatasi hata={hata} />
        <div className="pencere-dugmeler">
          <button type="button" onClick={() => pencere.current?.close()}>Vazgeç</button>
          <button type="button" className="primary" onClick={kaydet} disabled={mesgul}>Kaydet</button>
        </div>
      </div>
    </dialog>
  );
}
