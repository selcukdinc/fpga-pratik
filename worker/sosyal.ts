// Üyelerin soru önerileri ve yöneticiyle yazışmaları: /api/oneriler, /api/yazismalar.
// Misafirler bu uçları kullanamaz. Kullanıcı metinleri düz metin olarak saklanır.

import { Hono, type Context } from "hono";
import {
  GUNLUK_MESAJ, GUNLUK_ONERI, konuHatasi, mesajHatasi, oneriHatasi,
  type Okunmamis, type Oneri, type OneriGirdi, type Yazisma, type YazismaMesaji, type YazismaOzeti,
} from "../shared/sosyal";
import type { Env } from "./session";

type C = Context<Env>;
const GUN = 24 * 60 * 60 * 1000;

const sosyal = new Hono<Env>();

sosyal.use("*", async (c, next) => {
  if (c.get("me")?.kind !== "member") return c.json({ error: "Bunun için giriş yapmalısın." }, 401);
  await next();
});

async function govde<T>(c: C): Promise<Partial<T>> {
  const b = await c.req.json<T>().catch(() => null);
  return b && typeof b === "object" ? b : {};
}

export const susturuldu = (mutedUntil: number | null) => !!mutedUntil && mutedUntil > Date.now();

// ---- Öneriler ----

export type OneriSatiri = {
  id: string; topic_id: string; topic_title: string; type: Oneri["type"]; prompt: string; payload: string; answer: string;
  explanation: string; show_name: number; status: Oneri["status"]; admin_note: string | null; question_id: string | null;
  created_at: number; decided_at: number | null; user_unread: number;
};

export const ONERI_SQL = `SELECT s.*, t.title AS topic_title FROM suggestions s JOIN topics t ON t.id = s.topic_id`;

export function oneriSatiri(r: OneriSatiri): Oneri {
  return {
    id: r.id, topicId: r.topic_id, topicTitle: r.topic_title, type: r.type, prompt: r.prompt,
    choices: (JSON.parse(r.payload) as { choices?: string[] }).choices ?? [],
    answer: JSON.parse(r.answer), explanation: r.explanation, showName: r.show_name === 1, status: r.status,
    adminNote: r.admin_note, questionId: r.question_id, createdAt: r.created_at, decidedAt: r.decided_at,
    unread: r.user_unread === 1,
  };
}

sosyal.get("/oneriler", async (c) => {
  const { results } = await c.env.DB.prepare(`${ONERI_SQL} WHERE s.user_id = ? ORDER BY s.created_at DESC LIMIT 100`)
    .bind(c.get("me")!.id)
    .all<OneriSatiri>();
  return c.json(results.map(oneriSatiri));
});

// Listeyi görünce kararlar okunmuş sayılır
sosyal.post("/oneriler/okundu", async (c) => {
  await c.env.DB.prepare("UPDATE suggestions SET user_unread = 0 WHERE user_id = ? AND user_unread = 1").bind(c.get("me")!.id).run();
  return c.json({ ok: true });
});

sosyal.post("/oneriler", async (c) => {
  const me = c.get("me")!;
  if (susturuldu(me.mutedUntil)) return c.json({ error: "Hesabın şu an öneri gönderemiyor. Sorun olduğunu düşünüyorsan yöneticiye yaz." }, 403);
  const g = await govde<OneriGirdi>(c);
  const h = oneriHatasi(g);
  if (h) return c.json({ error: h }, 400);
  const db = c.env.DB;
  if (!(await db.prepare("SELECT 1 FROM topics WHERE id = ?").bind(g.topicId).first())) return c.json({ error: "Böyle bir konu yok." }, 400);
  const say = await db.prepare("SELECT COUNT(*) AS n FROM suggestions WHERE user_id = ? AND created_at > ?")
    .bind(me.id, Date.now() - GUN)
    .first<{ n: number }>();
  if ((say?.n ?? 0) >= GUNLUK_ONERI) return c.json({ error: `Günde en fazla ${GUNLUK_ONERI} soru önerebilirsin. Yarın tekrar dene.` }, 429);

  const id = crypto.randomUUID();
  const kapali = g.type !== "code";
  await db.prepare(
    `INSERT INTO suggestions (id, user_id, topic_id, type, prompt, payload, answer, explanation, show_name, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    id, me.id, g.topicId, g.type, g.prompt!.trim(),
    JSON.stringify(g.type === "mcq" ? { choices: g.choices!.map((x) => x.trim()) } : g.type === "fill" ? { blanks: (g.answer as { blanks: string[][] }).blanks.length } : {}),
    JSON.stringify(kapali ? g.answer : {}), g.explanation!.trim(), g.showName ? 1 : 0, Date.now(),
  ).run();
  return c.json({ id });
});

// ---- Yazışmalar ----

type YazismaSatiri = {
  id: string; subject: string; status: "open" | "closed"; created_at: number; updated_at: number; user_unread: number;
  admin_unread: number; username?: string | null;
};

export const yazismaOzeti = (r: YazismaSatiri, panel = false): YazismaOzeti => ({
  id: r.id, subject: r.subject, status: r.status, createdAt: r.created_at, updatedAt: r.updated_at,
  unread: (panel ? r.admin_unread : r.user_unread) === 1,
  ...(panel ? { username: r.username ?? null } : {}),
});

export async function mesajlar(db: D1Database, id: string): Promise<YazismaMesaji[]> {
  const { results } = await db.prepare("SELECT id, from_admin, body, created_at FROM thread_messages WHERE thread_id = ? ORDER BY id")
    .bind(id)
    .all<{ id: number; from_admin: number; body: string; created_at: number }>();
  return results.map((m) => ({ id: m.id, yonetici: m.from_admin === 1, body: m.body, createdAt: m.created_at }));
}

async function gunlukMesajDolu(db: D1Database, userId: string): Promise<boolean> {
  const r = await db.prepare(
    `SELECT COUNT(*) AS n FROM thread_messages m JOIN threads t ON t.id = m.thread_id
     WHERE t.user_id = ? AND m.from_admin = 0 AND m.created_at > ?`,
  )
    .bind(userId, Date.now() - GUN)
    .first<{ n: number }>();
  return (r?.n ?? 0) >= GUNLUK_MESAJ;
}

const COK_MESAJ = `Günde en fazla ${GUNLUK_MESAJ} mesaj gönderebilirsin. Yarın tekrar dene.`;

sosyal.get("/yazismalar", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM threads WHERE user_id = ? ORDER BY updated_at DESC LIMIT 100")
    .bind(c.get("me")!.id)
    .all<YazismaSatiri>();
  return c.json(results.map((r) => yazismaOzeti(r)));
});

sosyal.post("/yazismalar", async (c) => {
  const me = c.get("me")!;
  const b = await govde<{ subject: string; body: string }>(c);
  const h = konuHatasi(b.subject) ?? mesajHatasi(b.body);
  if (h) return c.json({ error: h }, 400);
  if (await gunlukMesajDolu(c.env.DB, me.id)) return c.json({ error: COK_MESAJ }, 429);
  const id = crypto.randomUUID();
  const simdi = Date.now();
  await c.env.DB.batch([
    c.env.DB.prepare("INSERT INTO threads (id, user_id, subject, created_at, updated_at) VALUES (?, ?, ?, ?, ?)").bind(
      id, me.id, b.subject!.trim(), simdi, simdi,
    ),
    c.env.DB.prepare("INSERT INTO thread_messages (thread_id, body, created_at) VALUES (?, ?, ?)").bind(id, b.body!.trim(), simdi),
  ]);
  return c.json({ id });
});

// Açınca okunmuş sayılır
sosyal.get("/yazismalar/:id", async (c) => {
  const db = c.env.DB;
  const r = await db.prepare("SELECT * FROM threads WHERE id = ? AND user_id = ?").bind(c.req.param("id"), c.get("me")!.id).first<YazismaSatiri>();
  if (!r) return c.json({ error: "yazışma bulunamadı" }, 404);
  if (r.user_unread) await db.prepare("UPDATE threads SET user_unread = 0 WHERE id = ?").bind(r.id).run();
  return c.json<Yazisma>({ ...yazismaOzeti(r), unread: false, mesajlar: await mesajlar(db, r.id) });
});

sosyal.post("/yazismalar/:id", async (c) => {
  const me = c.get("me")!;
  const db = c.env.DB;
  const b = await govde<{ body: string }>(c);
  const h = mesajHatasi(b.body);
  if (h) return c.json({ error: h }, 400);
  const r = await db.prepare("SELECT id, status FROM threads WHERE id = ? AND user_id = ?").bind(c.req.param("id"), me.id).first<{ id: string; status: string }>();
  if (!r) return c.json({ error: "yazışma bulunamadı" }, 404);
  if (r.status === "closed") return c.json({ error: "Bu yazışma kapatıldı. Yeni bir mesaj başlatabilirsin." }, 409);
  if (await gunlukMesajDolu(db, me.id)) return c.json({ error: COK_MESAJ }, 429);
  const simdi = Date.now();
  await db.batch([
    db.prepare("INSERT INTO thread_messages (thread_id, body, created_at) VALUES (?, ?, ?)").bind(r.id, b.body!.trim(), simdi),
    db.prepare("UPDATE threads SET updated_at = ?, admin_unread = 1 WHERE id = ?").bind(simdi, r.id),
  ]);
  return c.json({ ok: true });
});

// Menüdeki sayaç
sosyal.get("/okunmamis", async (c) => {
  const id = c.get("me")!.id;
  const r = await c.env.DB.prepare(
    `SELECT (SELECT COUNT(*) FROM threads WHERE user_id = ?1 AND user_unread = 1) AS mesaj,
            (SELECT COUNT(*) FROM suggestions WHERE user_id = ?1 AND user_unread = 1) AS oneri`,
  )
    .bind(id)
    .first<Okunmamis>();
  return c.json<Okunmamis>({ mesaj: r?.mesaj ?? 0, oneri: r?.oneri ?? 0 });
});

export { sosyal };
