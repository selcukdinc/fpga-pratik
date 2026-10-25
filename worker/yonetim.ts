// Yönetim paneli API'si: /api/yonetim. Her istek yetkisiVar() ile, Cloudflare
// Access açıksa ayrıca Access belirteciyle kontrol edilir. Her değişiklik
// admin_log tablosuna yazılır.

import { Hono, type Context } from "hono";
import type { Me } from "../shared/api";
import {
  soruGirdisiHatasi, soruSutunlari,
  type PanelAyarlar, type PanelKayit, type PanelKullanici, type PanelOzet, type PanelSoru, type SoruGirdi,
} from "../shared/yonetim";
import { accessAcik, accessEposta } from "./access";
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
  return c.json<PanelOzet>({
    ...(await ayarlariOku(db)),
    soru: { toplam: s?.toplam ?? 0, yayinda: s?.yayinda ?? 0, taslak: s?.taslak ?? 0, gizli: s?.gizli ?? 0, orijinal: s?.orijinal ?? 0 },
    uye: u?.uye ?? 0,
    misafir: u?.misafir ?? 0,
    deneme: u?.deneme ?? 0,
  });
});

yonetim.post("/ayarlar", izin("ayar.duzenle"), async (c) => {
  const b = (await c.req.json<Partial<PanelAyarlar>>().catch(() => ({}))) as Partial<PanelAyarlar>;
  const once = await ayarlariOku(c.env.DB);
  const sonra: PanelAyarlar = {
    showOriginal: typeof b.showOriginal === "boolean" ? b.showOriginal : once.showOriginal,
    currentWeek: b.currentWeek === undefined ? once.currentWeek : Number(b.currentWeek),
    announcement: typeof b.announcement === "string" ? b.announcement.trim() : once.announcement,
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
  status: PanelSoru["status"]; active: number; updated_at: number | null; deneme: number; dogru: number;
};

const SORU_SQL = `SELECT q.id, q.topic_id, q.week, q.type, q.source, q.prompt, q.payload, q.answer, q.explanation,
                         q.difficulty, q.source_ref, q.status, q.active, q.updated_at,
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
    `SELECT u.id, u.username, u.email, u.role, u.public_profile, u.created_at, COUNT(a.id) AS deneme
     FROM users u LEFT JOIN attempts a ON a.user_id = u.id
     WHERE u.kind = 'member'${ara ? " AND (u.username LIKE ?1 OR u.email LIKE ?1)" : ""}
     GROUP BY u.id ORDER BY u.created_at DESC LIMIT 200`,
  )
    .bind(...(ara ? [`%${ara}%`] : []))
    .all<{ id: string; username: string; email: string | null; role: string; public_profile: number; created_at: number; deneme: number }>();
  return c.json<PanelKullanici[]>(
    results.map((r) => ({
      id: r.id, username: r.username, email: r.email, role: r.role, publicProfile: r.public_profile === 1,
      createdAt: r.created_at, deneme: r.deneme,
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

// ---- İşlem kaydı ----

yonetim.get("/kayit", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT l.id, u.username, l.action, l.target, l.detail, l.created_at AS createdAt
     FROM admin_log l LEFT JOIN users u ON u.id = l.user_id ORDER BY l.id DESC LIMIT 200`,
  ).all<PanelKayit>();
  return c.json(results);
});

export { yonetim };
