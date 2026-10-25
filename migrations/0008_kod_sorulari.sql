-- Kod yazma soruları için tek kullanımlık sınamalar. Her denemede sunucu
-- rastgele giriş vektörleri seçer; beklenen çıkışlar burada saklanmaz,
-- gönderimde referans modelden yeniden hesaplanır.
CREATE TABLE sinamalar (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id),
  vectors     TEXT NOT NULL,
  created_at  INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL
);
CREATE INDEX sinamalar_user ON sinamalar(user_id);
CREATE INDEX sinamalar_expires ON sinamalar(expires_at);
