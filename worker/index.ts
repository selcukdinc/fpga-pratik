import { Hono } from "hono";
import { grade, type Answer, type QuestionType } from "../shared/grade";
import type { AnswerResult, Profil, ProfilSon, Question, Topic, TopicProgress } from "../shared/api";
import { ensureGuest, loadMe, type Env } from "./session";
import { hesap } from "./hesap";
import { epostaAcik } from "./eposta";
import { yonetim } from "./yonetim";

const app = new Hono<Env>().basePath("/api");

// Durum değiştiren isteklerde başka bir siteden gelen formlar reddedilir (CSRF).
// Tarayıcılar fetch POST isteklerinde Origin başlığını her zaman gönderir.
app.use("*", async (c, next) => {
  if (c.req.method !== "GET" && c.req.method !== "HEAD") {
    const origin = c.req.header("Origin");
    if (origin && origin !== new URL(c.req.url).origin) return c.json({ error: "izin verilmeyen kaynak" }, 403);
  }
  await next();
});

app.use("*", async (c, next) => {
  c.set("me", await loadMe(c));
  await next();
});

app.route("/hesap", hesap);
app.route("/yonetim", yonetim);

async function setting(db: D1Database, key: string): Promise<string | null> {
  const row = await db.prepare("SELECT value FROM settings WHERE key = ?").bind(key).first<{ value: string }>();
  return row?.value ?? null;
}

async function currentWeek(db: D1Database): Promise<number> {
  return Number((await setting(db, "current_week")) ?? 1);
}

// show_original = '0' iken sunumlardan gelen sorular hiçbir yerde gösterilmez
async function showOriginal(db: D1Database): Promise<boolean> {
  return (await setting(db, "show_original")) !== "0";
}

app.get("/me", (c) => {
  const me = c.get("me");
  return c.json(me ? { ...me, epostaAcik: epostaAcik(c.env) } : { epostaAcik: epostaAcik(c.env) });
});

app.get("/topics", async (c) => {
  const week = await currentWeek(c.env.DB);
  const { results } = await c.env.DB.prepare(
    "SELECT id, title, week FROM topics WHERE week <= ? ORDER BY week, sort",
  )
    .bind(week)
    .all<Topic>();
  return c.json({ currentWeek: week, topics: results, announcement: (await setting(c.env.DB, "announcement")) || null });
});

app.get("/questions", async (c) => {
  const week = await currentWeek(c.env.DB);
  const original = await showOriginal(c.env.DB);
  const topic = c.req.query("topic");
  // answer sütunu bilinçli olarak seçilmiyor
  const sql = `SELECT q.id, q.topic_id, q.week, q.type, q.source, q.prompt, q.payload, q.difficulty, q.source_ref
               FROM questions q JOIN topics t ON t.id = q.topic_id
               WHERE q.active = 1 AND q.status = 'published' AND q.week <= ?${original ? "" : " AND q.source = 'derived'"}${topic ? " AND q.topic_id = ?" : ""}
               ORDER BY q.week, t.sort, q.difficulty, q.rowid`;
  const stmt = c.env.DB.prepare(sql);
  const { results } = await (topic ? stmt.bind(week, topic) : stmt.bind(week)).all<{
    id: string; topic_id: string; week: number; type: QuestionType;
    source: "original" | "derived"; prompt: string; payload: string;
    difficulty: number; source_ref: string | null;
  }>();
  const questions: Question[] = results.map((r) => ({
    id: r.id,
    topicId: r.topic_id,
    week: r.week,
    type: r.type,
    source: r.source,
    prompt: r.prompt,
    payload: JSON.parse(r.payload),
    difficulty: r.difficulty,
    sourceRef: r.source_ref,
  }));
  return c.json(questions);
});

app.post("/questions/:id/answer", async (c) => {
  const body = await c.req.json<{ answer: Answer }>().catch(() => null);
  if (!body?.answer || typeof body.answer !== "object") return c.json({ error: "geçersiz cevap" }, 400);

  const q = await c.env.DB.prepare(
    "SELECT type, source, answer, explanation FROM questions WHERE id = ? AND active = 1 AND status = 'published' AND week <= ?",
  )
    .bind(c.req.param("id"), await currentWeek(c.env.DB))
    .first<{ type: QuestionType; source: string; answer: string; explanation: string | null }>();
  if (!q || (q.source === "original" && !(await showOriginal(c.env.DB)))) return c.json({ error: "soru bulunamadı" }, 404);
  if (q.type === "code" || q.type === "wave") return c.json({ error: "bu soru tipi henüz desteklenmiyor" }, 501);

  const correct = grade(q.type, JSON.parse(q.answer), body.answer);
  const me = await ensureGuest(c);
  await c.env.DB.prepare(
    "INSERT INTO attempts (user_id, question_id, correct, answer, created_at) VALUES (?, ?, ?, ?, ?)",
  )
    .bind(me.id, c.req.param("id"), correct ? 1 : 0, JSON.stringify(body.answer), Date.now())
    .run();

  const result: AnswerResult = { correct, explanation: q.explanation };
  return c.json(result);
});

// Konu bazlı ilerleme: sadece sunucudaki deneme kayıtlarından hesaplanır
async function konuIlerlemesi(db: D1Database, userId: string): Promise<TopicProgress[]> {
  const week = await currentWeek(db);
  const original = await showOriginal(db);
  const { results } = await db.prepare(
    `SELECT t.id AS topicId, t.title, t.week,
            COUNT(DISTINCT q.id) AS total,
            COUNT(DISTINCT a.question_id) AS attempted,
            COUNT(DISTINCT CASE WHEN a.correct = 1 THEN a.question_id END) AS correct
     FROM topics t
     LEFT JOIN questions q ON q.topic_id = t.id AND q.active = 1 AND q.status = 'published' AND q.week <= ?${original ? "" : " AND q.source = 'derived'"}
     LEFT JOIN attempts a ON a.question_id = q.id AND a.user_id = ?
     WHERE t.week <= ?
     GROUP BY t.id ORDER BY t.week, t.sort`,
  )
    .bind(week, userId, week)
    .all<TopicProgress>();
  return results;
}

app.get("/progress", async (c) => c.json(await konuIlerlemesi(c.env.DB, c.get("me")?.id ?? "")));

// Sorunun ilk satırından Markdown işaretleri atılmış kısa bir özet
function ozet(prompt: string): string {
  const satir = prompt.replace(/```[\s\S]*?```/g, " ").replace(/[`*_#>]/g, "").replace(/\s+/g, " ").trim();
  return satir.length > 90 ? `${satir.slice(0, 89)}…` : satir;
}

app.get("/profil/:ad", async (c) => {
  const ad = c.req.param("ad").toLowerCase();
  const u = await c.env.DB.prepare(
    "SELECT id, username, avatar, avatar_bg, public_profile, created_at FROM users WHERE username = ? AND kind = 'member'",
  )
    .bind(ad)
    .first<{ id: string; username: string; avatar: string | null; avatar_bg: string | null; public_profile: number; created_at: number }>();
  if (!u) return c.json({ error: "böyle bir kullanıcı yok" }, 404);

  const kendisi = c.get("me")?.id === u.id;
  if (!u.public_profile && !kendisi) return c.json<Profil>({ gizli: true, username: u.username });

  const original = await showOriginal(c.env.DB);
  const { results } = await c.env.DB.prepare(
    `SELECT q.id AS questionId, t.title AS topicTitle, q.week, q.prompt, MAX(a.created_at) AS at
     FROM attempts a JOIN questions q ON q.id = a.question_id JOIN topics t ON t.id = q.topic_id
     WHERE a.user_id = ? AND a.correct = 1 AND q.active = 1 AND q.status = 'published'${original ? "" : " AND q.source = 'derived'"}
     GROUP BY q.id ORDER BY at DESC LIMIT 10`,
  )
    .bind(u.id)
    .all<ProfilSon>();

  return c.json<Profil>({
    gizli: false,
    username: u.username,
    avatar: u.avatar,
    avatarBg: u.avatar_bg,
    joinedAt: u.created_at,
    publicProfile: u.public_profile === 1,
    kendisi,
    konular: await konuIlerlemesi(c.env.DB, u.id),
    son: results.map((r) => ({ ...r, prompt: ozet(r.prompt) })),
  });
});

export default app;
