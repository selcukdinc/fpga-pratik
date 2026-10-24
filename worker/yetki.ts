// Tüm yetki kontrolleri bu fonksiyondan geçer. Bugün tek rol var (admin her
// şeyi yapar). İleride ders asistanı ya da akademisyen eklenirse roles ve
// role_permissions tabloları eklenip sadece bu dosya değişir; "kendi eklediği
// soruyu düzenler" gibi kurallar questions.created_by ile yazılır.

import type { Me } from "../shared/api";

export type Izin =
  | "yonetim.giris"
  | "ayar.duzenle"
  | "soru.ekle"
  | "soru.duzenle"
  | "oneri.yonet"
  | "mesaj.cevapla"
  | "bildirim.yonet"
  | "kullanici.yonet";

export function yetkisiVar(me: Me | null, _izin: Izin): boolean {
  return me?.kind === "member" && me.role === "admin";
}
