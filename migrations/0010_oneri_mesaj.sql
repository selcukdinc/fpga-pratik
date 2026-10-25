-- A4: soru önerileri, yöneticiyle yazışmalar, susturma ve e-posta tercihi.

-- Susturulan kullanıcı bu zamana kadar öneri gönderemez ve içerik paylaşamaz
-- (yöneticiye yazabilir). Kalıcı susturma için çok uzak bir zaman yazılır.
ALTER TABLE users ADD COLUMN muted_until INTEGER;
-- Yönetici cevap verince e-posta gitsin mi
ALTER TABLE users ADD COLUMN notify_email INTEGER NOT NULL DEFAULT 1;

-- Kabul edilen öneriden oluşan soruda "Öneren: @kullanıcı" gösterilir (öneren izin verdiyse)
ALTER TABLE questions ADD COLUMN suggested_by TEXT REFERENCES users(id);

CREATE TABLE suggestions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id    TEXT NOT NULL REFERENCES topics(id),
  type        TEXT NOT NULL CHECK (type IN ('tf', 'mcq', 'fill', 'code')),
  prompt      TEXT NOT NULL,
  -- tf/mcq/fill için cevap ve şıklar; code için serbest metin (beklenen davranış)
  payload     TEXT NOT NULL DEFAULT '{}',
  answer      TEXT NOT NULL DEFAULT '{}',
  explanation TEXT NOT NULL,
  show_name   INTEGER NOT NULL DEFAULT 1,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  admin_note  TEXT,
  question_id TEXT REFERENCES questions(id),
  created_at  INTEGER NOT NULL,
  decided_at  INTEGER,
  -- Kullanıcı kararı henüz görmediyse 1
  user_unread INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX suggestions_user ON suggestions(user_id, created_at);
CREATE INDEX suggestions_status ON suggestions(status, created_at);

CREATE TABLE threads (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject      TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL,
  user_unread  INTEGER NOT NULL DEFAULT 0,
  admin_unread INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX threads_user ON threads(user_id, updated_at);
CREATE INDEX threads_admin ON threads(admin_unread, updated_at);

CREATE TABLE thread_messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  thread_id  TEXT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  from_admin INTEGER NOT NULL DEFAULT 0,
  -- Cevaplayan yönetici (hesabı silinirse NULL olur, from_admin kalır)
  admin_id   TEXT REFERENCES users(id),
  body       TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX thread_messages_thread ON thread_messages(thread_id, id);
