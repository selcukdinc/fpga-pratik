-- B6: Yedek soru havuzu. yedek = 1 olan sorular soru listesinde ve ilerleme
-- toplamlarında görünmez; aralıklı tekrar onları "görülmemiş soru" olarak getirir.
ALTER TABLE questions ADD COLUMN yedek INTEGER NOT NULL DEFAULT 0;
