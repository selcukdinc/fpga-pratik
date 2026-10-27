// Yönetim paneli API'si: /api/yonetim. Her istek yetkisiVar() ile, Cloudflare
// Access açıksa ayrıca Access belirteciyle kontrol edilir. Her değişiklik
// admin_log tablosuna yazılır.

import { Hono, type Context } from "hono";
import type { Me } from "../shared/api";
import {
  soruGirdisiHatasi, soruSutunlari,
  type PanelAyarlar, type PanelKayit, type PanelPano, type PanelKullanici, type PanelOzet, type PanelSoru, type SoruGirdi,
} from "../shared/yonetim";
import type { PanelOneri, Yazisma } from "../shared/sosyal";
import { accessAcik, accessEposta } from "./access";
import { bildirimGonder } from "./eposta";
import type { BildirimTuru, PanelBildirim } from "../shared/topluluk";
import { tbSilSorgulari } from "./topluluk";
import { ONERI_SQL, mesajlar, oneriSatiri, yazismaOzeti, type OneriSatiri } from "./sosyal";
import type { Env } from "./session";
import { yetkisiVar, type Izin } from "./yetki";

type C = Context<Env>;

const yonetim = new Hono<Env>();

yonetim.use("*", async (c, next) => {
  const me = c.get("me");
  if (!yetkisiVar(me, "yonetim.giris")) return c.json({ error: "Bu sayfa için yetkin yok." }, 403);
  if (accessAcik(c.env)) {
    const eposta = await accessEposta(c.env, c.req.header("Cf-Access-Jwt-Assertion"));
    if (!eposta || eposta !== me!.email) return c.json({ error: "Cloudflare Access doğrulaması gerekli." }, 403);
  }
  await next();
});

// Belirli bir izin isteyen uç noktalar için
const izin = (i: Izin) => async (c: C, next: () => Promise<void>) => {
  if (!yetkisiVar(c.get("me"), i)) return c.json({ error: "Bu işlem için yetkin yok." }, 403);
  await next();
};

function kayit(c: C, action: string, target: string | null, detail?: unknown): D1PreparedStatement {
  return c.env.DB.prepare("INSERT INTO admin_log (user_id, action, target, detail, created_at) VALUES (?, ?, ?, ?, ?)").bind(
    c.get("me")!.id, action, target, detail === undefined ? null : JSON.stringify(detail), Date.now(),
  );
}

async function ayarlariOku(db: D1Database): Promise<PanelAyarlar> {
  const { results } = await db.prepare("SELECT key, value FROM settings").all<{ key: string; value: string }>();
  const m = new Map(results.map((r) => [r.key, r.value]));
  return {
    showOriginal: m.get("show_original") !== "0",
    currentWeek: Number(m.get("current_week") ?? 1),
    announcement: m.get("announcement") ?? "",
    kodPaylasimi: m.get("kod_paylasimi") !== "0",
  };
}

// ---- Genel ----

yonetim.get("/ozet", async (c) => {
  const db = c.env.DB;
  const s = await db.prepare(
    `SELECT COUNT(*) AS toplam,
            SUM(status = 'published' AND active = 1) AS yayinda,
            SUM(status = 'draft') AS taslak,
            SUM(status = 'published' AND active = 0) AS gizli,
            SUM(source = 'original') AS orijinal
     FROM questions`,
  ).first<PanelOzet["soru"]>();
  const u = await db.prepare(
    `SELECT SUM(kind = 'member') AS uye, SUM(kind = 'guest') AS misafir, (SELECT COUNT(*) FROM attempts) AS deneme FROM users`,
  ).first<{ uye: number; misafir: number; deneme: number }>();
  const k = await db.prepare(
    `SELECT (SELECT COUNT(*) FROM suggestions WHERE status = 'pending') AS oneri,
            (SELECT COUNT(*) FROM threads WHERE admin_unread = 1) AS mesaj,
            (SELECT COUNT(DISTINCT hedef_tur || hedef_id) FROM bildirimler WHERE cozuldu = 0) AS bildirim`,
  ).first<{ oneri: number; mesaj: number; bildirim: number }>();
  return c.json<PanelOzet>({
    bekleyenOneri: k?.oneri ?? 0,
    okunmamisMesaj: k?.mesaj ?? 0,
    acikBildirim: k?.bildirim ?? 0,
    ...(await ayarlariOku(db)),
    soru: { toplam: s?.toplam ?? 0, yayinda: s?.yayinda ?? 0, taslak: s?.taslak ?? 0, gizli: s?.gizli ?? 0, orijinal: s?.orijinal ?? 0 },
    uye: u?.uye ?? 0,
    misafir: u?.misafir ?? 0,
    deneme: u?.deneme ?? 0,
  });
});

const GUN_MS = 86_400_000;
const TR_FARK = 3 * 3_600_000;
const gunAdi = (ms: number) => new Date(ms + TR_FARK).toISOString().slice(0, 10);

yonetim.get("/pano", async (c) => {
  const db = c.env.DB;
  const bugun = Math.floor((Date.now() + TR_FARK) / GUN_MS) * GUN_MS - TR_FARK;
  const bas = bugun - 6 * GUN_MS;
  const [g, y, k] = await db.batch([
    db.prepare(
      `SELECT date((created_at + ?) / 1000, 'unixepoch') AS gun, COUNT(*) AS deneme, SUM(correct) AS dogru
       FROM attempts WHERE created_at >= ? GROUP BY gun`,
    ).bind(TR_FARK, bas),
    db.prepare(
      `SELECT q.id, q.prompt, q.type, COUNT(a.id) AS deneme, SUM(a.correct = 0) AS yanlis
       FROM questions q JOIN attempts a ON a.question_id = q.id
       GROUP BY q.id HAVING deneme >= 3 AND yanlis > 0
       ORDER BY CAST(yanlis AS REAL) / deneme DESC, deneme DESC LIMIT 5`,
    ),
    db.prepare(
      `WITH h AS (
         SELECT a.question_id AS id, json_extract(a.answer, '$.ilkHata') AS kontrol, COUNT(*) AS sayi
         FROM attempts a JOIN questions q ON q.id = a.question_id
         WHERE q.type = 'code' AND a.correct = 0 AND json_extract(a.answer, '$.ilkHata') IS NOT NULL
         GROUP BY a.question_id, kontrol
       )
       SELECT h.id, q.prompt, h.kontrol, h.sayi, (SELECT SUM(x.sayi) FROM h x WHERE x.id = h.id) AS basarisiz
       FROM h JOIN questions q ON q.id = h.id
       WHERE h.sayi = (SELECT MAX(x.sayi) FROM h x WHERE x.id = h.id)
       GROUP BY h.id ORDER BY h.sayi DESC LIMIT 5`,
    ),
  ]);
  const gunler = new Map((g!.results as { gun: string; deneme: number; dogru: number }[]).map((r) => [r.gun, r]));
  const gunluk = Array.from({ length: 7 }, (_, i) => {
    const gun = gunAdi(bas + i * GUN_MS);
    const r = gunler.get(gun);
    return { gun, deneme: r?.deneme ?? 0, dogru: r?.dogru ?? 0 };
  });
  return c.json<PanelPano>({
    gunluk,
    enCokYanlis: y!.results as PanelPano["enCokYanlis"],
    kodHatalari: k!.results as PanelPano["kodHatalari"],
  });
});

yonetim.post("/ayarlar", izin("ayar.duzenle"), async (c) => {
  const b = (await c.req.json<Partial<PanelAyarlar>>().catch(() => ({}))) as Partial<PanelAyarlar>;
  const once = await ayarlariOku(c.env.DB);
  const sonra: PanelAyarlar = {
    showOriginal: typeof b.showOriginal === "boolean" ? b.showOriginal : once.showOriginal,
    currentWeek: b.currentWeek === undefined ? once.currentWeek : Number(b.currentWeek),
    announcement: typeof b.announcement === "string" ? b.announcement.trim() : once.announcement,
    kodPaylasimi: typeof b.kodPaylasimi === "boolean" ? b.kodPaylasimi : once.kodPaylasimi,
  };
  if (!Number.isInteger(sonra.currentWeek) || sonra.currentWeek < 1 || sonra.currentWeek > 14) {
    return c.json({ error: "Hafta 1 ile 14 arasında olmalı." }, 400);
  }
  if (sonra.announcement.length > 300) return c.json({ error: "Duyuru en fazla 300 karakter olabilir." }, 400);

  const yaz = (k: string, v: string) =>
    c.env.DB.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(k, v);
  const degisen = Object.fromEntries(
    (Object.keys(sonra) as (keyof PanelAyarlar)[]).filter((k) => sonra[k] !== once[k]).map((k) => [k, sonra[k]]),
  );
  if (Object.keys(degisen).length === 0) return c.json(sonra);
  await c.env.DB.batch([
    yaz("show_original", sonra.showOriginal ? "1" : "0"),
    yaz("current_week", String(sonra.currentWeek)),
    yaz("announcement", sonra.announcement),
    yaz("kod_paylasimi", sonra.kodPaylasimi ? "1" : "0"),
    kayit(c, "ayar", null, degisen),
  ]);
  return c.json(sonra);
});

// ---- Sorular ----

yonetim.get("/konular", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT id, title, week FROM topics ORDER BY week, sort").all();
  return c.json(results);
});

type SoruSatiri = {
  id: string; topic_id: string; week: number; type: PanelSoru["type"]; source: PanelSoru["source"]; prompt: string;
  payload: string; answer: string; explanation: string | null; difficulty: number; source_ref: string | null;
  status: PanelSoru["status"]; active: number; updated_at: number | null; yedek: number; deneme: number; dogru: number;
};

const SORU_SQL = `SELECT q.id, q.topic_id, q.week, q.type, q.source, q.prompt, q.payload, q.answer, q.explanation,
                         q.difficulty, q.source_ref, q.status, q.active, q.updated_at, q.yedek,
                         COUNT(a.id) AS deneme, COALESCE(SUM(a.correct), 0) AS dogru
                  FROM questions q JOIN topics t ON t.id = q.topic_id
                  LEFT JOIN attempts a ON a.question_id = q.id`;

function panelSoru(r: SoruSatiri): PanelSoru {
  return {
    id: r.id,
    topicId: r.topic_id,
    week: r.week,
    type: r.type,
    source: r.source,
    prompt: r.prompt,
    explanation: r.explanation ?? "",
    difficulty: r.difficulty,
    sourceRef: r.source_ref ?? "",
    choices: (JSON.parse(r.payload) as { choices?: string[] }).choices ?? [],
    answer: JSON.parse(r.answer),
    status: r.status,
    active: r.active === 1,
    updatedAt: r.updated_at,
    yedek: r.yedek === 1,
    deneme: r.deneme,
    dogru: r.dogru,
  };
}

yonetim.get("/sorular", async (c) => {
  const q = c.req.query();
  const kosul: string[] = [];
  const deger: (string | number)[] = [];
  if (q.konu) (kosul.push("q.topic_id = ?"), deger.push(q.konu));
  if (q.hafta) (kosul.push("q.week = ?"), deger.push(Number(q.hafta)));
  if (q.kaynak) (kosul.push("q.source = ?"), deger.push(q.kaynak));
  if (q.durum === "taslak") kosul.push("q.status = 'draft'");
  if (q.durum === "yayinda") kosul.push("q.status = 'published' AND q.active = 1");
  if (q.durum === "gizli") kosul.push("q.status = 'published' AND q.active = 0");
  if (q.ara) (kosul.push("(q.id LIKE ? OR q.prompt LIKE ?)"), deger.push(`%${q.ara}%`, `%${q.ara}%`));
  const sql = `${SORU_SQL}${kosul.length ? ` WHERE ${kosul.join(" AND ")}` : ""}
               GROUP BY q.id ORDER BY q.week, t.sort, q.difficulty, q.rowid`;
  const { results } = await c.env.DB.prepare(sql).bind(...deger).all<SoruSatiri>();
  return c.json(results.map(panelSoru));
});

yonetim.get("/sorular/:id", async (c) => {
  const r = await c.env.DB.prepare(`${SORU_SQL} WHERE q.id = ? GROUP BY q.id`).bind(c.req.param("id")).first<SoruSatiri>();
  return r ? c.json(panelSoru(r)) : c.json({ error: "soru bulunamadı" }, 404);
});

async function girdiOku(c: C): Promise<{ g: SoruGirdi; week: number } | { hata: string }> {
  const g = (await c.req.json<Partial<SoruGirdi>>().catch(() => ({}))) as Partial<SoruGirdi>;
  const hata = soruGirdisiHatasi(g);
  if (hata) return { hata };
  const konu = await c.env.DB.prepare("SELECT week FROM topics WHERE id = ?").bind(g.topicId).first<{ week: number }>();
  if (!konu) return { hata: "Böyle bir konu yok." };
  return { g: { ...(g as SoruGirdi), prompt: g.prompt!.trim(), explanation: g.explanation!.trim(), sourceRef: g.sourceRef!.trim() }, week: konu.week };
}

yonetim.post("/sorular", izin("soru.ekle"), async (c) => {
  const o = await girdiOku(c);
  if ("hata" in o) return c.json({ error: o.hata }, 400);
  const { g, week } = o;
  const id = `p-${crypto.randomUUID().slice(0, 8)}`;
  const { payload, answer } = soruSutunlari(g);
  const me = c.get("me")!;
  await c.env.DB.batch([
    c.env.DB.prepare(
      `INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref,
                              status, active, created_by, updated_at, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(id, g.topicId, week, g.type, g.source, g.prompt, payload, answer, g.explanation, g.difficulty, g.sourceRef || null,
      g.status, g.active ? 1 : 0, me.id, Date.now(), me.id),
    kayit(c, "soru.ekle", id, { durum: g.status }),
  ]);
  return c.json({ id });
});

// Kendi eklediği soruyu düzenleme gibi kurallar RBAC'de bu fonksiyona eklenir
async function duzenleyebilir(c: C, id: string): Promise<boolean> {
  const me: Me | null = c.get("me");
  return yetkisiVar(me, "soru.duzenle") && !!(await c.env.DB.prepare("SELECT 1 FROM questions WHERE id = ?").bind(id).first());
}

yonetim.put("/sorular/:id", async (c) => {
  const id = c.req.param("id");
  if (!(await duzenleyebilir(c, id))) return c.json({ error: "soru bulunamadı" }, 404);
  const o = await girdiOku(c);
  if ("hata" in o) return c.json({ error: o.hata }, 400);
  const { g, week } = o;
  const { payload, answer } = soruSutunlari(g);
  const me = c.get("me")!;
  await c.env.DB.batch([
    c.env.DB.prepare(
      `UPDATE questions SET topic_id = ?, week = ?, type = ?, source = ?, prompt = ?, payload = ?, answer = ?, explanation = ?,
                            difficulty = ?, source_ref = ?, status = ?, active = ?, updated_at = ?, updated_by = ?
       WHERE id = ?`,
    ).bind(g.topicId, week, g.type, g.source, g.prompt, payload, answer, g.explanation, g.difficulty, g.sourceRef || null,
      g.status, g.active ? 1 : 0, Date.now(), me.id, id),
    kayit(c, "soru.duzenle", id),
  ]);
  return c.json({ id });
});

// Listeden tek tıkla gizle / göster, taslak / yayında
yonetim.post("/sorular/:id/durum", async (c) => {
  const id = c.req.param("id");
  if (!(await duzenleyebilir(c, id))) return c.json({ error: "soru bulunamadı" }, 404);
  const b = (await c.req.json<{ active?: boolean; status?: string }>().catch(() => ({}))) as { active?: boolean; status?: string };
  const set: string[] = [];
  const deger: (string | number)[] = [];
  if (typeof b.active === "boolean") (set.push("active = ?"), deger.push(b.active ? 1 : 0));
  if (b.status === "draft" || b.status === "published") (set.push("status = ?"), deger.push(b.status));
  if (!set.length) return c.json({ error: "değişiklik yok" }, 400);
  await c.env.DB.batch([
    c.env.DB.prepare(`UPDATE questions SET ${set.join(", ")}, updated_at = ?, updated_by = ? WHERE id = ?`).bind(
      ...deger, Date.now(), c.get("me")!.id, id,
    ),
    kayit(c, "soru.durum", id, b),
  ]);
  return c.json({ ok: true });
});

// ---- Kullanıcılar ----

yonetim.get("/kullanicilar", izin("kullanici.yonet"), async (c) => {
  const ara = c.req.query("ara")?.toLowerCase();
  const { results } = await c.env.DB.prepare(
    `SELECT u.id, u.username, u.email, u.role, u.public_profile, u.created_at, u.muted_until, COUNT(a.id) AS deneme
     FROM users u LEFT JOIN attempts a ON a.user_id = u.id
     WHERE u.kind = 'member'${ara ? " AND (u.username LIKE ?1 OR u.email LIKE ?1)" : ""}
     GROUP BY u.id ORDER BY u.created_at DESC LIMIT 200`,
  )
    .bind(...(ara ? [`%${ara}%`] : []))
    .all<{
      id: string; username: string; email: string | null; role: string; public_profile: number; created_at: number;
      muted_until: number | null; deneme: number;
    }>();
  return c.json<PanelKullanici[]>(
    results.map((r) => ({
      id: r.id, username: r.username, email: r.email, role: r.role, publicProfile: r.public_profile === 1,
      createdAt: r.created_at, deneme: r.deneme, mutedUntil: r.muted_until,
    })),
  );
});

yonetim.post("/kullanicilar/:id/rol", izin("kullanici.yonet"), async (c) => {
  const id = c.req.param("id");
  const { role } = (await c.req.json<{ role?: string }>().catch(() => ({}))) as { role?: string };
  if (role !== "user" && role !== "admin") return c.json({ error: "Rol geçersiz." }, 400);
  // Kendini yöneticilikten çıkarıp panele kilitlenmeyi önler
  if (id === c.get("me")!.id && role !== "admin") return c.json({ error: "Kendi yönetici rolünü kaldıramazsın." }, 400);
  const u = await c.env.DB.prepare("SELECT username FROM users WHERE id = ? AND kind = 'member'").bind(id).first<{ username: string }>();
  if (!u) return c.json({ error: "kullanıcı bulunamadı" }, 404);
  await c.env.DB.batch([
    c.env.DB.prepare("UPDATE users SET role = ? WHERE id = ?").bind(role, id),
    kayit(c, "kullanici.rol", u.username, { role }),
  ]);
  return c.json({ ok: true });
});

// Susturma: gün sayısı kadar, -1 kalıcı, 0 kaldırır. Susturulan kullanıcı öneri gönderemez.
yonetim.post("/kullanicilar/:id/sustur", izin("kullanici.yonet"), async (c) => {
  const id = c.req.param("id");
  const { gun } = (await c.req.json<{ gun?: number }>().catch(() => ({}))) as { gun?: number };
  if (typeof gun !== "number" || !Number.isInteger(gun) || gun < -1 || gun > 365) return c.json({ error: "Süre geçersiz." }, 400);
  if (id === c.get("me")!.id) return c.json({ error: "Kendini susturamazsın." }, 400);
  const u = await c.env.DB.prepare("SELECT username FROM users WHERE id = ? AND kind = 'member'").bind(id).first<{ username: string }>();
  if (!u) return c.json({ error: "kullanıcı bulunamadı" }, 404);
  const bitis = gun === 0 ? null : gun === -1 ? 253402300799000 : Date.now() + gun * 24 * 60 * 60 * 1000;
  await c.env.DB.batch([
    c.env.DB.prepare("UPDATE users SET muted_until = ? WHERE id = ?").bind(bitis, id),
    kayit(c, "kullanici.sustur", u.username, { gun }),
  ]);
  return c.json({ mutedUntil: bitis });
});

// ---- Öneriler ----

const panelOnerisi = (r: OneriSatiri & { username: string | null }): PanelOneri => ({ ...oneriSatiri(r), username: r.username });
const PANEL_ONERI_SQL = ONERI_SQL.replace("FROM suggestions s", "FROM suggestions s LEFT JOIN users u ON u.id = s.user_id")
  .replace("SELECT s.*", "SELECT s.*, u.username");

yonetim.get("/oneriler", izin("oneri.yonet"), async (c) => {
  const durum = c.req.query("durum");
  const gecerli = durum === "pending" || durum === "accepted" || durum === "rejected";
  const { results } = await c.env.DB.prepare(
    `${PANEL_ONERI_SQL}${gecerli ? " WHERE s.status = ?" : ""} ORDER BY s.status = 'pending' DESC, s.created_at DESC LIMIT 200`,
  )
    .bind(...(gecerli ? [durum] : []))
    .all<OneriSatiri & { username: string | null }>();
  return c.json(results.map(panelOnerisi));
});

yonetim.get("/oneriler/:id", izin("oneri.yonet"), async (c) => {
  const r = await c.env.DB.prepare(`${PANEL_ONERI_SQL} WHERE s.id = ?`).bind(c.req.param("id")).first<OneriSatiri & { username: string | null }>();
  return r ? c.json(panelOnerisi(r)) : c.json({ error: "öneri bulunamadı" }, 404);
});

const notOku = async (c: C) => {
  const { not } = (await c.req.json<{ not?: string }>().catch(() => ({}))) as { not?: string };
  return typeof not === "string" && not.trim() ? not.trim().slice(0, 1000) : null;
};

// Kapalı uçlu öneri taslak soruya dönüşür; kod önerisi yalnızca kabul edildi olarak işaretlenir
yonetim.post("/oneriler/:id/kabul", izin("oneri.yonet"), async (c) => {
  const db = c.env.DB;
  const s = await db.prepare("SELECT * FROM suggestions WHERE id = ? AND status = 'pending'").bind(c.req.param("id")).first<{
    id: string; user_id: string; topic_id: string; type: string; prompt: string; payload: string; answer: string;
    explanation: string; show_name: number;
  }>();
  if (!s) return c.json({ error: "Bekleyen böyle bir öneri yok." }, 404);
  const konu = await db.prepare("SELECT week FROM topics WHERE id = ?").bind(s.topic_id).first<{ week: number }>();
  const not = await notOku(c);
  const me = c.get("me")!;
  const simdi = Date.now();
  const questionId = s.type === "code" ? null : `p-${crypto.randomUUID().slice(0, 8)}`;
  await db.batch([
    ...(questionId
      ? [db.prepare(
          `INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty,
                                  status, active, created_by, suggested_by, updated_at, updated_by)
           VALUES (?, ?, ?, ?, 'derived', ?, ?, ?, ?, 1, 'draft', 1, ?, ?, ?, ?)`,
        ).bind(questionId, s.topic_id, konu?.week ?? 1, s.type, s.prompt, s.payload, s.answer, s.explanation, me.id,
          s.show_name ? s.user_id : null, simdi, me.id)]
      : []),
    db.prepare("UPDATE suggestions SET status = 'accepted', admin_note = ?, question_id = ?, decided_at = ?, user_unread = 1 WHERE id = ?")
      .bind(not, questionId, simdi, s.id),
    kayit(c, "oneri.kabul", s.id, questionId ? { soru: questionId } : undefined),
  ]);
  return c.json({ questionId });
});

yonetim.post("/oneriler/:id/red", izin("oneri.yonet"), async (c) => {
  const id = c.req.param("id");
  const not = await notOku(c);
  const r = await c.env.DB.batch([
    c.env.DB.prepare("UPDATE suggestions SET status = 'rejected', admin_note = ?, decided_at = ?, user_unread = 1 WHERE id = ? AND status = 'pending'")
      .bind(not, Date.now(), id),
    kayit(c, "oneri.red", id ?? null),
  ]);
  if (!r[0]!.meta.changes) return c.json({ error: "Bekleyen böyle bir öneri yok." }, 404);
  return c.json({ ok: true });
});

// ---- Mesajlar ----

yonetim.get("/yazismalar", izin("mesaj.cevapla"), async (c) => {
  const durum = c.req.query("durum");
  const gecerli = durum === "open" || durum === "closed";
  const { results } = await c.env.DB.prepare(
    `SELECT t.*, u.username FROM threads t LEFT JOIN users u ON u.id = t.user_id
     ${gecerli ? "WHERE t.status = ?" : ""} ORDER BY t.admin_unread DESC, t.updated_at DESC LIMIT 200`,
  )
    .bind(...(gecerli ? [durum] : []))
    .all<Parameters<typeof yazismaOzeti>[0]>();
  return c.json(results.map((r) => yazismaOzeti(r, true)));
});

yonetim.get("/yazismalar/:id", izin("mesaj.cevapla"), async (c) => {
  const db = c.env.DB;
  const r = await db.prepare("SELECT t.*, u.username FROM threads t LEFT JOIN users u ON u.id = t.user_id WHERE t.id = ?")
    .bind(c.req.param("id"))
    .first<Parameters<typeof yazismaOzeti>[0]>();
  if (!r) return c.json({ error: "yazışma bulunamadı" }, 404);
  if (r.admin_unread) await db.prepare("UPDATE threads SET admin_unread = 0 WHERE id = ?").bind(r.id).run();
  return c.json<Yazisma>({ ...yazismaOzeti(r, true), unread: false, mesajlar: await mesajlar(db, r.id) });
});

// Cevap kullanıcıya sitede okunmamış olarak görünür; isterse e-postayla da haber verilir
yonetim.post("/yazismalar/:id", izin("mesaj.cevapla"), async (c) => {
  const db = c.env.DB;
  const { body } = (await c.req.json<{ body?: string }>().catch(() => ({}))) as { body?: string };
  if (typeof body !== "string" || !body.trim() || body.length > 4000) return c.json({ error: "Cevap boş olamaz (en fazla 4000 karakter)." }, 400);
  const t = await db.prepare(
    "SELECT t.id, t.subject, u.email, u.notify_email FROM threads t JOIN users u ON u.id = t.user_id WHERE t.id = ?",
  )
    .bind(c.req.param("id"))
    .first<{ id: string; subject: string; email: string | null; notify_email: number }>();
  if (!t) return c.json({ error: "yazışma bulunamadı" }, 404);
  const simdi = Date.now();
  await db.batch([
    db.prepare("INSERT INTO thread_messages (thread_id, from_admin, admin_id, body, created_at) VALUES (?, 1, ?, ?, ?)")
      .bind(t.id, c.get("me")!.id, body.trim(), simdi),
    db.prepare("UPDATE threads SET updated_at = ?, user_unread = 1, admin_unread = 0, status = 'open' WHERE id = ?").bind(simdi, t.id),
    kayit(c, "mesaj.cevap", t.id),
  ]);
  if (t.email && t.notify_email) {
    const gonder = bildirimGonder(
      c.env, t.email, `Mesajına cevap var: ${t.subject}`,
      `FPGA Pratik yöneticisi "${t.subject}" konulu mesajına cevap yazdı.\n\nCevabı okumak için: ${new URL(c.req.url).origin}/mesajlar/${t.id}\n\n` +
        "Bu e-postaları Ayarlar sayfasından kapatabilirsin.",
    ).catch((e) => console.log(`[eposta] cevap bildirimi gönderilemedi: ${String(e)}`));
    try {
      c.executionCtx.waitUntil(gonder);
    } catch {
      await gonder;
    }
  }
  return c.json({ ok: true });
});

yonetim.post("/yazismalar/:id/durum", izin("mesaj.cevapla"), async (c) => {
  const { status } = (await c.req.json<{ status?: string }>().catch(() => ({}))) as { status?: string };
  if (status !== "open" && status !== "closed") return c.json({ error: "Durum geçersiz." }, 400);
  const r = await c.env.DB.batch([
    c.env.DB.prepare("UPDATE threads SET status = ? WHERE id = ?").bind(status, c.req.param("id")),
    kayit(c, "mesaj.durum", c.req.param("id") ?? null, { status }),
  ]);
  if (!r[0]!.meta.changes) return c.json({ error: "yazışma bulunamadı" }, 404);
  return c.json({ ok: true });
});

// ---- Bildirimler ----

// Açık bildirimi olan içerikler, en çok bildirilen önce
yonetim.get("/bildirimler", izin("bildirim.yonet"), async (c) => {
  const db = c.env.DB;
  const { results } = await db.prepare(
    `SELECT hedef_tur, hedef_id, COUNT(*) AS sayi, MAX(created_at) AS son, json_group_array(neden) AS nedenler
     FROM bildirimler WHERE cozuldu = 0 GROUP BY hedef_tur, hedef_id ORDER BY sayi DESC, son DESC LIMIT 100`,
  ).all<{ hedef_tur: BildirimTuru; hedef_id: string; sayi: number; son: number; nedenler: string }>();
  const liste: PanelBildirim[] = [];
  for (const r of results) {
    if (r.hedef_tur === "tb") {
      const t = await db.prepare(
        "SELECT tb.title, tb.hidden, tb.testbench, u.username FROM topluluk_tb tb LEFT JOIN users u ON u.id = tb.user_id WHERE tb.id = ?",
      ).bind(r.hedef_id).first<{ title: string; hidden: number; testbench: string; username: string | null }>();
      if (!t) continue;
      liste.push({
        tur: "tb", id: r.hedef_id, baslik: t.title, sahibi: t.username, sayi: r.sayi, nedenler: JSON.parse(r.nedenler),
        gizli: t.hidden === 1, sonTarih: r.son, bag: `/topluluk/${r.hedef_id}`, icerik: t.testbench,
      });
    } else {
      const p = await db.prepare(
        `SELECT p.question_id, p.gecen, p.toplam, p.kod, p.hidden, u.username FROM paylasimlar p
         LEFT JOIN users u ON u.id = p.user_id WHERE p.id = ?`,
      ).bind(r.hedef_id).first<{ question_id: string; gecen: number; toplam: number; kod: string | null; hidden: number; username: string | null }>();
      if (!p) continue;
      liste.push({
        tur: "paylasim", id: r.hedef_id, baslik: `${p.question_id} sorusunda paylaşılan sonuç (${p.gecen}/${p.toplam})`,
        sahibi: p.username, sayi: r.sayi, nedenler: JSON.parse(r.nedenler), gizli: p.hidden === 1, sonTarih: r.son,
        bag: `/yonetim/sorular/${p.question_id}`, icerik: p.kod,
      });
    }
  }
  return c.json(liste);
});

// kaldir: içerik silinir. geri-ac: içerik görünür olur, bildirimler kapanır.
yonetim.post("/bildirimler/:tur/:id", izin("bildirim.yonet"), async (c) => {
  const tur = c.req.param("tur");
  const id = c.req.param("id") ?? "";
  if (tur !== "tb" && tur !== "paylasim") return c.json({ error: "Tür geçersiz." }, 400);
  const { islem } = (await c.req.json<{ islem?: string }>().catch(() => ({}))) as { islem?: string };
  if (islem !== "kaldir" && islem !== "geri-ac") return c.json({ error: "İşlem geçersiz." }, 400);
  const db = c.env.DB;
  const tablo = tur === "tb" ? "topluluk_tb" : "paylasimlar";
  if (!(await db.prepare(`SELECT 1 FROM ${tablo} WHERE id = ?`).bind(id).first())) return c.json({ error: "İçerik bulunamadı." }, 404);
  const sorgular =
    islem === "geri-ac"
      ? [
          db.prepare(`UPDATE ${tablo} SET hidden = 0 WHERE id = ?`).bind(id),
          db.prepare("UPDATE bildirimler SET cozuldu = 1 WHERE hedef_tur = ? AND hedef_id = ?").bind(tur, id),
        ]
      : tur === "tb"
        ? tbSilSorgulari(db, "id = ?", id)
        : [
            db.prepare("DELETE FROM bildirimler WHERE hedef_tur = 'paylasim' AND hedef_id = ?").bind(id),
            db.prepare("DELETE FROM paylasimlar WHERE id = ?").bind(id),
          ];
  await db.batch([...sorgular, kayit(c, `bildirim.${islem}`, id, { tur })]);
  return c.json({ ok: true });
});

// ---- İşlem kaydı ----

yonetim.get("/kayit", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT l.id, u.username, l.action, l.target, l.detail, l.created_at AS createdAt
     FROM admin_log l LEFT JOIN users u ON u.id = l.user_id ORDER BY l.id DESC LIMIT 200`,
  ).all<PanelKayit>();
  return c.json(results);
});

export { yonetim };
