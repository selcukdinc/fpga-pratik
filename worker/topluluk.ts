// Topluluk: kod sorularında paylaşılan sonuçlar (/api/topluluk/paylasimlar),
// üyelerin testbench'leri (/api/topluluk/tb) ve bildirimler (/api/topluluk/bildir).
// Testbench'ler tarayıcıda puanlanır ve resmi ilerlemeye sayılmaz.

import { Hono, type Context } from "hono";
import {
  BILDIRIM_ESIGI, GUNLUK_TB, KOD_SINIRI, YENI_HESAP_MS, bildirimHatasi, tbHatasi,
  type BildirimTuru, type Paylasim, type Paylasimlar, type Tb, type TbGirdi, type TbOzeti,
} from "../shared/topluluk";
import type { Me } from "../shared/api";
import { susturuldu } from "./sosyal";
import type { Env } from "./session";
import { yetkisiVar } from "./yetki";

type C = Context<Env>;
const GUN = 24 * 60 * 60 * 1000;

const topluluk = new Hono<Env>();

const uye = (c: C): Me | null => {
  const me = c.get("me");
  return me?.kind === "member" ? me : null;
};
const GIRIS = { error: "Bunun için giriş yapmalısın." };

async function govde<T>(c: C): Promise<Partial<T>> {
  const b = await c.req.json<T>().catch(() => null);
  return b && typeof b === "object" ? b : {};
}

export async function kodPaylasimiAcik(db: D1Database): Promise<boolean> {
  const r = await db.prepare("SELECT value FROM settings WHERE key = 'kod_paylasimi'").first<{ value: string }>();
  return r?.value !== "0";
}

// Herkese açık içerik (kod, testbench) için: susturulmamış ve en az 24 saatlik hesap
async function yayimlayabilir(db: D1Database, me: Me): Promise<string | null> {
  if (susturuldu(me.mutedUntil)) return "Hesabın şu an içerik paylaşamıyor. Sorun olduğunu düşünüyorsan yöneticiye yaz.";
  const u = await db.prepare("SELECT created_at FROM users WHERE id = ?").bind(me.id).first<{ created_at: number }>();
  if (!u || Date.now() - u.created_at < YENI_HESAP_MS) return "Yeni hesaplar ilk 24 saat içerik yayımlayamaz.";
  return null;
}

// ---- Paylaşılan sonuçlar ----

type PaylasimSatiri = {
  id: string; user_id: string; username: string | null; avatar: string | null; avatar_bg: string | null;
  gecen: number; toplam: number; ilk_hata: number | null; kod: string | null; hidden: number; created_at: number;
  bildirdim: number;
};

topluluk.get("/paylasimlar/:soru", async (c) => {
  const me = uye(c);
  if (!me) return c.json(GIRIS, 401);
  const db = c.env.DB;
  const kodAcik = await kodPaylasimiAcik(db);
  const { results } = await db.prepare(
    `SELECT p.*, u.username, u.avatar, u.avatar_bg,
            EXISTS (SELECT 1 FROM bildirimler b WHERE b.hedef_tur = 'paylasim' AND b.hedef_id = p.id AND b.user_id = ?1) AS bildirdim
     FROM paylasimlar p JOIN users u ON u.id = p.user_id
     WHERE p.question_id = ?2 AND (p.hidden = 0 OR p.user_id = ?1)
     ORDER BY p.user_id = ?1 DESC, p.created_at DESC LIMIT 50`,
  )
    .bind(me.id, c.req.param("soru"))
    .all<PaylasimSatiri>();
  return c.json<Paylasimlar>({
    kodAcik,
    kodPaylasabilir: kodAcik && !(await yayimlayabilir(db, me)),
    liste: results.map((r): Paylasim => ({
      id: r.id, username: r.username, avatar: r.avatar, avatarBg: r.avatar_bg, gecen: r.gecen, toplam: r.toplam,
      ilkHata: r.ilk_hata, kod: kodAcik ? r.kod : null, createdAt: r.created_at, benim: r.user_id === me.id,
      bildirdim: r.bildirdim === 1, gizli: r.hidden === 1,
    })),
  });
});

// Skor sunucudaki son deneme kaydından alınır, istemcinin söylediğine güvenilmez
topluluk.post("/paylasimlar/:soru", async (c) => {
  const me = uye(c);
  if (!me) return c.json(GIRIS, 401);
  const db = c.env.DB;
  const soru = c.req.param("soru");
  const b = await govde<{ kod: string | null }>(c);
  const kod = typeof b.kod === "string" && b.kod.trim() ? b.kod : null;
  if (susturuldu(me.mutedUntil)) return c.json({ error: "Hesabın şu an içerik paylaşamıyor." }, 403);
  if (kod) {
    if (kod.length > KOD_SINIRI) return c.json({ error: "Kod en fazla 20 KB olabilir." }, 400);
    if (!(await kodPaylasimiAcik(db))) return c.json({ error: "Kod paylaşımı şu an kapalı." }, 403);
    const h = await yayimlayabilir(db, me);
    if (h) return c.json({ error: h }, 403);
  }
  const a = await db.prepare(
    `SELECT a.answer FROM attempts a JOIN questions q ON q.id = a.question_id
     WHERE a.user_id = ? AND a.question_id = ? AND q.type = 'code' ORDER BY a.id DESC LIMIT 1`,
  )
    .bind(me.id, soru)
    .first<{ answer: string }>();
  if (!a) return c.json({ error: "Paylaşmak için önce bu soruyu sınamalısın." }, 400);
  const d = JSON.parse(a.answer) as { gecen: number; toplam: number; ilkHata: number | null };
  // Yeniden paylaşım eski bildirimleri silmez; gizlenmiş bir paylaşım gizli kalır
  await db.prepare(
    `INSERT INTO paylasimlar (id, user_id, question_id, gecen, toplam, ilk_hata, kod, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (user_id, question_id) DO UPDATE SET gecen = excluded.gecen, toplam = excluded.toplam,
       ilk_hata = excluded.ilk_hata, kod = excluded.kod, created_at = excluded.created_at`,
  )
    .bind(crypto.randomUUID(), me.id, soru, d.gecen, d.toplam, d.ilkHata ?? null, kod, Date.now())
    .run();
  return c.json({ ok: true });
});

topluluk.delete("/paylasimlar/:soru", async (c) => {
  const me = uye(c);
  if (!me) return c.json(GIRIS, 401);
  const db = c.env.DB;
  const p = await db.prepare("SELECT id FROM paylasimlar WHERE user_id = ? AND question_id = ?").bind(me.id, c.req.param("soru")).first<{ id: string }>();
  if (p) {
    await db.batch([
      db.prepare("DELETE FROM bildirimler WHERE hedef_tur = 'paylasim' AND hedef_id = ?").bind(p.id),
      db.prepare("DELETE FROM paylasimlar WHERE id = ?").bind(p.id),
    ]);
  }
  return c.json({ ok: true });
});

// ---- Topluluk testbench'leri ----

type TbSatiri = {
  id: string; user_id: string; topic_id: string; topic_title: string; title: string; username: string | null;
  begeni: number; cozen: number; ben_begendim: number; ben_cozdum: number; hidden: number; created_at: number;
};

const TB_SQL = `SELECT tb.id, tb.user_id, tb.topic_id, t.title AS topic_title, tb.title, u.username, tb.hidden, tb.created_at,
         (SELECT COUNT(*) FROM tb_begeni b WHERE b.tb_id = tb.id) AS begeni,
         (SELECT COUNT(*) FROM tb_cozum z WHERE z.tb_id = tb.id) AS cozen,
         EXISTS (SELECT 1 FROM tb_begeni b WHERE b.tb_id = tb.id AND b.user_id = ?1) AS ben_begendim,
         EXISTS (SELECT 1 FROM tb_cozum z WHERE z.tb_id = tb.id AND z.user_id = ?1) AS ben_cozdum
  FROM topluluk_tb tb JOIN topics t ON t.id = tb.topic_id LEFT JOIN users u ON u.id = tb.user_id`;

const tbOzeti = (r: TbSatiri): TbOzeti => ({
  id: r.id, topicId: r.topic_id, topicTitle: r.topic_title, title: r.title, username: r.username, begeni: r.begeni,
  cozen: r.cozen, benBegendim: r.ben_begendim === 1, benCozdum: r.ben_cozdum === 1, gizli: r.hidden === 1, createdAt: r.created_at,
});

// Liste herkese açık; gizlenen testbench'leri yalnızca sahibi görür
topluluk.get("/tb", async (c) => {
  const meId = c.get("me")?.id ?? "";
  const konu = c.req.query("konu");
  const kisi = c.req.query("kullanici");
  const sira = c.req.query("sira") === "begeni" ? "begeni DESC, tb.created_at DESC" : "tb.created_at DESC";
  const kosullar = ["(tb.hidden = 0 OR tb.user_id = ?1)"];
  const degerler: string[] = [meId];
  if (konu) {
    degerler.push(konu);
    kosullar.push(`tb.topic_id = ?${degerler.length}`);
  }
  if (kisi) {
    degerler.push(kisi.toLowerCase());
    kosullar.push(`u.username = ?${degerler.length}`);
  }
  const { results } = await c.env.DB.prepare(`${TB_SQL} WHERE ${kosullar.join(" AND ")} ORDER BY ${sira} LIMIT 100`)
    .bind(...degerler)
    .all<TbSatiri>();
  return c.json(results.map(tbOzeti));
});

topluluk.get("/tb/:id", async (c) => {
  const me = c.get("me");
  const db = c.env.DB;
  const r = await db.prepare(
    `${TB_SQL.replace("SELECT tb.id,", "SELECT tb.description, tb.sablon, tb.testbench, tb.top, tb.stop_time, tb.id,")}
     WHERE tb.id = ?2`,
  )
    .bind(me?.id ?? "", c.req.param("id"))
    .first<TbSatiri & { description: string; sablon: string; testbench: string; top: string; stop_time: string }>();
  const yonetici = yetkisiVar(me, "bildirim.yonet");
  if (!r || (r.hidden && r.user_id !== me?.id && !yonetici)) return c.json({ error: "Bu testbench bulunamadı." }, 404);
  const bildirdim = me
    ? !!(await db.prepare("SELECT 1 FROM bildirimler WHERE hedef_tur = 'tb' AND hedef_id = ? AND user_id = ?").bind(r.id, me.id).first())
    : false;
  return c.json<Tb>({
    ...tbOzeti(r), description: r.description, sablon: r.sablon, testbench: r.testbench, top: r.top, stopTime: r.stop_time,
    benim: r.user_id === me?.id, bildirdim, silebilir: r.user_id === me?.id || yonetici,
  });
});

topluluk.post("/tb", async (c) => {
  const me = uye(c);
  if (!me) return c.json(GIRIS, 401);
  const db = c.env.DB;
  const g = await govde<TbGirdi>(c);
  const h = tbHatasi(g) ?? (await yayimlayabilir(db, me));
  if (h) return c.json({ error: h }, 400);
  if (!(await db.prepare("SELECT 1 FROM topics WHERE id = ?").bind(g.topicId).first())) return c.json({ error: "Böyle bir konu yok." }, 400);
  const say = await db.prepare("SELECT COUNT(*) AS n FROM topluluk_tb WHERE user_id = ? AND created_at > ?")
    .bind(me.id, Date.now() - GUN)
    .first<{ n: number }>();
  if ((say?.n ?? 0) >= GUNLUK_TB) return c.json({ error: `Günde en fazla ${GUNLUK_TB} testbench yayımlayabilirsin.` }, 429);
  const id = crypto.randomUUID().slice(0, 12);
  await db.prepare(
    `INSERT INTO topluluk_tb (id, user_id, topic_id, title, description, sablon, testbench, top, stop_time, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, me.id, g.topicId, g.title!.trim(), g.description!.trim(), g.sablon, g.testbench, g.top, g.stopTime!.replace(/\s+/g, ""), Date.now())
    .run();
  return c.json({ id });
});

export function tbSilSorgulari(db: D1Database, kosul: string, deger: string): D1PreparedStatement[] {
  return [
    db.prepare(`DELETE FROM bildirimler WHERE hedef_tur = 'tb' AND hedef_id IN (SELECT id FROM topluluk_tb WHERE ${kosul})`).bind(deger),
    db.prepare(`DELETE FROM tb_begeni WHERE tb_id IN (SELECT id FROM topluluk_tb WHERE ${kosul})`).bind(deger),
    db.prepare(`DELETE FROM tb_cozum WHERE tb_id IN (SELECT id FROM topluluk_tb WHERE ${kosul})`).bind(deger),
    db.prepare(`DELETE FROM topluluk_tb WHERE ${kosul}`).bind(deger),
  ];
}

topluluk.delete("/tb/:id", async (c) => {
  const me = uye(c);
  if (!me) return c.json(GIRIS, 401);
  const db = c.env.DB;
  const r = await db.prepare("SELECT user_id FROM topluluk_tb WHERE id = ?").bind(c.req.param("id")).first<{ user_id: string }>();
  if (!r) return c.json({ error: "Bu testbench bulunamadı." }, 404);
  const yonetici = r.user_id !== me.id && yetkisiVar(me, "bildirim.yonet");
  if (r.user_id !== me.id && !yonetici) return c.json({ error: "Bunu yalnızca sahibi silebilir." }, 403);
  await db.batch([
    ...tbSilSorgulari(db, "id = ?", c.req.param("id")),
    ...(yonetici
      ? [db.prepare("INSERT INTO admin_log (user_id, action, target, detail, created_at) VALUES (?, 'tb.sil', ?, NULL, ?)").bind(me.id, c.req.param("id"), Date.now())]
      : []),
  ]);
  return c.json({ ok: true });
});

async function gorunurTb(db: D1Database, id: string, meId: string): Promise<boolean> {
  return !!(await db.prepare("SELECT 1 FROM topluluk_tb WHERE id = ? AND (hidden = 0 OR user_id = ?)").bind(id, meId).first());
}

topluluk.post("/tb/:id/begen", async (c) => {
  const me = uye(c);
  if (!me) return c.json(GIRIS, 401);
  const db = c.env.DB;
  const id = c.req.param("id");
  if (!(await gorunurTb(db, id, me.id))) return c.json({ error: "Bu testbench bulunamadı." }, 404);
  const sil = await db.prepare("DELETE FROM tb_begeni WHERE tb_id = ? AND user_id = ?").bind(id, me.id).run();
  if (!sil.meta.changes) await db.prepare("INSERT INTO tb_begeni (tb_id, user_id) VALUES (?, ?)").bind(id, me.id).run();
  const n = await db.prepare("SELECT COUNT(*) AS n FROM tb_begeni WHERE tb_id = ?").bind(id).first<{ n: number }>();
  return c.json({ begeni: n?.n ?? 0, benBegendim: !sil.meta.changes });
});

// Tarayıcıda geçti; sunucu doğrulaması yok, bu yüzden yalnızca "kaç kişi çözdü" sayısına girer
topluluk.post("/tb/:id/cozdum", async (c) => {
  const me = uye(c);
  if (!me) return c.json(GIRIS, 401);
  const db = c.env.DB;
  const id = c.req.param("id");
  if (!(await gorunurTb(db, id, me.id))) return c.json({ error: "Bu testbench bulunamadı." }, 404);
  await db.prepare("INSERT OR IGNORE INTO tb_cozum (tb_id, user_id, created_at) VALUES (?, ?, ?)").bind(id, me.id, Date.now()).run();
  const n = await db.prepare("SELECT COUNT(*) AS n FROM tb_cozum WHERE tb_id = ?").bind(id).first<{ n: number }>();
  return c.json({ cozen: n?.n ?? 0 });
});

// ---- Bildirim ----

const HEDEF: Record<BildirimTuru, string> = { tb: "topluluk_tb", paylasim: "paylasimlar" };

topluluk.post("/bildir", async (c) => {
  const me = uye(c);
  if (!me) return c.json(GIRIS, 401);
  const db = c.env.DB;
  const b = await govde<{ tur: BildirimTuru; id: string; neden: string }>(c);
  const h = bildirimHatasi(b);
  if (h) return c.json({ error: h }, 400);
  const tablo = HEDEF[b.tur!];
  const hedef = await db.prepare(`SELECT user_id FROM ${tablo} WHERE id = ?`).bind(b.id).first<{ user_id: string }>();
  if (!hedef) return c.json({ error: "Bildirilen içerik bulunamadı." }, 404);
  if (hedef.user_id === me.id) return c.json({ error: "Kendi içeriğini bildiremezsin." }, 400);
  const say = await db.prepare("SELECT COUNT(*) AS n FROM bildirimler WHERE user_id = ? AND created_at > ?")
    .bind(me.id, Date.now() - GUN)
    .first<{ n: number }>();
  if ((say?.n ?? 0) >= 20) return c.json({ error: "Günde en fazla 20 bildirim gönderebilirsin." }, 429);
  await db.prepare("INSERT OR IGNORE INTO bildirimler (user_id, hedef_tur, hedef_id, neden, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(me.id, b.tur, b.id, b.neden!.trim(), Date.now())
    .run();
  // Eşiği geçen içerik yönetici bakana kadar gizlenir
  await db.prepare(
    `UPDATE ${tablo} SET hidden = 1 WHERE id = ?1 AND hidden = 0 AND
       (SELECT COUNT(DISTINCT user_id) FROM bildirimler WHERE hedef_tur = ?2 AND hedef_id = ?1 AND cozuldu = 0) >= ?3`,
  )
    .bind(b.id, b.tur, BILDIRIM_ESIGI)
    .run();
  return c.json({ ok: true });
});

export { topluluk };
