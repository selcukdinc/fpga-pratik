import { Hono, type Context } from "hono";
import { grade, type Answer, type QuestionType } from "../shared/grade";
import type { AnswerResult, Profil, ProfilSon, Question, Topic, TopicProgress } from "../shared/api";
import { ensureGuest, loadMe, type Env } from "./session";
import { hesap } from "./hesap";
import { epostaAcik } from "./eposta";
import { yonetim } from "./yonetim";
import { DAKIKA, SAAT, sinirAsildi } from "./sinir";
import { MODELLER, degerlendir, vektorUret } from "./modeller";
import { IZ_SINIRI, TB_ADI, testbenchUret, type KodBilgisi, type KodSonucu, type Sinama, type Vektor } from "../shared/kod";

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

type SoruSatiri = { type: QuestionType; source: string; payload: string; answer: string; explanation: string | null };

// Sitede görünen (yayında, gizli değil, haftası gelmiş) bir soruyu getirir
async function yayindakiSoru(c: Context<Env>, id: string): Promise<SoruSatiri | null> {
  const q = await c.env.DB.prepare(
    "SELECT type, source, payload, answer, explanation FROM questions WHERE id = ? AND active = 1 AND status = 'published' AND week <= ?",
  )
    .bind(id, await currentWeek(c.env.DB))
    .first<SoruSatiri>();
  if (!q || (q.source === "original" && !(await showOriginal(c.env.DB)))) return null;
  return q;
}

async function denemeKaydet(c: Context<Env>, userId: string, soruId: string, correct: boolean, answer: unknown) {
  await c.env.DB.prepare(
    "INSERT INTO attempts (user_id, question_id, correct, answer, created_at) VALUES (?, ?, ?, ?, ?)",
  )
    .bind(userId, soruId, correct ? 1 : 0, JSON.stringify(answer), Date.now())
    .run();
}

app.post("/questions/:id/answer", async (c) => {
  const body = await c.req.json<{ answer: Answer }>().catch(() => null);
  if (!body?.answer || typeof body.answer !== "object") return c.json({ error: "geçersiz cevap" }, 400);

  const q = await yayindakiSoru(c, c.req.param("id"));
  if (!q) return c.json({ error: "soru bulunamadı" }, 404);
  if (q.type === "code" || q.type === "wave") return c.json({ error: "bu soru tipi bu yoldan cevaplanmaz" }, 400);

  const correct = grade(q.type, JSON.parse(q.answer), body.answer);
  const me = await ensureGuest(c);
  await denemeKaydet(c, me.id, c.req.param("id"), correct, body.answer);

  const result: AnswerResult = { correct, explanation: q.explanation };
  return c.json(result);
});

// ---- Kod soruları ----

const SINAMA_OMRU_MS = 30 * DAKIKA;

const kodModeli = (id: string, q: SoruSatiri) => {
  const bilgi = (JSON.parse(q.payload) as { kod?: KodBilgisi }).kod;
  const model = MODELLER[(JSON.parse(q.answer) as { model?: string }).model ?? id];
  return bilgi && model ? { bilgi, model } : null;
};

// Rastgele girişlerle tek kullanımlık bir sınama açar ve testbench'i döner
app.post("/questions/:id/sinama", async (c) => {
  const id = c.req.param("id");
  const q = await yayindakiSoru(c, id);
  const km = q?.type === "code" ? kodModeli(id, q) : null;
  if (!q || !km) return c.json({ error: "soru bulunamadı" }, 404);

  const me = await ensureGuest(c);
  if (await sinirAsildi(c.env.DB, `sinama:${me.id}`, 120, SAAT)) {
    return c.json({ error: "Bir saatte çok fazla deneme yaptın. Biraz ara verip tekrar dene." }, 429);
  }
  const rastgele = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
  const vektorler = vektorUret(km.bilgi, km.model, rastgele);
  const tb = testbenchUret(km.bilgi, vektorler);
  const simdi = Date.now();
  const sinamaId = crypto.randomUUID();
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM sinamalar WHERE expires_at < ?").bind(simdi),
    c.env.DB.prepare(
      "INSERT INTO sinamalar (id, user_id, question_id, vectors, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)",
    ).bind(sinamaId, me.id, id, JSON.stringify(vektorler), simdi, simdi + SINAMA_OMRU_MS),
  ]);
  return c.json<Sinama>({
    id: sinamaId, testbench: tb.metin, top: TB_ADI, stopTime: tb.stopTime, adet: vektorler.length, bitis: simdi + SINAMA_OMRU_MS,
  });
});

// Tarayıcıdaki benzetimin izini alır, referans modelle karşılaştırır. Sınama bir kez kullanılır.
// Öğrencinin kodu sunucuya gönderilmez; yalnızca testbench'in bastığı çıkışlar gelir.
app.post("/sinama/:id", async (c) => {
  const body = await c.req.json<{ iz?: unknown }>().catch(() => null);
  const iz = body?.iz;
  if (!Array.isArray(iz) || iz.length > IZ_SINIRI || !iz.every((x) => typeof x === "string" && x.length <= 200)) {
    return c.json({ error: "geçersiz iz" }, 400);
  }
  const me = c.get("me");
  const s = me
    ? await c.env.DB.prepare("SELECT question_id, vectors, expires_at FROM sinamalar WHERE id = ? AND user_id = ?")
        .bind(c.req.param("id"), me.id)
        .first<{ question_id: string; vectors: string; expires_at: number }>()
    : null;
  if (!me || !s || s.expires_at < Date.now()) return c.json({ error: "Bu sınama artık geçerli değil (süresi dolmuş ya da kullanılmış). Yeniden sına." }, 410);

  const q = await yayindakiSoru(c, s.question_id);
  const km = q && kodModeli(s.question_id, q);
  if (!q || !km) return c.json({ error: "soru bulunamadı" }, 404);

  const vektorler = JSON.parse(s.vectors) as Vektor[];
  const d = degerlendir(km.bilgi, km.model, vektorler, iz as string[]);
  const correct = d.gecen === d.toplam;
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM sinamalar WHERE id = ?").bind(c.req.param("id")),
    c.env.DB.prepare(
      "INSERT INTO attempts (user_id, question_id, correct, answer, created_at) VALUES (?, ?, ?, ?, ?)",
    ).bind(me.id, s.question_id, correct ? 1 : 0, JSON.stringify({ gecen: d.gecen, toplam: d.toplam, ilkHata: d.ilkHata }), Date.now()),
  ]);
  return c.json<KodSonucu>({
    correct, gecen: d.gecen, toplam: d.toplam, rapor: d.rapor, ipucu: d.ipucu,
    explanation: correct ? q.explanation : null,
  });
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
