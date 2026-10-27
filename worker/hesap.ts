// Hesap uç noktaları: kayıt (e-posta kodu), giriş, çıkış, parola sıfırlama ve ayarlar.

import { Hono, type Context } from "hono";
import { deleteCookie } from "hono/cookie";
import {
  KOD_DENEME, KOD_GECERLILIK_DK, KOD_TEKRAR_SN, KULLANICI_ADI_DEGISIM_GUN,
  epostaHatasi, kullaniciAdiHatasi, parolaHatasi,
} from "../shared/hesap";
import { AVATAR_IDLERI, AVATAR_ZEMINLERI, rastgeleAvatar } from "../shared/avatarlar";
import { duzenleriDenetle } from "../shared/duzen";
import type { ApiHata } from "../shared/api";
import { dortHaneliKod, epostaAcik, kodGonder } from "./eposta";
import { tbSilSorgulari } from "./topluluk";
import { parolaDogru, parolaOzeti, yinelemeSayisi } from "./parola";
import { COOKIE, endSession, loadUser, otherSessionsQuery, sha256, startSession, type Env } from "./session";
import { DAKIKA, SAAT, sinirAsildi, sinirDolu, sinirSifirla } from "./sinir";
import { HEDEF_SECENEKLERI } from "../shared/motivasyon";

const hesap = new Hono<Env>();

type C = Context<Env>;

function hata(c: C, status: 400 | 401 | 403 | 404 | 409 | 429 | 503, error: string, extra: Omit<ApiHata, "error"> = {}) {
  return c.json<ApiHata>({ error, ...extra }, status);
}

async function govde<T>(c: C): Promise<Partial<T>> {
  const b = await c.req.json<T>().catch(() => null);
  return b && typeof b === "object" ? b : {};
}

const metin = (v: unknown) => (typeof v === "string" ? v : "");
const ip = (c: C) => c.req.header("CF-Connecting-IP") ?? "yerel";
const kodOzeti = (id: string, kod: string) => sha256(`${id}:${kod}`);

const KAPALI = "E-posta gönderimi henüz açık değil, bu yüzden kayıt ve parola sıfırlama şimdilik kullanılamıyor.";
const COK_DENEME = "Çok fazla deneme yapıldı, biraz sonra tekrar dene.";

// Kod gönderimi: IP ve alıcı başına saatte en fazla 5
async function kodSiniri(c: C, alici: string): Promise<boolean> {
  const db = c.env.DB;
  return (await sinirAsildi(db, `kod-ip:${ip(c)}`, 5, SAAT)) || (await sinirAsildi(db, `kod-alici:${alici}`, 5, SAAT));
}

async function kullaniciAdiAlinmis(db: D1Database, ad: string, haricId = ""): Promise<boolean> {
  const row = await db
    .prepare(
      `SELECT 1 FROM users WHERE username = ?1 AND id != ?3
       UNION ALL SELECT 1 FROM pending_signups WHERE username = ?1 AND expires_at > ?2 LIMIT 1`,
    )
    .bind(ad, Date.now(), haricId)
    .first();
  return !!row;
}

async function epostaAlinmis(db: D1Database, eposta: string): Promise<boolean> {
  return !!(await db.prepare("SELECT 1 FROM users WHERE email = ? AND kind = 'member'").bind(eposta).first());
}

type KodSatiri = { id: string; code_hash: string; attempts: number; expires_at: number };

// Kod doğruysa null, değilse hata yanıtı döner; yanlış denemeleri sayar
async function kodYanlis(c: C, tablo: "pending_signups" | "email_codes", row: KodSatiri | null, kod: string) {
  if (!row || row.expires_at < Date.now() || row.attempts >= KOD_DENEME) {
    return hata(c, 400, "Kod hatalı ya da süresi dolmuş. Yeni bir kod iste.", { alan: "kod", kalan: 0 });
  }
  if ((await kodOzeti(row.id, kod)) === row.code_hash) return null;
  await c.env.DB.prepare(`UPDATE ${tablo} SET attempts = attempts + 1 WHERE id = ?`).bind(row.id).run();
  const kalan = KOD_DENEME - row.attempts - 1;
  return hata(c, 400, kalan > 0 ? `Kod hatalı. ${kalan} deneme hakkın kaldı.` : "Kod hatalı. Yeni bir kod iste.", {
    alan: "kod",
    kalan,
  });
}

const gecerlilik = () => Date.now() + KOD_GECERLILIK_DK * DAKIKA;

// ---- Kayıt ----

hesap.get("/kullanici-adi/:ad", async (c) => {
  const ad = c.req.param("ad").toLowerCase();
  const sebep = kullaniciAdiHatasi(ad) ?? ((await kullaniciAdiAlinmis(c.env.DB, ad, c.get("me")?.id)) ? "Bu ad alınmış." : null);
  return c.json({ uygun: !sebep, sebep });
});

hesap.post("/kayit", async (c) => {
  if (!epostaAcik(c.env)) return hata(c, 503, KAPALI);
  if (c.get("me")?.kind === "member") return hata(c, 409, "Zaten giriş yapmışsın.");
  const b = await govde<{ username: string; password: string; email: string }>(c);
  const username = metin(b.username).trim().toLowerCase();
  const email = metin(b.email).trim().toLowerCase();
  const password = metin(b.password);

  const adHata = kullaniciAdiHatasi(username);
  if (adHata) return hata(c, 400, adHata, { alan: "username" });
  const epHata = epostaHatasi(email);
  if (epHata) return hata(c, 400, epHata, { alan: "email" });
  const paHata = parolaHatasi(password, [username, email.split("@")[0]!]);
  if (paHata) return hata(c, 400, paHata, { alan: "password" });

  if (await kullaniciAdiAlinmis(c.env.DB, username)) return hata(c, 409, "Bu ad alınmış.", { alan: "username" });
  if (await epostaAlinmis(c.env.DB, email)) {
    return hata(c, 409, "Bu e-postayla açılmış bir hesap var. Parolanı unuttuysan sıfırlayabilirsin.", { alan: "email" });
  }
  if (await kodSiniri(c, email)) return hata(c, 429, COK_DENEME);

  const id = crypto.randomUUID();
  const kod = dortHaneliKod();
  const o = await parolaOzeti(password, yinelemeSayisi(c.env));
  const now = Date.now();
  await c.env.DB.batch([
    // Aynı e-postayla yarım kalmış eski kayıtlar silinir
    c.env.DB.prepare("DELETE FROM pending_signups WHERE email = ? OR expires_at < ?").bind(email, now),
    c.env.DB.prepare(
      `INSERT INTO pending_signups (id, username, email, pass_hash, pass_salt, pass_iter, code_hash, sent_at, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(id, username, email, o.hash, o.salt, o.iter, await kodOzeti(id, kod), now, gecerlilik()),
  ]);
  await kodGonder(c.env, email, kod, "kayit");
  return c.json({ id, tekrarSaniye: KOD_TEKRAR_SN });
});

hesap.post("/kayit/yeniden", async (c) => {
  if (!epostaAcik(c.env)) return hata(c, 503, KAPALI);
  const b = await govde<{ id: string }>(c);
  const row = await c.env.DB.prepare("SELECT id, email, sent_at FROM pending_signups WHERE id = ? AND expires_at > ?")
    .bind(metin(b.id), Date.now())
    .first<{ id: string; email: string; sent_at: number }>();
  if (!row) return hata(c, 400, "Kaydın süresi dolmuş, baştan başla.");
  if (Date.now() - row.sent_at < KOD_TEKRAR_SN * 1000) return hata(c, 429, "Yeni kod için biraz bekle.");
  if (await kodSiniri(c, row.email)) return hata(c, 429, COK_DENEME);

  const kod = dortHaneliKod();
  await c.env.DB.prepare("UPDATE pending_signups SET code_hash = ?, attempts = 0, sent_at = ?, expires_at = ? WHERE id = ?")
    .bind(await kodOzeti(row.id, kod), Date.now(), gecerlilik(), row.id)
    .run();
  await kodGonder(c.env, row.email, kod, "kayit");
  return c.json({ tekrarSaniye: KOD_TEKRAR_SN });
});

hesap.post("/kayit/dogrula", async (c) => {
  const b = await govde<{ id: string; kod: string }>(c);
  const row = await c.env.DB.prepare("SELECT * FROM pending_signups WHERE id = ?").bind(metin(b.id)).first<
    KodSatiri & { username: string; email: string; pass_hash: string; pass_salt: string; pass_iter: number }
  >();
  const yanlis = await kodYanlis(c, "pending_signups", row, metin(b.kod).trim());
  if (yanlis) return yanlis;
  const p = row!;

  // Kod beklenirken ad ya da e-posta başkası tarafından alınmış olabilir
  const ayniAd = await c.env.DB.prepare("SELECT 1 FROM users WHERE username = ?").bind(p.username).first();
  if (ayniAd) return hata(c, 409, "Bu ad bu arada alınmış, baştan başla.");
  if (await epostaAlinmis(c.env.DB, p.email)) return hata(c, 409, "Bu e-postayla açılmış bir hesap var.");

  const me = c.get("me");
  const now = Date.now();
  const avatar = rastgeleAvatar();
  // Misafirse aynı kullanıcı hesaba dönüşür, böylece denemeleri kaybolmaz
  const userId = me?.kind === "guest" ? me.id : crypto.randomUUID();
  const kullanici =
    me?.kind === "guest"
      ? c.env.DB.prepare(
          `UPDATE users SET kind = 'member', username = ?, email = ?, email_verified = 1, password_hash = ?,
                            pass_salt = ?, pass_iter = ?, avatar = ? WHERE id = ?`,
        ).bind(p.username, p.email, p.pass_hash, p.pass_salt, p.pass_iter, avatar, userId)
      : c.env.DB.prepare(
          `INSERT INTO users (id, kind, username, email, email_verified, password_hash, pass_salt, pass_iter, avatar, created_at)
           VALUES (?, 'member', ?, ?, 1, ?, ?, ?, ?, ?)`,
        ).bind(userId, p.username, p.email, p.pass_hash, p.pass_salt, p.pass_iter, avatar, now);
  await startSession(c, userId, [kullanici, c.env.DB.prepare("DELETE FROM pending_signups WHERE id = ?").bind(p.id)]);
  return c.json(await loadUser(c.env.DB, userId));
});

// ---- Giriş ve çıkış ----

hesap.post("/giris", async (c) => {
  const b = await govde<{ kimlik: string; parola: string }>(c);
  const kimlik = metin(b.kimlik).trim().toLowerCase();
  const parola = metin(b.parola);
  if (!kimlik || !parola) return hata(c, 400, "Kullanıcı adını ya da e-postanı ve parolanı yaz.");

  // Başarısız girişler kullanıcı ve IP başına sayılır
  const kKey = `giris-k:${kimlik}`;
  const iKey = `giris-ip:${ip(c)}`;
  if ((await sinirDolu(c.env.DB, kKey, 10, 15 * DAKIKA)) || (await sinirDolu(c.env.DB, iKey, 30, 15 * DAKIKA))) {
    return hata(c, 429, "Çok fazla hatalı giriş denendi. 15 dakika sonra tekrar dene.");
  }

  const u = await c.env.DB.prepare(
    `SELECT id, password_hash, pass_salt, pass_iter FROM users
     WHERE kind = 'member' AND (username = ?1 OR email = ?1)`,
  )
    .bind(kimlik)
    .first<{ id: string; password_hash: string; pass_salt: string; pass_iter: number }>();
  const dogru = u ? await parolaDogru(parola, { hash: u.password_hash, salt: u.pass_salt, iter: u.pass_iter }) : false;
  if (!u || !dogru) {
    await sinirAsildi(c.env.DB, kKey, 10, 15 * DAKIKA);
    await sinirAsildi(c.env.DB, iKey, 30, 15 * DAKIKA);
    return hata(c, 401, "Kullanıcı adı, e-posta ya da parola hatalı.");
  }
  await sinirSifirla(c.env.DB, kKey);

  // Yineleme sayısı artırıldıysa özet yenilenir (parola sadece burada elimizde)
  const yineleme = yinelemeSayisi(c.env);
  const yenile: D1PreparedStatement[] = [];
  if (u.pass_iter < yineleme) {
    const o = await parolaOzeti(parola, yineleme);
    yenile.push(
      c.env.DB.prepare("UPDATE users SET password_hash = ?, pass_salt = ?, pass_iter = ? WHERE id = ?").bind(
        o.hash, o.salt, o.iter, u.id,
      ),
    );
  }

  // Bu tarayıcıdaki misafir denemeleri hesaba taşınır
  const me = c.get("me");
  const tasi =
    me?.kind === "guest" && me.id !== u.id
      ? [
          c.env.DB.prepare("UPDATE attempts SET user_id = ? WHERE user_id = ?").bind(u.id, me.id),
          c.env.DB.prepare("UPDATE sinamalar SET user_id = ? WHERE user_id = ?").bind(u.id, me.id),
          // Hesapta zaten olan sorular hesaptaki haliyle kalır
          c.env.DB.prepare("UPDATE OR IGNORE tekrarlar SET user_id = ? WHERE user_id = ?").bind(u.id, me.id),
          c.env.DB.prepare("DELETE FROM tekrarlar WHERE user_id = ?").bind(me.id),
          c.env.DB.prepare("DELETE FROM users WHERE id = ? AND kind = 'guest'").bind(me.id),
        ]
      : [];
  await startSession(c, u.id, [...yenile, ...tasi]);
  return c.json(await loadUser(c.env.DB, u.id));
});

hesap.post("/cikis", async (c) => {
  await endSession(c);
  return c.json({ ok: true });
});

// ---- Parola sıfırlama ----

hesap.post("/sifre/iste", async (c) => {
  if (!epostaAcik(c.env)) return hata(c, 503, KAPALI);
  const b = await govde<{ kimlik: string }>(c);
  const kimlik = metin(b.kimlik).trim().toLowerCase();
  if (!kimlik) return hata(c, 400, "Kullanıcı adını ya da e-postanı yaz.");

  // Hesap olsun olmasın aynı yanıt döner; böylece kimin kayıtlı olduğu anlaşılmaz
  const id = crypto.randomUUID();
  const yanit = { id, tekrarSaniye: KOD_TEKRAR_SN };
  if (await sinirAsildi(c.env.DB, `kod-ip:${ip(c)}`, 5, SAAT)) return hata(c, 429, COK_DENEME);

  const u = await c.env.DB.prepare(
    "SELECT id, email FROM users WHERE kind = 'member' AND email_verified = 1 AND (username = ?1 OR email = ?1)",
  )
    .bind(kimlik)
    .first<{ id: string; email: string }>();
  if (!u || (await sinirAsildi(c.env.DB, `kod-alici:${u.email}`, 5, SAAT))) return c.json(yanit);

  const kod = dortHaneliKod();
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM email_codes WHERE user_id = ? AND purpose = 'reset'").bind(u.id),
    c.env.DB.prepare(
      "INSERT INTO email_codes (id, user_id, purpose, code_hash, sent_at, expires_at) VALUES (?, ?, 'reset', ?, ?, ?)",
    ).bind(id, u.id, await kodOzeti(id, kod), Date.now(), gecerlilik()),
  ]);
  await kodGonder(c.env, u.email, kod, "reset");
  return c.json(yanit);
});

hesap.post("/sifre/dogrula", async (c) => {
  const b = await govde<{ id: string; kod: string; parola: string }>(c);
  const row = await c.env.DB.prepare(
    `SELECT e.id, e.user_id, e.code_hash, e.attempts, e.expires_at, u.username, u.email
     FROM email_codes e JOIN users u ON u.id = e.user_id WHERE e.id = ? AND e.purpose = 'reset'`,
  )
    .bind(metin(b.id))
    .first<KodSatiri & { user_id: string; username: string; email: string }>();
  const yanlis = await kodYanlis(c, "email_codes", row, metin(b.kod).trim());
  if (yanlis) return yanlis;
  const r = row!;

  const parola = metin(b.parola);
  const paHata = parolaHatasi(parola, [r.username, r.email.split("@")[0]!]);
  if (paHata) return hata(c, 400, paHata, { alan: "password" });

  const o = await parolaOzeti(parola, yinelemeSayisi(c.env));
  // Tüm açık oturumlar kapatılır, sonra bu tarayıcıda yeni oturum açılır
  await startSession(c, r.user_id, [
    c.env.DB.prepare("UPDATE users SET password_hash = ?, pass_salt = ?, pass_iter = ? WHERE id = ?").bind(
      o.hash, o.salt, o.iter, r.user_id,
    ),
    c.env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(r.user_id),
    c.env.DB.prepare("DELETE FROM email_codes WHERE id = ?").bind(r.id),
  ]);
  return c.json(await loadUser(c.env.DB, r.user_id));
});

// ---- Ayarlar (giriş gerekir) ----

const ayarlar = new Hono<Env>();

ayarlar.use("*", async (c, next) => {
  if (c.get("me")?.kind !== "member") return hata(c, 401, "Bunun için giriş yapmalısın.");
  await next();
});

async function parolaKontrol(c: C, parola: string): Promise<boolean> {
  const u = await c.env.DB.prepare("SELECT password_hash, pass_salt, pass_iter FROM users WHERE id = ?")
    .bind(c.get("me")!.id)
    .first<{ password_hash: string; pass_salt: string; pass_iter: number }>();
  return !!u && parolaDogru(parola, { hash: u.password_hash, salt: u.pass_salt, iter: u.pass_iter });
}

ayarlar.post("/profil", async (c) => {
  const b = await govde<{ publicProfile: boolean; avatar: string; avatarBg: string | null; notifyEmail: boolean; gunlukHedef: number }>(c);
  const me = c.get("me")!;
  const publicProfile = typeof b.publicProfile === "boolean" ? b.publicProfile : me.publicProfile;
  const notifyEmail = typeof b.notifyEmail === "boolean" ? b.notifyEmail : me.notifyEmail;
  const gunlukHedef = b.gunlukHedef === undefined ? me.gunlukHedef : b.gunlukHedef;
  if (!HEDEF_SECENEKLERI.includes(gunlukHedef)) return hata(c, 400, "Geçersiz günlük hedef.");
  const avatar = b.avatar === undefined ? me.avatar : metin(b.avatar);
  const avatarBg = b.avatarBg === undefined ? me.avatarBg : b.avatarBg;
  if (avatar && !AVATAR_IDLERI.has(avatar)) return hata(c, 400, "Böyle bir avatar yok.");
  if (avatarBg !== null && !(AVATAR_ZEMINLERI as readonly string[]).includes(metin(avatarBg))) {
    return hata(c, 400, "Böyle bir zemin rengi yok.");
  }
  await c.env.DB.prepare("UPDATE users SET public_profile = ?, avatar = ?, avatar_bg = ?, notify_email = ?, gunluk_hedef = ? WHERE id = ?")
    .bind(publicProfile ? 1 : 0, avatar, avatarBg, notifyEmail ? 1 : 0, gunlukHedef, me.id)
    .run();
  return c.json(await loadUser(c.env.DB, me.id));
});

ayarlar.get("/duzenler", async (c) => {
  const r = await c.env.DB.prepare("SELECT sim_duzenleri FROM users WHERE id = ?").bind(c.get("me")!.id)
    .first<{ sim_duzenleri: string | null }>();
  let kayitli: unknown = [];
  try {
    kayitli = JSON.parse(r?.sim_duzenleri ?? "[]");
  } catch {
    // bozuk kayıt boş liste sayılır
  }
  const d = duzenleriDenetle(kayitli);
  return c.json("duzenler" in d ? d.duzenler : []);
});

ayarlar.put("/duzenler", async (c) => {
  const b = await govde<{ duzenler: unknown }>(c);
  const d = duzenleriDenetle(b.duzenler);
  if ("hata" in d) return hata(c, 400, d.hata);
  await c.env.DB.prepare("UPDATE users SET sim_duzenleri = ? WHERE id = ?").bind(JSON.stringify(d.duzenler), c.get("me")!.id).run();
  return c.json(d.duzenler);
});

ayarlar.post("/parola", async (c) => {
  const b = await govde<{ mevcut: string; yeni: string }>(c);
  const me = c.get("me")!;
  if (!(await parolaKontrol(c, metin(b.mevcut)))) return hata(c, 400, "Mevcut parola hatalı.", { alan: "mevcut" });
  const paHata = parolaHatasi(metin(b.yeni), [me.username ?? "", (me.email ?? "").split("@")[0]!]);
  if (paHata) return hata(c, 400, paHata, { alan: "yeni" });
  const o = await parolaOzeti(metin(b.yeni), yinelemeSayisi(c.env));
  await c.env.DB.batch([
    c.env.DB.prepare("UPDATE users SET password_hash = ?, pass_salt = ?, pass_iter = ? WHERE id = ?").bind(
      o.hash, o.salt, o.iter, me.id,
    ),
    await otherSessionsQuery(c, me.id),
  ]);
  return c.json({ ok: true });
});

ayarlar.post("/kullanici-adi", async (c) => {
  const b = await govde<{ yeni: string }>(c);
  const me = c.get("me")!;
  const yeni = metin(b.yeni).trim().toLowerCase();
  if (yeni === me.username) return c.json(me);
  const bekle = (me.usernameChangedAt ?? 0) + KULLANICI_ADI_DEGISIM_GUN * 24 * SAAT - Date.now();
  if (bekle > 0) {
    return hata(c, 429, `Kullanıcı adını ${Math.ceil(bekle / (24 * SAAT))} gün sonra yeniden değiştirebilirsin.`, {
      alan: "yeni",
    });
  }
  const adHata = kullaniciAdiHatasi(yeni) ?? ((await kullaniciAdiAlinmis(c.env.DB, yeni, me.id)) ? "Bu ad alınmış." : null);
  if (adHata) return hata(c, 400, adHata, { alan: "yeni" });
  await c.env.DB.prepare("UPDATE users SET username = ?, username_changed_at = ? WHERE id = ?")
    .bind(yeni, Date.now(), me.id)
    .run();
  return c.json(await loadUser(c.env.DB, me.id));
});

ayarlar.post("/eposta", async (c) => {
  if (!epostaAcik(c.env)) return hata(c, 503, "E-posta gönderimi henüz açık değil.");
  const b = await govde<{ yeni: string; parola: string }>(c);
  const me = c.get("me")!;
  const yeni = metin(b.yeni).trim().toLowerCase();
  const epHata = epostaHatasi(yeni);
  if (epHata) return hata(c, 400, epHata, { alan: "yeni" });
  if (yeni === me.email) return hata(c, 400, "Bu zaten şu anki e-postan.", { alan: "yeni" });
  if (!(await parolaKontrol(c, metin(b.parola)))) return hata(c, 400, "Parola hatalı.", { alan: "parola" });
  if (await epostaAlinmis(c.env.DB, yeni)) return hata(c, 409, "Bu e-posta başka bir hesapta kayıtlı.", { alan: "yeni" });
  if (await kodSiniri(c, yeni)) return hata(c, 429, COK_DENEME);

  const id = crypto.randomUUID();
  const kod = dortHaneliKod();
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM email_codes WHERE user_id = ? AND purpose = 'email'").bind(me.id),
    c.env.DB.prepare(
      "INSERT INTO email_codes (id, user_id, purpose, new_email, code_hash, sent_at, expires_at) VALUES (?, ?, 'email', ?, ?, ?, ?)",
    ).bind(id, me.id, yeni, await kodOzeti(id, kod), Date.now(), gecerlilik()),
  ]);
  await kodGonder(c.env, yeni, kod, "email");
  return c.json({ id, tekrarSaniye: KOD_TEKRAR_SN });
});

ayarlar.post("/eposta/dogrula", async (c) => {
  const b = await govde<{ id: string; kod: string }>(c);
  const me = c.get("me")!;
  const row = await c.env.DB.prepare(
    "SELECT id, code_hash, attempts, expires_at, new_email FROM email_codes WHERE id = ? AND user_id = ? AND purpose = 'email'",
  )
    .bind(metin(b.id), me.id)
    .first<KodSatiri & { new_email: string }>();
  const yanlis = await kodYanlis(c, "email_codes", row, metin(b.kod).trim());
  if (yanlis) return yanlis;
  if (await epostaAlinmis(c.env.DB, row!.new_email)) return hata(c, 409, "Bu e-posta başka bir hesapta kayıtlı.");
  await c.env.DB.batch([
    c.env.DB.prepare("UPDATE users SET email = ?, email_verified = 1 WHERE id = ?").bind(row!.new_email, me.id),
    c.env.DB.prepare("DELETE FROM email_codes WHERE id = ?").bind(row!.id),
  ]);
  return c.json(await loadUser(c.env.DB, me.id));
});

ayarlar.post("/oturumlari-kapat", async (c) => {
  await (await otherSessionsQuery(c, c.get("me")!.id)).run();
  return c.json({ ok: true });
});

// Hesap silinince denemeler, oturumlar ve kodlar da silinir (KVKK)
ayarlar.post("/hesabi-sil", async (c) => {
  const b = await govde<{ parola: string }>(c);
  const me = c.get("me")!;
  if (!(await parolaKontrol(c, metin(b.parola)))) return hata(c, 400, "Parola hatalı.", { alan: "parola" });
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM attempts WHERE user_id = ?").bind(me.id),
    c.env.DB.prepare("DELETE FROM tekrarlar WHERE user_id = ?").bind(me.id),
    c.env.DB.prepare("DELETE FROM sinamalar WHERE user_id = ?").bind(me.id),
    c.env.DB.prepare("DELETE FROM thread_messages WHERE thread_id IN (SELECT id FROM threads WHERE user_id = ?)").bind(me.id),
    c.env.DB.prepare("DELETE FROM threads WHERE user_id = ?").bind(me.id),
    c.env.DB.prepare("DELETE FROM suggestions WHERE user_id = ?").bind(me.id),
    c.env.DB.prepare("DELETE FROM bildirimler WHERE user_id = ?").bind(me.id),
    c.env.DB.prepare("DELETE FROM bildirimler WHERE hedef_tur = 'paylasim' AND hedef_id IN (SELECT id FROM paylasimlar WHERE user_id = ?)").bind(me.id),
    c.env.DB.prepare("DELETE FROM paylasimlar WHERE user_id = ?").bind(me.id),
    ...tbSilSorgulari(c.env.DB, "user_id = ?", me.id),
    c.env.DB.prepare("DELETE FROM tb_begeni WHERE user_id = ?").bind(me.id),
    c.env.DB.prepare("DELETE FROM tb_cozum WHERE user_id = ?").bind(me.id),
    c.env.DB.prepare("UPDATE questions SET suggested_by = NULL WHERE suggested_by = ?").bind(me.id),
    c.env.DB.prepare("UPDATE thread_messages SET admin_id = NULL WHERE admin_id = ?").bind(me.id),
    c.env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(me.id),
    c.env.DB.prepare("DELETE FROM email_codes WHERE user_id = ?").bind(me.id),
    c.env.DB.prepare("UPDATE questions SET created_by = NULL WHERE created_by = ?").bind(me.id),
    c.env.DB.prepare("DELETE FROM users WHERE id = ?").bind(me.id),
  ]);
  deleteCookie(c, COOKIE, { path: "/", secure: true });
  return c.json({ ok: true });
});

hesap.route("/ayarlar", ayarlar);

export { hesap };
