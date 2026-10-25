-- A4b: paylaşılan kod sorusu sonuçları, topluluk testbench'leri ve bildirimler.

-- "Başkaları nerede takıldı?": üyenin bir kod sorusundaki son sonucunu
-- paylaşması. Skor sunucudaki deneme kaydından alınır; kod yalnızca üye
-- ayrıca işaretlerse saklanır.
CREATE TABLE paylasimlar (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id),
  gecen       INTEGER NOT NULL,
  toplam      INTEGER NOT NULL,
  ilk_hata    INTEGER,
  kod         TEXT,
  hidden      INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL,
  UNIQUE (user_id, question_id)
);
CREATE INDEX paylasimlar_soru ON paylasimlar(question_id, created_at);

-- Üyelerin yazdığı testbench'ler. Çözüm sunucuya gelmez; yalnızca çözenin
-- başladığı şablon (entity ve boş mimari) ile testbench saklanır.
CREATE TABLE topluluk_tb (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id    TEXT NOT NULL REFERENCES topics(id),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  sablon      TEXT NOT NULL,
  testbench   TEXT NOT NULL,
  top         TEXT NOT NULL,
  stop_time   TEXT NOT NULL,
  hidden      INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL
);
CREATE INDEX topluluk_tb_konu ON topluluk_tb(topic_id, created_at);
CREATE INDEX topluluk_tb_user ON topluluk_tb(user_id, created_at);

CREATE TABLE tb_begeni (
  tb_id   TEXT NOT NULL REFERENCES topluluk_tb(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (tb_id, user_id)
);

-- Tarayıcıda geçti diye işaretlenir; resmi ilerlemeye sayılmaz
CREATE TABLE tb_cozum (
  tb_id      TEXT NOT NULL REFERENCES topluluk_tb(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (tb_id, user_id)
);
CREATE INDEX tb_cozum_user ON tb_cozum(user_id);

-- 3 farklı üyeden açık bildirim alan içerik yönetici bakana kadar gizlenir
CREATE TABLE bildirimler (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hedef_tur  TEXT NOT NULL CHECK (hedef_tur IN ('tb', 'paylasim')),
  hedef_id   TEXT NOT NULL,
  neden      TEXT NOT NULL,
  cozuldu    INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  UNIQUE (user_id, hedef_tur, hedef_id)
);
CREATE INDEX bildirimler_hedef ON bildirimler(hedef_tur, hedef_id, cozuldu);

-- Sınav döneminde paylaşılan kodları kapatmak için
INSERT OR IGNORE INTO settings (key, value) VALUES ('kod_paylasimi', '1');
