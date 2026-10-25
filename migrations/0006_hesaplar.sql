-- Hesap sistemi: kullanıcı adı, doğrulanmış e-posta, PBKDF2 parola, avatar,
-- açık/gizli profil. Misafirler aynı tabloda kind = 'guest' olarak kalır.

ALTER TABLE users ADD COLUMN username TEXT;
ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN pass_salt TEXT;
ALTER TABLE users ADD COLUMN pass_iter INTEGER;
ALTER TABLE users ADD COLUMN avatar TEXT;
ALTER TABLE users ADD COLUMN avatar_bg TEXT;
-- Yetkiler worker/yetki.ts'teki tek fonksiyondan okunur; ileride RBAC'ye
-- geçilirse bu sütun roles tablosuna bağlanır
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
ALTER TABLE users ADD COLUMN public_profile INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN username_changed_at INTEGER;
CREATE UNIQUE INDEX users_username ON users(username);

-- Kodu girilene kadar hesap açılmaz; bekleyen kayıtlar burada durur
CREATE TABLE pending_signups (
  id         TEXT PRIMARY KEY,
  username   TEXT NOT NULL,
  email      TEXT NOT NULL,
  pass_hash  TEXT NOT NULL,
  pass_salt  TEXT NOT NULL,
  pass_iter  INTEGER NOT NULL,
  code_hash  TEXT NOT NULL,
  attempts   INTEGER NOT NULL DEFAULT 0,
  sent_at    INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX pending_signups_username ON pending_signups(username);
CREATE INDEX pending_signups_email ON pending_signups(email);

-- Var olan hesaplar için kodlar: parola sıfırlama ve e-posta değişimi
CREATE TABLE email_codes (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose    TEXT NOT NULL CHECK (purpose IN ('reset', 'email')),
  new_email  TEXT,
  code_hash  TEXT NOT NULL,
  attempts   INTEGER NOT NULL DEFAULT 0,
  sent_at    INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX email_codes_user ON email_codes(user_id, purpose);

-- Sabit pencereli sayaçlar: "kod:<ip>", "giris:<kullanıcı>" gibi anahtarlar
CREATE TABLE rate_limits (
  key          TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  count        INTEGER NOT NULL
);

-- Sorunun kimin tarafından eklendiği; RBAC'de "kendi sorusunu düzenler" kuralı için
ALTER TABLE questions ADD COLUMN created_by TEXT REFERENCES users(id) ON DELETE SET NULL;
