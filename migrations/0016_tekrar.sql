-- Aralıklı tekrar: kişinin tekrar kutusundaki sorular (Leitner kutuları).
-- kutu 1-5 sorulur, 6 öğrenildi. sonraki: sorulacağı günün başı (ms).
-- son_tekrar: tekrar olarak en son ne zaman cevaplandığı; günlük sınır için.
CREATE TABLE tekrarlar (
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  kutu        INTEGER NOT NULL,
  sonraki     INTEGER NOT NULL,
  kaynak      TEXT NOT NULL CHECK (kaynak IN ('yanlis', 'iliskili')),
  eklendi     INTEGER NOT NULL,
  son_tekrar  INTEGER,
  PRIMARY KEY (user_id, question_id)
);
CREATE INDEX tekrarlar_vade ON tekrarlar(user_id, kutu, sonraki);

-- Soruların kavramı: yanlış yapılan sorunun kavramından çözülmemiş sorular tekrara eklenir
ALTER TABLE questions ADD COLUMN kavram TEXT;

-- Geçmişteki yanlışlar hemen sorulacak şekilde tekrara girer: hiç doğru
-- yapılamayanlar 1. kutuya, sonradan doğru yapılanlar 2. kutuya
INSERT OR IGNORE INTO tekrarlar (user_id, question_id, kutu, sonraki, kaynak, eklendi)
SELECT user_id, question_id, CASE WHEN MAX(correct) = 1 THEN 2 ELSE 1 END, 0, 'yanlis', MAX(created_at)
FROM attempts
GROUP BY user_id, question_id
HAVING MIN(correct) = 0;
