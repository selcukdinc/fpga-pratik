-- Hesaplar ve misafirler. Misafir de bir kullanıcıdır (kind = 'guest'),
-- sonradan hesaba dönüştürülünce ilerlemesi kaybolmaz.
CREATE TABLE users (
  id            TEXT PRIMARY KEY,
  kind          TEXT NOT NULL CHECK (kind IN ('guest', 'member')),
  email         TEXT UNIQUE,
  password_hash TEXT,
  display_name  TEXT,
  created_at    INTEGER NOT NULL
);

-- Çerezde yalnızca rastgele belirteç durur; burada onun SHA-256 özeti saklanır
CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX sessions_user ON sessions(user_id);

CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE topics (
  id    TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  week  INTEGER NOT NULL,
  sort  INTEGER NOT NULL DEFAULT 0
);

-- type:   tf (doğru/yanlış), mcq (şıklı), fill (boşluk doldurma),
--         code (kod yazma), wave (dalga okuma)
-- source: original (geçmiş sınav / ders notu), derived (aynı mantıkla türetilmiş)
-- payload istemciye gider (şıklar, kod şablonu), answer asla gitmez
CREATE TABLE questions (
  id          TEXT PRIMARY KEY,
  topic_id    TEXT NOT NULL REFERENCES topics(id),
  week        INTEGER NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('tf', 'mcq', 'fill', 'code', 'wave')),
  source      TEXT NOT NULL CHECK (source IN ('original', 'derived')),
  prompt      TEXT NOT NULL,
  payload     TEXT NOT NULL DEFAULT '{}',
  answer      TEXT NOT NULL,
  explanation TEXT,
  active      INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX questions_week ON questions(week, active);

CREATE TABLE attempts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id),
  correct     INTEGER NOT NULL,
  answer      TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);
CREATE INDEX attempts_user ON attempts(user_id, question_id);
