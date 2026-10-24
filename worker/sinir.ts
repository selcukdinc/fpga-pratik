// Basit sabit pencereli hız sınırı. Her anahtar için tek satır tutulur.

// Sayaçlar IP adresi içerebildiği için en uzun pencereden (1 saat) eski satırlar silinir
export async function sinirAsildi(db: D1Database, anahtar: string, enFazla: number, pencereMs: number): Promise<boolean> {
  const simdi = Date.now();
  await db.prepare("DELETE FROM rate_limits WHERE window_start < ?").bind(simdi - SAAT).run();
  const row = await db
    .prepare(
      `INSERT INTO rate_limits (key, window_start, count) VALUES (?1, ?2, 1)
       ON CONFLICT(key) DO UPDATE SET
         count = CASE WHEN window_start <= ?2 - ?3 THEN 1 ELSE count + 1 END,
         window_start = CASE WHEN window_start <= ?2 - ?3 THEN ?2 ELSE window_start END
       RETURNING count`,
    )
    .bind(anahtar, simdi, pencereMs)
    .first<{ count: number }>();
  return (row?.count ?? 0) > enFazla;
}

// Sayacı artırmadan bakar; başarısız giriş gibi yalnızca hatada sayılan durumlar için
export async function sinirDolu(db: D1Database, anahtar: string, enFazla: number, pencereMs: number): Promise<boolean> {
  const row = await db
    .prepare("SELECT count FROM rate_limits WHERE key = ? AND window_start > ?")
    .bind(anahtar, Date.now() - pencereMs)
    .first<{ count: number }>();
  return (row?.count ?? 0) >= enFazla;
}

export async function sinirSifirla(db: D1Database, anahtar: string): Promise<void> {
  await db.prepare("DELETE FROM rate_limits WHERE key = ?").bind(anahtar).run();
}

export const DAKIKA = 60_000;
export const SAAT = 60 * DAKIKA;
