import { Hono } from "hono";
import { grade, type Answer, type QuestionType } from "../shared/grade";
import type { AnswerResult, Question, Topic, TopicProgress } from "../shared/api";
import { ensureGuest, loadMe, type Env } from "./session";

const app = new Hono<Env>().basePath("/api");

app.use("*", async (c, next) => {
  c.set("me", await loadMe(c));
  await next();
});

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

app.get("/me", (c) => c.json(c.get("me")));

app.get("/topics", async (c) => {
  const week = await currentWeek(c.env.DB);
  const { results } = await c.env.DB.prepare(
    "SELECT id, title, week FROM topics WHERE week <= ? ORDER BY week, sort",
  )
    .bind(week)
    .all<Topic>();
  return c.json({ currentWeek: week, topics: results });
});

app.get("/questions", async (c) => {
  const week = await currentWeek(c.env.DB);
  const original = await showOriginal(c.env.DB);
  const topic = c.req.query("topic");
  // answer sütunu bilinçli olarak seçilmiyor
  const sql = `SELECT q.id, q.topic_id, q.week, q.type, q.source, q.prompt, q.payload, q.difficulty, q.source_ref
               FROM questions q JOIN topics t ON t.id = q.topic_id
               WHERE q.active = 1 AND q.week <= ?${original ? "" : " AND q.source = 'derived'"}${topic ? " AND q.topic_id = ?" : ""}
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
    "SELECT type, source, answer, explanation FROM questions WHERE id = ? AND active = 1",
  )
    .bind(c.req.param("id"))
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
app.get("/progress", async (c) => {
  const me = c.get("me");
  const week = await currentWeek(c.env.DB);
  const original = await showOriginal(c.env.DB);
  const { results } = await c.env.DB.prepare(
    `SELECT t.id AS topicId, t.title, t.week,
            COUNT(DISTINCT q.id) AS total,
            COUNT(DISTINCT a.question_id) AS attempted,
            COUNT(DISTINCT CASE WHEN a.correct = 1 THEN a.question_id END) AS correct
     FROM topics t
     LEFT JOIN questions q ON q.topic_id = t.id AND q.active = 1 AND q.week <= ?${original ? "" : " AND q.source = 'derived'"}
     LEFT JOIN attempts a ON a.question_id = q.id AND a.user_id = ?
     WHERE t.week <= ?
     GROUP BY t.id ORDER BY t.week, t.sort`,
  )
    .bind(week, me?.id ?? "", week)
    .all<TopicProgress>();
  return c.json(results);
});

export default app;
