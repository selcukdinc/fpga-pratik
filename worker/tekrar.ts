// Aralıklı tekrar: her cevaptan sonra tekrar kutusunu günceller, /api/tekrar
// bugün sorulacakları ve kutuların durumunu verir. Kurallar shared/tekrar.ts'de.

import { Hono } from "hono";
import type { Env } from "./session";
import { GUN_MS, SORU_SUTUNLARI, bugunBasi, gorunurKosul, soruyaCevir, type SoruListeSatiri } from "./ortak";
import { GUNLUK_TEKRAR, ILISKILI_SAYISI, OGRENILDI, SON_KUTU, sonrakiKutu, type TekrarCevabi, type TekrarKaynagi } from "../shared/tekrar";

type Satir = { kutu: number; sonraki: number; kaynak: TekrarKaynagi; son_tekrar: number | null };

export async function tekrarIsle(db: D1Database, userId: string, soruId: string, dogru: boolean) {
  const simdi = Date.now();
  const bugun = bugunBasi();
  const r = await db.prepare("SELECT kutu, sonraki, kaynak, son_tekrar FROM tekrarlar WHERE user_id = ? AND question_id = ?")
    .bind(userId, soruId)
    .first<Satir>();
  // Vadesi gelmiş bir sorunun cevabı tekrar sayılır (günlük sınıra girer)
  const vadeli = !!r && r.kutu < OGRENILDI && r.sonraki <= simdi;

  if (dogru) {
    if (!r) return;
    if (vadeli) {
      const g = sonrakiKutu(r.kutu, true);
      await db.prepare("UPDATE tekrarlar SET kutu = ?, sonraki = ?, son_tekrar = ? WHERE user_id = ? AND question_id = ?")
        .bind(g.kutu, g.gun === null ? 0 : bugun + g.gun * GUN_MS, simdi, userId, soruId)
        .run();
    } else if (r.kaynak === "iliskili" && r.son_tekrar === null) {
      // Tekrara eklenen yeni soru, sırası gelmeden havuzda çözüldü: artık sorulmasına gerek yok
      await db.prepare("DELETE FROM tekrarlar WHERE user_id = ? AND question_id = ?").bind(userId, soruId).run();
    }
    return;
  }

  const g = sonrakiKutu(r?.kutu ?? 1, false);
  const sorgular = [
    db.prepare(
      `INSERT INTO tekrarlar (user_id, question_id, kutu, sonraki, kaynak, eklendi, son_tekrar) VALUES (?, ?, ?, ?, 'yanlis', ?, ?)
       ON CONFLICT(user_id, question_id) DO UPDATE SET kutu = excluded.kutu, sonraki = excluded.sonraki, kaynak = 'yanlis',
         son_tekrar = COALESCE(excluded.son_tekrar, tekrarlar.son_tekrar)`,
    ).bind(userId, soruId, g.kutu, bugun + g.gun! * GUN_MS, simdi, vadeli ? simdi : null),
  ];
  // İlk kez yanlış yapılan (ya da öğrenilmişken unutulan) sorunun kavramından,
  // kişinin hiç denemediği birkaç soru da ertesi güne eklenir. Önce yedek havuzdan
  // seçilir: o sorular başka yerde görünmediği için gerçekten görülmemiş sorulardır
  if (!r || r.kutu === OGRENILDI) {
    sorgular.push(
      db.prepare(
        `INSERT OR IGNORE INTO tekrarlar (user_id, question_id, kutu, sonraki, kaynak, eklendi)
         SELECT ?1, q.id, 1, ?2, 'iliskili', ?3
         FROM questions q, (SELECT kavram, topic_id FROM questions WHERE id = ?4) k
         WHERE ${await gorunurKosul(db)} AND q.id <> ?4
           AND (q.kavram = k.kavram OR (k.kavram IS NULL AND q.topic_id = k.topic_id))
           AND NOT EXISTS (SELECT 1 FROM attempts a WHERE a.user_id = ?1 AND a.question_id = q.id)
           AND NOT EXISTS (SELECT 1 FROM tekrarlar t WHERE t.user_id = ?1 AND t.question_id = q.id)
         ORDER BY q.yedek DESC, q.difficulty, random() LIMIT ${ILISKILI_SAYISI}`,
      ).bind(userId, bugun + GUN_MS, simdi, soruId),
    );
  }
  await db.batch(sorgular);
}

const tekrar = new Hono<Env>();

tekrar.get("/", async (c) => {
  const me = c.get("me");
  const bos: TekrarCevabi = { bugun: [], sorular: [], bekleyen: 0, yapilan: 0, kutular: Array(SON_KUTU).fill(0), ogrenilen: 0, takvim: Array(7).fill(0) };
  if (!me) return c.json(bos);
  const db = c.env.DB;
  const simdi = Date.now();
  const bugun = bugunBasi();
  const gorunur = await gorunurKosul(db);
  const yapilan = (await db.prepare("SELECT COUNT(*) AS n FROM tekrarlar WHERE user_id = ? AND son_tekrar >= ?").bind(me.id, bugun)
    .first<{ n: number }>())?.n ?? 0;
  const kalan = Math.max(0, GUNLUK_TEKRAR - yapilan);
  const vadeli = `FROM tekrarlar t JOIN questions q ON q.id = t.question_id LEFT JOIN users u ON u.id = q.suggested_by
                  WHERE t.user_id = ?1 AND t.kutu <= ${SON_KUTU} AND t.sonraki <= ?2 AND ${gorunur}`;
  const [liste, bekleyen, kutular, takvim] = await db.batch([
    db.prepare(`SELECT t.kutu AS t_kutu, t.kaynak AS t_kaynak, q.kavram AS t_kavram, ${SORU_SUTUNLARI} ${vadeli}
                ORDER BY t.sonraki, t.kutu, t.eklendi LIMIT ?3`).bind(me.id, simdi, kalan),
    db.prepare(`SELECT COUNT(*) AS n ${vadeli}`).bind(me.id, simdi),
    db.prepare("SELECT kutu, COUNT(*) AS n FROM tekrarlar WHERE user_id = ? GROUP BY kutu").bind(me.id),
    db.prepare(
      `SELECT (sonraki - ?2) / ${GUN_MS} AS gun, COUNT(*) AS n FROM tekrarlar
       WHERE user_id = ?1 AND kutu <= ${SON_KUTU} AND sonraki > ?3 AND sonraki < ?2 + ${8 * GUN_MS} GROUP BY gun`,
    ).bind(me.id, bugun, simdi),
  ]);
  const satirlar = liste!.results as (SoruListeSatiri & { t_kutu: number; t_kaynak: TekrarKaynagi; t_kavram: string | null })[];
  const k = new Map((kutular!.results as { kutu: number; n: number }[]).map((r) => [r.kutu, r.n]));
  const g = new Map((takvim!.results as { gun: number; n: number }[]).map((r) => [r.gun, r.n]));
  return c.json<TekrarCevabi>({
    bugun: satirlar.map((r) => ({ id: r.id, kutu: r.t_kutu, kaynak: r.t_kaynak, kavram: r.t_kavram })),
    sorular: satirlar.map(soruyaCevir),
    bekleyen: (bekleyen!.results[0] as { n: number }).n,
    yapilan,
    kutular: Array.from({ length: SON_KUTU }, (_, i) => k.get(i + 1) ?? 0),
    ogrenilen: k.get(OGRENILDI) ?? 0,
    takvim: Array.from({ length: 7 }, (_, i) => g.get(i + 1) ?? 0),
  });
});

// Menüdeki sayı: bugün sorulacak soru sayısı
tekrar.get("/sayi", async (c) => {
  const me = c.get("me");
  if (!me) return c.json({ n: 0 });
  const db = c.env.DB;
  const r = await db.prepare(
    `SELECT (SELECT COUNT(*) FROM tekrarlar y WHERE y.user_id = ?1 AND y.son_tekrar >= ?3) AS yapilan,
            (SELECT COUNT(*) FROM tekrarlar t JOIN questions q ON q.id = t.question_id
             WHERE t.user_id = ?1 AND t.kutu <= ${SON_KUTU} AND t.sonraki <= ?2 AND ${await gorunurKosul(db)}) AS bekleyen`,
  ).bind(me.id, Date.now(), bugunBasi()).first<{ yapilan: number; bekleyen: number }>();
  return c.json({ n: Math.min(r?.bekleyen ?? 0, Math.max(0, GUNLUK_TEKRAR - (r?.yapilan ?? 0))) });
});

export { tekrar };
