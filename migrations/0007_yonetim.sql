-- Yönetim paneli: soru durumu, panel düzenleme izi, duyuru ve işlem kaydı.

-- draft: sadece panelde görünür; published: sitede görünür.
-- active = 0 yayındaki bir soruyu tek tek gizler (eski denemeler korunur).
ALTER TABLE questions ADD COLUMN status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published'));
-- Panelde değiştirilen sorular dolu olur; content/sorular'dan üretilen
-- migration'lar bu soruların üzerine yazmaz
ALTER TABLE questions ADD COLUMN updated_at INTEGER;
ALTER TABLE questions ADD COLUMN updated_by TEXT REFERENCES users(id) ON DELETE SET NULL;

INSERT INTO settings (key, value) VALUES ('announcement', '') ON CONFLICT(key) DO NOTHING;

CREATE TABLE admin_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    TEXT REFERENCES users(id) ON DELETE SET NULL,
  action     TEXT NOT NULL,
  target     TEXT,
  detail     TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX admin_log_time ON admin_log(created_at);
