-- Bu dosya scripts/sorular-sql.ts ile content/sorular'dan üretildi, elle düzenlemeyin.

INSERT INTO topics (id, title, week, sort) VALUES ('fpga-giris', 'FPGA''ya giriş: FPGA, ASIC, CPU', 1, 1)
  ON CONFLICT(id) DO UPDATE SET title = excluded.title, week = excluded.week, sort = excluded.sort;
INSERT INTO topics (id, title, week, sort) VALUES ('pld', 'PROM, PAL, PLA ve FPGA yapısı', 2, 1)
  ON CONFLICT(id) DO UPDATE SET title = excluded.title, week = excluded.week, sort = excluded.sort;
INSERT INTO topics (id, title, week, sort) VALUES ('tasarim-akisi', 'Tasarım akışı, modelleme ve Vivado', 2, 2)
  ON CONFLICT(id) DO UPDATE SET title = excluded.title, week = excluded.week, sort = excluded.sort;
INSERT INTO topics (id, title, week, sort) VALUES ('vhdl-temel', 'VHDL yapısı: library, entity, architecture', 3, 1)
  ON CONFLICT(id) DO UPDATE SET title = excluded.title, week = excluded.week, sort = excluded.sort;
INSERT INTO topics (id, title, week, sort) VALUES ('operatorler', 'VHDL operatörleri', 3, 2)
  ON CONFLICT(id) DO UPDATE SET title = excluded.title, week = excluded.week, sort = excluded.sort;
INSERT INTO topics (id, title, week, sort) VALUES ('nitelikler', 'Öznitelikler, operatör aşırı yükleme ve GENERIC', 3, 3)
  ON CONFLICT(id) DO UPDATE SET title = excluded.title, week = excluded.week, sort = excluded.sort;
INSERT INTO topics (id, title, week, sort) VALUES ('veri-nesneleri', 'Veri nesneleri: constant, signal, variable', 4, 1)
  ON CONFLICT(id) DO UPDATE SET title = excluded.title, week = excluded.week, sort = excluded.sort;
INSERT INTO topics (id, title, week, sort) VALUES ('veri-tipleri', 'Veri tipleri, dönüşümler ve diziler', 4, 2)
  ON CONFLICT(id) DO UPDATE SET title = excluded.title, week = excluded.week, sort = excluded.sort;
INSERT INTO topics (id, title, week, sort) VALUES ('esz-atamalar', 'Eşzamanlı atamalar: when/else, with/select', 5, 1)
  ON CONFLICT(id) DO UPDATE SET title = excluded.title, week = excluded.week, sort = excluded.sort;
INSERT INTO topics (id, title, week, sort) VALUES ('sirali-kod', 'Sıralı kod: process, if, case, loop', 5, 2)
  ON CONFLICT(id) DO UPDATE SET title = excluded.title, week = excluded.week, sort = excluded.sort;

INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h1-fpga-acilim', 'fpga-giris', 1, 'mcq', 'original', 'FPGA kısaltmasının açılımı hangisidir?', '{"choices":["Fast Parallel Gate Architecture","Fixed Programmable Gate Array","Field Programmable Gate Array","Field Processing Gate Array"]}', '{"index":2}', 'FPGA, **Field Programmable Gate Array** demektir. "Field programmable" ifadesi, yonganın üretildikten sonra kullanıcı tarafından (sahada) yeniden yapılandırılabildiğini anlatır.', 1, 'Hafta 1, FPGA nedir?', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h1-fpga-asic-nre', 'fpga-giris', 1, 'mcq', 'original', 'Bir kerelik geliştirme maliyeti (NRE) ve birim maliyet açısından FPGA ile ASIC karşılaştırıldığında hangisi doğrudur?', '{"choices":["FPGA''de NRE yüksek, birim maliyet düşüktür; ASIC''te NRE düşük, birim maliyet yüksektir.","FPGA''de NRE düşük, birim maliyet yüksektir; ASIC''te NRE yüksek, birim maliyet düşüktür.","İkisinde de NRE ve birim maliyet aynıdır, fark sadece hızdadır.","ASIC''te hem NRE hem birim maliyet FPGA''den düşüktür."]}', '{"index":1}', 'ASIC''te maske, tasarım ve doğrulama gibi bir kerelik maliyetler (NRE) çok yüksektir, ama binlerce adet üretildiğinde birim fiyatı düşer. FPGA hazır bir yongadır: NRE düşüktür, ama her yonganın fiyatı ASIC''e göre yüksektir.', 1, 'Hafta 1, FPGA ve ASIC karşılaştırması (NRE tablosu)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h1-asic-seri-uretim', 'fpga-giris', 1, 'mcq', 'derived', 'Tasarımı tamamen kesinleşmiş bir oyuncak kontrol devresinden 1 milyon adet üretilecek. Birim maliyeti en düşük tutan seçenek hangisidir?', '{"choices":["FPGA","ASIC","Her cihaza bir Nexys 4 geliştirme kartı","CPLD"]}', '{"index":1}', 'Çok yüksek adette ve değişmeyecek bir tasarımda ASIC''in yüksek NRE''si adetlere bölünür ve birim maliyet en düşük olur. FPGA ve CPLD esneklik için fazladan para ödetir.', 2, 'Hafta 1, FPGA ve mikrodenetleyici', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h1-fpga-guncelleme', 'fpga-giris', 1, 'mcq', 'derived', 'Bir baz istasyonundaki sinyal işleme algoritması birkaç yılda bir iyileştirilip sahadaki cihazlara yüklenecek. Gerçek zamanlı ve paralel işlem de gerekiyor. En uygun seçenek hangisidir?', '{"choices":["ASIC","Bir kez programlanan PROM","FPGA","Bir kez programlanan PAL"]}', '{"index":2}', 'FPGA yeniden yapılandırılabildiği için tasarım sahada güncellenebilir ve paralel donanım olarak gerçek zamanlı çalışır. ASIC silikona döküldükten sonra değiştirilemez. PROM ve klasik PAL tek seferlik programlanır.', 2, 'Hafta 1, FPGA ve ASIC karşılaştırması', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h1-fpga-cpu-paralel', 'fpga-giris', 1, 'tf', 'original', 'FPGA''ler işlemleri bir CPU gibi komut komut, sırayla (ardışıl) yürütür.', '{}', '{"value":false}', 'CPU yazılımı sırayla yürütür. FPGA''de tasarım donanım olarak kurulur, farklı bloklar aynı anda (paralel) çalışır.', 1, 'Hafta 1, FPGA ve CPU karşılaştırması', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h1-asic-analog', 'fpga-giris', 1, 'tf', 'original', 'ASIC''ler aynı kalıpta analog alıcı-verici gibi tam analog devreler barındırabilir. FPGA''lerde ise ADC ya da PLL gibi bazı özel bloklar olsa da tam analog devreler bulunmaz.', '{}', '{"value":true}', 'Bu, ASIC''in FPGA''ye göre avantajlarından biridir. FPGA''nin dokusu sayısal mantık için tasarlanmıştır.', 2, 'Hafta 1, FPGA ve ASIC karşılaştırması', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h1-esneklik-verim', 'fpga-giris', 1, 'mcq', 'original', 'CPU, GPU, FPGA ve ASIC''i **en esnekten en verimliye** (performans ve güç verimliliği) doğru sıralayan seçenek hangisidir?', '{"choices":["CPU → GPU → FPGA → ASIC","ASIC → FPGA → GPU → CPU","CPU → FPGA → GPU → ASIC","GPU → CPU → ASIC → FPGA"]}', '{"index":0}', 'Esneklik ve kullanım kolaylığı CPU''dan ASIC''e doğru azalır, performans ve güç verimliliği ise artar: CPU, GPU, FPGA, ASIC.', 2, 'Hafta 1, CPU, GPU, FPGA ve ASIC karşılaştırması', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h1-prototip', 'fpga-giris', 1, 'tf', 'original', 'Birçok ASIC ve işlemci tasarımı, silikona aktarılmadan önce FPGA üzerinde prototiplenerek doğrulanır.', '{}', '{"value":true}', 'Silikona dökülmüş bir ASIC''teki hatayı düzeltmek neredeyse imkânsızdır. Bu yüzden tasarım önce FPGA''de denenir.', 1, 'Hafta 1, FPGA ve ASIC karşılaştırması', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h1-fpga-cpu-avantaj', 'fpga-giris', 1, 'mcq', 'derived', 'Aşağıdakilerden hangisi FPGA''nin değil, **CPU''nun** üstün olduğu bir özelliktir?', '{"choices":["Birçok işlemi aynı anda, paralel yürütmesi","Gerçek zamanlı uygulamalarda yüksek ve öngörülebilir hız","Kayan noktalı sayıları ek tasarım olmadan işlemesi","İşlevin donanım olarak kurulması"]}', '{"index":2}', 'Sunumdaki karşılaştırmaya göre CPU kayan nokta gibi işlemleri ve veri tiplerini doğrudan tanır. FPGA''de bunlar için ayrıca donanım tasarlamak gerekir.', 2, 'Hafta 1, FPGA ve CPU karşılaştırması', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h1-entegre-olcek', 'fpga-giris', 1, 'mcq', 'original', 'Derste verilen sınıflandırmaya göre 20 ile 100 arasında mantık kapısı içeren bir entegre hangi sınıftadır?', '{"choices":["SSI","MSI","LSI","VLSI"]}', '{"index":1}', 'Derste verilen aralıklar: SSI 1-20, MSI 20-100, LSI 100-5000, VLSI 5000 ve üzeri kapı. Örneğin 74LS90 sayıcı entegresi MSI''dır.', 2, 'Hafta 1, Entegre çeşitleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h1-7400-ssi', 'fpga-giris', 1, 'mcq', 'derived', 'Dört adet iki girişli NAND kapısı içeren 7400 entegresi hangi sınıfa girer?', '{"choices":["VLSI","LSI","MSI","SSI"]}', '{"index":3}', '7400 sadece 4 kapı içerir. 1-20 kapı aralığı SSI (küçük ölçekli entegre) sınıfıdır.', 1, 'Hafta 1, Entegre çeşitleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-prom-dizi', 'pld', 2, 'mcq', 'original', 'PROM yapısında hangi dizi programlanabilir?', '{"choices":["Yalnız AND dizisi","Yalnız OR dizisi","Hem AND hem OR dizisi","Hiçbiri, iki dizi de sabittir"]}', '{"index":1}', 'PROM''da AND dizisi sabittir ve girişlerin tüm mintermlerini (adres çözücü) üretir. Programlanan kısım OR dizisidir.', 1, 'Hafta 2, PROM', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-pal-dizi', 'pld', 2, 'mcq', 'original', 'PAL yapısında hangi dizi programlanabilir?', '{"choices":["Hem AND hem OR dizisi","Yalnız AND dizisi","Yalnız OR dizisi","Hiçbiri, iki dizi de sabittir"]}', '{"index":1}', 'PAL''de AND dizisi programlanabilir, OR dizisi sabittir. Her OR kapısı belirli çarpım terimlerine kalıcı olarak bağlıdır.', 1, 'Hafta 2, PAL', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-pla-dizi', 'pld', 2, 'mcq', 'original', 'PLA yapısında hangi dizi programlanabilir?', '{"choices":["Yalnız OR dizisi","Yalnız AND dizisi","Hiçbiri, iki dizi de sabittir","Hem AND hem OR dizisi"]}', '{"index":3}', 'PLA''da iki dizi de programlanabilir. Bu onu PAL ve PROM''dan daha esnek yapar, ama daha karmaşık ve yavaştır.', 1, 'Hafta 2, PLA', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-pal-pla-paylasim', 'pld', 2, 'tf', 'derived', 'PAL''de OR dizisi sabit olduğu için her çıkış sadece kendisine ayrılmış çarpım terimlerini kullanabilir. PLA''da ise bir çarpım terimi birden fazla çıkış tarafından paylaşılabilir.', '{}', '{"value":true}', 'PLA''nın OR dizisi programlanabilir olduğu için bir AND kapısının çıkışı istenen her OR kapısına bağlanabilir. PAL''de bu bağlantılar üretimde sabitlenir.', 2, 'Hafta 2, PAL ve PLA', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-prom-terim', 'pld', 2, 'mcq', 'derived', '3 girişli bir PROM''un sabit AND dizisinde kaç çarpım terimi (AND kapısı) bulunur?', '{"choices":["3","6","8","9"]}', '{"index":2}', 'PROM''un AND dizisi girişlerin tüm mintermlerini üretir: 2³ = 8. Sunumdaki PROM şemasında da 3 giriş için 8 AND kapısı vardır.', 2, 'Hafta 2, PROM', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-pla-fonksiyon', 'pld', 2, 'fill', 'derived', 'A, B, C girişli bir PLA''da AND dizisi şu çarpım terimlerini üretecek şekilde programlanmış:

```
P1 = A''B''
P2 = AC''
P3 = BC
```

OR dizisi bağlantıları:

```
F1 = P1 + P3
F2 = P2 + P3
F3 = P1 + P2
```

A = 1, B = 1, C = 0 için F1, F2, F3 değerlerini sırayla yan yana yazın (örnek: `101`).', '{"blanks":1}', '{"blanks":[["011"]]}', 'A=1, B=1, C=0 için P1 = A''B'' = 0·0 = 0, P2 = AC'' = 1·1 = 1, P3 = BC = 1·0 = 0. Buradan F1 = 0+0 = 0, F2 = 1+0 = 1, F3 = 0+1 = 1, yani `011`.', 3, 'Hafta 2, PLA (F1, F2, F3 = ?)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-pla-terim-sayisi', 'pld', 2, 'mcq', 'derived', 'F1 = AB + C ve F2 = AB + A''C'' fonksiyonları bir PLA ile gerçeklenecek. AND dizisinde **en az** kaç çarpım terimi gerekir?', '{"choices":["2","3","4","5"]}', '{"index":1}', 'Farklı çarpım terimleri AB, C ve A''C''''dür. PLA''da AB terimi bir kez üretilip iki OR kapısına birden bağlanabilir, bu yüzden 3 terim yeter. PAL''de AB iki kez üretilmek zorunda kalırdı.', 3, 'Hafta 2, PLA', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-tarihce-sira', 'pld', 2, 'mcq', 'original', 'Derste verilen tarihçeye göre programlanabilir mantık cihazlarının ortaya çıkış sırası hangisidir?', '{"choices":["PAL → PROM → PLA → FPGA → CPLD","PROM → PLA → PAL → CPLD → FPGA","PLA → PROM → CPLD → PAL → FPGA","PROM → PAL → FPGA → PLA → CPLD"]}', '{"index":1}', 'Sunumdaki sıra: PROM (1966), PLA (1975), PAL (1980), CPLD (1982), FPGA (1985).', 2, 'Hafta 2, FPGA tarihçesi', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-cpld', 'pld', 2, 'tf', 'original', 'CPLD, PLD benzeri birkaç mantık bloğunun ortak bir ara bağlantı matrisiyle birleştirilmesinden oluşur.', '{}', '{"value":true}', 'CPLD (Complex PLD), ihtiyaçlar büyüdükçe birden fazla PLD bloğunu bir ara bağlantı matrisiyle tek yongada toplar. FPGA bu fikrin daha ince taneli ve çok daha büyük devamıdır.', 2, 'Hafta 2, CPLD', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-fpga-yapi', 'pld', 2, 'mcq', 'original', 'Bir FPGA''nin üç temel yapı taşı hangisidir?', '{"choices":["ALU, kayıtçılar ve program sayacı","Sabit AND dizisi, programlanabilir OR dizisi ve çıkış tamponu","Mantık blokları, programlanabilir ara bağlantılar ve G/Ç blokları","RAM, ROM ve DMA denetleyicisi"]}', '{"index":2}', 'FPGA; mantığın gerçeklendiği CLB''ler, bunları birbirine bağlayan programlanabilir ara bağlantılar ve dış dünyayla bağlantıyı sağlayan G/Ç bloklarından oluşur. ALU''lu seçenek bir CPU''yu, sabit AND dizili seçenek PROM''u anlatır.', 1, 'Hafta 2, FPGA yapısı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-clb-lut', 'pld', 2, 'mcq', 'original', 'Bir FPGA mantık bloğunda (CLB) kombinasyonel mantık fonksiyonunu gerçekleyen eleman hangisidir?', '{"choices":["D flip-flop","LUT","Çıkıştaki MUX","G/Ç bloğu"]}', '{"index":1}', 'LUT, girişlerin her kombinasyonu için çıkışı saklayan küçük bir bellektir, yani bir doğruluk tablosudur. D flip-flop sonucu saatle saklar, MUX ise çıkışın LUT''tan mı flip-flop''tan mı alınacağını seçer.', 1, 'Hafta 2, FPGA mantık bloğu (CLB)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-lut-bit', 'pld', 2, 'fill', 'derived', '6 girişli bir LUT, doğruluk tablosu için kaç bitlik bellek hücresi tutar?', '{"blanks":1}', '{"blanks":[["64"]]}', 'n girişli bir LUT 2ⁿ satırlık bir doğruluk tablosudur. 2⁶ = 64 bit.', 2, 'Hafta 2, FPGA mantık bloğu (CLB)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-akis-sira', 'tasarim-akisi', 2, 'mcq', 'original', 'FPGA tasarım akışının doğru sırası hangisidir?', '{"choices":["Tasarım → Sentez → Simülasyon → Eşleme → Yönlendirme → Yerleştirme → Bitstream","Tasarım → Simülasyon → Sentez → Eşleme → Yerleştirme → Yönlendirme → Bitstream","Simülasyon → Tasarım → Eşleme → Sentez → Yerleştirme → Yönlendirme → Bitstream","Tasarım → Simülasyon → Yerleştirme → Sentez → Eşleme → Yönlendirme → Bitstream"]}', '{"index":1}', 'Kod yazılır, simülasyonla test edilir, sentezle netlist''e dönüştürülür, elemanlar CLB''lere eşlenir, yerleştirilir, aralarındaki bağlantılar yönlendirilir ve en son bitstream üretilip karta yüklenir.', 2, 'Hafta 2, FPGA tasarım akışı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-sentez', 'tasarim-akisi', 2, 'mcq', 'original', 'HDL kodunun mantıksal karşılığının, yani devre bağlantı listesinin (netlist) oluşturulduğu adım hangisidir?', '{"choices":["Simülasyon","Sentezleme","Yerleştirme","Yönlendirme"]}', '{"index":1}', 'Sentez, VHDL kodunu kapılar, flip-flop''lar ve aritmetik bloklardan oluşan bir netlist''e çevirir.', 1, 'Hafta 2, Adım 3: Sentezleme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-yonlendirme', 'tasarim-akisi', 2, 'mcq', 'original', 'Yerleştirilmiş mantık blokları ile giriş/çıkış pinleri arasındaki bağlantıların ara bağlantı kaynakları üzerinden kurulduğu adım hangisidir?', '{"choices":["Eşleme","Sentezleme","Yönlendirme","Bitstream üretimi"]}', '{"index":2}', 'Yerleştirme elemanların hangi CLB''ye konacağını belirler. Yönlendirme ise bu blokları ve pinleri birbirine bağlayan yolları seçer.', 2, 'Hafta 2, Adım 6: Yönlendirme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-modelleme-yapisal', 'tasarim-akisi', 2, 'mcq', 'original', 'Sistemi birbirine bağlanmış alt bileşenler (component) olarak tanımlayan modelleme yöntemi hangisidir?', '{"choices":["Veri akışı","Davranışsal","Yapısal","Algoritmik"]}', '{"index":2}', 'Yapısal modellemede devre, port map ile birbirine bağlanan bileşenlerden kurulur. Veri akışı eşzamanlı atamalarla, davranışsal modelleme ise process içindeki sıralı kodla yazılır.', 1, 'Hafta 2, VHDL modelleme yöntemleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-modelleme-kod', 'tasarim-akisi', 2, 'mcq', 'derived', 'Aşağıdaki mimari hangi modelleme yöntemiyle yazılmıştır?

```vhdl
architecture a of ornek is
begin
  y <= (a and b) or c;
  z <= a xor c;
end a;
```', '{"choices":["Veri akışı","Davranışsal","Yapısal","Yapısal ve davranışsal karma"]}', '{"index":0}', 'Process ya da component yok. Çıkışlar eşzamanlı sinyal atamalarıyla, verinin girişlerden çıkışa nasıl aktığı anlatılarak yazılmış. Bu veri akışı modellemesidir.', 2, 'Hafta 2, VHDL modelleme yöntemleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-vivado-rtl', 'tasarim-akisi', 2, 'mcq', 'original', 'Vivado''nun yeni proje sihirbazında, VHDL kaynak dosyası ekleyip sentez ve uygulama (implementation) yapabilmek için hangi proje türü seçilir?', '{"choices":["Post-synthesis Project","I/O Planning Project","RTL Project","Imported Project"]}', '{"index":2}', 'RTL Project, HDL kaynaklarından başlayıp sentez, uygulama ve bitstream üretimine kadar giden standart proje türüdür.', 1, 'Hafta 2, Vivado''da proje oluşturma', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-vivado-parca', 'tasarim-akisi', 2, 'fill', 'original', 'Derste kullanılan Nexys 4 kartı için Vivado''da hangi FPGA parça numarası seçilir?', '{"blanks":1}', '{"blanks":[["xc7a100tcsg324-1","xc7a100tcsg324"]]}', 'Nexys 4 kartında Artix-7 ailesinden **xc7a100tcsg324-1** yongası vardır. Parça yanlış seçilirse kısıt (XDC) ve bitstream karta uymaz.', 1, 'Hafta 2, Vivado''da proje oluşturma', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-simulasyon-amac', 'tasarim-akisi', 2, 'tf', 'derived', 'Davranışsal simülasyon, tasarımın FPGA''ye yüklenmeden önce beklenen şekilde çalışıp çalışmadığını bilgisayarda denemeye yarar.', '{}', '{"value":true}', 'Simülasyonda giriş değerleri verilir ve çıkışların dalga şekli incelenir. Hatayı kartta aramaktan çok daha hızlı ve ucuzdur.', 1, 'Hafta 2, Adım 2: Benzetim', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-uc-bolum', 'vhdl-temel', 3, 'mcq', 'original', 'Bir VHDL tasarımının temel üç bölümü hangisidir?', '{"choices":["PROCESS, SIGNAL, VARIABLE","LIBRARY, ENTITY, ARCHITECTURE","PACKAGE, FUNCTION, PROCEDURE","ENTITY, PORT MAP, COMPONENT"]}', '{"index":1}', 'LIBRARY bildirimleri kullanılacak paketleri görünür yapar, ENTITY dış arayüzü (portları) tanımlar, ARCHITECTURE ise devrenin işlevini anlatır.', 1, 'Hafta 3, Temel VHDL yapısı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-std-work', 'vhdl-temel', 3, 'mcq', 'original', 'Hangi iki kütüphane her tasarımda varsayılan olarak görünürdür, yani bildirilmesine gerek yoktur?', '{"choices":["ieee ve std","ieee ve work","std ve work","numeric_std ve std_logic_1164"]}', '{"index":2}', '`std` (içinde `standard` paketi, BIT, INTEGER, BOOLEAN gibi tipler) ve `work` (kendi tasarım dosyaların) her zaman görünürdür. `ieee` kütüphanesi ise `library ieee;` ile açıkça bildirilmelidir.', 2, 'Hafta 3, Library bildirimi', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-port-inout', 'vhdl-temel', 3, 'mcq', 'original', 'Hem dışarıdan sürülebilen hem de devre tarafından sürülebilen, çift yönlü port modu hangisidir?', '{"choices":["IN","OUT","BUFFER","INOUT"]}', '{"index":3}', 'INOUT çift yönlüdür (örneğin üç durumlu bir veri yolu). BUFFER ise sadece dışarı veri verir ama içeride okunabilir.', 1, 'Hafta 3, Entity ve port modları', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-out-okuma', 'vhdl-temel', 3, 'tf', 'original', 'VHDL-93''te `out` modundaki bir port, mimari içinde bir atamanın sağ tarafında okunabilir.', '{}', '{"value":false}', 'VHDL-93''te `out` portu sadece yazılabilir. Okumak gerekiyorsa iç bir sinyal kullanılır ve port bu sinyalden sürülür. (VHDL-2008 bu kısıtı kaldırdı, ama ders VHDL-93 esaslıdır.)', 2, 'Hafta 3, Entity ve port modları', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-entity-hata', 'vhdl-temel', 3, 'mcq', 'derived', 'Aşağıdaki entity bildirimi derlenmez. Hata nedir?

```vhdl
entity ornek is
  port ( a, b : in  std_logic;
         y    : out std_logic; );
end ornek;
```', '{"choices":["a ve b aynı satırda bildirilemez","Son porttan sonra noktalı virgül konmaz","Entity adı `ornek` olamaz","Port listesinde `in` ve `out` birlikte kullanılamaz"]}', '{"index":1}', 'Port bildirimleri birbirinden noktalı virgülle ayrılır, sonuncusundan sonra noktalı virgül konmaz. Doğrusu: `y : out std_logic );`', 2, 'Hafta 3, Entity', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-architecture-of', 'vhdl-temel', 3, 'fill', 'derived', 'Boşluğu doldurun:

```vhdl
architecture davranis ____ yarim_toplayici is
begin
  ...
end davranis;
```', '{"blanks":1}', '{"blanks":[["of"]]}', 'Sözdizimi `architecture mimari_adi of entity_adi is` biçimindedir.', 1, 'Hafta 3, Architecture', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-yarim-toplayici', 'vhdl-temel', 3, 'fill', 'original', 'Yarım toplayıcıda A = 1, B = 1 için toplam (S) ve elde (CO) çıkışları nedir?

Boşluk 1: S, Boşluk 2: CO', '{"blanks":2}', '{"blanks":[["0","''0''"],["1","''1''"]]}', 'S = A xor B = 0, CO = A and B = 1. 1 + 1 = 10 (ikilik).', 1, 'Hafta 3, Örnek 1 (yarım toplayıcı)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-yarim-toplayici-kod', 'vhdl-temel', 3, 'mcq', 'original', 'Yarım toplayıcıyı doğru gerçekleyen atama çifti hangisidir?', '{"choices":["`S <= A or B;  CO <= A and B;`","`S <= A and B; CO <= A xor B;`","`S <= A xor B; CO <= A and B;`","`S <= A xnor B; CO <= A or B;`"]}', '{"index":2}', 'Toplam biti girişler farklıyken 1 olur (XOR). Elde biti sadece ikisi de 1''ken 1 olur (AND).', 1, 'Hafta 3, Örnek 1 (yarım toplayıcı)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-tam-toplayici', 'vhdl-temel', 3, 'fill', 'original', '1 bitlik tam toplayıcıda A = 1, B = 0, Cin = 1 için S ve Cout nedir?

Boşluk 1: S, Boşluk 2: Cout', '{"blanks":2}', '{"blanks":[["0","''0''"],["1","''1''"]]}', '1 + 0 + 1 = 2 = 10 (ikilik). S = A xor B xor Cin = 0, Cout = AB + Cin(A xor B) = 0 + 1·1 = 1.', 2, 'Hafta 3, Örnek 2 (tam toplayıcı)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-tam-toplayici-cout', 'vhdl-temel', 3, 'mcq', 'original', 'Tam toplayıcının elde çıkışı için hangi VHDL ifadesi doğrudur?', '{"choices":["`Cout <= A xor B xor Cin;`","`Cout <= (A or B) and Cin;`","`Cout <= (A and B) xor Cin;`","`Cout <= (A and B) or (Cin and (A xor B));`"]}', '{"index":3}', 'Sunumdaki formül Cout = AB + Cin(A ⊕ B). `A xor B xor Cin` toplam bitidir, elde değil. `(A or B) and Cin`, A=B=1 ve Cin=0''da 0 verir (yanlış). `(A and B) xor Cin` ise A=B=Cin=1''de 0 verir (yanlış).', 2, 'Hafta 3, Örnek 2 (tam toplayıcı)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-atama-variable', 'operatorler', 3, 'mcq', 'original', 'Bir VARIABLE''a değer atamak için hangi operatör kullanılır?', '{"choices":["`<=`","`:=`","`=>`","`=`"]}', '{"index":1}', '`:=` variable, constant ve generic''lere değer atar, ayrıca başlangıç değeri verir. `<=` sinyal atamasıdır. `=>` ise `others => ''0''` gibi eleman eşlemede kullanılır.', 1, 'Hafta 3, Atama operatörleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-others-to', 'operatorler', 3, 'mcq', 'original', '`signal w : std_logic_vector(0 to 7);` için `w <= (0 => ''1'', others => ''0'');` ataması hangi değere eşittir?', '{"choices":["`\"00000001\"`","`\"10000000\"`","`\"11111110\"`","`\"01111111\"`"]}', '{"index":1}', '`0 to 7` aralığında 0 indeksi en soldadır. Dizgi değeri soldan sağa indeks sırasıyla yazılır, bu yüzden sonuç `"10000000"` olur.', 2, 'Hafta 3, Atama operatörleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-not-oncelik', 'operatorler', 3, 'mcq', 'original', '`y <= not a and b;` ifadesi hangisine eşittir?', '{"choices":["(a · b)''","a'' · b","a'' · b''","(a + b)''"]}', '{"index":1}', 'NOT diğer mantıksal operatörlerden önceliklidir, yani önce `not a` hesaplanır, sonra b ile AND''lenir. (a·b)'' için `not (a and b)` yazmak gerekir.', 2, 'Hafta 3, Lojik işlemler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-karisik-op', 'operatorler', 3, 'tf', 'derived', '`y <= a and b or c;` ifadesi parantez kullanılmadan VHDL''de derlenir.', '{}', '{"value":false}', 'VHDL''de and, or, xor gibi ikili mantık operatörleri aynı önceliktedir. Farklı operatörleri parantezsiz arka arkaya yazmak hatadır: `(a and b) or c` yazılmalıdır. (Aynı operatörün tekrarı serbesttir: `a and b and c`.) Not: Bu sitedeki simülatör (NVC) bu kuralı denetlemez ve kodu kabul eder; Vivado ve GHDL ise hata verir.', 2, 'Hafta 3, Lojik işlemler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-nand-zincir', 'operatorler', 3, 'tf', 'derived', 'Üç girişli NAND için `y <= a nand b nand c;` yazılabilir.', '{}', '{"value":false}', 'NAND ve NOR birleşme özelliğine sahip değildir; (a nand b) nand c ile a nand (b nand c) farklıdır. Bu yüzden VHDL bu zinciri yasaklar. Üç girişli NAND için `y <= not (a and b and c);` yazılır.', 3, 'Hafta 3, Lojik işlemler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-mod-rem-pozitif', 'operatorler', 3, 'fill', 'original', '`in_giris_3 = 19` ve `in_giris_2 = "0100"` (4) iken aşağıdaki çıkışlar kaç olur?

```vhdl
out_cikis_bolme <= in_giris_3 / to_integer(signed(in_giris_2));
out_cikis_mod   <= in_giris_3 mod to_integer(signed(in_giris_2));
out_cikis_rem   <= in_giris_3 rem to_integer(signed(in_giris_2));
```

Boşluk 1: bölme, Boşluk 2: mod, Boşluk 3: rem', '{"blanks":3}', '{"blanks":[["4"],["3"],["3"]]}', '19 / 4 = 4 (tam sayı bölmesinde kesirli kısım atılır). İki sayı da pozitif olduğunda mod ve rem aynı sonucu verir: 19 = 4·4 + 3.', 2, 'Hafta 3, Örnek 4 ve 5 (mod ve rem)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-mod-rem-negatif-bolen', 'operatorler', 3, 'fill', 'derived', 'Aynı kodda `in_giris_2 = "1100"` olursa (`signed` olarak -4) çıkışlar kaç olur?

Boşluk 1: `19 / (-4)`, Boşluk 2: `19 mod (-4)`, Boşluk 3: `19 rem (-4)`', '{"blanks":3}', '{"blanks":[["-4"],["-1"],["3"]]}', 'Bölme sıfıra doğru keser: 19 / -4 = -4,75 → -4. `rem` sonucu bölünenin (19) işaretini alır: 19 - (-4)(-4) = 3. `mod` sonucu bölenin (-4) işaretini alır: 19 = (-4)(-5) + (-1), yani -1.', 3, 'Hafta 3, Örnek 4 ve 5 (mod ve rem)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-mod-rem-negatif-bolunen', 'operatorler', 3, 'fill', 'derived', '`(-19) mod 4` ve `(-19) rem 4` kaçtır?

Boşluk 1: mod, Boşluk 2: rem', '{"blanks":2}', '{"blanks":[["1"],["-3"]]}', '`rem` bölünenin işaretini alır: -19 = 4·(-4) + (-3), sonuç -3. `mod` bölenin işaretini alır: -19 = 4·(-5) + 1, sonuç 1.', 3, 'Hafta 3, Aritmetik işlemler (mod, rem)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-mod-rem-isaret', 'operatorler', 3, 'mcq', 'original', '`a mod b` ve `a rem b` sonuçlarının işareti neye göre belirlenir?', '{"choices":["mod: a''nın işareti, rem: b''nin işareti","mod: b''nin işareti, rem: a''nın işareti","İkisi de her zaman pozitiftir","İkisi de a''nın işaretini alır"]}', '{"index":1}', '`mod` sonucu bölenin (b), `rem` sonucu bölünenin (a) işaretini taşır. İşaretler aynıysa iki sonuç eşittir.', 2, 'Hafta 3, Aritmetik işlemler (mod, rem)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-bolme-sentez', 'operatorler', 3, 'mcq', 'original', 'Sentez araçları `/` (bölme) operatörünü genellikle hangi durumda doğrudan kabul eder?', '{"choices":["Her durumda, bölücü ne olursa olsun","Bölen 2''nin sabit bir kuvveti olduğunda","Sadece REAL tipinde","Hiçbir durumda, bölme sentezlenemez"]}', '{"index":1}', '2''nin kuvvetine bölme sadece bitleri kaydırmaktır. Genel bölme pahalı bir devre gerektirir ve doğrudan desteklenmez. `mod`, `rem` ve `abs` için de destek sınırlıdır.', 2, 'Hafta 3, Aritmetik işlemler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-ornek3', 'operatorler', 3, 'fill', 'original', '`a = "0111"` ve `b = "0011"` için çıkışlar nedir?

```vhdl
e <= std_logic_vector(unsigned(a) + unsigned(b));
f <= std_logic_vector(signed(a) - signed(b));
g <= a(1 downto 0) & b(3 downto 2);
```

Boşluk 1: e, Boşluk 2: f, Boşluk 3: g (4 bitlik ikilik)', '{"blanks":3}', '{"blanks":[["1010","\"1010\""],["0100","\"0100\""],["1100","\"1100\""]]}', 'e = 7 + 3 = 10 = `1010`. f = 7 - 3 = 4 = `0100`. g, a''nın alt iki biti (`11`) ile b''nin üst iki bitinin (`00`) birleşimidir: `1100`.', 2, 'Hafta 3, Örnek 3', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-ornek3-tasma', 'operatorler', 3, 'fill', 'derived', 'Aynı kodda `a = "1001"` ve `b = "0110"` olursa e, f ve g ne olur?

Boşluk 1: e, Boşluk 2: f, Boşluk 3: g (4 bitlik ikilik)', '{"blanks":3}', '{"blanks":[["1111","\"1111\""],["0011","\"0011\""],["0101","\"0101\""]]}', 'e: işaretsiz 9 + 6 = 15 = `1111`. f: işaretli olarak a = -7, b = 6, fark -13. Bu 4 bite sığmaz (aralık -8..7), sonuç 16''ya göre sarar: -13 + 16 = 3 = `0011`. Taşma uyarı vermez, sessizce olur. g = `01` & `01` = `0101`.', 3, 'Hafta 3, Örnek 3', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-slv-toplama', 'operatorler', 3, 'tf', 'original', '`ieee.std_logic_1164` ve `ieee.numeric_std` kullanılan bir tasarımda iki `std_logic_vector` doğrudan `a + b` şeklinde toplanabilir.', '{}', '{"value":false}', '`numeric_std` toplamayı `signed` ve `unsigned` için tanımlar, `std_logic_vector` için tanımlamaz. Önce dönüştürmek gerekir: `std_logic_vector(unsigned(a) + unsigned(b))`. Eski `std_logic_unsigned` paketi buna izin verir ama standart değildir ve derste önerilmez.', 2, 'Hafta 3, Aritmetik operatörler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-kaydirma', 'operatorler', 3, 'fill', 'original', '`signal x : bit_vector(3 downto 0) := "1011";` için `x sll 1` ve `x srl 2` sonuçları nedir?

Boşluk 1: `x sll 1`, Boşluk 2: `x srl 2`', '{"blanks":2}', '{"blanks":[["0110","\"0110\""],["0010","\"0010\""]]}', '`sll` sola kaydırır ve sağdan ''0'' ekler: `1011` → `0110`. `srl` sağa kaydırır ve soldan ''0'' ekler: `1011` → `0101` → `0010`.', 2, 'Hafta 3, Kaydırma operatörleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-esit-degil', 'operatorler', 3, 'mcq', 'original', 'VHDL''de "eşit değildir" operatörü hangisidir?', '{"choices":["`!=`","`<>`","`/=`","`=/`"]}', '{"index":2}', 'VHDL''de eşit değildir `/=` ile yazılır. `!=` C dilinden, `<>` ise bazı başka dillerden gelen bir alışkanlıktır.', 1, 'Hafta 3, Karşılaştırma operatörleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-kucuk-esit', 'operatorler', 3, 'tf', 'derived', '`if a <= b then` satırındaki `<=` bir sinyal ataması değil, "küçük veya eşit" karşılaştırmasıdır.', '{}', '{"value":true}', 'Aynı simge iki anlamda kullanılır. Bir koşul ifadesinin içinde `<=` karşılaştırmadır; bir satırın başında, hedef sinyalden sonra ise atamadır.', 2, 'Hafta 3, Karşılaştırma operatörleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-birlestirme', 'operatorler', 3, 'fill', 'derived', '`"10" & "011"` ifadesinin sonucu nedir?', '{"blanks":1}', '{"blanks":[["10011","\"10011\""]]}', '`&` birleştirme operatörüdür; sol operand üst bitlere, sağ operand alt bitlere gider ve 5 bitlik `10011` oluşur.', 1, 'Hafta 3, Operatörler (birleştirme)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-attr-downto', 'nitelikler', 3, 'fill', 'original', '`signal d : std_logic_vector(7 downto 0);` için:

Boşluk 1: `d''LOW`, Boşluk 2: `d''HIGH`, Boşluk 3: `d''LEFT`, Boşluk 4: `d''RIGHT`, Boşluk 5: `d''LENGTH`', '{"blanks":5}', '{"blanks":[["0"],["7"],["7"],["0"],["8"]]}', 'LOW ve HIGH yönden bağımsız olarak en küçük ve en büyük indeksi verir. LEFT ve RIGHT ise yazıldığı sıradaki sol ve sağ sınırdır: `7 downto 0` için LEFT = 7, RIGHT = 0. LENGTH eleman sayısıdır.', 2, 'Hafta 3, Veri öznitelikleri (Örnek 1)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-attr-to', 'nitelikler', 3, 'fill', 'derived', '`signal x : std_logic_vector(3 to 10);` için:

Boşluk 1: `x''LEFT`, Boşluk 2: `x''HIGH`, Boşluk 3: `x''LENGTH`', '{"blanks":3}', '{"blanks":[["3"],["10"],["8"]]}', '`3 to 10` yazımında sol sınır 3, en büyük indeks 10''dur. Eleman sayısı 10 - 3 + 1 = 8.', 2, 'Hafta 3, Veri öznitelikleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-attr-reverse', 'nitelikler', 3, 'mcq', 'original', '`signal d : std_logic_vector(7 downto 0);` için `d''REVERSE_RANGE` neyi verir?', '{"choices":["`7 downto 0`","`0 to 7`","`8`","`0 downto 7`"]}', '{"index":1}', '`d''RANGE` = `7 downto 0`, `d''REVERSE_RANGE` ise aynı aralığın ters yönlüsüdür: `0 to 7`.', 2, 'Hafta 3, Veri öznitelikleri (Örnek 1)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-attr-dongu', 'nitelikler', 3, 'mcq', 'original', '`signal x : std_logic_vector(0 to 7);` için aşağıdaki döngülerden hangisi i''yi 0''dan 7''ye **sırayla** dolaştırmaz?', '{"choices":["`for i in 0 to 7 loop`","`for i in x''RANGE loop`","`for i in x''REVERSE_RANGE loop`","`for i in 0 to x''LENGTH - 1 loop`"]}', '{"index":2}', '`x''REVERSE_RANGE` = `7 downto 0` olduğu için döngü 7''den 0''a iner. Diğer üçü 0''dan 7''ye çıkar. Sunumdaki dört eşdeğer döngü örneği de bu fikre dayanır.', 2, 'Hafta 3, Veri öznitelikleri (Örnek 2)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-kenar-algilama', 'nitelikler', 3, 'mcq', 'original', 'Aşağıdakilerden hangisi saatin **yalnızca yükselen kenarını** algılamaz?', '{"choices":["`if clk''EVENT and clk = ''1'' then`","`if not clk''STABLE and clk = ''1'' then`","`if clk''EVENT then`","`if rising_edge(clk) then`"]}', '{"index":2}', '`clk''EVENT` tek başına her değişimde, yani hem yükselen hem düşen kenarda doğrudur. Diğer üçü sunumdaki eşdeğer yükselen kenar yazımlarıdır.', 2, 'Hafta 3, Sinyal öznitelikleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-sentezlenebilir-nitelik', 'nitelikler', 3, 'mcq', 'original', 'Sinyal niteliklerinden hangi ikisi sentezlenebilir?', '{"choices":["`''LAST_VALUE` ve `''QUIET`","`''EVENT` ve `''STABLE`","`''LAST_EVENT` ve `''ACTIVE`","`''DELAYED` ve `''TRANSACTION`"]}', '{"index":1}', 'Sinyal niteliklerinin çoğu sadece simülasyon içindir. `''EVENT` ve `''STABLE` sentezlenebilir; özellikle `''EVENT` kenar algılamada çok kullanılır.', 2, 'Hafta 3, Sinyal öznitelikleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-last-value', 'nitelikler', 3, 'tf', 'derived', '`s''LAST_VALUE`, s sinyalinin son olaydan (değişimden) önceki değerini verir.', '{}', '{"value":true}', 'Örneğin s ''0''dan ''1''e geçtiyse `s''LAST_VALUE` = ''0'' olur. Simülasyonda kullanışlıdır, sentezlenmez.', 3, 'Hafta 3, Sinyal öznitelikleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-enum-encoding', 'nitelikler', 3, 'fill', 'original', '`type color is (red, green, blue, white);` tipinde:

Boşluk 1: Varsayılan sıralı kodlamada `blue` hangi koda karşılık gelir?

Boşluk 2: `attribute enum_encoding of color : type is "11 00 10 01";` yazıldıktan sonra `green` hangi koda karşılık gelir?', '{"blanks":2}', '{"blanks":[["10","\"10\""],["00","\"00\""]]}', 'Varsayılan kodlama sıraya göredir: red = 00, green = 01, blue = 10, white = 11. `enum_encoding` dizgisindeki kodlar da aynı sırayla değerlere verilir: red = 11, green = 00, blue = 10, white = 01.', 2, 'Hafta 3, Numaralandırılmış tip kodlama', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-pos-val', 'nitelikler', 3, 'fill', 'derived', '`type durum is (bekle, ileri, geri, dur);` için:

Boşluk 1: `durum''POS(geri)`, Boşluk 2: `durum''VAL(3)`', '{"blanks":2}', '{"blanks":[["2"],["dur"]]}', 'Konumlar 0''dan başlar: bekle = 0, ileri = 1, geri = 2, dur = 3. POS değerden konuma, VAL konumdan değere gider.', 2, 'Hafta 3, Numaralandırılmış tip öznitelikleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-generic-atama', 'nitelikler', 3, 'mcq', 'original', 'Bir GENERIC parametresine varsayılan değer hangi operatörle verilir?', '{"choices":["`<=`","`=>`","`:=`","`=`"]}', '{"index":2}', 'Örnek: `generic (n : integer := 8);`. Bileşen kullanılırken değer `generic map (n => 16)` ile değiştirilebilir.', 1, 'Hafta 3, GENERIC', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-generic-yer', 'nitelikler', 3, 'mcq', 'original', 'GENERIC bildirimi nerede yapılır?', '{"choices":["Architecture''ın `begin` satırından sonra","Entity içinde, PORT bildiriminden önce","Process''in bildirim bölümünde","Package body içinde"]}', '{"index":1}', 'GENERIC, entity''nin parametresidir ve `port (...)` listesinden önce yazılır. Böylece port genişlikleri generic''e bağlanabilir.', 2, 'Hafta 3, GENERIC', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-generic-genislik', 'nitelikler', 3, 'fill', 'derived', 'Aşağıdaki entity `generic map (N => 12)` ile kullanılıyor. x portu için `x''HIGH` kaçtır?

```vhdl
entity kaydirici is
  generic (N : integer := 8);
  port (x : in std_logic_vector(N-1 downto 0));
end kaydirici;
```', '{"blanks":1}', '{"blanks":[["11"]]}', 'N = 12 olduğunda port `std_logic_vector(11 downto 0)` olur. HIGH en büyük indekstir: 11. Varsayılan 8 sadece generic map verilmezse kullanılır.', 2, 'Hafta 3, GENERIC', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-overload', 'nitelikler', 3, 'tf', 'original', 'VHDL''de `+` gibi bir operatör yeni tip kombinasyonları için aşırı yüklenebilir. Bunun için adı tırnak içinde yazılmış bir fonksiyon tanımlanır: `function "+" (a : integer; b : bit) return integer`.', '{}', '{"value":true}', 'Sunumdaki örnek, INTEGER ile BIT toplamayı tanımlayan böyle bir fonksiyondur. Derleyici hangi `+`''nın çağrılacağını operand tiplerine bakarak seçer.', 3, 'Hafta 3, Operatör aşırı yükleme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h3-kullanici-nitelik', 'nitelikler', 3, 'mcq', 'original', '`attribute number_of_inputs : integer;` bildiriminden sonra, `nand3` sinyaline bu niteliği 3 olarak vermek için hangi yazım doğrudur?', '{"choices":["`attribute number_of_inputs of nand3 : signal is 3;`","`nand3''number_of_inputs := 3;`","`attribute nand3 of number_of_inputs : integer is 3;`","`signal nand3 : number_of_inputs := 3;`"]}', '{"index":0}', 'Belirtim sözdizimi `attribute nitelik_adi of hedef : sinif is deger;` şeklindedir. Değer daha sonra `nand3''number_of_inputs` ile okunur.', 3, 'Hafta 3, Kullanıcı tanımlı öznitelikler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-variable-yer', 'veri-nesneleri', 4, 'mcq', 'original', 'VHDL-93''te sıradan (shared olmayan) bir VARIABLE nerede bildirilir?', '{"choices":["Architecture''ın bildirim bölümünde","Entity''nin port listesinde","Process''in bildirim bölümünde","Bir package içinde"]}', '{"index":2}', 'Variable yereldir; sadece sıralı kodun içinde, process, function ya da procedure''ün bildirim bölümünde tanımlanır. Değerini process dışına taşımak için bir sinyale atanır.', 1, 'Hafta 4, VARIABLE', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-signal-guncelleme', 'veri-nesneleri', 4, 'tf', 'original', 'Bir process içinde sinyale `<=` ile yapılan atama, bir sonraki satırda o sinyal okunduğunda yeni değeri verir.', '{}', '{"value":false}', 'Sinyal atamaları process askıya alınınca (sonunda ya da bir `wait`''te) uygulanır. Process içinde sinyal okunduğunda hep eski değer görülür.', 1, 'Hafta 4, Signal ve variable farkı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-variable-guncelleme', 'veri-nesneleri', 4, 'tf', 'original', 'Bir variable''a `:=` ile yapılan atama hemen geçerli olur; bir sonraki satırda yeni değer okunur.', '{}', '{"value":true}', 'Variable''lar sıradan programlama dillerindeki değişkenler gibi anında güncellenir. Ara hesaplamalarda bu yüzden variable önerilir.', 1, 'Hafta 4, Signal ve variable farkı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-uc-atama', 'veri-nesneleri', 4, 'fill', 'derived', 'Simülasyon başında `t` = 0 ve `v` = 0''dır. Aşağıdaki iki process simülasyonun başında birer kez çalıştıktan sonra t ve v kaç olur?

```vhdl
signal t : integer := 0;
...
p1 : process (tetik)
begin
  t <= t + 1;
  t <= t + 1;
  t <= t + 1;
end process;

p2 : process (tetik)
  variable v : integer := 0;
begin
  v := v + 1;
  v := v + 1;
  v := v + 1;
  sonuc <= v;
end process;
```

Boşluk 1: t, Boşluk 2: v (sonuc)', '{"blanks":2}', '{"blanks":[["1"],["3"]]}', 'Üç sinyal atamasının üçü de t''nin eski değerini (0) okur ve hepsi aynı `t <= 1` ataması olur; son atama geçerlidir, t = 1. Variable ise her satırda güncellenir: 1, 2, 3.', 3, 'Hafta 4, Signal ve variable farkı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-birler-signal', 'veri-nesneleri', 4, 'mcq', 'original', 'Sunumdaki hatalı birler sayacında `temp` bir sinyaldir ve başta 0''dır:

```vhdl
PROCESS (din)
BEGIN
  temp <= 0;
  FOR i IN 0 TO 7 LOOP
    IF (din(i) = ''1'') THEN
      temp <= temp + 1;
    END IF;
  END LOOP;
  ones <= temp;
END PROCESS;
```

`din` "10110001" olduğunda process bir kez çalıştıktan hemen sonra `temp` kaç olur?', '{"choices":["4","1","0","8"]}', '{"index":1}', 'Döngüdeki her `temp <= temp + 1` temp''in eski değerini (0) okur, yani hepsi `temp <= 1` olur. Son yapılan atama geçerlidir: temp = 1, doğru cevap 4 olmasına rağmen. `ones` ise temp''in o anki eski değerini (0) alır. Çözüm temp''i variable yapmaktır.', 3, 'Hafta 4, SIGNAL vs VARIABLE (count_ones, not_ok)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-birler-variable', 'veri-nesneleri', 4, 'fill', 'original', '8 bitlik girişteki ''1'' sayısını variable ile sayan doğru bir devrede (Hafta 4_2) aşağıdaki girişler için çıkış kaç olur?

Boşluk 1: `"01011111"`, Boşluk 2: `"10100101"`', '{"blanks":2}', '{"blanks":[["6"],["4"]]}', 'Variable her adımda güncellendiği için döngü gerçekten sayar. `01011111` altı, `10100101` dört adet 1 içerir.', 2, 'Hafta 4, Hafta 4_2 (birler sayacı)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-nand-variable', 'veri-nesneleri', 4, 'fill', 'original', 'Hafta 4_1''deki process''te `in_giris` = "11001110" iken döngü bittiğinde `v_nand_sonuc` kaç olur?

```vhdl
v_nand_sonuc := in_giris(0);
for n_i in 1 to 7 loop
  v_nand_sonuc := not (v_nand_sonuc and in_giris(n_i));
end loop;
```', '{"blanks":1}', '{"blanks":[["1","''1''"]]}', 'Başlangıç in_giris(0) = 0. Adım adım: n=1 → 1, n=2 → 0, n=3 → 1, n=4 → 1, n=5 → 1, n=6 → 0, n=7 → 1. Sunumdaki tablonun son satırı da 1''dir.', 2, 'Hafta 4, Hafta 4_1 (NAND zinciri)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-nand-variable-2', 'veri-nesneleri', 4, 'fill', 'derived', 'Aynı process''te `in_giris` = "10110011" olursa döngü bittiğinde `v_nand_sonuc` kaç olur?', '{"blanks":1}', '{"blanks":[["0","''0''"]]}', 'Başlangıç in_giris(0) = 1. n=1: not(1·1) = 0; n=2: not(0·0) = 1; n=3: not(1·0) = 1; n=4: not(1·1) = 0; n=5: not(0·1) = 1; n=6: not(1·0) = 1; n=7: not(1·1) = 0.', 3, 'Hafta 4, Hafta 4_1 (NAND zinciri)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-nand-signal-sabit', 'veri-nesneleri', 4, 'tf', 'original', 'Hafta 4_1''de benzetim process içinde adım adım ilerletildiğinde `s_nand_sonuc` sinyalinin okunan değeri döngü boyunca değişmez.', '{}', '{"value":true}', 'Döngüdeki her `s_nand_sonuc <= ...` ataması sadece planlanır; process askıya alınana kadar sinyal eski değerinde kalır. Sunumdaki tabloda s_nand_sonuc sütununun hep aynı kalmasının nedeni budur.', 2, 'Hafta 4, Hafta 4_1 (NAND zinciri)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-variable-disarida', 'veri-nesneleri', 4, 'tf', 'original', 'Bir process içinde bildirilen variable, process dışındaki eşzamanlı bir atamada (ör. `out_cikis <= v_nand_sonuc;`) kullanılabilir.', '{}', '{"value":false}', 'Variable sadece bildirildiği process''in içinde görünür. Dışarı aktarmak için process içinde bir sinyale atanır, port da o sinyalden sürülür.', 2, 'Hafta 4, Hafta 4_1 (variable porta atanamaz)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-out-okuma-cozum', 'veri-nesneleri', 4, 'mcq', 'original', 'Bir çıkış portunun değeri mimari içinde de okunmak isteniyor (VHDL-93). Ders notlarında önerilen iyi uygulama hangisidir?', '{"choices":["Portun yönünü `in` olarak değiştirmek","İç bir sinyal kullanıp portu ondan sürmek","Portu çift yönlü `inout` yapmak","Port yerine process içinde variable kullanmak"]}', '{"index":1}', '`buffer` da çalışır, ama gerçekte tek yönlü olan bir çıkış için iç sinyal kullanmak daha temiz bir tasarım pratiğidir. `inout` çift yönlü veri yolları içindir.', 2, 'Hafta 4, SIGNAL vs VARIABLE (BUFFER notu)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-isim-gecerli', 'veri-nesneleri', 4, 'mcq', 'original', 'Aşağıdakilerden hangisi geçerli bir VHDL tanımlayıcısıdır?', '{"choices":["`_kelime`","`kelime__10`","`kelime_10`","`10kelime`"]}', '{"index":2}', 'Tanımlayıcı harfle başlamalı, alt çizgiyle bitmemeli ve arka arkaya iki alt çizgi içermemelidir. Ayrıca bir VHDL anahtar sözcüğü olamaz.', 1, 'Hafta 4, İsimlendirme kuralları', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-isim-gecersiz', 'veri-nesneleri', 4, 'mcq', 'derived', 'Aşağıdakilerden hangisi **geçersiz** bir tanımlayıcıdır?', '{"choices":["`Sayac2`","`s_ayac`","`SAYAC`","`sayac_`"]}', '{"index":3}', '`sayac_` alt çizgiyle bittiği için geçersizdir. VHDL büyük/küçük harf duyarsız olduğundan `SAYAC` ile `sayac` aynı isimdir ama ikisi de geçerlidir.', 2, 'Hafta 4, İsimlendirme kuralları', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-anahtar-sozcuk', 'veri-nesneleri', 4, 'tf', 'original', '`signal entity : bit;` geçerli bir sinyal bildirimidir.', '{}', '{"value":false}', '`entity` bir VHDL anahtar sözcüğüdür ve isim olarak kullanılamaz.', 1, 'Hafta 4, İsimlendirme kuralları', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-std-ulogic-deger', 'veri-tipleri', 4, 'fill', 'original', 'IEEE 1164''teki `std_ulogic` (ve `std_logic`) tipi kaç farklı değer alabilir?', '{"blanks":1}', '{"blanks":[["9"]]}', 'Değerler: ''U'', ''X'', ''0'', ''1'', ''Z'', ''W'', ''L'', ''H'', ''-''.', 1, 'Hafta 4, STD_ULOGIC', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-u-degeri', 'veri-tipleri', 4, 'mcq', 'original', 'Aşağıdaki `std_logic` değerlerinden hangisi donanımda karşılığı olmayan, sadece simülasyonda anlamlı bir değerdir?', '{"choices":["''0''","''1''","''Z''","''U''"]}', '{"index":3}', '''U'' (tanımlanmamış), simülasyonda henüz hiç değer atanmamış sinyali gösterir. ''Z'' ise üç durumlu çıkışlarla donanımda gerçeklenebilir.', 2, 'Hafta 4, STD_LOGIC değerleri tablosu', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-cozumleme', 'veri-tipleri', 4, 'fill', 'original', 'Bir `std_logic` sinyali iki kaynak tarafından aynı anda sürülüyor. Çözümleme tablosuna göre sonuç nedir?

Boşluk 1: ''0'' ile ''1'', Boşluk 2: ''Z'' ile ''1'', Boşluk 3: ''L'' ile ''H''', '{"blanks":3}', '{"blanks":[["X","''X''"],["1","''1''"],["W","''W''"]]}', 'Güçlü 0 ile güçlü 1 çakışırsa bilinmeyen (''X'') olur. ''Z'' (yüksek empedans) diğer sürücüye yol verir. Zayıf 0 ile zayıf 1 çakışırsa zayıf bilinmeyen (''W'') olur.', 2, 'Hafta 4, STD_LOGIC çözümleme tablosu', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-ulogic-coklu', 'veri-tipleri', 4, 'tf', 'original', '`std_ulogic` tipindeki bir sinyal iki ayrı eşzamanlı atamayla sürülürse hata alınır; `std_logic` ise çözümlenmiş (resolved) bir tip olduğu için buna izin verir.', '{}', '{"value":true}', '`std_logic`, `std_ulogic`''in çözümleme fonksiyonu eklenmiş alt tipidir. Çözümlenmemiş tiplerde birden fazla sürücü hatadır; bu, iki çıkışı yanlışlıkla birbirine bağlamayı yakalamaya yarar.', 3, 'Hafta 4, STD_ULOGIC', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-bit-toplama', 'veri-tipleri', 4, 'tf', 'original', 'BIT tipindeki iki sinyal doğrudan `+` ile toplanabilir.', '{}', '{"value":false}', 'BIT bir mantık tipidir; aritmetik işlemler onun için tanımlı değildir. Toplama için `integer`, `unsigned` ya da `signed` kullanılır.', 1, 'Hafta 4, VHDL skaler veri tipleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-to-indeks', 'veri-tipleri', 4, 'fill', 'original', '`signal w : bit_vector(0 to 7);` ve `w <= "01110001";` ataması yapılıyor.

Boşluk 1: `w(0)`, Boşluk 2: `w(7)`', '{"blanks":2}', '{"blanks":[["0","''0''"],["1","''1''"]]}', 'Dizgi değeri soldan sağa indeks sırasıyla yerleşir. `0 to 7` aralığında en soldaki bit w(0), en sağdaki w(7)''dir.', 2, 'Hafta 4, BIT_VECTOR (0 TO 7)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-hex-oktal', 'veri-tipleri', 4, 'mcq', 'original', '12 bitlik bir sinyale yapılan `kelime <= X"333";` ataması aşağıdakilerden hangisiyle aynıdır?', '{"choices":["`kelime <= O\"333\";`","`kelime <= O\"1463\";`","`kelime <= \"333\";`","`kelime <= B\"0011_0011\";`"]}', '{"index":1}', 'X"333" = 0011 0011 0011. Bunu üçerli gruplarsak 001 100 110 011 = O"1463". B"0011_0011" sadece 8 bittir.', 2, 'Hafta 4, Çoklu veri nesnesine değer atanması', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-sayi-tabani', 'veri-tipleri', 4, 'fill', 'original', 'Aşağıdaki değerlerin onluk karşılığı nedir?

Boşluk 1: `X"2F"`, Boşluk 2: `O"57"`', '{"blanks":2}', '{"blanks":[["47"],["47"]]}', 'X"2F" = 2·16 + 15 = 47. O"57" = 5·8 + 7 = 47. İkisi de ikilik olarak 101111''dir.', 2, 'Hafta 4, Sayı gösterimleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-alt-cizgi', 'veri-tipleri', 4, 'tf', 'derived', '`B"1010_0101"` ile `"10100101"` aynı değerdir; alt çizgi sadece okunabilirlik içindir.', '{}', '{"value":true}', 'Taban belirtilen bit dizgilerinde (B, O, X) alt çizgi okunabilirlik için kullanılabilir ve değeri etkilemez. Tabansız `"1010_0101"` yazımında ise alt çizgi kullanılamaz.', 2, 'Hafta 4, Sayı gösterimleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-signed-deger', 'veri-tipleri', 4, 'fill', 'original', '4 bitlik değerlerin onluk karşılığı nedir?

Boşluk 1: `signed("1010")`, Boşluk 2: `unsigned("1010")`, Boşluk 3: `signed("1101")`', '{"blanks":3}', '{"blanks":[["-6"],["10"],["-3"]]}', 'Signed değerler ikiye tümleyendir. 1010 → tersi 0101, +1 = 0110 = 6, yani -6. 1101 → tersi 0010, +1 = 0011 = 3, yani -3. Dikkat: sunumdaki bir slaytta "1101" için 3 yazıyor; doğrusu -3''tür.', 2, 'Hafta 4, SIGNED ve UNSIGNED', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-signed-karsilastirma', 'veri-tipleri', 4, 'mcq', 'original', 'Hafta 4_4''te `a1` ve `b1` `signed(3 downto 0)`, `a2` ve `b2` `unsigned(3 downto 0)` tipindedir. `a1 = a2 = "1010"` ve `b1 = b2 = "0101"` iken çıkışlar ne olur?

```vhdl
c <= (a1 > b1);
d <= (a2 > b2);
```', '{"choices":["c = true, d = true","c = false, d = true","c = true, d = false","c = false, d = false"]}', '{"index":1}', 'Aynı bitler farklı tiplerde farklı sayıdır. Signed: -6 > 5 yanlış, c = false. Unsigned: 10 > 5 doğru, d = true.', 2, 'Hafta 4, Hafta 4_4', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-unsigned-and', 'veri-tipleri', 4, 'tf', 'derived', '`ieee.numeric_std` paketi kullanıldığında iki `unsigned` sinyal arasında `and` işlemi yapılabilir.', '{}', '{"value":true}', '`numeric_std`, `signed` ve `unsigned` için mantıksal operatörleri de tanımlar. Sunumdaki "signed/unsigned ile AND yasal değil" örneği eski `std_logic_arith` paketi içindir. Ders `numeric_std` kullandığı için bu işlem geçerlidir.', 3, 'Hafta 4, Signed ve unsigned ile izin verilen işlemler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-slv-toplama', 'veri-tipleri', 4, 'mcq', 'original', '`a`, `b` ve `y` `std_logic_vector(7 downto 0)` tipinde ve `numeric_std` kullanılıyor. Hangi atama doğrudur?', '{"choices":["`y <= a + b;`","`y <= unsigned(a + b);`","`y <= std_logic_vector(unsigned(a) + unsigned(b));`","`y <= to_integer(a) + b;`"]}', '{"index":2}', 'Önce iki vektör `unsigned`''a dönüştürülür, toplanır, sonuç yeniden `std_logic_vector`''e çevrilir. `to_integer` `std_logic_vector` almaz, önce `unsigned(a)` gerekir.', 2, 'Hafta 4, Tip dönüşümleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-to-integer', 'veri-tipleri', 4, 'fill', 'original', '`d` `std_logic_vector(7 downto 0)`, `n` ise `integer` tipindedir. Boşlukları doldurun:

```vhdl
n <= ____(unsigned(d));
d <= std_logic_vector(to_unsigned(n, ____));
```', '{"blanks":2}', '{"blanks":[["to_integer"],["8","d''length"]]}', '`to_integer` `unsigned`/`signed` değeri tam sayıya çevirir. `to_unsigned` ise tam sayıyı verilen bit genişliğinde `unsigned`''a çevirir; genişlik hedefle aynı olmalıdır (8 ya da `d''length`).', 2, 'Hafta 4, Tip dönüşümleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-tek-bit-to-integer', 'veri-tipleri', 4, 'tf', 'original', 'Tek bitlik bir `std_logic` değer doğrudan `to_integer()` fonksiyonuna verilebilir.', '{}', '{"value":false}', '`to_integer` sadece `signed` ve `unsigned` alır. Tek biti önce 1 elemanlı bir vektöre çevirmek gerekir, Hafta 4_2''deki `unsigned''(bit & "")` hilesi bunun içindir.', 2, 'Hafta 4, Tip dönüşümleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-bit-vektor-hilesi', 'veri-tipleri', 4, 'mcq', 'original', 'Hafta 4_2''deki `artis := artis + to_integer(unsigned''(in_giris(n_i) & ""));` satırında `& ""` ne işe yarar?', '{"choices":["Bitin değerini tersler","Biti 1 elemanlı bir vektöre çevirir","Bitin değerini sıfırlar","Hiçbir etkisi yoktur, sözdizimi süsüdür"]}', '{"index":1}', '`unsigned` bir vektör tipidir, tek bir `std_logic` değeri doğrudan `unsigned` olamaz. Boş dizgiyle birleştirme 1 bitlik bir dizi üretir, `unsigned''(...)` onu niteler, `to_integer` de 0 ya da 1 döndürür.', 3, 'Hafta 4, Hafta 4_2', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-tip-uyumu', 'veri-tipleri', 4, 'mcq', 'original', 'Bildirimler:

```vhdl
SIGNAL a : BIT;
SIGNAL b : BIT_VECTOR(7 DOWNTO 0);
SIGNAL c : STD_LOGIC;
SIGNAL d : STD_LOGIC_VECTOR(7 DOWNTO 0);
SIGNAL e : INTEGER RANGE 0 TO 255;
```

Hangi atama geçerlidir?', '{"choices":["`a <= c;`","`b <= d;`","`c <= d(5);`","`e <= d;`"]}', '{"index":2}', '`d(5)` bir `STD_LOGIC` bittir ve c ile aynı tiptedir. Diğerlerinde tipler uyuşmaz: BIT ile STD_LOGIC, BIT_VECTOR ile STD_LOGIC_VECTOR, INTEGER ile STD_LOGIC_VECTOR. VHDL güçlü tiplidir, örtük dönüşüm yapmaz.', 2, 'Hafta 4, İzin verilen ve verilmeyen işlemler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-subtype-atama', 'veri-tipleri', 4, 'mcq', 'original', 'Bildirimler:

```vhdl
SUBTYPE my_logic IS STD_LOGIC RANGE ''0'' TO ''1'';
SIGNAL a : BIT;
SIGNAL b : STD_LOGIC;
SIGNAL c : my_logic;
```

Hangi atama geçerlidir?', '{"choices":["`b <= a;`","`a <= b;`","`b <= c;`","`a <= c;`"]}', '{"index":2}', 'Alt tip, temel tipiyle aynı tiptir; sadece değer aralığı kısıtlıdır. Bu yüzden `b <= c` geçerlidir. BIT ise STD_LOGIC''ten tamamen farklı bir tiptir.', 3, 'Hafta 4, SUBTYPE', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-subtype-aralik', 'veri-tipleri', 4, 'fill', 'original', '`SUBTYPE my_logic IS STD_LOGIC RANGE ''0'' TO ''Z'';` alt tipi kaç farklı değer içerir?', '{"blanks":1}', '{"blanks":[["3"]]}', '`std_ulogic` değerlerinin sırası ''U'', ''X'', ''0'', ''1'', ''Z'', ''W'', ''L'', ''H'', ''-'' şeklindedir. ''0'' ile ''Z'' arası: ''0'', ''1'', ''Z'', yani 3 değer.', 3, 'Hafta 4, SUBTYPE', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-integer-bit', 'veri-tipleri', 4, 'fill', 'original', 'Sentezde aşağıdaki aralıklar için kaç bit kullanılır?

Boşluk 1: `integer range -63 to 63`, Boşluk 2: `integer range 0 to 255`', '{"blanks":2}', '{"blanks":[["7"],["8"]]}', '-63..63 için 6 değer biti ve 1 işaret biti gerekir: 7 bit. 0..255 negatif değer içermediği için 8 bitlik işaretsiz sayıyla gösterilir. Aralık verilmezse integer 32 bit olarak sentezlenir.', 2, 'Hafta 4, INTEGER tipi', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-aralik-disi', 'veri-tipleri', 4, 'mcq', 'original', 'Hafta 4_6''da `in_giris_1 : in integer range 0 to 15` tanımlı. Davranışsal simülasyonda bu porta 20 değeri verilirse ne olur?', '{"choices":["Değer 4 bite kırpılır, 4 olur","Simülasyon \"aralık dışı\" hatasıyla durur","Değer sessizce 15''e sabitlenir","Hiçbir şey olmaz, 20 değeri kullanılır"]}', '{"index":1}', 'Simülatör aralık kısıtını çalışma sırasında denetler ve ihlalde hata verip durur. Sentezlenmiş devrede ise denetim yoktur; sentez sonrası simülasyonda değer sadece bitlerin taşıyabildiği kadarıyla görünür.', 2, 'Hafta 4, Hafta 4_6', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-carpim-aralik', 'veri-tipleri', 4, 'fill', 'derived', '`in_giris_1 : integer range 0 to 15` ve `in_giris_2 : integer range 0 to 31` için `out_cikis_1 <= in_giris_1 * in_giris_2;` yazılıyor. Simülasyonun hiçbir girişte aralık hatası vermemesi için `out_cikis_1`''in aralığının üst sınırı **en az** kaç olmalıdır?', '{"blanks":1}', '{"blanks":[["465"]]}', 'En büyük çarpım 15 · 31 = 465''tir. Sunumdaki `range 0 to 511` bu yüzden yeterlidir (9 bit). Örneğin `0 to 255` olsaydı büyük girişlerde simülasyon hata verirdi.', 3, 'Hafta 4, Hafta 4_6', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-dizi-atama', 'veri-tipleri', 4, 'mcq', 'original', 'Bildirimler:

```vhdl
TYPE row    IS ARRAY (7 DOWNTO 0) OF STD_LOGIC;
TYPE array1 IS ARRAY (0 TO 3) OF row;
TYPE array2 IS ARRAY (0 TO 3) OF STD_LOGIC_VECTOR(7 DOWNTO 0);
TYPE array3 IS ARRAY (0 TO 3, 7 DOWNTO 0) OF STD_LOGIC;
SIGNAL x : row;
SIGNAL y : array1;
SIGNAL v : array2;
SIGNAL w : array3;
```

Hangi atama geçerlidir?', '{"choices":["`x <= v(1);`","`x <= w(2);`","`x <= y(0);`","`y(1) <= v(3);`"]}', '{"index":2}', '`y(0)` `row` tipindedir ve x de `row`''dur. `v(1)` `std_logic_vector`''dür; yapısı aynı olsa da `row`''dan farklı bir tiptir. w 2 boyutlu olduğu için `w(2)` gibi tek indeksle bir satır alınamaz.', 3, 'Hafta 4, ARRAYS (uygun ve uygun olmayan atamalar)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-2d-erisim', 'veri-tipleri', 4, 'mcq', 'original', '`TYPE array3 IS ARRAY (0 TO 3, 7 DOWNTO 0) OF STD_LOGIC;` tipindeki w sinyalinin 2. satır 1. sütundaki elemanına nasıl erişilir?', '{"choices":["`w(2)(1)`","`w(2, 1)`","`w[2][1]`","`w(2).1`"]}', '{"index":1}', 'Gerçek 2 boyutlu dizide tek parantez ve virgül kullanılır: `w(2, 1)`. `y(1)(2)` biçimi ise dizinin dizisi (1Dx1D) içindir.', 2, 'Hafta 4, ARRAYS (2D dizi)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-bellek-tipi', 'veri-tipleri', 4, 'fill', 'derived', 'Her biri 8 bitlik 16 kelimelik bir bellek tipi tanımlamak için boşluğu doldurun:

```vhdl
type bellek is array (0 to 15) of ____;
```', '{"blanks":1}', '{"blanks":[["std_logic_vector(7 downto 0)","std_logic_vector(0 to 7)"]]}', 'Önceden tanımlı 1Dx1D dizi tipi yoktur; önce böyle bir tip tanımlanır, sonra `signal ram : bellek;` ile kullanılır. Bir kelimeye `ram(3)`, bir bite `ram(3)(7)` ile erişilir.', 2, 'Hafta 4, ARRAYS', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-port-dizisi', 'veri-tipleri', 4, 'mcq', 'original', 'Bir entity portunun vektör dizisi (örneğin 4 adet 8 bitlik vektör) olması isteniyor. Bu dizi tipi nerede tanımlanmalıdır?', '{"choices":["Entity''nin içinde, port listesinden önce","Bir PACKAGE içinde, sonra USE ile","Architecture''ın bildirim bölümünde","Process içinde"]}', '{"index":1}', 'Port listesi architecture''dan önce okunur, bu yüzden tip ondan önce görünür olmalıdır. Kullanıcı tipleri bir package''ta tanımlanıp `use work.paket_adi.all;` ile tasarıma açılır.', 2, 'Hafta 4, PORT ARRAYS', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-shift-and-add', 'veri-tipleri', 4, 'fill', 'original', 'Hafta 4_7''deki `shift_and_add` devresinde `SHIFT_AMOUNT = 2` ve `NEGATIVE_VAL = -5` alınıyor. Giriş önce 2 bit sağa kaydırılıyor (boşalan yerlere 0), sonra -5 ile işaretli olarak toplanıyor. Çıkışlar 16 bitlik onaltılık olarak nedir?

Boşluk 1: `input_data = X"0050"`, Boşluk 2: `input_data = X"0004"`', '{"blanks":2}', '{"blanks":[["000F","x\"000f\""],["FFFC","x\"fffc\""]]}', 'X"0050" = 80 → sağa 2 bit = 20 → 20 - 5 = 15 = X"000F". X"0004" = 4 → 1 → 1 - 5 = -4; 16 bitlik ikiye tümleyende -4 = X"FFFC".', 3, 'Hafta 4, Hafta 4_7 (shift_and_add)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-hafta4-3-d', 'veri-tipleri', 4, 'fill', 'original', 'Hafta4_3 devresi:

```vhdl
F <= B(0) and A;
G <= B(1) or F;
D <= C(2) & G & C(0);
```

Tablodaki şu satırlar için D (3 bit) nedir?

Boşluk 1: A = 1, B = "10", C = "010"

Boşluk 2: A = 1, B = "00", C = "011"', '{"blanks":2}', '{"blanks":[["010","\"010\""],["001","\"001\""]]}', '1. satır: F = 0 and 1 = 0, G = 1 or 0 = 1, D = C(2) & G & C(0) = 0 & 1 & 0 = 010. 2. satır: F = 0, G = 0 or 0 = 0, D = 0 & 0 & 1 = 001.', 2, 'Hafta 4, Hafta4_3', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-multiple-driven', 'veri-tipleri', 4, 'mcq', 'original', 'Hafta4_3''te E `bit_vector(2 downto 0)` tipinde bir çıkıştır ve şu iki eşzamanlı atama yapılmıştır:

```vhdl
E <= not H;
E(2) <= ''0'';
```

Araç "E is multiple driven" hatası verir. Neden?', '{"choices":["`not` operatörü `bit_vector` için tanımlı değildir","E(2) iki ayrı atamayla sürülüyor, BIT çözümlenmez","H sinyaline başlangıç değeri verilmemiştir","Çıkış portuna sabit değer atanamaz"]}', '{"index":1}', 'Her eşzamanlı atama ayrı bir sürücüdür. İlk atama E''nin tüm bitlerini, ikincisi E(2)''yi sürer, yani E(2)''nin iki sürücüsü olur. Doğru çözüm tek atamada birleştirmektir: `E <= ''0'' & not H(1 downto 0);`', 3, 'Hafta4_3 (E is multiple driven)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h4-hafta4-3-e', 'veri-tipleri', 4, 'fill', 'derived', '"E''nin MSB''sini 1 yapın" isteği tek bir atamayla şöyle yazılıyor. `H = "101"` iken E nedir?

```vhdl
E <= ''1'' & not H(1 downto 0);
```', '{"blanks":1}', '{"blanks":[["110","\"110\""]]}', 'H(1 downto 0) = 01, tersi 10. Başına ''1'' eklenince E = 110 olur. Tek atama olduğu için çoklu sürücü hatası da yoktur.', 2, 'Hafta4_3', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-with-select-mux', 'esz-atamalar', 5, 'fill', 'original', 'Hafta 5_1''deki 4''e 1 multiplexer:

```vhdl
with S select
  O <= IN_1 when "00",
       IN_2 when "01",
       IN_3 when "10",
       IN_4 when others;
```

`IN_1 = "0001"`, `IN_2 = "0010"`, `IN_3 = "0100"`, `IN_4 = "1000"` ve `S = "10"` iken O nedir?', '{"blanks":1}', '{"blanks":[["0100","\"0100\""]]}', 'S = "10" seçeneği IN_3''ü seçer.', 1, 'Hafta 5, Hafta 5_1 (with/select ile mux)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-when-else-latch', 'esz-atamalar', 5, 'mcq', 'original', 'Hafta 5_2''deki çözümde son satır koşullu bırakılmış:

```vhdl
O <= IN_1 when S = "00" else
     IN_2 when S = "01" else
     IN_3 when S = "10" else
     IN_4 when S = "11";
```

Bu yazımla ilgili hangisi doğrudur?', '{"choices":["Kod derlenmez, `when` ile bitemez","S tanımsızken (ör. \"X1\") O eski değerini korur, kilitleme oluşur","S = \"11\" iken O, IN_1''i alır","with/select ile tamamen aynı devreyi üretir, hiçbir fark yoktur"]}', '{"index":1}', 'VHDL-93 son koşullu dalı kabul eder, kod derlenir. Son satırı koşulsuz `else IN_4` yapmak daha doğrudur. Ama hiçbir koşul doğru olmadığında atama yapılmaz ve sinyal değerini saklar. Bu, kombinasyonel bir mux''ta istenmeyen bir bellek davranışıdır. Benzetimde S başlangıçta "UU" iken O de ''U'' olarak kalır.', 3, 'Hafta 5, Hafta 5_2 (when/else ile mux)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-oncelikli-mux-or', 'esz-atamalar', 5, 'mcq', 'original', 'Sunumdaki `priority_mux` örneği:

```vhdl
output <= i3 when i3 = ''1'' else
          i2 when i2 = ''1'' else
          i1 when i1 = ''1'' else
          i0 when i0 = ''1'' else
          ''0'';
```

Girişler sadece ''0'' ya da ''1'' aldığında bu devre aslında hangi kapıya eşdeğerdir?', '{"choices":["4 girişli AND","4 girişli OR","4 girişli XOR","i3''ü seçen bir tampon"]}', '{"index":1}', 'Her dal, seçtiği giriş ''1'' iken o girişi yani ''1''i verir. Hiçbiri ''1'' değilse ''0'' verilir. Sonuç, girişlerden en az biri ''1'' ise ''1'' olur, yani bir OR kapısıdır. Öncelik yapısını gerçekten kullanmak için seçim sinyalleri ile veri girişleri ayrı olmalıdır (sonraki soru).', 3, 'Hafta 5, priority_mux örneği', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-oncelikli-secim', 'esz-atamalar', 5, 'fill', 'derived', 'Öncelikli seçici:

```vhdl
y <= d3 when s(3) = ''1'' else
     d2 when s(2) = ''1'' else
     d1 when s(1) = ''1'' else
     d0;
```

`s = "0110"`, `d3 = "11"`, `d2 = "10"`, `d1 = "01"`, `d0 = "00"` iken y nedir?', '{"blanks":1}', '{"blanks":[["10","\"10\""]]}', 'Koşullar yukarıdan aşağı denetlenir. s(3) = 0 olduğu için ilk dal atlanır; s(2) = 1 olduğu için d2 seçilir. s(1)''in de 1 olması önemli değildir, çünkü daha yüksek öncelikli koşul önce sağlandı.', 2, 'Hafta 5, when/else önceliği', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-with-others-zorunlu', 'esz-atamalar', 5, 'tf', 'original', 'Seçicisi `std_logic_vector(1 downto 0)` olan bir `with ... select` ifadesinde "00", "01", "10" ve "11" yazılıp `when others` yazılmazsa kod derlenmez.', '{}', '{"value":true}', 'with/select bütün olası değerleri kapsamalıdır. `std_logic` 9 değerli olduğu için 2 bitlik bir vektörün 81 olası değeri vardır; dört ikilik değer yetmez. Bu yüzden `when others` gerekir.', 2, 'Hafta 5, with/select (when others)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-select-oncelik', 'esz-atamalar', 5, 'mcq', 'original', 'with/select ile when/else arasındaki fark için hangisi doğrudur?', '{"choices":["with/select''te seçeneklerin sırası önemlidir, when/else''te önemli değildir","with/select''te sıra önemsizdir; when/else''te koşullar yukarıdan aşağı öncelikle denetlenir","İkisinde de sadece tek bir sinyal sorgulanabilir","when/else sadece process içinde kullanılabilir"]}', '{"index":1}', 'with/select tek bir ifadenin değerine göre seçer, seçenekler birbirini dışlar (sentezde genelde case tabanlı mux). when/else''te ilk doğru koşul kazanır ve her koşul farklı sinyalleri sorgulayabilir (öncelikli yapı).', 2, 'Hafta 5, with/select ve when/else', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-select-tekrar', 'esz-atamalar', 5, 'tf', 'derived', 'Bir with/select ifadesinde aynı seçim değeri iki kez yazılırsa ilk yazılan geçerli olur.', '{}', '{"value":false}', 'with/select''te seçenekler birbirini dışlamak zorundadır; aynı değerin iki kez yazılması derleme hatasıdır. "İlk eşleşen kazanır" mantığı when/else''e aittir.', 3, 'Hafta 5, with/select', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-others-hepsi', 'esz-atamalar', 5, 'fill', 'original', '`signal sinyal_2 : std_logic_vector(3 downto 0);` için `sinyal_2 <= (others => ''1'');` sonrası sinyal_2 nedir?', '{"blanks":1}', '{"blanks":[["1111","\"1111\""]]}', '`others` belirtilmeyen tüm elemanları kapsar. Vektörün genişliğinden bağımsız olduğu için sıfırlama ve doldurmada çok kullanılır.', 1, 'Hafta 5, others kullanarak sinyal değeri atama', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-others-karisik', 'esz-atamalar', 5, 'fill', 'derived', '`signal x : std_logic_vector(7 downto 0);` için `x <= (7 => ''1'', 0 => ''1'', others => ''0'');` sonrası x nedir?', '{"blanks":1}', '{"blanks":[["10000001","\"10000001\""]]}', '7 ve 0 indeksli bitler 1, geri kalanlar 0 olur. `7 downto 0` aralığında 7 en soldadır.', 2, 'Hafta 5, others kullanarak sinyal değeri atama', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-kosullu-z', 'esz-atamalar', 5, 'fill', 'original', 'Sunumdaki şartlı atama:

```vhdl
sinyal_cikis <= sinyal_1 when sinyal_secme = ''0''
           else sinyal_2 when sinyal_secme = ''1''
           else ''0'';
```

`sinyal_1 = ''1''`, `sinyal_2 = ''1''` ve `sinyal_secme = ''Z''` iken sinyal_cikis nedir?', '{"blanks":1}', '{"blanks":[["0","''0''"]]}', '''Z'' ne ''0'' ne de ''1''''e eşittir, bu yüzden iki koşul da yanlıştır ve son `else` dalı ''0'' verir.', 2, 'Hafta 5, Şartlı sinyal atamaları', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-secilmis-x', 'esz-atamalar', 5, 'fill', 'derived', 'Sunumdaki seçilmiş atama:

```vhdl
with sinyal_secme select
  sinyal_sonuc <= sinyal_1 when ''0'',
                  sinyal_2 when others;
```

`sinyal_1 = ''1''`, `sinyal_2 = ''0''` ve `sinyal_secme = ''X''` iken sinyal_sonuc nedir?', '{"blanks":1}', '{"blanks":[["0","''0''"]]}', '''X'' değeri ''0'' seçeneğine uymaz, `others` dalına düşer ve sinyal_2 = ''0'' seçilir.', 2, 'Hafta 5, Seçilmiş sinyal atama', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-process-tetik', 'sirali-kod', 5, 'tf', 'original', 'Hassasiyet listesi olan bir process, listedeki sinyallerden biri değiştiğinde çalışır.', '{}', '{"value":true}', 'Process tetiklenince baştan sona çalışır ve sonra listedeki bir sinyal yeniden değişene kadar bekler.', 1, 'Hafta 5, Sıralı söz dizimleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-eksik-hassasiyet', 'sirali-kod', 5, 'fill', 'derived', 'Aşağıdaki process''in hassasiyet listesinde sadece `c` var:

```vhdl
process (c)
begin
  y <= (a and b) or c;
end process;
```

Girişler 10 ns arayla şu sırayla veriliyor (a, b, c):

```
1. adım: 0 1 1
2. adım: 1 0 0
3. adım: 1 1 0
4. adım: 0 1 0
5. adım: 1 0 1
```

Boşluk 1: 3. adımda y kaçtır?

Boşluk 2: Hassasiyet listesi `(a, b, c)` olsaydı 3. adımda y kaç olurdu?', '{"blanks":2}', '{"blanks":[["0","''0''"],["1","''1''"]]}', '2. adımda c 1''den 0''a değişir, process çalışır ve y = 0 olur. 3. adımda a ve b değişir ama c değişmez, process çalışmaz ve y 0''da kalır. Tam listeyle (1 and 1) or 0 = 1 olurdu. Sentez araçları hassasiyet listesini genelde yok sayıp kombinasyonel devre kurduğu için bu, simülasyon ile donanımın farklı davranmasına yol açar.', 3, 'Hafta 5, Hafta 5_3 (hassasiyet listesi sadece in_giris_3)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-if-oncelik', 'sirali-kod', 5, 'mcq', 'derived', '`a = ''1''` ve `b = ''1''` iken aşağıdaki process sonunda y ne olur?

```vhdl
process (a, b)
begin
  if a = ''1'' then
    y <= "01";
  elsif b = ''1'' then
    y <= "10";
  else
    y <= "00";
  end if;
end process;
```', '{"choices":["`\"01\"`","`\"10\"`","`\"11\"`","`\"00\"`"]}', '{"index":0}', 'if/elsif zincirinde ilk doğru koşulun dalı çalışır, diğerlerine bakılmaz. a = ''1'' olduğu için y = "01".', 2, 'Hafta 5, If söz dizimi', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-case-others', 'sirali-kod', 5, 'tf', 'original', '`std_logic_vector(1 downto 0)` üzerinde bir `case` ifadesinde "00", "01", "10" ve "11" seçenekleri yazıldıysa `when others` gerekmez.', '{}', '{"value":false}', 'case de with/select gibi tüm olası değerleri kapsamalıdır. `std_logic`''in ''U'', ''X'', ''Z'' gibi değerleri yüzünden `when others` zorunludur.', 2, 'Hafta 5, Case söz dizimi', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-case-sinyal', 'sirali-kod', 5, 'tf', 'derived', '`case` ifadesinde `when` seçeneği olarak bir sinyal kullanılabilir (ör. `when b =>`).', '{}', '{"value":false}', 'case seçenekleri sabit (yerel statik) değerler olmalıdır: `when "01" =>`, `when 3 =>`, bir `constant` ya da `when others =>`. Değişken bir değerle karşılaştırma gerekiyorsa if/elsif kullanılır.', 2, 'Hafta 5, Case söz dizimi', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-for-sayi', 'sirali-kod', 5, 'fill', 'original', '`for i in 7 downto 0 loop` döngüsü kaç kez çalışır?', '{"blanks":1}', '{"blanks":[["8"]]}', '7, 6, 5, 4, 3, 2, 1, 0: sekiz tur. Döngü değişkeni i ayrıca bildirilmez ve döngü içinde değiştirilemez.', 1, 'Hafta 5, Loop söz dizimi', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-arama-modulu', 'sirali-kod', 5, 'fill', 'original', 'Arama modülü için yazılmış bir çözüm:

```vhdl
process (input16, input4)
  variable idx : integer;
begin
  idx := 0;
  for i in 15 downto 3 loop
    if input16(i downto i-3) = input4 then
      idx := i;
      exit;
    end if;
  end loop;
  konum <= idx;
end process;
```

`input16 = X"1A5A"` (0001 1010 0101 1010) iken konum kaç olur?

Boşluk 1: `input4 = "1010"`, Boşluk 2: `input4 = "1111"`', '{"blanks":2}', '{"blanks":[["11"],["0"]]}', 'Arama MSB tarafından başlar. i=15: 0001, i=14: 0011, i=13: 0110, i=12: 1101, i=11: 1010 eşleşir ve `exit` döngüden çıkar, konum = 11. "1111" hiçbir 4 bitlik pencerede yoktur, idx başlangıç değeri 0 kalır.', 3, 'Hafta 5, VHDL arama modülü tasarımı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-for-statik', 'sirali-kod', 5, 'tf', 'derived', 'Sentezlenebilir bir `for` döngüsünün aralığı derleme zamanında bilinen sabit değerler olmalıdır.', '{}', '{"value":true}', 'Sentez aracı döngüyü açarak (her tur için ayrı donanım) devre kurar. Bu yüzden tur sayısı sabit olmalıdır. Aralığı bir giriş sinyaline bağlı döngüler sentezlenemez.', 2, 'Hafta 5, Loop söz dizimi', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-variable-yeri', 'sirali-kod', 5, 'mcq', 'original', 'Bir process içinde kullanılacak variable nerede tanımlanır?', '{"choices":["Process''in `begin` satırından sonra","`process (...)` satırı ile `begin` arasında","Architecture''ın `begin` satırından sonra","Entity''nin port listesinde"]}', '{"index":1}', 'Process''in bildirim bölümü `process (...)` ile `begin` arasıdır; variable, constant ve process''e özel tipler burada tanımlanır.', 1, 'Hafta 5, Sıralı söz dizimleri (process yapısı)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h5-wait-liste', 'sirali-kod', 5, 'tf', 'derived', 'Hassasiyet listesi olan bir process içinde `wait` ifadesi de kullanılabilir.', '{}', '{"value":false}', 'Bir process ya hassasiyet listesiyle ya da `wait` ifadeleriyle askıya alınır, ikisi birlikte kullanılamaz. Testbench''lerdeki listesiz process''ler bu yüzden `wait for 10 ns;` gibi satırlar içerir.', 3, 'Hafta 5, Sıralı söz dizimleri (wait)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('k-yarim-toplayici', 'vhdl-temel', 3, 'code', 'derived', 'İki bitlik bir **yarım toplayıcı** yaz: `s` toplam (a XOR b), `c` elde (a AND b) çıkışıdır.

Şablondaki entity''yi değiştirme; yalnızca mimariyi yaz. **Sına** dediğinde tasarımın tarayıcında, her seferinde rastgele seçilen girişlerle gizli bir testbench''e karşı çalıştırılır.', '{"kod":{"varlik":"half_adder","portlar":[{"ad":"a","yon":"in","genislik":0},{"ad":"b","yon":"in","genislik":0},{"ad":"s","yon":"out","genislik":0},{"ad":"c","yon":"out","genislik":0}],"sablon":"library ieee;\nuse ieee.std_logic_1164.all;\nuse ieee.numeric_std.all;\n\nentity half_adder is\n  port (\n    a : in  std_logic;\n    b : in  std_logic;\n    s : out std_logic;\n    c : out std_logic\n  );\nend half_adder;\n\narchitecture rtl of half_adder is\nbegin\n  -- Çözümünü buraya yaz\nend rtl;\n"}}', '{"model":"k-yarim-toplayici"}', 'Yarım toplayıcı iki eşzamanlı atamadır: `s <= a xor b;` ve `c <= a and b;`. Eşzamanlı atamaların sırası önemli değildir.', 1, 'Hafta 3, entity ve architecture', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('k-tam-toplayici', 'vhdl-temel', 3, 'code', 'derived', 'Bir **tam toplayıcı** yaz: `a + b + cin` toplamının düşük biti `s`, yüksek biti `cout` olsun.

Şablondaki entity''yi değiştirme; yalnızca mimariyi yaz. **Sına** dediğinde tasarımın tarayıcında, her seferinde rastgele seçilen girişlerle gizli bir testbench''e karşı çalıştırılır.', '{"kod":{"varlik":"full_adder","portlar":[{"ad":"a","yon":"in","genislik":0},{"ad":"b","yon":"in","genislik":0},{"ad":"cin","yon":"in","genislik":0},{"ad":"s","yon":"out","genislik":0},{"ad":"cout","yon":"out","genislik":0}],"sablon":"library ieee;\nuse ieee.std_logic_1164.all;\nuse ieee.numeric_std.all;\n\nentity full_adder is\n  port (\n    a    : in  std_logic;\n    b    : in  std_logic;\n    cin  : in  std_logic;\n    s    : out std_logic;\n    cout : out std_logic\n  );\nend full_adder;\n\narchitecture rtl of full_adder is\nbegin\n  -- Çözümünü buraya yaz\nend rtl;\n"}}', '{"model":"k-tam-toplayici"}', '`s <= a xor b xor cin;` ve `cout <= (a and b) or (cin and (a xor b));`. Elde, girişlerden en az ikisi 1 olduğunda 1 olur; `(a and b) or (a and cin) or (b and cin)` de aynı sonucu verir.', 1, 'Hafta 3, entity ve architecture', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('k-karsilastirici', 'operatorler', 3, 'code', 'derived', '4 bitlik **işaretsiz karşılaştırıcı** yaz. `a = b` ise `eq`, `a > b` ise `gt`, `a < b` ise `lt` ''1'' olsun; diğerleri ''0''.

İpucu: `numeric_std` ile `unsigned(a)` biçiminde dönüştürüp karşılaştırabilirsin.

Şablondaki entity''yi değiştirme; yalnızca mimariyi yaz. **Sına** dediğinde tasarımın tarayıcında, her seferinde rastgele seçilen girişlerle gizli bir testbench''e karşı çalıştırılır.', '{"kod":{"varlik":"cmp4","portlar":[{"ad":"a","yon":"in","genislik":4},{"ad":"b","yon":"in","genislik":4},{"ad":"eq","yon":"out","genislik":0},{"ad":"gt","yon":"out","genislik":0},{"ad":"lt","yon":"out","genislik":0}],"sablon":"library ieee;\nuse ieee.std_logic_1164.all;\nuse ieee.numeric_std.all;\n\nentity cmp4 is\n  port (\n    a  : in  std_logic_vector(3 downto 0);\n    b  : in  std_logic_vector(3 downto 0);\n    eq : out std_logic;\n    gt : out std_logic;\n    lt : out std_logic\n  );\nend cmp4;\n\narchitecture rtl of cmp4 is\nbegin\n  -- Çözümünü buraya yaz\nend rtl;\n"}}', '{"model":"k-karsilastirici"}', '`std_logic_vector` için `<` ve `>` işaretsiz sayı karşılaştırması yapmaz; `unsigned(a) < unsigned(b)` yazmak gerekir. Çıkışlar `''1'' when ... else ''0''` biçimiyle atanabilir.', 2, 'Hafta 3, ilişkisel operatörler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('k-mux4', 'esz-atamalar', 5, 'code', 'derived', '`with ... select` kullanarak 4''e 1 **multiplexer** yaz: `sel = "00"` iken `y = d(0)`, `"01"` iken `d(1)`, `"10"` iken `d(2)`, `"11"` iken `d(3)`.

Şablondaki entity''yi değiştirme; yalnızca mimariyi yaz. **Sına** dediğinde tasarımın tarayıcında, her seferinde rastgele seçilen girişlerle gizli bir testbench''e karşı çalıştırılır.', '{"kod":{"varlik":"mux4","portlar":[{"ad":"d","yon":"in","genislik":4},{"ad":"sel","yon":"in","genislik":2},{"ad":"y","yon":"out","genislik":0}],"sablon":"library ieee;\nuse ieee.std_logic_1164.all;\nuse ieee.numeric_std.all;\n\nentity mux4 is\n  port (\n    d   : in  std_logic_vector(3 downto 0);\n    sel : in  std_logic_vector(1 downto 0);\n    y   : out std_logic\n  );\nend mux4;\n\narchitecture rtl of mux4 is\nbegin\n  -- Çözümünü buraya yaz\nend rtl;\n"}}', '{"model":"k-mux4"}', '`with sel select y <= d(0) when "00", d(1) when "01", d(2) when "10", d(3) when others;` Son seçeneği `others` yapmak, std_logic''in ''0'' ve ''1'' dışındaki değerlerini de kapsar.', 1, 'Hafta 5, with/select', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('k-oncelik', 'esz-atamalar', 5, 'code', 'derived', '4 girişli bir **öncelik kodlayıcı** yaz. `r(3)` en yüksek önceliklidir: ''1'' olan en yüksek bitin numarası `y`''ye yazılsın (ör. `r = "0110"` ise `y = "10"`) ve `v = ''1''` olsun. Hiçbir bit ''1'' değilse `y = "00"`, `v = ''0''`.

Şablondaki entity''yi değiştirme; yalnızca mimariyi yaz. **Sına** dediğinde tasarımın tarayıcında, her seferinde rastgele seçilen girişlerle gizli bir testbench''e karşı çalıştırılır.', '{"kod":{"varlik":"prio4","portlar":[{"ad":"r","yon":"in","genislik":4},{"ad":"y","yon":"out","genislik":2},{"ad":"v","yon":"out","genislik":0}],"sablon":"library ieee;\nuse ieee.std_logic_1164.all;\nuse ieee.numeric_std.all;\n\nentity prio4 is\n  port (\n    r : in  std_logic_vector(3 downto 0);\n    y : out std_logic_vector(1 downto 0);\n    v : out std_logic\n  );\nend prio4;\n\narchitecture rtl of prio4 is\nbegin\n  -- Çözümünü buraya yaz\nend rtl;\n"}}', '{"model":"k-oncelik"}', '`when/else` koşulları sırayla denendiği için öncelik doğal olarak ifade edilir: `y <= "11" when r(3) = ''1'' else "10" when r(2) = ''1'' else ...` ve `v <= ''0'' when r = "0000" else ''1'';`', 2, 'Hafta 5, when/else', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('k-birler', 'sirali-kod', 5, 'code', 'derived', '8 bitlik `x` girişindeki **''1'' bitlerinin sayısını** `n` çıkışına yaz (ör. `x = "10110001"` ise `n = "0100"`). Bir process içinde `for` döngüsü ve değişken (variable) kullan.

Şablondaki entity''yi değiştirme; yalnızca mimariyi yaz. **Sına** dediğinde tasarımın tarayıcında, her seferinde rastgele seçilen girişlerle gizli bir testbench''e karşı çalıştırılır.', '{"kod":{"varlik":"ones8","portlar":[{"ad":"x","yon":"in","genislik":8},{"ad":"n","yon":"out","genislik":4}],"sablon":"library ieee;\nuse ieee.std_logic_1164.all;\nuse ieee.numeric_std.all;\n\nentity ones8 is\n  port (\n    x : in  std_logic_vector(7 downto 0);\n    n : out std_logic_vector(3 downto 0)\n  );\nend ones8;\n\narchitecture rtl of ones8 is\nbegin\n  -- Çözümünü buraya yaz\nend rtl;\n"}}', '{"model":"k-birler"}', 'Sayaç bir `variable` olmalı: sinyal kullanılsaydı process içindeki ara atamalar hemen görünmezdi. Process''in duyarlılık listesinde `x` bulunmalı; sonuç döngüden sonra `n <= std_logic_vector(to_unsigned(say, 4));` ile atanır.', 2, 'Hafta 5, process ve for loop', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('k-sayac', 'sirali-kod', 5, 'code', 'derived', '4 bitlik bir **yukarı sayıcı** yaz. Her yükselen saat kenarında:

- `rst = ''1''` ise `q` sıfırlanır (eşzamanlı reset),
- değilse `en = ''1''` iken `q` bir artar (15''ten sonra 0''a döner),
- `en = ''0''` iken `q` değişmez.

Şablondaki entity''yi değiştirme; yalnızca mimariyi yaz. **Sına** dediğinde tasarımın tarayıcında, her seferinde rastgele seçilen girişlerle gizli bir testbench''e karşı çalıştırılır.', '{"kod":{"varlik":"cnt4","portlar":[{"ad":"clk","yon":"in","genislik":0},{"ad":"rst","yon":"in","genislik":0},{"ad":"en","yon":"in","genislik":0},{"ad":"q","yon":"out","genislik":4}],"saat":"clk","sablon":"library ieee;\nuse ieee.std_logic_1164.all;\nuse ieee.numeric_std.all;\n\nentity cnt4 is\n  port (\n    clk : in  std_logic;\n    rst : in  std_logic;\n    en  : in  std_logic;\n    q   : out std_logic_vector(3 downto 0)\n  );\nend cnt4;\n\narchitecture rtl of cnt4 is\nbegin\n  -- Çözümünü buraya yaz\nend rtl;\n"}}', '{"model":"k-sayac"}', 'Çıkış portu okunamadığı için (VHDL-93''te `out` port okunmaz) sayım iç bir `unsigned(3 downto 0)` sinyalinde tutulur ve `q <= std_logic_vector(sayi);` ile dışarı verilir. `unsigned` toplama 4 bitte taşar, böylece 15 + 1 = 0 olur.', 2, 'Hafta 5, process ve rising_edge', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('k-kenar', 'sirali-kod', 5, 'code', 'derived', 'Bir **yükselen kenar dedektörü** yaz. Her yükselen saat kenarında `d` örneklenir; `d` bu kenarda ''1'' ve bir önceki kenarda ''0'' ise `p` bir saat çevrimi boyunca ''1'' olur, aksi halde ''0''. `p` bir yazmaç çıkışı olmalı (değeri yalnızca saat kenarında değişir).

`rst = ''1''` iken (eşzamanlı) `p = ''0''` olur ve önceki değer ''0'' kabul edilir.

Şablondaki entity''yi değiştirme; yalnızca mimariyi yaz. **Sına** dediğinde tasarımın tarayıcında, her seferinde rastgele seçilen girişlerle gizli bir testbench''e karşı çalıştırılır.', '{"kod":{"varlik":"rise_detect","portlar":[{"ad":"clk","yon":"in","genislik":0},{"ad":"rst","yon":"in","genislik":0},{"ad":"d","yon":"in","genislik":0},{"ad":"p","yon":"out","genislik":0}],"saat":"clk","sablon":"library ieee;\nuse ieee.std_logic_1164.all;\nuse ieee.numeric_std.all;\n\nentity rise_detect is\n  port (\n    clk : in  std_logic;\n    rst : in  std_logic;\n    d   : in  std_logic;\n    p   : out std_logic\n  );\nend rise_detect;\n\narchitecture rtl of rise_detect is\nbegin\n  -- Çözümünü buraya yaz\nend rtl;\n"}}', '{"model":"k-kenar"}', '`d`''nin önceki değeri bir sinyalde saklanır. Aynı kenarda `p <= d and not onceki;` ve `onceki <= d;` atanır; sinyal atamaları process sonunda gerçekleştiği için `p` hesaplanırken `onceki` hâlâ eski değerdir.', 2, 'Hafta 5, process ve rising_edge', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('k-dizi101', 'sirali-kod', 5, 'code', 'derived', 'Her yükselen saat kenarında `x` girişinden bir bit okuyan bir **"101" dizi dedektörü** yaz. Son okunan üç bit sırasıyla 1, 0, 1 olduğunda `z` ''1'' olur; diziler örtüşebilir (`1 0 1 0 1` iki kez yakalanır). `z` son biti okuyan kenardan hemen sonra ''1'' olmalı ve bir sonraki kenara kadar öyle kalmalı.

`rst = ''1''` iken (eşzamanlı) geçmiş unutulur: yeni bir "101" için reset sonrasında üç bit daha okunmalı.

Şablondaki entity''yi değiştirme; yalnızca mimariyi yaz. **Sına** dediğinde tasarımın tarayıcında, her seferinde rastgele seçilen girişlerle gizli bir testbench''e karşı çalıştırılır.', '{"kod":{"varlik":"det101","portlar":[{"ad":"clk","yon":"in","genislik":0},{"ad":"rst","yon":"in","genislik":0},{"ad":"x","yon":"in","genislik":0},{"ad":"z","yon":"out","genislik":0}],"saat":"clk","sablon":"library ieee;\nuse ieee.std_logic_1164.all;\nuse ieee.numeric_std.all;\n\nentity det101 is\n  port (\n    clk : in  std_logic;\n    rst : in  std_logic;\n    x   : in  std_logic;\n    z   : out std_logic\n  );\nend det101;\n\narchitecture rtl of det101 is\nbegin\n  -- Çözümünü buraya yaz\nend rtl;\n"}}', '{"model":"k-dizi101"}', 'Moore tipi bir durum makinesi kurulabilir: `S0` (başlangıç), `S1` ("1" görüldü), `S10` ("10" görüldü), `S101` (dizi tamam, `z = ''1''`). `S101` durumunda `x = ''0''` gelirse `S10`''a, `x = ''1''` gelirse `S1`''e geçilir; örtüşme bu geçişlerden gelir. Durum tipini `type durum is (S0, S1, S10, S101);` ile tanımlayıp `case` ile geçişleri yazmak okunaklı olur.', 3, 'Hafta 5, process ve case', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t1-nre-tanim', 'fpga-giris', 1, 'mcq', 'derived', 'NRE (non-recurring engineering) maliyeti neyi anlatır?', '{"choices":["Tasarım ve maske için bir kez ödenen maliyeti","Üretilen her yonga için tekrar tekrar ödenen birim maliyeti","Cihazın çalışırken harcadığı enerjinin maliyetini","Sahadaki cihazlara güncelleme göndermenin maliyetini"]}', '{"index":0}', 'NRE bir kerelik maliyettir; kaç adet üretilirse üretilsin bir kez ödenir. ASIC''te çok yüksektir, FPGA''da hazır yonga kullanıldığı için yok denecek kadar azdır.', 1, 'Hafta 1, FPGA ve ASIC karşılaştırması', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t1-asic-hata', 'fpga-giris', 1, 'tf', 'derived', 'Üretilmiş bir ASIC''te tasarım hatası bulunursa, yeni bir yapılandırma dosyası yüklenerek hata sahada düzeltilebilir.', '{}', '{"value":false}', 'ASIC''te devre silikona kazınmıştır, sonradan değiştirilemez. Hatayı düzeltmek yeni bir üretim turu demektir. Sahada yeniden yapılandırma FPGA''nın üstünlüğüdür.', 1, 'Hafta 1, FPGA ve ASIC karşılaştırması', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t1-dusuk-adet', 'fpga-giris', 1, 'mcq', 'derived', 'Bir laboratuvar yalnızca 20 adet ölçüm cihazı üretecek ve tasarımın ileride değişmesi bekleniyor. Hangisi en uygundur?', '{"choices":["ASIC","Maske programlı ROM","FPGA","Tam özel yonga"]}', '{"index":2}', 'Az adet ve değişebilecek bir tasarımda ASIC''in yüksek NRE''si karşılanamaz ve sonradan değiştirilemez. FPGA hem bir kerelik maliyet gerektirmez hem de yeniden yapılandırılabilir.', 2, 'Hafta 1, FPGA ve ASIC karşılaştırması', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t1-asic-guc', 'fpga-giris', 1, 'tf', 'derived', 'Aynı işlevi yapan bir ASIC, genellikle aynı işi yapan bir FPGA''dan daha az güç harcar.', '{}', '{"value":true}', 'ASIC yalnızca gereken transistörleri içerir; FPGA''daki programlanabilir bağlantılar ve kullanılmayan kaynaklar ek güç ve gecikme getirir.', 2, 'Hafta 1, FPGA ve ASIC karşılaştırması', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t1-kesisim', 'fpga-giris', 1, 'fill', 'derived', 'Bir üründe FPGA''nın birim maliyeti 50 TL, bir kerelik maliyeti yok. ASIC''in bir kerelik maliyeti (NRE) 2.000.000 TL, birim maliyeti 10 TL. Kaç adet üretimde iki seçeneğin toplam maliyeti eşit olur?', '{"blanks":1}', '{"blanks":[["50000","50.000"]]}', 'Eşitlik: 50·n = 2.000.000 + 10·n, yani 40·n = 2.000.000 ve n = 50.000. Bundan fazla üretimde ASIC, daha azında FPGA ucuzdur.', 3, 'Hafta 1, FPGA ve ASIC karşılaştırması', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t1-prototip-neden', 'fpga-giris', 1, 'mcq', 'derived', 'Bir ASIC tasarımının silikona gönderilmeden önce FPGA üzerinde çalıştırılmasının temel nedeni nedir?', '{"choices":["FPGA''nın aynı tasarımı ASIC''ten daha hızlı çalıştırması","ASIC üretiminin bir FPGA yongası gerektirmesi","FPGA''nın analog devreleri de barındırabilmesi","Hataların pahalı üretim turundan önce ucuza bulunabilmesi"]}', '{"index":3}', 'ASIC''te bir hata yeni bir maske ve üretim turu demektir. FPGA prototipi tasarımı gerçek donanımda erkenden doğrulamayı sağlar.', 2, 'Hafta 1, FPGA ve ASIC karşılaştırması', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t1-paralel-sayi', 'fpga-giris', 1, 'mcq', 'derived', 'Bir FPGA tasarımında birbirinden bağımsız 8 toplayıcı kurulmuş. Her saat çevriminde en çok kaç toplama yapılabilir?', '{"choices":["1","2","8","Toplayıcılar sırayla çalıştığı için 1/8"]}', '{"index":2}', 'FPGA''da her toplayıcı kendi donanımıdır ve hepsi aynı anda çalışır. 8 toplayıcı her çevrimde 8 toplama yapar.', 2, 'Hafta 1, FPGA ve işlemci', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t1-donanim-tanim', 'fpga-giris', 1, 'tf', 'derived', 'VHDL ile yazılan bir tasarım FPGA''da işlemci komutları gibi sırayla yürütülmez; yazılan yapı donanıma dönüşür.', '{}', '{"value":true}', 'VHDL bir donanım tanımlama dilidir. Sentez aracı kodu kapılara, LUT''lara ve flip-floplara çevirir; bunlar aynı anda çalışır.', 1, 'Hafta 1, FPGA ve işlemci', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t1-cpu-uygun', 'fpga-giris', 1, 'mcq', 'derived', 'Hangi iş için genel amaçlı bir işlemci FPGA''dan daha uygundur?', '{"choices":["Saniyede milyonlarca pikseli işleyen bir görüntü hattı","Sık değişen, adım adım ilerleyen bir masaüstü uygulaması","Kesin zamanlamalı bir haberleşme arayüzü","Aynı anda çalışan yüzlerce sayısal filtre"]}', '{"index":1}', 'Karmaşık, sırayla ilerleyen ve sık değişen işler işlemcide daha pratiktir. Paralel ve zamanlaması kesin işler FPGA''nın güçlü olduğu alanlardır.', 2, 'Hafta 1, FPGA ve işlemci', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t1-zamanlama', 'fpga-giris', 1, 'tf', 'derived', 'FPGA''da kurulan bir arayüzün zamanlaması, araya bir işletim sistemi girmediği için öngörülebilirdir.', '{}', '{"value":true}', 'FPGA''daki devre her saat çevriminde aynı işi yapar; işletim sistemi zamanlayıcısı ya da kesmeler araya girmez.', 2, 'Hafta 1, FPGA ve işlemci', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t1-vlsi', 'fpga-giris', 1, 'mcq', 'derived', 'Yüz binlerce ve daha fazla kapı içeren günümüz işlemcileri ve FPGA''lar hangi ölçekte sınıflanır?', '{"choices":["SSI","MSI","LSI","VLSI"]}', '{"index":3}', 'VLSI (çok büyük ölçekli tümleşik devre) yüz binlerce ve daha fazla kapıyı kapsar.', 1, 'Hafta 1, Entegre devre ölçekleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t1-msi-ornek', 'fpga-giris', 1, 'mcq', 'derived', 'Sayıcı, çoklayıcı ya da kod çözücü içeren, onlarca kapılık entegreler hangi ölçektedir?', '{"choices":["SSI","MSI","VLSI","CPLD"]}', '{"index":1}', 'Onlarca kapılık bu tür işlevsel bloklar MSI (orta ölçek) sınıfındadır. CPLD bir ölçek değil, bir programlanabilir mantık türüdür.', 2, 'Hafta 1, Entegre devre ölçekleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-bitstream', 'pld', 2, 'mcq', 'derived', 'FPGA''ya yüklenen ve hangi bloğun ne iş yapacağını, blokların nasıl bağlanacağını belirleyen dosyaya ne denir?', '{"choices":["Netlist","Testbench","Bitstream","Kısıt dosyası"]}', '{"index":2}', 'Bitstream, tasarım akışının sonunda üretilen yapılandırma dosyasıdır. FPGA''ya bir program değil, bu yapılandırma yüklenir.', 1, 'Hafta 2, FPGA''nın yapısı ve tarihçesi', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-iob', 'pld', 2, 'mcq', 'derived', 'FPGA''da yonganın bacaklarıyla içerideki mantık arasında bağlantıyı kuran bloklar hangileridir?', '{"choices":["CLB","LUT","DSP dilimleri","IOB"]}', '{"index":3}', 'IOB (giriş/çıkış bloğu) yonganın dış dünyayla bağlantısını sağlar. Mantık işlevleri CLB''lerde kurulur.', 1, 'Hafta 2, FPGA''nın yapısı ve tarihçesi', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-ek-kaynak', 'pld', 2, 'mcq', 'derived', 'Modern FPGA''larda CLB''lere ek olarak hangi özel bloklar bulunur?', '{"choices":["Blok RAM ve DSP dilimleri","PROM''daki gibi sabit AND ve OR dizileri","Yalnızca SSI kapıları","Bir kez yakılabilen sigortalar"]}', '{"index":0}', 'Bellek ve çarpma gibi sık kullanılan işler için FPGA''larda blok RAM, DSP dilimleri ve saat üreteçleri (PLL) gibi hazır bloklar vardır.', 2, 'Hafta 2, FPGA''nın yapısı ve tarihçesi', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-yeniden', 'pld', 2, 'tf', 'derived', 'Bir FPGA''ya farklı bir bitstream yüklenerek aynı yonga başka bir devreye dönüştürülebilir.', '{}', '{"value":true}', 'FPGA''nın adındaki "field programmable" bunu anlatır: yapılandırma sahada değiştirilebilir.', 1, 'Hafta 2, FPGA''nın yapısı ve tarihçesi', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-pal-or-sabit', 'pld', 2, 'tf', 'derived', 'PAL yapısında AND dizisi programlanabilir, OR dizisi sabittir.', '{}', '{"value":true}', 'PAL''de çarpım terimleri (AND dizisi) programlanır, her çıkış kendine ayrılmış terimleri sabit bir OR ile toplar.', 1, 'Hafta 2, PROM, PAL, PLA dizileri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-prom-4giris', 'pld', 2, 'fill', 'derived', '4 girişli bir PROM''un sabit AND dizisi kaç çarpım terimi üretir?', '{"blanks":1}', '{"blanks":[["16"]]}', 'PROM''un AND dizisi girişlerin tüm birleşimlerini üretir: 2^4 = 16 minterim.', 2, 'Hafta 2, PROM, PAL, PLA dizileri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-prom-minterim', 'pld', 2, 'mcq', 'derived', 'PROM''da AND dizisinin sabit olmasının sonucu nedir?', '{"choices":["Hiç çarpım terimi üretilmez","Girişlerin tüm minterimleri her zaman üretilir","Yalnızca iki çarpım terimi üretilir","OR dizisinin de sabit olması gerekir"]}', '{"index":1}', 'Sabit AND dizisi n girişin 2^n minterimini üretir; fonksiyon, programlanabilir OR dizisinde hangi minterimlerin toplanacağı seçilerek kurulur.', 2, 'Hafta 2, PROM, PAL, PLA dizileri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-pla-dezavantaj', 'pld', 2, 'mcq', 'derived', 'PLA en esnek yapı olduğu halde neden her yerde tercih edilmez?', '{"choices":["Çarpım terimi üretemez","Yalnızca tek çıkışı olabilir","Daha yavaş ve daha pahalıdır","Programlanamaz"]}', '{"index":2}', 'İki programlanabilir dizi daha fazla anahtar ve daha uzun sinyal yolu demektir; bu da hız ve maliyet açısından bedel öder.', 2, 'Hafta 2, PROM, PAL, PLA dizileri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-sop', 'pld', 2, 'mcq', 'derived', 'Önce bir AND dizisi, ardından bir OR dizisi kullanan yapılar fonksiyonu hangi biçimde gerçekler?', '{"choices":["Toplamların çarpımı","Çarpımların toplamı","Yalnızca XOR terimleri","Doğruluk tablosunun tümleyeni"]}', '{"index":1}', 'AND dizisi çarpım terimlerini, OR dizisi bunların toplamını üretir: çarpımların toplamı (sum of products).', 2, 'Hafta 2, PROM, PAL, PLA dizileri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-pla-paylasim-sayi', 'pld', 2, 'fill', 'derived', 'F1 = AB + BC ve F2 = BC + A''C fonksiyonları bir PLA ile gerçeklenecek. AND dizisinde **en az** kaç çarpım terimi gerekir?', '{"blanks":1}', '{"blanks":[["3"]]}', 'Farklı terimler AB, BC ve A''C''dir. PLA''da BC terimi iki çıkışta ortak kullanılabildiği için 3 terim yeter.', 3, 'Hafta 2, PLA ile fonksiyon gerçekleme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-pal-terim-sayi', 'pld', 2, 'fill', 'derived', 'F1 = AB + BC ve F2 = BC + A''C fonksiyonları her çıkışın yalnızca kendi terimlerini kullanabildiği bir PAL''de gerçekleniyor. Toplam kaç AND kapısı (çarpım terimi) kullanılır?', '{"blanks":1}', '{"blanks":[["4"]]}', 'PAL''de terimler paylaşılamaz: F1 için AB ve BC, F2 için yine BC ve A''C gerekir. BC iki kez kurulur, toplam 4 terim.', 3, 'Hafta 2, PLA ile fonksiyon gerçekleme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-pla-deger', 'pld', 2, 'fill', 'derived', 'Bir PLA''da P1 = AB, P2 = B''C ve F = P1 + P2 programlanmış. A = 0, B = 0, C = 1 iken F kaçtır?', '{"blanks":1}', '{"blanks":[["1","''1''"]]}', 'P1 = 0·0 = 0. P2 = B''·C = 1·1 = 1. F = 0 + 1 = 1.', 2, 'Hafta 2, PLA ile fonksiyon gerçekleme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-lut-4', 'pld', 2, 'fill', 'derived', '4 girişli bir LUT, doğruluk tablosu için kaç bitlik bellek tutar?', '{"blanks":1}', '{"blanks":[["16"]]}', 'k girişli LUT 2^k bitlik bir bellektir: 2^4 = 16.', 1, 'Hafta 2, CLB ve LUT', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-lut-xor', 'pld', 2, 'fill', 'derived', 'Ders örneğindeki 2 girişli LUT''ta tablo sırası (b,a) = 11, 10, 01, 00 biçiminde yazılıyor ve "1000" bir AND kapısı veriyor. XOR kapısı için TABLO sabiti ne olmalıdır?', '{"blanks":1}', '{"blanks":[["0110","\"0110\""]]}', 'XOR, girişler farklıyken 1''dir: ba = 11 → 0, 10 → 1, 01 → 1, 00 → 0. Bu sırayla "0110".', 3, 'Hafta 2, CLB ve LUT', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-lut-nand', 'pld', 2, 'fill', 'derived', 'Aynı 2 girişli LUT''ta (sıra: ba = 11, 10, 01, 00) NAND kapısı için TABLO sabiti ne olmalıdır?', '{"blanks":1}', '{"blanks":[["0111","\"0111\""]]}', 'NAND yalnızca iki giriş 1 iken 0''dır: ba = 11 → 0, diğerleri 1. Bu sırayla "0111".', 3, 'Hafta 2, CLB ve LUT', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-lut-her-fonksiyon', 'pld', 2, 'tf', 'derived', 'k girişli bir LUT, k girişli her mantık fonksiyonunu gerçekleyebilir.', '{}', '{"value":true}', 'LUT, doğruluk tablosunun tamamını saklar. Hangi tablo yazılırsa o fonksiyon elde edilir.', 2, 'Hafta 2, CLB ve LUT', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-clb-ff', 'pld', 2, 'mcq', 'derived', 'Bir CLB''de LUT çıkışından sonra gelen flip-flop ne işe yarar?', '{"choices":["LUT''un giriş sayısını iki katına çıkarır","Sonucu saat kenarında saklar","Bitstream''i saklar","Analog sinyali sayısala çevirir"]}', '{"index":1}', 'Flip-flop, LUT''un kombinasyonel sonucunu saat kenarında yakalar. Bir çoklayıcı, çıkışın kayıtlı ya da doğrudan olacağını seçer.', 2, 'Hafta 2, CLB ve LUT', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-yerlestirme', 'tasarim-akisi', 2, 'mcq', 'derived', 'Netlist''teki mantığın yonganın hangi gerçek kaynaklarında (hangi CLB''lerde) çalışacağının seçildiği adım hangisidir?', '{"choices":["Sentez","Benzetim","Bitstream yükleme","Yerleştirme"]}', '{"index":3}', 'Uygulama aşamasında önce yerleştirme yapılır: her mantık parçasına yongada bir yer seçilir. Ardından yönlendirme bu yerler arasındaki bağlantıları kurar.', 2, 'Hafta 2, Tasarım akışı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-benzetim-erken', 'tasarim-akisi', 2, 'tf', 'derived', 'Benzetim, tasarım hatalarını yongaya yüklemeden önce yakalamanın en ucuz yoludur.', '{}', '{"value":true}', 'Benzetim bilgisayarda yapılır; sentez ve uygulama gibi uzun adımları beklemeden ve donanım gerekmeden hata bulunur.', 1, 'Hafta 2, Tasarım akışı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-zamanlama-adim', 'tasarim-akisi', 2, 'mcq', 'derived', 'Bağlantıların gerçek gecikmeleriyle zamanlamanın kontrol edildiği adım hangisidir?', '{"choices":["Tasarım girişi","Yerleştirme ve yönlendirme","Davranışsal benzetim","Kütüphane bildirimi"]}', '{"index":1}', 'Gerçek gecikmeler, mantığın nereye yerleştirildiği ve bağlantıların nasıl yönlendirildiği belli olunca bilinir. Zamanlama bu yüzden uygulamada kontrol edilir.', 3, 'Hafta 2, Tasarım akışı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-akis-sonraki', 'tasarim-akisi', 2, 'mcq', 'derived', 'Tasarım akışında sentezden hemen sonra gelen adım hangisidir?', '{"choices":["Tasarım girişi","Benzetim","Yerleştirme ve yönlendirme","Testbench yazma"]}', '{"index":2}', 'Sıra: tasarım girişi, benzetim, sentez, uygulama, bitstream üretimi ve yükleme.', 2, 'Hafta 2, Tasarım akışı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-davranissal-kod', 'tasarim-akisi', 2, 'mcq', 'derived', '`s <= a + b;` satırı hangi modelleme yaklaşımına örnektir?', '{"choices":["Yapısal","Şematik","Davranışsal","Fiziksel yerleşim"]}', '{"index":2}', 'Devrenin ne yapacağı anlatılıyor, nasıl kurulacağı sentez aracına bırakılıyor: davranışsal modelleme.', 2, 'Hafta 2, Yapısal ve davranışsal modelleme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-yapisal-ornek', 'tasarim-akisi', 2, 'mcq', 'derived', 'Tam toplayıcıyı iki yarım toplayıcı ve bir OR kapısını birbirine bağlayarak kurmak hangi modellemedir?', '{"choices":["Davranışsal","Yapısal","Algoritmik","Zamanlama"]}', '{"index":1}', 'Devre, daha küçük bileşenlerin bağlanmasıyla, bir şema çizer gibi kuruluyor: yapısal modelleme.', 2, 'Hafta 2, Yapısal ve davranışsal modelleme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-karma', 'tasarim-akisi', 2, 'tf', 'derived', 'Gerçek tasarımlarda üst seviyede bileşenler yapısal olarak bağlanır, bileşenlerin içi çoğunlukla davranışsal yazılır.', '{}', '{"value":true}', 'İki yaklaşım birlikte kullanılır: hiyerarşi yapısal, en alttaki bloklar davranışsal tanımlanır.', 1, 'Hafta 2, Yapısal ve davranışsal modelleme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-rtl-sema', 'tasarim-akisi', 2, 'mcq', 'derived', 'Vivado''da sentezden sonra kodun hangi bloklara ve kapılara dönüştüğünü görmek için neye bakılır?', '{"choices":["Testbench''in dalga ekranına","Bitstream dosyasına","RTL şemasına","Proje klasöründeki .vhd dosyasına"]}', '{"index":2}', 'Şema görünümü, sentezin ürettiği devreyi bloklar ve bağlantılar olarak gösterir.', 2, 'Hafta 2, Vivado kullanımı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t2-part-secim', 'tasarim-akisi', 2, 'tf', 'derived', 'Vivado''da hedef FPGA yongası (part) proje oluşturulurken ya da proje ayarlarından seçilir.', '{}', '{"value":true}', 'Sentez ve uygulama hedef yonganın kaynaklarına göre yapılır; bu yüzden part seçimi projenin bir ayarıdır.', 1, 'Hafta 2, Vivado kullanımı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-end-satiri', 'vhdl-temel', 3, 'mcq', 'derived', '`entity sayac is ... ` bildirimini kapatan satırlardan hangisi VHDL-93''te **yanlıştır**?', '{"choices":["`end entity;`","`end sayac;`","`end entity sayac;`","`end architecture sayac;`"]}', '{"index":3}', 'Entity `end`, `end entity`, `end sayac` ya da `end entity sayac` ile kapatılabilir. `end architecture` yalnızca bir mimariyi kapatır.', 2, 'Hafta 3, library, entity, architecture', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-use-satiri', 'vhdl-temel', 3, 'mcq', 'derived', '`std_logic` tipini kullanabilmek için `library ieee;` satırından sonra hangi satır gerekir?', '{"choices":["`use work.all;`","`use ieee.std_logic_1164.all;`","`library std_logic;`","`use std.standard.all;`"]}', '{"index":1}', '`std_logic` ve `std_logic_vector`, ieee kütüphanesindeki std_logic_1164 paketinde tanımlıdır.', 1, 'Hafta 3, library, entity, architecture', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-coklu-arch', 'vhdl-temel', 3, 'tf', 'derived', 'Bir entity''nin birden fazla architecture''ı olabilir.', '{}', '{"value":true}', 'Aynı arayüz için farklı gerçeklemeler (ör. davranışsal ve yapısal) yazılabilir; örneklerken hangisinin kullanılacağı seçilir.', 2, 'Hafta 3, library, entity, architecture', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-port-yazimi', 'vhdl-temel', 3, 'mcq', 'derived', 'Hangi port listesi doğru yazılmıştır?', '{"choices":["`port (a : in std_logic; y : out std_logic);`","`port (a : in std_logic; y : out std_logic;);`","`port (a in std_logic, y out std_logic);`","`port (a : std_logic in; y : std_logic out);`"]}', '{"index":0}', 'Her port `ad : mod tip` biçimindedir, portlar noktalı virgülle ayrılır ve son porttan sonra noktalı virgül konmaz.', 2, 'Hafta 3, library, entity, architecture', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-buffer', 'vhdl-temel', 3, 'mcq', 'derived', 'Yazılan ve mimari içinden geri okunabilen, ama yalnızca tek bir kaynaktan sürülebilen port modu hangisidir?', '{"choices":["in","out","inout","buffer"]}', '{"index":3}', '`buffer` çıkış gibi sürülür ve içeriden okunabilir. `inout` ise iki yönlüdür ve birden çok kaynak tarafından sürülebilir.', 2, 'Hafta 3, Port modları', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-in-yazma', 'vhdl-temel', 3, 'tf', 'derived', '`in` modundaki bir porta mimari içinde değer atanabilir.', '{}', '{"value":false}', '`in` portu yalnızca okunur; ona atama yapmak derleme hatasıdır.', 1, 'Hafta 3, Port modları', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-ara-sinyal', 'vhdl-temel', 3, 'mcq', 'derived', 'VHDL-93''te `y : out std_logic` portunu mimaride hem sürmek hem de okumak istiyorsun. Hangisi doğru yoldur?', '{"choices":["`y`''nin modunu `in` yapmak","Hesabı bir iç sinyalle yapıp sonunda `y <= ic;` yazmak","`y''event` ile okumak","`y`''yi bir variable''a dönüştürmek"]}', '{"index":1}', '`out` port VHDL-93''te içeriden okunamaz. Değer bir iç sinyalde tutulur, hem okunur hem de porta atanır.', 3, 'Hafta 3, Port modları', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-yarim-01', 'vhdl-temel', 3, 'fill', 'derived', 'Yarım toplayıcıda A = 0, B = 1 iken toplam ve elde nedir? Boşluk 1: S, Boşluk 2: C', '{"blanks":2}', '{"blanks":[["1","''1''"],["0","''0''"]]}', 'S = A XOR B = 1, C = A AND B = 0.', 1, 'Hafta 3, Yarım ve tam toplayıcı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-tam-111', 'vhdl-temel', 3, 'fill', 'derived', 'Tam toplayıcıda A = 1, B = 1, Cin = 1 için çıkışlar nedir? Boşluk 1: S, Boşluk 2: Cout', '{"blanks":2}', '{"blanks":[["1","''1''"],["1","''1''"]]}', '1 + 1 + 1 = 3, ikili olarak 11: toplam biti 1, elde 1.', 2, 'Hafta 3, Yarım ve tam toplayıcı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-tam-s-ifade', 'vhdl-temel', 3, 'mcq', 'derived', 'Tam toplayıcının toplam çıkışı S için hangi ifade doğrudur?', '{"choices":["`s <= a and b and cin;`","`s <= (a and b) or cin;`","`s <= a xor b xor cin;`","`s <= a or b or cin;`"]}', '{"index":2}', 'Toplam biti, girişlerden tek sayıda 1 olduğunda 1''dir: üç girişin XOR''u.', 2, 'Hafta 3, Yarım ve tam toplayıcı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-yarim-eksik', 'vhdl-temel', 3, 'mcq', 'derived', 'Çok bitli bir toplayıcıda neden her bit için yarım toplayıcı yeterli değildir?', '{"choices":["Toplam çıkışını XOR kapısıyla üretmediği için","Elde çıkışını dışarıya vermediği için","Önceki bitin eldesini alan girişi olmadığı için","Yalnızca çıkarma işlemi yapabildiği için"]}', '{"index":2}', 'En düşük bit dışındaki her bit üç şeyi toplar: iki giriş biti ve alt bitten gelen elde. Bunun için tam toplayıcı gerekir.', 3, 'Hafta 3, Yarım ve tam toplayıcı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-xnor', 'operatorler', 3, 'fill', 'derived', '`a = ''1''` ve `b = ''0''` iken `a xnor b` kaçtır?', '{"blanks":1}', '{"blanks":[["0","''0''"]]}', 'XNOR, girişler eşitken 1 verir. Girişler farklı olduğu için sonuç 0.', 2, 'Hafta 3, Mantık operatörleri ve öncelik', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-nor-zincir', 'operatorler', 3, 'tf', 'derived', '`y <= a nor b nor c;` yazımı parantezsiz olarak derlenir.', '{}', '{"value":false}', '`nand` ve `nor` birleşmeli değildir; VHDL bunları parantezsiz zincirlemeye izin vermez. `y <= not (a or b or c);` yazılır.', 2, 'Hafta 3, Mantık operatörleri ve öncelik', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-and-or-parantez', 'operatorler', 3, 'mcq', 'derived', 'VHDL''de `a and b or c` yazılamaz, `(a and b) or c` yazılır. Bunun nedeni nedir?', '{"choices":["`or`, `and`''den önce hesaplandığı için","`and` yalnızca vektörlerle çalıştığı için","`and` ile `or` arasında öncelik tanımlanmadığı için farklı mantık operatörleri parantezsiz karıştırılamaz","`c`''nin tipi uyuşmadığı için"]}', '{"index":2}', 'Bütün ikili mantık operatörleri (`not` hariç) aynı önceliktedir. Karışıklığı önlemek için VHDL farklı olanların parantezsiz yan yana yazılmasını yasaklar.', 2, 'Hafta 3, Mantık operatörleri ve öncelik', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-not-oncelik2', 'operatorler', 3, 'fill', 'derived', '`a = ''0''` ve `b = ''1''` iken `not a and b` kaçtır?', '{"blanks":1}', '{"blanks":[["1","''1''"]]}', '`not` en yüksek önceliklidir: `(not a) and b` = 1 and 1 = 1.', 2, 'Hafta 3, Mantık operatörleri ve öncelik', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-mod-7-3', 'operatorler', 3, 'fill', 'derived', '`7 mod 3` ve `7 rem 3` kaçtır? Boşluk 1: mod, Boşluk 2: rem', '{"blanks":2}', '{"blanks":[["1"],["1"]]}', 'İki sayı da pozitifken mod ve rem aynıdır: 7 = 2·3 + 1.', 1, 'Hafta 3, mod, rem ve bölme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-mod-neg-b', 'operatorler', 3, 'fill', 'derived', '`7 mod (-3)` ve `7 rem (-3)` kaçtır? Boşluk 1: mod, Boşluk 2: rem', '{"blanks":2}', '{"blanks":[["-2"],["1"]]}', '`rem` sonucu bölünenin (7) işaretini, `mod` sonucu bölenin (-3) işaretini alır. rem: 7 - (-3)·(-2) = 1. mod: 7 - (-3)·(-3) = -2.', 3, 'Hafta 3, mod, rem ve bölme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-mod-neg-a', 'operatorler', 3, 'fill', 'derived', '`(-7) mod 3` ve `(-7) rem 3` kaçtır? Boşluk 1: mod, Boşluk 2: rem', '{"blanks":2}', '{"blanks":[["2"],["-1"]]}', 'rem bölünenin işaretini alır: -7 - 3·(-2) = -1. mod bölenin işaretini alır: -7 - 3·(-3) = 2.', 3, 'Hafta 3, mod, rem ve bölme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-bolme-kuvvet', 'operatorler', 3, 'mcq', 'derived', 'Sentezde `x / 4` gibi ikinin kuvvetine bölme neden genellikle sorun çıkarmaz?', '{"choices":["4 bir asal sayı olduğu için","Bölme bitleri sağa kaydırmaya indirgenebildiği için","Bölme her zaman yalnızca benzetimde yapıldığı için","x''in sabit olması gerektiği için"]}', '{"index":1}', '4''e bölmek, işaretsiz bir sayıda iki bit sağa kaydırmakla aynıdır; ek donanım gerekmez. Genel bölme ise büyük bir devre ister.', 2, 'Hafta 3, mod, rem ve bölme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-tasma-4bit', 'operatorler', 3, 'fill', 'derived', '`a` ve `b` 4 bitlik `unsigned` sinyallerdir ve `y <= a + b;` (y de 4 bit). `a = "1100"`, `b = "0101"` iken y nedir?', '{"blanks":1}', '{"blanks":[["0001","\"0001\""]]}', '12 + 5 = 17. 4 bit en çok 15 tutar, taşan elde atılır: 17 - 16 = 1, yani "0001".', 2, 'Hafta 3, Toplama, çıkarma ve taşma', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-elde-bit', 'operatorler', 3, 'mcq', 'derived', 'İki 4 bitlik `unsigned` sayının toplamındaki eldeyi kaybetmemek için ne yapılır?', '{"choices":["Sonuç 3 bite indirilir","Sayılar önce 5 bite genişletilir (ör. `''0'' & a`) ve 5 bitlik bir sonuca toplanır","`mod` operatörü kullanılır","Sayılar `signed` yapılır"]}', '{"index":1}', '`numeric_std`''de toplamın genişliği işlenenlerin genişliğidir. Eldeyi görmek için işlenenler bir bit genişletilir.', 3, 'Hafta 3, Toplama, çıkarma ve taşma', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-cikarma-tasma', 'operatorler', 3, 'fill', 'derived', '4 bitlik `unsigned` sinyallerde `y <= a - b;` yazılıyor. `a = "0010"`, `b = "0011"` iken y nedir?', '{"blanks":1}', '{"blanks":[["1111","\"1111\""]]}', '2 - 3 = -1 işaretsiz 4 bitte gösterilemez; sonuç 16''ya göre sarılır: -1 + 16 = 15, yani "1111".', 3, 'Hafta 3, Toplama, çıkarma ve taşma', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-unsigned-arti', 'operatorler', 3, 'tf', 'derived', '`numeric_std` paketi kullanıldığında iki `unsigned` sinyal doğrudan `+` ile toplanabilir.', '{}', '{"value":true}', '`numeric_std`, `unsigned` ve `signed` için aritmetik operatörleri tanımlar. `std_logic_vector` için tanımlamaz.', 1, 'Hafta 3, Hangi tipte hangi işlem yapılır', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-slv-cevir', 'operatorler', 3, 'mcq', 'derived', '`a`, `b` ve `y` `std_logic_vector(3 downto 0)` tipindedir. Hangi toplama doğrudur?', '{"choices":["`y <= a + b;`","`y <= unsigned(a + b);`","`y <= to_integer(a) + to_integer(b);`","`y <= std_logic_vector(unsigned(a) + unsigned(b));`"]}', '{"index":3}', 'Vektörler önce `unsigned`''a çevrilip toplanır, sonuç yeniden `std_logic_vector`''e çevrilir.', 2, 'Hafta 3, Hangi tipte hangi işlem yapılır', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-integer-arti', 'operatorler', 3, 'tf', 'derived', '`integer` tipindeki iki sinyal ek bir paket kullanmadan `+` ile toplanabilir.', '{}', '{"value":true}', '`integer` ve aritmetiği her zaman görünür olan `std.standard` paketinde tanımlıdır.', 2, 'Hafta 3, Hangi tipte hangi işlem yapılır', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-signed-buyuk', 'operatorler', 3, 'mcq', 'derived', '`signed''("1000") > signed''("0111")` ifadesinin sonucu nedir?', '{"choices":["true","false","Derleme hatası","''X''"]}', '{"index":1}', 'signed olarak "1000" = -8 ve "0111" = 7''dir. -8 > 7 yanlıştır.', 3, 'Hafta 3, Karşılaştırma operatörleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-esit', 'operatorler', 3, 'mcq', 'derived', 'VHDL''de iki değerin eşitliğini sınayan operatör hangisidir?', '{"choices":["==",":=","=","=>"]}', '{"index":2}', 'Eşitlik `=` ile, eşitsizlik `/=` ile sınanır. `:=` değişken ataması, `=>` eşleme içindir.', 1, 'Hafta 3, Karşılaştırma operatörleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-buyuk-esit', 'operatorler', 3, 'fill', 'derived', 'VHDL''de "büyük veya eşit" karşılaştırma operatörü nasıl yazılır?', '{"blanks":1}', '{"blanks":[[">="]]}', '`>=` büyük veya eşit, `<=` ise (koşul içinde) küçük veya eşittir.', 1, 'Hafta 3, Karşılaştırma operatörleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-birlestir-uzunluk', 'operatorler', 3, 'fill', 'derived', '`a` 3 bitlik, `b` 5 bitlik bir vektörse `a & b` kaç bitliktir?', '{"blanks":1}', '{"blanks":[["8"]]}', 'Birleştirme (`&`) iki vektörü uç uca ekler: 3 + 5 = 8 bit.', 1, 'Hafta 3, Kaydırma ve birleştirme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-sola-kaydir', 'operatorler', 3, 'mcq', 'derived', '4 bitlik `x` için `x <= x(2 downto 0) & ''0'';` ne yapar?', '{"choices":["x''i bir bit sağa kaydırır","x''i bir bit sola kaydırır, sağdan 0 girer","x''in en düşük bitini siler, x 3 bit olur","x''in bitlerini ters çevirir"]}', '{"index":1}', 'Alt üç bit üste taşınır ve en sağa ''0'' eklenir: bu, bir bit sola kaydırmadır.', 2, 'Hafta 3, Kaydırma ve birleştirme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-rol', 'operatorler', 3, 'fill', 'derived', '`signal x : bit_vector(3 downto 0) := "1001";` için `x rol 1` nedir?', '{"blanks":1}', '{"blanks":[["0011","\"0011\""]]}', '`rol` sola döndürür: soldan çıkan bit sağdan girer. "1001" → "0011".', 3, 'Hafta 3, Kaydırma ve birleştirme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-srl-sonuc', 'operatorler', 3, 'fill', 'derived', '`bit_vector''("1100") srl 1` nedir?', '{"blanks":1}', '{"blanks":[["0110","\"0110\""]]}', '`srl` mantıksal sağa kaydırmadır: soldan 0 girer, en sağdaki bit atılır.', 2, 'Hafta 3, Kaydırma ve birleştirme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-others-sifir', 'operatorler', 3, 'fill', 'derived', '`signal v : std_logic_vector(5 downto 0);` için `v <= (others => ''0'');` ataması sonrası v nedir?', '{"blanks":1}', '{"blanks":[["000000","\"000000\""]]}', '`others` belirtilmeyen bütün elemanları kapsar; 6 bitin hepsi ''0'' olur.', 1, 'Hafta 3, others ile toplu atama', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-others-konum', 'operatorler', 3, 'fill', 'derived', '`signal v : std_logic_vector(0 to 3);` için `v <= (1 => ''1'', others => ''0'');` sonrası v soldan sağa nasıl yazılır?', '{"blanks":1}', '{"blanks":[["0100","\"0100\""]]}', '`0 to 3` aralığında en soldaki eleman v(0)''dır. v(1) = ''1'', diğerleri ''0'': "0100".', 3, 'Hafta 3, others ile toplu atama', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-others-downto', 'operatorler', 3, 'fill', 'derived', '`signal v : std_logic_vector(3 downto 0);` için `v <= (1 => ''1'', others => ''0'');` sonrası v nedir?', '{"blanks":1}', '{"blanks":[["0010","\"0010\""]]}', '`3 downto 0` aralığında soldan sağa v(3), v(2), v(1), v(0) yazılır. Yalnızca v(1) = ''1'': "0010".', 2, 'Hafta 3, others ile toplu atama', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-length', 'nitelikler', 3, 'fill', 'derived', '`signal d : std_logic_vector(15 downto 0);` için `d''LENGTH` kaçtır?', '{"blanks":1}', '{"blanks":[["16"]]}', '15''ten 0''a kadar 16 eleman vardır.', 1, 'Hafta 3, Dizi nitelikleri (''LEFT, ''RANGE...)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-left-right', 'nitelikler', 3, 'fill', 'derived', '`signal x : std_logic_vector(2 to 9);` için Boşluk 1: `x''LEFT`, Boşluk 2: `x''RIGHT`', '{"blanks":2}', '{"blanks":[["2"],["9"]]}', '''LEFT ve ''RIGHT aralığın yazılışındaki sol ve sağ uçlardır: 2 ve 9.', 2, 'Hafta 3, Dizi nitelikleri (''LEFT, ''RANGE...)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-range-dongu', 'nitelikler', 3, 'mcq', 'derived', 'Döngüde `for i in d''RANGE loop` yazmanın avantajı nedir?', '{"choices":["Döngü turlarını paralel olarak çalıştırması","Döngü sayısını iki katına çıkarması","Yalnızca `to` aralıklarında çalışması","Vektörün sınırları değişince de uyum sağlaması"]}', '{"index":3}', '`d''RANGE` vektörün kendi aralığını verir. Genişlik bir GENERIC ile değişse bile döngü kodunu değiştirmek gerekmez.', 2, 'Hafta 3, Dizi nitelikleri (''LEFT, ''RANGE...)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-high-low', 'nitelikler', 3, 'fill', 'derived', '`signal d : std_logic_vector(7 downto 2);` için Boşluk 1: `d''HIGH`, Boşluk 2: `d''LOW`, Boşluk 3: `d''LENGTH`', '{"blanks":3}', '{"blanks":[["7"],["2"],["6"]]}', 'En büyük indis 7, en küçüğü 2; 7''den 2''ye 6 eleman vardır.', 2, 'Hafta 3, Dizi nitelikleri (''LEFT, ''RANGE...)', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-rising-edge', 'nitelikler', 3, 'mcq', 'derived', 'Saatin yükselen kenarını algılamanın önerilen yolu hangisidir?', '{"choices":["`clk = ''1''`","`rising_edge(clk)`","`clk''LAST_VALUE`","`falling_edge(clk)`"]}', '{"index":1}', '`rising_edge(clk)` yalnızca ''0''dan ''1''e geçişte doğrudur; ''X'' ya da ''U''dan geçişleri kenar saymaz.', 1, 'Hafta 3, Sinyal nitelikleri ve kenar algılama', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-event', 'nitelikler', 3, 'tf', 'derived', '`clk''EVENT`, clk sinyalinde o anda bir değişiklik olduysa `true` döner.', '{}', '{"value":true}', '''EVENT, sinyalin o benzetim adımında değiştiğini gösterir. `clk''event and clk = ''1''` yükselen kenarı algılar.', 2, 'Hafta 3, Sinyal nitelikleri ve kenar algılama', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-dusen-kenar', 'nitelikler', 3, 'mcq', 'derived', '`clk''event and clk = ''0''` hangi kenarı algılar?', '{"choices":["Yükselen kenarı","Her iki kenarı","Düşen kenarı","Hiçbirini"]}', '{"index":2}', 'Değişiklik olmuş ve yeni değer ''0'' ise saat 1''den 0''a inmiştir: düşen kenar.', 2, 'Hafta 3, Sinyal nitelikleri ve kenar algılama', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-enum-pos', 'nitelikler', 3, 'fill', 'derived', '`type renk is (kirmizi, yesil, mavi);` için Boşluk 1: `renk''POS(mavi)`, Boşluk 2: `renk''VAL(0)`', '{"blanks":2}', '{"blanks":[["2"],["kirmizi"]]}', 'Sayım tipinde konumlar 0''dan başlar: kirmizi 0, yesil 1, mavi 2. ''VAL(0) ilk değeri verir.', 2, 'Hafta 3, Sayım tipleri ve ''POS / ''VAL', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-enum-left', 'nitelikler', 3, 'fill', 'derived', '`type durum is (bosta, calis, bitti);` için Boşluk 1: `durum''LEFT`, Boşluk 2: `durum''HIGH`', '{"blanks":2}', '{"blanks":[["bosta"],["bitti"]]}', '''LEFT yazılıştaki ilk değer, ''HIGH en büyük konumdaki değerdir.', 2, 'Hafta 3, Sayım tipleri ve ''POS / ''VAL', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-enum-baslangic', 'nitelikler', 3, 'mcq', 'derived', '`type durum is (bosta, calis, bitti);` ve `signal d : durum;` başlangıç değeri verilmeden tanımlanıyor. Benzetimin başında d nedir?', '{"choices":["bitti","''U''","Rastgele bir değer","bosta"]}', '{"index":3}', 'Başlangıç değeri verilmeyen bir nesne tipinin ''LEFT değerini alır. std_logic''te bu ''U'', bu tipte `bosta`''dır.', 3, 'Hafta 3, Sayım tipleri ve ''POS / ''VAL', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-generic-map', 'nitelikler', 3, 'mcq', 'derived', 'Bir bileşen örneklenirken GENERIC değeri nasıl verilir?', '{"choices":["`port map (N => 8)`","`generic map (N => 8)`","Mimaride `N := 8;` yazarak","`constant N <= 8;` ile"]}', '{"index":1}', 'Örneklemede önce `generic map`, ardından `port map` yazılır: `u1 : entity work.sayac generic map (N => 8) port map (...)`.', 2, 'Hafta 3, GENERIC', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-generic-varsayilan', 'nitelikler', 3, 'fill', 'derived', '`entity alt is generic (N : integer := 4); port (x : in std_logic_vector(N-1 downto 0)); end alt;` bileşeni `generic map` yazılmadan örnekleniyor. `x''LENGTH` kaçtır?', '{"blanks":1}', '{"blanks":[["4"]]}', 'generic map verilmezse varsayılan değer kullanılır: N = 4, x 3 downto 0, yani 4 bit.', 2, 'Hafta 3, GENERIC', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-generic-sabit', 'nitelikler', 3, 'tf', 'derived', 'GENERIC parametresi mimaride bir sabit gibi kullanılabilir, ama mimari içinde değeri değiştirilemez.', '{}', '{"value":true}', 'GENERIC değeri örnekleme anında belirlenir ve o örnek için sabittir; vektör genişliği gibi yerlerde kullanılır.', 2, 'Hafta 3, GENERIC', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-attribute-bagla', 'nitelikler', 3, 'mcq', 'derived', '`attribute pin_no : integer;` bildiriminden sonra bu niteliği `s` sinyaline 5 olarak bağlamak için ne yazılır?', '{"choices":["`s''pin_no := 5;`","`attribute pin_no of s : signal is 5;`","`attribute s.pin_no = 5;`","`signal s''pin_no : integer := 5;`"]}', '{"index":1}', 'Nitelik önce tipiyle bildirilir, sonra `attribute ad of nesne : sınıf is değer;` ile bir nesneye bağlanır. Değeri `s''pin_no` ile okunur.', 3, 'Hafta 3, Kullanıcı nitelikleri ve aşırı yükleme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t3-overload-isim', 'nitelikler', 3, 'tf', 'derived', 'Bir operatörü aşırı yüklerken fonksiyonun adı tırnak içinde yazılır, ör. `function "+" (a, b : renk) return renk`.', '{}', '{"value":true}', 'Operatör fonksiyonlarının adı operatör sembolünün tırnaklı halidir; derleyici tiplerine bakarak hangi `+`''nın çağrılacağını seçer.', 2, 'Hafta 3, Kullanıcı nitelikleri ve aşırı yükleme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-son-atama', 'veri-nesneleri', 4, 'fill', 'derived', 'Bir process içinde art arda `y <= ''0'';` ve `y <= ''1'';` yazılmıştır. Process askıya alındıktan sonra `y` kaçtır?', '{"blanks":1}', '{"blanks":[["1","''1''"]]}', 'Aynı process''te bir sinyale yapılan atamalardan sonuncusu geçerli olur. Önceki atama, sinyal güncellenmeden önce ezilir.', 1, 'Hafta 4, Sinyal ve değişkenin ne zaman güncellendiği', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-swap', 'veri-nesneleri', 4, 'tf', 'derived', 'Bir process içinde `a <= b;` ve `b <= a;` yazmak, iki sinyalin değerini takas eder.', '{}', '{"value":true}', 'İki atama da sinyallerin eski değerlerini okur; yeni değerler process askıya alınınca birlikte yazılır. Bu yüzden ara değişken gerekmez.', 2, 'Hafta 4, Sinyal ve değişkenin ne zaman güncellendiği', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-swap-var', 'veri-nesneleri', 4, 'mcq', 'derived', '`v1 = 1` ve `v2 = 2` olan iki değişken için `v1 := v2; v2 := v1;` çalışınca değerler ne olur?', '{"choices":["v1 = 2, v2 = 1","v1 = 2, v2 = 2","v1 = 1, v2 = 1","v1 = 1, v2 = 2"]}', '{"index":1}', 'Değişkenler hemen güncellenir. `v1` önce 2 olur, ardından `v2 := v1` bu yeni değeri okur. Değişkenlerle takas için üçüncü bir değişken gerekir.', 2, 'Hafta 4, Sinyal ve değişkenin ne zaman güncellendiği', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-delta', 'veri-nesneleri', 4, 'fill', 'derived', '`s` sinyalinin değeri `''0''` iken process içinde `s <= ''1'';` ve hemen ardından `x := s;` çalışıyor. `x` kaçtır?', '{"blanks":1}', '{"blanks":[["0","''0''"]]}', 'Sinyal ataması yalnızca bir sonraki delta döngüsünde etkili olur. `x := s` satırı hâlâ eski değeri, yani 0''ı okur.', 2, 'Hafta 4, Sinyal ve değişkenin ne zaman güncellendiği', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-sinyal-sayac', 'veri-nesneleri', 4, 'fill', 'derived', '`c : unsigned(3 downto 0)` sinyali 0 iken bir process''te art arda iki kez `c <= c + 1;` çalışıyor. Process askıya alındıktan sonra `c` kaçtır (ondalık)?', '{"blanks":1}', '{"blanks":[["1"]]}', 'İki satır da `c`''nin eski değeri olan 0''ı okur ve 1 atar. Son atama geçerli olduğundan sonuç 1''dir, 2 değil.', 3, 'Hafta 4, Sinyal ve değişkenin ne zaman güncellendiği', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-after', 'veri-nesneleri', 4, 'tf', 'derived', '`y <= a after 5 ns;` yazılan bir tasarım sentezlenince devrede 5 ns''lik bir gecikme oluşur.', '{}', '{"value":false}', '`after` yalnızca benzetimde anlamlıdır. Sentez araçları bu gecikmeyi yok sayar; gerçek gecikmeyi kullanılan donanım belirler.', 2, 'Hafta 4, Sinyal ve değişkenin ne zaman güncellendiği', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-var-operator', 'veri-nesneleri', 4, 'mcq', 'derived', 'Bir değişkene değer atamak için hangi operatör kullanılır?', '{"choices":["`<=`","`:=`","`=>`","`=`"]}', '{"index":1}', 'Değişkenler `:=` ile atanır. `<=` sinyal ataması, `=>` eşleme, `=` ise karşılaştırmadır.', 1, 'Hafta 4, Değişkenin yeri ve kullanımı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-var-sayac', 'veri-nesneleri', 4, 'fill', 'derived', '`v` tamsayı değişkeni 0 iken process''te `v := v + 1; v := v + 1; y <= v;` çalışıyor. `y`''ye atanan değer kaçtır?', '{"blanks":1}', '{"blanks":[["2"]]}', 'Değişken her satırda hemen güncellenir: önce 1, sonra 2 olur. `y`''ye 2 atanır.', 2, 'Hafta 4, Değişkenin yeri ve kullanımı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-var-kalici', 'veri-nesneleri', 4, 'tf', 'derived', 'Bir process''te bildirilen değişken, process''in bir çalışmasından sonrakine değerini korur.', '{}', '{"value":true}', 'Process''in değişkenleri benzetim başında bir kez ilklenir ve process her uyandığında kaldıkları değerden devam eder. Bu yüzden saatsiz bir process''te okunmadan önce yazılmayan değişken bellek gibi davranır.', 3, 'Hafta 4, Değişkenin yeri ve kullanımı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-var-baska-process', 'veri-nesneleri', 4, 'tf', 'derived', 'Bir process''te bildirilen değişken, aynı mimarideki başka bir process''te okunabilir.', '{}', '{"value":false}', 'Değişken yalnızca bildirildiği process''te görünür. Process''ler arasında veri sinyallerle taşınır.', 2, 'Hafta 4, Değişkenin yeri ve kullanımı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-sabit-atama', 'veri-nesneleri', 4, 'tf', 'derived', '`constant N : integer := 8;` olarak bildirilen sabite process içinde `N := 9;` ile yeni değer verilebilir.', '{}', '{"value":false}', 'Sabitin değeri bildirimde verilir ve sonra değiştirilemez. Değişen bir değer için `variable` ya da `signal` kullanılır.', 1, 'Hafta 4, Değişkenin yeri ve kullanımı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-isim-rakam', 'veri-nesneleri', 4, 'tf', 'derived', '`2giris` geçerli bir sinyal adıdır.', '{}', '{"value":false}', 'VHDL tanımlayıcıları bir harfle başlamalıdır. `giris2` geçerlidir, `2giris` değildir.', 1, 'Hafta 4, İsimlendirme kuralları', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-isim-cift-alt', 'veri-nesneleri', 4, 'mcq', 'derived', 'Hangisi geçerli bir VHDL tanımlayıcısı **değildir**?', '{"choices":["`veri_giris`","`Veri2`","`veri__giris`","`v_1_a`"]}', '{"index":2}', 'Tanımlayıcıda iki alt çizgi yan yana gelemez. Tek alt çizgiler ve rakamlar (ilk karakter dışında) serbesttir.', 2, 'Hafta 4, İsimlendirme kuralları', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-isim-buyuk-kucuk', 'veri-nesneleri', 4, 'tf', 'derived', 'Aynı mimaride `Sayac` ve `SAYAC` adında iki ayrı sinyal bildirilebilir.', '{}', '{"value":false}', 'VHDL büyük ve küçük harf ayırmaz; `Sayac` ile `SAYAC` aynı addır ve ikinci bildirim çakışma hatası verir.', 2, 'Hafta 4, İsimlendirme kuralları', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-isim-son-alt', 'veri-nesneleri', 4, 'tf', 'derived', '`veri_` (alt çizgiyle biten) geçerli bir tanımlayıcıdır.', '{}', '{"value":false}', 'Tanımlayıcı alt çizgiyle bitemez ve alt çizgiyle başlayamaz.', 2, 'Hafta 4, İsimlendirme kuralları', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-dokuz-deger', 'veri-tipleri', 4, 'fill', 'derived', '`std_logic` tipi kaç farklı değer alabilir?', '{"blanks":1}', '{"blanks":[["9","dokuz"]]}', 'U, X, 0, 1, Z, W, L, H ve - olmak üzere dokuz değer vardır.', 1, 'Hafta 4, std_logic değerleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-z-anlam', 'veri-tipleri', 4, 'mcq', 'derived', '`std_logic`''teki `''Z''` değeri neyi gösterir?', '{"choices":["Bilinmeyen değer","Yüksek empedans","Zayıf 0","Önemsiz değer"]}', '{"index":1}', '`''Z''` hattın hiçbir kaynakça sürülmediğini anlatır; üç durumlu (tri-state) çıkışlarda kullanılır.', 1, 'Hafta 4, std_logic değerleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-tire-anlam', 'veri-tipleri', 4, 'mcq', 'derived', '`std_logic`''teki `''-''` değeri neyi gösterir?', '{"choices":["Önemsiz (don''t care)","Zayıf bilinmeyen","Negatif değer","Başlatılmamış"]}', '{"index":0}', '`''-''` değerin önemsiz olduğunu söyler ve sentez aracına sadeleştirme serbestliği verir.', 2, 'Hafta 4, std_logic değerleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-l-anlam', 'veri-tipleri', 4, 'mcq', 'derived', '`''L''` ve `''H''` değerleri neyi gösterir?', '{"choices":["Düşük ve yüksek empedans","Zayıf 0 ve zayıf 1","Mantık 0 ve 1''in ters hali","Saat kenarları"]}', '{"index":1}', '`''L''` zayıf 0, `''H''` zayıf 1''dir; örneğin çekme dirençleri (pull-up, pull-down) böyle modellenir.', 2, 'Hafta 4, std_logic değerleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-x-anlam', 'veri-tipleri', 4, 'mcq', 'derived', 'Benzetimde bir sinyalin `''X''` olması genellikle neye işaret eder?', '{"choices":["Sinyale hiç değer verilmediğine","Sinyalin sürülmediğine","Birden çok kaynağın çeliştiğine","Sinyalin önemsiz olduğuna"]}', '{"index":2}', '`''X''` güçlü bilinmeyendir; tipik nedeni bir kaynağın 0, diğerinin 1 sürmesidir. Hiç değer verilmemiş sinyal `''U''` görünür.', 2, 'Hafta 4, std_logic değerleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-coz-01', 'veri-tipleri', 4, 'fill', 'derived', 'Bir `std_logic` hattını bir kaynak `''0''`, diğeri `''1''` ile sürüyor. Çözümlenen değer nedir?', '{"blanks":1}', '{"blanks":[["X","''X''"]]}', 'İki güçlü değer çelişince sonuç güçlü bilinmeyen `''X''` olur.', 1, 'Hafta 4, Çok sürücü ve çözümleme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-coz-z1', 'veri-tipleri', 4, 'fill', 'derived', 'Bir kaynak `''Z''`, diğeri `''1''` sürüyor. Çözümlenen değer nedir?', '{"blanks":1}', '{"blanks":[["1","''1''"]]}', '`''Z''` hattı sürmez; sonucu diğer kaynak belirler. Ortak veri yollarındaki üç durumlu çıkışlar bu kurala dayanır.', 2, 'Hafta 4, Çok sürücü ve çözümleme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-coz-lh', 'veri-tipleri', 4, 'fill', 'derived', 'Bir kaynak `''L''`, diğeri `''H''` sürüyor. Çözümlenen değer nedir?', '{"blanks":1}', '{"blanks":[["W","''W''"]]}', 'İki zayıf değer çelişince sonuç zayıf bilinmeyen `''W''` olur.', 3, 'Hafta 4, Çok sürücü ve çözümleme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-coz-0l', 'veri-tipleri', 4, 'fill', 'derived', 'Bir kaynak `''0''`, diğeri `''H''` sürüyor. Çözümlenen değer nedir?', '{"blanks":1}', '{"blanks":[["0","''0''"]]}', 'Güçlü değer zayıfı yener. `''0''` güçlü olduğu için zayıf `''H''`''yi bastırır.', 2, 'Hafta 4, Çok sürücü ve çözümleme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-dilim-downto', 'veri-tipleri', 4, 'fill', 'derived', '`a : std_logic_vector(7 downto 0) := "10110010"` için `a(7 downto 4)` nedir?', '{"blanks":1}', '{"blanks":[["1011","\"1011\""]]}', '`downto` vektörde soldaki bit en büyük indekstir. `a(7 downto 4)` soldaki dört bittir: 1011.', 1, 'Hafta 4, Vektör indeksleri ve dilimler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-indeks-to', 'veri-tipleri', 4, 'fill', 'derived', '`b : std_logic_vector(0 to 3) := "1000"` için `b(0)` kaçtır?', '{"blanks":1}', '{"blanks":[["1","''1''"]]}', '`to` ile bildirilen vektörde soldaki bit en küçük indekstir, yani `b(0)` = 1.', 2, 'Hafta 4, Vektör indeksleri ve dilimler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-dilim-yon', 'veri-tipleri', 4, 'tf', 'derived', '`a : std_logic_vector(7 downto 0)` için `a(0 to 3)` dilimi geçerlidir.', '{}', '{"value":false}', 'Dilimin yönü vektörün bildirildiği yönle aynı olmalıdır. Doğru yazım `a(3 downto 0)`''dır.', 3, 'Hafta 4, Vektör indeksleri ve dilimler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-dilim-birlestir', 'veri-tipleri', 4, 'fill', 'derived', '`a : std_logic_vector(3 downto 0) := "1100"` için `a(1 downto 0) & a(3 downto 2)` nedir?', '{"blanks":1}', '{"blanks":[["0011","\"0011\""]]}', 'Alt iki bit (00) sola, üst iki bit (11) sağa yazılır: 0011.', 2, 'Hafta 4, Vektör indeksleri ve dilimler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-hex-bit', 'veri-tipleri', 4, 'fill', 'derived', '`x"A5"` bit dizgisi kaç bit uzunluğundadır?', '{"blanks":1}', '{"blanks":[["8"]]}', 'Her onaltılık basamak 4 bittir; iki basamak 8 bit eder.', 1, 'Hafta 4, Sayı tabanları ve bit dizgileri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-hex-ikili', 'veri-tipleri', 4, 'fill', 'derived', '`x"3C"` ikili olarak nasıl yazılır?', '{"blanks":1}', '{"blanks":[["00111100","\"00111100\""]]}', '3 = 0011 ve C = 1100; yan yana 00111100.', 2, 'Hafta 4, Sayı tabanları ve bit dizgileri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-oktal', 'veri-tipleri', 4, 'fill', 'derived', '`o"17"` sekizlik bit dizgisi ikili olarak nasıl yazılır?', '{"blanks":1}', '{"blanks":[["001111","\"001111\""]]}', 'Her sekizlik basamak 3 bittir: 1 = 001, 7 = 111.', 2, 'Hafta 4, Sayı tabanları ve bit dizgileri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-tabanli-hex', 'veri-tipleri', 4, 'fill', 'derived', '`16#FF#` tamsayı sabitinin ondalık değeri kaçtır?', '{"blanks":1}', '{"blanks":[["255"]]}', '`taban#basamaklar#` yazımında FF onaltılık olarak 15·16 + 15 = 255''tir.', 2, 'Hafta 4, Sayı tabanları ve bit dizgileri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-tabanli-ikili', 'veri-tipleri', 4, 'fill', 'derived', '`2#1010#` tamsayı sabitinin ondalık değeri kaçtır?', '{"blanks":1}', '{"blanks":[["10"]]}', '1010 ikili sayısı 8 + 2 = 10''dur.', 1, 'Hafta 4, Sayı tabanları ve bit dizgileri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-signed-1000', 'veri-tipleri', 4, 'fill', 'derived', '`signed''("1000")` değerinin ondalık karşılığı kaçtır?', '{"blanks":1}', '{"blanks":[["-8"]]}', '4 bitlik ikiye tümleyende en soldaki bit -8 ağırlığındadır; diğer bitler 0 olduğundan sonuç -8.', 2, 'Hafta 4, signed ve unsigned', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-unsigned-1000', 'veri-tipleri', 4, 'fill', 'derived', '`unsigned''("1000")` değerinin ondalık karşılığı kaçtır?', '{"blanks":1}', '{"blanks":[["8"]]}', 'İşaretsiz yorumda en soldaki bit +8 ağırlığındadır.', 1, 'Hafta 4, signed ve unsigned', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-signed-aralik', 'veri-tipleri', 4, 'mcq', 'derived', '8 bitlik `signed` bir sayının alabileceği değer aralığı nedir?', '{"choices":["0 ile 255","-127 ile 127","-128 ile 127","-256 ile 255"]}', '{"index":2}', 'n bitlik ikiye tümleyen aralığı -2ⁿ⁻¹ ile 2ⁿ⁻¹ - 1''dir; n = 8 için -128 ile 127.', 2, 'Hafta 4, signed ve unsigned', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-resize-signed', 'veri-tipleri', 4, 'fill', 'derived', '`resize(signed''("1010"), 8)` sonucu nedir?', '{"blanks":1}', '{"blanks":[["11111010","\"11111010\""]]}', '`signed` için `resize` işaret bitini çoğaltır; -6 değeri 8 bitte de -6 kalır: 11111010.', 3, 'Hafta 4, signed ve unsigned', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-resize-unsigned', 'veri-tipleri', 4, 'fill', 'derived', '`resize(unsigned''("1010"), 8)` sonucu nedir?', '{"blanks":1}', '{"blanks":[["00001010","\"00001010\""]]}', '`unsigned` için `resize` sola sıfır ekler; değer 10 olarak kalır.', 2, 'Hafta 4, signed ve unsigned', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-int-slv', 'veri-tipleri', 4, 'mcq', 'derived', '`n : integer` değerini 8 bitlik bir `std_logic_vector`''e çevirmenin doğru yolu hangisidir?', '{"choices":["`std_logic_vector(n)`","`to_unsigned(std_logic_vector(n), 8)`","`std_logic_vector(to_unsigned(n, 8))`","`to_integer(n, 8)`"]}', '{"index":2}', 'Tamsayı önce `to_unsigned` (ya da `to_signed`) ile bit uzunluğu verilerek sayısal vektöre çevrilir, sonra tip dönüşümüyle `std_logic_vector` yapılır.', 2, 'Hafta 4, Tip dönüşümleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-slv-int', 'veri-tipleri', 4, 'mcq', 'derived', '`v : std_logic_vector(7 downto 0)` değerini işaretsiz tamsayıya çevirmenin doğru yolu hangisidir?', '{"choices":["`to_integer(v)`","`integer(v)`","`to_integer(unsigned(v))`","`unsigned(to_integer(v))`"]}', '{"index":2}', '`std_logic_vector` sayısal anlam taşımaz; önce `unsigned` ya da `signed` olarak yorumlanır, sonra `to_integer` çağrılır.', 2, 'Hafta 4, Tip dönüşümleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-to-signed-neg', 'veri-tipleri', 4, 'fill', 'derived', '`to_signed(-3, 4)` sonucu hangi bit dizisidir?', '{"blanks":1}', '{"blanks":[["1101","\"1101\""]]}', '-3''ün 4 bitlik ikiye tümleyeni: 3 = 0011, tersi 1100, bir eklenince 1101.', 3, 'Hafta 4, Tip dönüşümleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-signed-int', 'veri-tipleri', 4, 'fill', 'derived', '`to_integer(signed''("1110"))` kaçtır?', '{"blanks":1}', '{"blanks":[["-2"]]}', '1110 ikiye tümleyende -8 + 4 + 2 = -2''dir.', 2, 'Hafta 4, Tip dönüşümleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-donusum-maliyet', 'veri-tipleri', 4, 'tf', 'derived', '`unsigned(v)` ya da `std_logic_vector(u)` dönüşümleri sentezde ek donanım üretmez.', '{}', '{"value":true}', 'Bu tipler aynı elemanlardan oluşan yakın tiplerdir; dönüşüm yalnızca bitlerin nasıl yorumlanacağını değiştirir, kablolar aynı kalır.', 2, 'Hafta 4, Tip dönüşümleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-slv-unsigned', 'veri-tipleri', 4, 'tf', 'derived', '`unsigned` tipindeki bir değer, `std_logic_vector` sinyaline dönüşüm yazmadan atanabilir.', '{}', '{"value":false}', 'VHDL tipleri katı biçimde denetler. Atama `y <= std_logic_vector(u);` biçiminde yapılmalıdır.', 2, 'Hafta 4, Tip uyumu ve alt tipler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-bit-stdlogic', 'veri-tipleri', 4, 'tf', 'derived', '`bit` tipindeki bir sinyal `std_logic` sinyaline doğrudan atanabilir.', '{}', '{"value":false}', '`bit` ve `std_logic` farklı tiplerdir. `to_stdulogic` gibi bir dönüşüm fonksiyonu gerekir.', 2, 'Hafta 4, Tip uyumu ve alt tipler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-subtype-uyum', 'veri-tipleri', 4, 'tf', 'derived', '`subtype bayt is std_logic_vector(7 downto 0);` ile bildirilen bir sinyal, `std_logic_vector(7 downto 0)` sinyaline doğrudan atanabilir.', '{}', '{"value":true}', 'Alt tip (subtype) yeni bir tip değildir, temel tipe bir kısıt ekler. Bu yüzden temel tiple serbestçe karışır.', 2, 'Hafta 4, Tip uyumu ve alt tipler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-yeni-tip', 'veri-tipleri', 4, 'tf', 'derived', '`type rakam is range 0 to 9;` ile bildirilen tipteki bir sinyal, `integer` sinyaline doğrudan atanabilir.', '{}', '{"value":false}', '`type` ile bildirilen tamsayı tipi `integer`''dan bağımsız yeni bir tiptir; `integer(r)` dönüşümü gerekir. `subtype` kullanılsaydı atama geçerli olurdu.', 3, 'Hafta 4, Tip uyumu ve alt tipler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-bit-0-15', 'veri-tipleri', 4, 'fill', 'derived', '`integer range 0 to 15` olarak bildirilen bir sinyal sentezde kaç bitle gerçeklenir?', '{"blanks":1}', '{"blanks":[["4"]]}', '0 ile 15 arası 16 değerdir; 2⁴ = 16 olduğundan 4 bit yeter.', 1, 'Hafta 4, integer aralıkları ve bit sayısı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-bit-0-100', 'veri-tipleri', 4, 'fill', 'derived', '`integer range 0 to 100` için kaç bit gerekir?', '{"blanks":1}', '{"blanks":[["7"]]}', '6 bit en fazla 63''ü, 7 bit 127''yi gösterebilir. 100 için 7 bit gerekir.', 2, 'Hafta 4, integer aralıkları ve bit sayısı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-bit-negatif', 'veri-tipleri', 4, 'fill', 'derived', '`integer range -8 to 7` için kaç bit gerekir?', '{"blanks":1}', '{"blanks":[["4"]]}', 'Aralık negatif değer içerdiği için ikiye tümleyen kullanılır; 4 bit -8 ile 7 arasını tam karşılar.', 3, 'Hafta 4, integer aralıkları ve bit sayısı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-aralik-arttirma', 'veri-tipleri', 4, 'tf', 'derived', '`variable v : integer range 0 to 15 := 15;` için `v := v + 1;` benzetimde hataya yol açar.', '{}', '{"value":true}', 'Sonuç 16 olur ve tanımlı aralığın dışına çıkar. Benzetim aralık hatasıyla durur; sayaçlarda sınır kontrolü ya da `mod` kullanılır.', 2, 'Hafta 4, integer aralıkları ve bit sayısı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-dizi-bildirim', 'veri-tipleri', 4, 'mcq', 'derived', 'Her biri 8 bit olan 4 sözcüklük bir bellek için doğru tip bildirimi hangisidir?', '{"choices":["`type bellek is array (0 to 3) of std_logic_vector(7 downto 0);`","`type bellek is std_logic_vector(0 to 3)(7 downto 0);`","`type bellek is array (7 downto 0) of integer range 0 to 3;`","`subtype bellek is std_logic_vector(31 downto 0);`"]}', '{"index":0}', 'Dizi tipinde önce indeks aralığı (sözcük sayısı), sonra eleman tipi (sözcük genişliği) yazılır.', 2, 'Hafta 4, Dizi tipleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-dizi-eleman', 'veri-tipleri', 4, 'fill', 'derived', '`constant m : tablo := ("0001", "0010", "0101");` (indeksler 0''dan başlıyor, elemanlar `std_logic_vector(3 downto 0)`) için `m(2)(0)` kaçtır?', '{"blanks":1}', '{"blanks":[["1","''1''"]]}', '`m(2)` üçüncü eleman olan 0101''dir; bunun 0. biti en sağdaki bit, yani 1''dir.', 2, 'Hafta 4, Dizi tipleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t4-dizi-uzunluk', 'veri-tipleri', 4, 'fill', 'derived', '`type bellek is array (0 to 15) of std_logic_vector(7 downto 0);` tipindeki bir dizinin `''length` değeri kaçtır?', '{"blanks":1}', '{"blanks":[["16"]]}', '`''length` dizideki eleman sayısını verir: 0''dan 15''e 16 eleman. Eleman genişliği bu sayıyı etkilemez.', 1, 'Hafta 4, Dizi tipleri', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-ws-sonuc', 'esz-atamalar', 5, 'fill', 'derived', 'Aşağıdaki kodda `s = "10"` iken `y` nedir?

```
  with s select
    y <= "0001" when "00",
         "0010" when "01",
         "0100" when "10",
         "1000" when others;
```', '{"blanks":1}', '{"blanks":[["0100","\"0100\""]]}', '`with/select` seçici değere eşit olan kolu seçer. `s = "10"` üçüncü koldur: 0100.', 1, 'Hafta 5, with/select', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-ws-dekoder', 'esz-atamalar', 5, 'fill', 'derived', 'Aynı 2''den 4''e kod çözücüde `s = "11"` iken `y` nedir?

```
  with s select
    y <= "0001" when "00",
         "0010" when "01",
         "0100" when "10",
         "1000" when others;
```', '{"blanks":1}', '{"blanks":[["1000","\"1000\""]]}', '"11" açıkça yazılmamıştır ve `others` koluna düşer: 1000.', 2, 'Hafta 5, with/select', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-ws-coklu', 'esz-atamalar', 5, 'mcq', 'derived', '`with/select` içinde aynı değeri birden çok seçim için vermek istiyorsun. Seçimler hangi işaretle ayrılır?', '{"choices":["`,`","`|`","`or`","`;`"]}', '{"index":1}', '`y <= a when "00" | "11",` yazımında `|` "ya da" anlamındadır. Virgül kolları ayırır.', 2, 'Hafta 5, with/select', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-ws-process', 'esz-atamalar', 5, 'tf', 'derived', 'VHDL-93''te `with/select` deyimi bir process''in içinde kullanılabilir.', '{}', '{"value":false}', '`with/select` eşzamanlı bir deyimdir ve process dışında yazılır. Process içinde aynı işi `case` yapar. (VHDL-2008 sıralı biçimine izin verir.)', 2, 'Hafta 5, with/select', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-we-ilk-dogru', 'esz-atamalar', 5, 'fill', 'derived', '`y <= "00" when a = ''1'' else "01" when b = ''1'' else "10";` deyiminde `a = ''1''` ve `b = ''1''` iken `y` nedir?', '{"blanks":1}', '{"blanks":[["00","\"00\""]]}', '`when/else` koşulları sırayla dener ve doğru olan ilk kolu seçer. `a = ''1''` ilk sırada olduğu için `b`''ye bakılmaz.', 1, 'Hafta 5, when/else ve öncelik', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-oncelik-kodlayici', 'esz-atamalar', 5, 'fill', 'derived', 'Aşağıdaki öncelik kodlayıcıda (priority encoder) `d = "0110"` iken `y` nedir?

```
  y <= "11" when d(3) = ''1'' else
       "10" when d(2) = ''1'' else
       "01" when d(1) = ''1'' else
       "00";
```', '{"blanks":1}', '{"blanks":[["10","\"10\""]]}', 'Önce en yüksek bit `d(3)` denenir ve 0''dır. Ardından `d(2) = ''1''` bulunur; `d(1)`''in de 1 olması sonucu değiştirmez.', 2, 'Hafta 5, when/else ve öncelik', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-oncelik-kodlayici2', 'esz-atamalar', 5, 'fill', 'derived', 'Aynı öncelik kodlayıcıda `d = "0011"` iken `y` nedir?

```
  y <= "11" when d(3) = ''1'' else
       "10" when d(2) = ''1'' else
       "01" when d(1) = ''1'' else
       "00";
```', '{"blanks":1}', '{"blanks":[["01","\"01\""]]}', '`d(3)` ve `d(2)` sıfırdır; ilk bir `d(1)`''dedir. `d(0)`''ın kodu yazılmadığından o da "00" verirdi.', 2, 'Hafta 5, when/else ve öncelik', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-hassas-eksik', 'sirali-kod', 5, 'fill', 'derived', '`process (a) begin y <= a and b; end process;` benzetimde `a = ''1''`, `b = ''0''` ile başlıyor. Sonra yalnızca `b` 1 oluyor. `y` kaçtır?', '{"blanks":1}', '{"blanks":[["0","''0''"]]}', 'Process yalnızca `a` değişince uyanır. `b`''nin değişimi process''i çalıştırmaz ve `y` eski değeri 0''da kalır. Sentezlenen devre ise AND kapısı olur; benzetim ile donanım ayrışır.', 3, 'Hafta 5, process ve hassasiyet listesi', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-hassas-wait', 'sirali-kod', 5, 'tf', 'derived', 'Hassasiyet listesi olan bir process içinde `wait` deyimi kullanılabilir.', '{}', '{"value":false}', 'Bir process ya hassasiyet listesiyle ya da `wait` deyimleriyle askıya alınır; ikisi birlikte kullanılamaz.', 2, 'Hafta 5, process ve hassasiyet listesi', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-process-baslangic', 'sirali-kod', 5, 'tf', 'derived', 'Her process, hassasiyet listesindeki sinyaller hiç değişmese bile benzetimin başında bir kez çalışır.', '{}', '{"value":true}', 'Benzetim başlarken tüm process''ler bir kez askıya alınana kadar çalışır. Bu yüzden kombinasyonel çıkışlar ilk anda da hesaplanır.', 2, 'Hafta 5, process ve hassasiyet listesi', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-process-all', 'sirali-kod', 5, 'mcq', 'derived', 'VHDL-2008''deki `process (all)` yazımı ne anlama gelir?', '{"choices":["Process tasarımdaki tüm sinyallerde uyanır","Okunan tüm sinyaller listeye eklenir","Process hiç askıya alınmaz","Process tüm saat kenarlarında çalışır"]}', '{"index":1}', '`all`, process''in okuduğu sinyalleri otomatik olarak listeye ekler ve eksik hassasiyet hatasını önler.', 2, 'Hafta 5, process ve hassasiyet listesi', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-if-sonuc', 'sirali-kod', 5, 'fill', 'derived', '`if x > 10 then y := 2; elsif x > 5 then y := 1; else y := 0; end if;` deyiminde `x = 12` iken `y` kaçtır?', '{"blanks":1}', '{"blanks":[["2"]]}', 'İlk koşul `12 > 10` doğrudur; `elsif` ve `else` kollarına bakılmaz.', 1, 'Hafta 5, if ve case', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-if-sonuc2', 'sirali-kod', 5, 'fill', 'derived', 'Aynı `if` deyiminde (`x > 10` ise 2, `x > 5` ise 1, değilse 0) `x = 7` iken `y` kaçtır?', '{"blanks":1}', '{"blanks":[["1"]]}', '`7 > 10` yanlış, `7 > 5` doğrudur; ikinci kol çalışır.', 1, 'Hafta 5, if ve case', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-case-tekrar', 'sirali-kod', 5, 'tf', 'derived', 'Bir `case` deyiminde aynı seçim değeri iki farklı kolda yazılabilir.', '{}', '{"value":false}', '`case` kollarının seçimleri çakışmamalı ve tüm değerleri kapsamalıdır. Aynı değeri iki kez yazmak derleme hatasıdır.', 2, 'Hafta 5, if ve case', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-case-aralik', 'sirali-kod', 5, 'mcq', 'derived', '`n : integer range 0 to 7` için `case` deyiminde 0''dan 3''e kadar olan değerleri tek kolda toplamanın yolu hangisidir?', '{"choices":["`when 0 to 3 =>`","`when 0..3 =>`","`when (0, 3) =>`","`when 0 - 3 =>`"]}', '{"index":0}', 'Tamsayı seçimlerinde aralık `to` ile yazılır. Ayrık değerler için `|` kullanılır: `when 0 | 2 =>`.', 2, 'Hafta 5, if ve case', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-case-null', 'sirali-kod', 5, 'mcq', 'derived', '`case` deyiminin bir kolunda hiçbir şey yapılmaması isteniyor. Bu kola ne yazılır?', '{"choices":["Hiçbir şey, kol boş bırakılır","`null;`","`exit;`","`wait;`"]}', '{"index":1}', 'Her kolun en az bir deyimi olmalıdır; "hiçbir şey yapma" `null;` ile söylenir, örneğin `when others => null;`.', 1, 'Hafta 5, if ve case', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-if-mandal', 'sirali-kod', 5, 'tf', 'derived', 'Kombinasyonel bir process''te bir çıkış bazı koşullarda hiç atanmıyorsa sentez aracı bir mandal (latch) oluşturur.', '{}', '{"value":true}', 'Atanmayan yolda çıkış eski değerini korumak zorundadır ve bu bellek demektir. Önlemek için her kolda atama yapılır ya da process başında varsayılan değer verilir.', 2, 'Hafta 5, if ve case', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-for-sayi', 'sirali-kod', 5, 'fill', 'derived', '`for i in 7 downto 2 loop` döngüsü kaç kez çalışır?', '{"blanks":1}', '{"blanks":[["6"]]}', 'i sırasıyla 7, 6, 5, 4, 3, 2 değerlerini alır: 6 tur.', 1, 'Hafta 5, Döngüler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-birleri-say', 'sirali-kod', 5, 'fill', 'derived', 'Bir `for` döngüsü `a = "10110100"` vektöründeki 1''leri sayıyor. Sonuç kaçtır?', '{"blanks":1}', '{"blanks":[["4"]]}', '1''ler 7, 5, 4 ve 2 numaralı bitlerdedir: toplam 4.', 2, 'Hafta 5, Döngüler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-for-indeks-atama', 'sirali-kod', 5, 'tf', 'derived', '`for` döngüsünün indeksine döngü içinde `i := 3;` gibi bir değer atanabilir.', '{}', '{"value":false}', 'Döngü indeksi döngü içinde sabit gibidir; okunabilir ama değiştirilemez.', 2, 'Hafta 5, Döngüler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-exit-next', 'sirali-kod', 5, 'mcq', 'derived', 'Döngünün o anki turunu atlayıp bir sonraki tura geçen deyim hangisidir?', '{"choices":["`exit`","`next`","`null`","`return`"]}', '{"index":1}', '`next` sonraki tura geçer, `exit` döngüden tamamen çıkar.', 2, 'Hafta 5, Döngüler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-ters-cevir', 'sirali-kod', 5, 'fill', 'derived', '`for i in 0 to 7 loop y(i) <= a(7 - i); end loop;` döngüsünde `a = "11010000"` ise `y` nedir?', '{"blanks":1}', '{"blanks":[["00001011","\"00001011\""]]}', 'Döngü bit sırasını ters çevirir: `a` sağdan sola okunur ve 00001011 elde edilir.', 3, 'Hafta 5, Döngüler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-sayac-18', 'sirali-kod', 5, 'fill', 'derived', '`q : unsigned(3 downto 0)` sayacı 0''dan başlıyor ve her yükselen kenarda `q <= q + 1;` çalışıyor. 18 yükselen kenardan sonra `q` kaçtır (ondalık)?', '{"blanks":1}', '{"blanks":[["2"]]}', '4 bitlik sayaç 15''ten sonra 0''a döner. 18 mod 16 = 2.', 2, 'Hafta 5, Saatli devreler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-kaydirma', 'sirali-kod', 5, 'fill', 'derived', '4 bitlik kaydırma yazmacı her yükselen kenarda `q <= q(2 downto 0) & din;` çalıştırıyor. `q = "0000"` iken `din` sırasıyla 1, 0, 1, 1 veriliyor. Dört kenardan sonra `q` nedir?', '{"blanks":1}', '{"blanks":[["1011","\"1011\""]]}', 'Her kenarda bitler sola kayar ve yeni bit sağdan girer: 0001, 0010, 0101, 1011.', 3, 'Hafta 5, Saatli devreler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-asenkron-reset', 'sirali-kod', 5, 'mcq', 'derived', 'Asenkron resetli bir D flip-flop için doğru process yapısı hangisidir?', '{"choices":["`process (clk) begin if rising_edge(clk) then if rst = ''1'' then q <= ''0''; else q <= d; end if; end if; end process;`","`process (clk, rst) begin if rst = ''1'' then q <= ''0''; elsif rising_edge(clk) then q <= d; end if; end process;`","`process (d) begin if rst = ''1'' then q <= ''0''; else q <= d; end if; end process;`","`process (rst) begin if rising_edge(clk) then q <= d; end if; end process;`"]}', '{"index":1}', 'Asenkron reset saati beklemez: `rst` hassasiyet listesinde olur ve saat kenarından önce denetlenir. İlk seçenek senkron resettir.', 2, 'Hafta 5, Saatli devreler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-senkron-liste', 'sirali-kod', 5, 'tf', 'derived', 'Senkron resetli bir D flip-flop''un process''inde hassasiyet listesine yalnızca `clk` yazmak yeterlidir.', '{}', '{"value":true}', 'Senkron reset yalnızca saat kenarında denetlenir; çıkış ancak `clk` değişince değişebileceği için `rst` ve `d` listeye gerekmez.', 2, 'Hafta 5, Saatli devreler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('t5-kenar-esdeger', 'sirali-kod', 5, 'mcq', 'derived', '`rising_edge(clk)` yerine kullanılabilen klasik yazım hangisidir?', '{"choices":["`clk = ''1''`","`clk''event and clk = ''1''`","`clk''event and clk = ''0''`","`clk''stable`"]}', '{"index":1}', '`clk''event` sinyalin o anda değiştiğini, `clk = ''1''` yeni değerin 1 olduğunu söyler: yükselen kenar. `rising_edge` ayrıca ''X''ten 1''e geçişleri dışarıda bırakır.', 1, 'Hafta 5, Saatli devreler', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;

UPDATE questions SET kavram = 'fpga-yapi', yedek = 0 WHERE id = 'h1-fpga-acilim';
UPDATE questions SET kavram = 'fpga-asic', yedek = 0 WHERE id = 'h1-fpga-asic-nre';
UPDATE questions SET kavram = 'fpga-asic', yedek = 0 WHERE id = 'h1-asic-seri-uretim';
UPDATE questions SET kavram = 'fpga-asic', yedek = 0 WHERE id = 'h1-fpga-guncelleme';
UPDATE questions SET kavram = 'fpga-cpu', yedek = 0 WHERE id = 'h1-fpga-cpu-paralel';
UPDATE questions SET kavram = 'fpga-asic', yedek = 0 WHERE id = 'h1-asic-analog';
UPDATE questions SET kavram = 'fpga-asic', yedek = 0 WHERE id = 'h1-esneklik-verim';
UPDATE questions SET kavram = 'fpga-asic', yedek = 0 WHERE id = 'h1-prototip';
UPDATE questions SET kavram = 'fpga-cpu', yedek = 0 WHERE id = 'h1-fpga-cpu-avantaj';
UPDATE questions SET kavram = 'entegre-olcek', yedek = 0 WHERE id = 'h1-entegre-olcek';
UPDATE questions SET kavram = 'entegre-olcek', yedek = 0 WHERE id = 'h1-7400-ssi';
UPDATE questions SET kavram = 'pld-diziler', yedek = 0 WHERE id = 'h2-prom-dizi';
UPDATE questions SET kavram = 'pld-diziler', yedek = 0 WHERE id = 'h2-pal-dizi';
UPDATE questions SET kavram = 'pld-diziler', yedek = 0 WHERE id = 'h2-pla-dizi';
UPDATE questions SET kavram = 'pld-diziler', yedek = 0 WHERE id = 'h2-pal-pla-paylasim';
UPDATE questions SET kavram = 'pld-diziler', yedek = 0 WHERE id = 'h2-prom-terim';
UPDATE questions SET kavram = 'pla-tasarim', yedek = 0 WHERE id = 'h2-pla-fonksiyon';
UPDATE questions SET kavram = 'pla-tasarim', yedek = 0 WHERE id = 'h2-pla-terim-sayisi';
UPDATE questions SET kavram = 'fpga-yapi', yedek = 0 WHERE id = 'h2-tarihce-sira';
UPDATE questions SET kavram = 'fpga-yapi', yedek = 0 WHERE id = 'h2-cpld';
UPDATE questions SET kavram = 'fpga-yapi', yedek = 0 WHERE id = 'h2-fpga-yapi';
UPDATE questions SET kavram = 'lut-clb', yedek = 0 WHERE id = 'h2-clb-lut';
UPDATE questions SET kavram = 'lut-clb', yedek = 0 WHERE id = 'h2-lut-bit';
UPDATE questions SET kavram = 'tasarim-akisi', yedek = 0 WHERE id = 'h2-akis-sira';
UPDATE questions SET kavram = 'tasarim-akisi', yedek = 0 WHERE id = 'h2-sentez';
UPDATE questions SET kavram = 'tasarim-akisi', yedek = 0 WHERE id = 'h2-yonlendirme';
UPDATE questions SET kavram = 'modelleme', yedek = 0 WHERE id = 'h2-modelleme-yapisal';
UPDATE questions SET kavram = 'modelleme', yedek = 0 WHERE id = 'h2-modelleme-kod';
UPDATE questions SET kavram = 'vivado', yedek = 0 WHERE id = 'h2-vivado-rtl';
UPDATE questions SET kavram = 'vivado', yedek = 0 WHERE id = 'h2-vivado-parca';
UPDATE questions SET kavram = 'tasarim-akisi', yedek = 0 WHERE id = 'h2-simulasyon-amac';
UPDATE questions SET kavram = 'vhdl-yapi', yedek = 0 WHERE id = 'h3-uc-bolum';
UPDATE questions SET kavram = 'vhdl-yapi', yedek = 0 WHERE id = 'h3-std-work';
UPDATE questions SET kavram = 'port-modlari', yedek = 0 WHERE id = 'h3-port-inout';
UPDATE questions SET kavram = 'port-modlari', yedek = 0 WHERE id = 'h3-out-okuma';
UPDATE questions SET kavram = 'vhdl-yapi', yedek = 0 WHERE id = 'h3-entity-hata';
UPDATE questions SET kavram = 'vhdl-yapi', yedek = 0 WHERE id = 'h3-architecture-of';
UPDATE questions SET kavram = 'toplayici', yedek = 0 WHERE id = 'h3-yarim-toplayici';
UPDATE questions SET kavram = 'toplayici', yedek = 0 WHERE id = 'h3-yarim-toplayici-kod';
UPDATE questions SET kavram = 'toplayici', yedek = 0 WHERE id = 'h3-tam-toplayici';
UPDATE questions SET kavram = 'toplayici', yedek = 0 WHERE id = 'h3-tam-toplayici-cout';
UPDATE questions SET kavram = 'atama-zamani', yedek = 0 WHERE id = 'h3-atama-variable';
UPDATE questions SET kavram = 'others-atama', yedek = 0 WHERE id = 'h3-others-to';
UPDATE questions SET kavram = 'mantik-operatorleri', yedek = 0 WHERE id = 'h3-not-oncelik';
UPDATE questions SET kavram = 'mantik-operatorleri', yedek = 0 WHERE id = 'h3-karisik-op';
UPDATE questions SET kavram = 'mantik-operatorleri', yedek = 0 WHERE id = 'h3-nand-zincir';
UPDATE questions SET kavram = 'mod-rem', yedek = 0 WHERE id = 'h3-mod-rem-pozitif';
UPDATE questions SET kavram = 'mod-rem', yedek = 0 WHERE id = 'h3-mod-rem-negatif-bolen';
UPDATE questions SET kavram = 'mod-rem', yedek = 0 WHERE id = 'h3-mod-rem-negatif-bolunen';
UPDATE questions SET kavram = 'mod-rem', yedek = 0 WHERE id = 'h3-mod-rem-isaret';
UPDATE questions SET kavram = 'mod-rem', yedek = 0 WHERE id = 'h3-bolme-sentez';
UPDATE questions SET kavram = 'aritmetik-tasma', yedek = 0 WHERE id = 'h3-ornek3';
UPDATE questions SET kavram = 'aritmetik-tasma', yedek = 0 WHERE id = 'h3-ornek3-tasma';
UPDATE questions SET kavram = 'numeric-std-islem', yedek = 0 WHERE id = 'h3-slv-toplama';
UPDATE questions SET kavram = 'kaydirma-birlestirme', yedek = 0 WHERE id = 'h3-kaydirma';
UPDATE questions SET kavram = 'karsilastirma', yedek = 0 WHERE id = 'h3-esit-degil';
UPDATE questions SET kavram = 'karsilastirma', yedek = 0 WHERE id = 'h3-kucuk-esit';
UPDATE questions SET kavram = 'kaydirma-birlestirme', yedek = 0 WHERE id = 'h3-birlestirme';
UPDATE questions SET kavram = 'dizi-nitelikleri', yedek = 0 WHERE id = 'h3-attr-downto';
UPDATE questions SET kavram = 'dizi-nitelikleri', yedek = 0 WHERE id = 'h3-attr-to';
UPDATE questions SET kavram = 'dizi-nitelikleri', yedek = 0 WHERE id = 'h3-attr-reverse';
UPDATE questions SET kavram = 'dizi-nitelikleri', yedek = 0 WHERE id = 'h3-attr-dongu';
UPDATE questions SET kavram = 'sinyal-nitelikleri', yedek = 0 WHERE id = 'h3-kenar-algilama';
UPDATE questions SET kavram = 'sinyal-nitelikleri', yedek = 0 WHERE id = 'h3-sentezlenebilir-nitelik';
UPDATE questions SET kavram = 'sinyal-nitelikleri', yedek = 0 WHERE id = 'h3-last-value';
UPDATE questions SET kavram = 'enum-nitelikleri', yedek = 0 WHERE id = 'h3-enum-encoding';
UPDATE questions SET kavram = 'enum-nitelikleri', yedek = 0 WHERE id = 'h3-pos-val';
UPDATE questions SET kavram = 'generic', yedek = 0 WHERE id = 'h3-generic-atama';
UPDATE questions SET kavram = 'generic', yedek = 0 WHERE id = 'h3-generic-yer';
UPDATE questions SET kavram = 'generic', yedek = 0 WHERE id = 'h3-generic-genislik';
UPDATE questions SET kavram = 'kullanici-nitelik', yedek = 0 WHERE id = 'h3-overload';
UPDATE questions SET kavram = 'kullanici-nitelik', yedek = 0 WHERE id = 'h3-kullanici-nitelik';
UPDATE questions SET kavram = 'variable-kullanim', yedek = 0 WHERE id = 'h4-variable-yer';
UPDATE questions SET kavram = 'atama-zamani', yedek = 0 WHERE id = 'h4-signal-guncelleme';
UPDATE questions SET kavram = 'atama-zamani', yedek = 0 WHERE id = 'h4-variable-guncelleme';
UPDATE questions SET kavram = 'atama-zamani', yedek = 0 WHERE id = 'h4-uc-atama';
UPDATE questions SET kavram = 'atama-zamani', yedek = 0 WHERE id = 'h4-birler-signal';
UPDATE questions SET kavram = 'variable-kullanim', yedek = 0 WHERE id = 'h4-birler-variable';
UPDATE questions SET kavram = 'variable-kullanim', yedek = 0 WHERE id = 'h4-nand-variable';
UPDATE questions SET kavram = 'variable-kullanim', yedek = 0 WHERE id = 'h4-nand-variable-2';
UPDATE questions SET kavram = 'atama-zamani', yedek = 0 WHERE id = 'h4-nand-signal-sabit';
UPDATE questions SET kavram = 'variable-kullanim', yedek = 0 WHERE id = 'h4-variable-disarida';
UPDATE questions SET kavram = 'port-modlari', yedek = 0 WHERE id = 'h4-out-okuma-cozum';
UPDATE questions SET kavram = 'tanimlayicilar', yedek = 0 WHERE id = 'h4-isim-gecerli';
UPDATE questions SET kavram = 'tanimlayicilar', yedek = 0 WHERE id = 'h4-isim-gecersiz';
UPDATE questions SET kavram = 'tanimlayicilar', yedek = 0 WHERE id = 'h4-anahtar-sozcuk';
UPDATE questions SET kavram = 'std-logic-degerleri', yedek = 0 WHERE id = 'h4-std-ulogic-deger';
UPDATE questions SET kavram = 'std-logic-degerleri', yedek = 0 WHERE id = 'h4-u-degeri';
UPDATE questions SET kavram = 'cozumleme', yedek = 0 WHERE id = 'h4-cozumleme';
UPDATE questions SET kavram = 'cozumleme', yedek = 0 WHERE id = 'h4-ulogic-coklu';
UPDATE questions SET kavram = 'numeric-std-islem', yedek = 0 WHERE id = 'h4-bit-toplama';
UPDATE questions SET kavram = 'vektor-indeks', yedek = 0 WHERE id = 'h4-to-indeks';
UPDATE questions SET kavram = 'sayi-tabani', yedek = 0 WHERE id = 'h4-hex-oktal';
UPDATE questions SET kavram = 'sayi-tabani', yedek = 0 WHERE id = 'h4-sayi-tabani';
UPDATE questions SET kavram = 'sayi-tabani', yedek = 0 WHERE id = 'h4-alt-cizgi';
UPDATE questions SET kavram = 'signed-unsigned', yedek = 0 WHERE id = 'h4-signed-deger';
UPDATE questions SET kavram = 'signed-unsigned', yedek = 0 WHERE id = 'h4-signed-karsilastirma';
UPDATE questions SET kavram = 'numeric-std-islem', yedek = 0 WHERE id = 'h4-unsigned-and';
UPDATE questions SET kavram = 'numeric-std-islem', yedek = 0 WHERE id = 'h4-slv-toplama';
UPDATE questions SET kavram = 'tip-donusumu', yedek = 0 WHERE id = 'h4-to-integer';
UPDATE questions SET kavram = 'tip-donusumu', yedek = 0 WHERE id = 'h4-tek-bit-to-integer';
UPDATE questions SET kavram = 'tip-donusumu', yedek = 0 WHERE id = 'h4-bit-vektor-hilesi';
UPDATE questions SET kavram = 'tip-uyumu', yedek = 0 WHERE id = 'h4-tip-uyumu';
UPDATE questions SET kavram = 'tip-uyumu', yedek = 0 WHERE id = 'h4-subtype-atama';
UPDATE questions SET kavram = 'tip-uyumu', yedek = 0 WHERE id = 'h4-subtype-aralik';
UPDATE questions SET kavram = 'integer-aralik', yedek = 0 WHERE id = 'h4-integer-bit';
UPDATE questions SET kavram = 'integer-aralik', yedek = 0 WHERE id = 'h4-aralik-disi';
UPDATE questions SET kavram = 'integer-aralik', yedek = 0 WHERE id = 'h4-carpim-aralik';
UPDATE questions SET kavram = 'diziler', yedek = 0 WHERE id = 'h4-dizi-atama';
UPDATE questions SET kavram = 'diziler', yedek = 0 WHERE id = 'h4-2d-erisim';
UPDATE questions SET kavram = 'diziler', yedek = 0 WHERE id = 'h4-bellek-tipi';
UPDATE questions SET kavram = 'diziler', yedek = 0 WHERE id = 'h4-port-dizisi';
UPDATE questions SET kavram = 'tip-donusumu', yedek = 0 WHERE id = 'h4-shift-and-add';
UPDATE questions SET kavram = 'vektor-indeks', yedek = 0 WHERE id = 'h4-hafta4-3-d';
UPDATE questions SET kavram = 'cozumleme', yedek = 0 WHERE id = 'h4-multiple-driven';
UPDATE questions SET kavram = 'vektor-indeks', yedek = 0 WHERE id = 'h4-hafta4-3-e';
UPDATE questions SET kavram = 'with-select', yedek = 0 WHERE id = 'h5-with-select-mux';
UPDATE questions SET kavram = 'when-else', yedek = 0 WHERE id = 'h5-when-else-latch';
UPDATE questions SET kavram = 'when-else', yedek = 0 WHERE id = 'h5-oncelikli-mux-or';
UPDATE questions SET kavram = 'when-else', yedek = 0 WHERE id = 'h5-oncelikli-secim';
UPDATE questions SET kavram = 'with-select', yedek = 0 WHERE id = 'h5-with-others-zorunlu';
UPDATE questions SET kavram = 'when-else', yedek = 0 WHERE id = 'h5-select-oncelik';
UPDATE questions SET kavram = 'with-select', yedek = 0 WHERE id = 'h5-select-tekrar';
UPDATE questions SET kavram = 'others-atama', yedek = 0 WHERE id = 'h5-others-hepsi';
UPDATE questions SET kavram = 'others-atama', yedek = 0 WHERE id = 'h5-others-karisik';
UPDATE questions SET kavram = 'when-else', yedek = 0 WHERE id = 'h5-kosullu-z';
UPDATE questions SET kavram = 'with-select', yedek = 0 WHERE id = 'h5-secilmis-x';
UPDATE questions SET kavram = 'process-hassasiyet', yedek = 0 WHERE id = 'h5-process-tetik';
UPDATE questions SET kavram = 'process-hassasiyet', yedek = 0 WHERE id = 'h5-eksik-hassasiyet';
UPDATE questions SET kavram = 'if-case', yedek = 0 WHERE id = 'h5-if-oncelik';
UPDATE questions SET kavram = 'if-case', yedek = 0 WHERE id = 'h5-case-others';
UPDATE questions SET kavram = 'if-case', yedek = 0 WHERE id = 'h5-case-sinyal';
UPDATE questions SET kavram = 'donguler', yedek = 0 WHERE id = 'h5-for-sayi';
UPDATE questions SET kavram = 'donguler', yedek = 0 WHERE id = 'h5-arama-modulu';
UPDATE questions SET kavram = 'donguler', yedek = 0 WHERE id = 'h5-for-statik';
UPDATE questions SET kavram = 'variable-kullanim', yedek = 0 WHERE id = 'h5-variable-yeri';
UPDATE questions SET kavram = 'process-hassasiyet', yedek = 0 WHERE id = 'h5-wait-liste';
UPDATE questions SET kavram = 'toplayici', yedek = 0 WHERE id = 'k-yarim-toplayici';
UPDATE questions SET kavram = 'toplayici', yedek = 0 WHERE id = 'k-tam-toplayici';
UPDATE questions SET kavram = 'karsilastirma', yedek = 0 WHERE id = 'k-karsilastirici';
UPDATE questions SET kavram = 'with-select', yedek = 0 WHERE id = 'k-mux4';
UPDATE questions SET kavram = 'when-else', yedek = 0 WHERE id = 'k-oncelik';
UPDATE questions SET kavram = 'variable-kullanim', yedek = 0 WHERE id = 'k-birler';
UPDATE questions SET kavram = 'saatli-devre', yedek = 0 WHERE id = 'k-sayac';
UPDATE questions SET kavram = 'saatli-devre', yedek = 0 WHERE id = 'k-kenar';
UPDATE questions SET kavram = 'saatli-devre', yedek = 0 WHERE id = 'k-dizi101';
UPDATE questions SET kavram = 'fpga-asic', yedek = 0 WHERE id = 't1-nre-tanim';
UPDATE questions SET kavram = 'fpga-asic', yedek = 0 WHERE id = 't1-asic-hata';
UPDATE questions SET kavram = 'fpga-asic', yedek = 1 WHERE id = 't1-dusuk-adet';
UPDATE questions SET kavram = 'fpga-asic', yedek = 1 WHERE id = 't1-asic-guc';
UPDATE questions SET kavram = 'fpga-asic', yedek = 1 WHERE id = 't1-kesisim';
UPDATE questions SET kavram = 'fpga-asic', yedek = 0 WHERE id = 't1-prototip-neden';
UPDATE questions SET kavram = 'fpga-cpu', yedek = 0 WHERE id = 't1-paralel-sayi';
UPDATE questions SET kavram = 'fpga-cpu', yedek = 0 WHERE id = 't1-donanim-tanim';
UPDATE questions SET kavram = 'fpga-cpu', yedek = 1 WHERE id = 't1-cpu-uygun';
UPDATE questions SET kavram = 'fpga-cpu', yedek = 1 WHERE id = 't1-zamanlama';
UPDATE questions SET kavram = 'entegre-olcek', yedek = 0 WHERE id = 't1-vlsi';
UPDATE questions SET kavram = 'entegre-olcek', yedek = 1 WHERE id = 't1-msi-ornek';
UPDATE questions SET kavram = 'fpga-yapi', yedek = 0 WHERE id = 't2-bitstream';
UPDATE questions SET kavram = 'fpga-yapi', yedek = 1 WHERE id = 't2-iob';
UPDATE questions SET kavram = 'fpga-yapi', yedek = 0 WHERE id = 't2-ek-kaynak';
UPDATE questions SET kavram = 'fpga-yapi', yedek = 1 WHERE id = 't2-yeniden';
UPDATE questions SET kavram = 'pld-diziler', yedek = 1 WHERE id = 't2-pal-or-sabit';
UPDATE questions SET kavram = 'pld-diziler', yedek = 0 WHERE id = 't2-prom-4giris';
UPDATE questions SET kavram = 'pld-diziler', yedek = 1 WHERE id = 't2-prom-minterim';
UPDATE questions SET kavram = 'pld-diziler', yedek = 0 WHERE id = 't2-pla-dezavantaj';
UPDATE questions SET kavram = 'pld-diziler', yedek = 1 WHERE id = 't2-sop';
UPDATE questions SET kavram = 'pla-tasarim', yedek = 0 WHERE id = 't2-pla-paylasim-sayi';
UPDATE questions SET kavram = 'pla-tasarim', yedek = 1 WHERE id = 't2-pal-terim-sayi';
UPDATE questions SET kavram = 'pla-tasarim', yedek = 0 WHERE id = 't2-pla-deger';
UPDATE questions SET kavram = 'lut-clb', yedek = 0 WHERE id = 't2-lut-4';
UPDATE questions SET kavram = 'lut-clb', yedek = 1 WHERE id = 't2-lut-xor';
UPDATE questions SET kavram = 'lut-clb', yedek = 0 WHERE id = 't2-lut-nand';
UPDATE questions SET kavram = 'lut-clb', yedek = 1 WHERE id = 't2-lut-her-fonksiyon';
UPDATE questions SET kavram = 'lut-clb', yedek = 0 WHERE id = 't2-clb-ff';
UPDATE questions SET kavram = 'tasarim-akisi', yedek = 0 WHERE id = 't2-yerlestirme';
UPDATE questions SET kavram = 'tasarim-akisi', yedek = 1 WHERE id = 't2-benzetim-erken';
UPDATE questions SET kavram = 'tasarim-akisi', yedek = 1 WHERE id = 't2-zamanlama-adim';
UPDATE questions SET kavram = 'tasarim-akisi', yedek = 0 WHERE id = 't2-akis-sonraki';
UPDATE questions SET kavram = 'modelleme', yedek = 0 WHERE id = 't2-davranissal-kod';
UPDATE questions SET kavram = 'modelleme', yedek = 1 WHERE id = 't2-yapisal-ornek';
UPDATE questions SET kavram = 'modelleme', yedek = 0 WHERE id = 't2-karma';
UPDATE questions SET kavram = 'vivado', yedek = 1 WHERE id = 't2-rtl-sema';
UPDATE questions SET kavram = 'vivado', yedek = 0 WHERE id = 't2-part-secim';
UPDATE questions SET kavram = 'vhdl-yapi', yedek = 0 WHERE id = 't3-end-satiri';
UPDATE questions SET kavram = 'vhdl-yapi', yedek = 0 WHERE id = 't3-use-satiri';
UPDATE questions SET kavram = 'vhdl-yapi', yedek = 1 WHERE id = 't3-coklu-arch';
UPDATE questions SET kavram = 'vhdl-yapi', yedek = 1 WHERE id = 't3-port-yazimi';
UPDATE questions SET kavram = 'port-modlari', yedek = 0 WHERE id = 't3-buffer';
UPDATE questions SET kavram = 'port-modlari', yedek = 0 WHERE id = 't3-in-yazma';
UPDATE questions SET kavram = 'port-modlari', yedek = 1 WHERE id = 't3-ara-sinyal';
UPDATE questions SET kavram = 'toplayici', yedek = 0 WHERE id = 't3-yarim-01';
UPDATE questions SET kavram = 'toplayici', yedek = 1 WHERE id = 't3-tam-111';
UPDATE questions SET kavram = 'toplayici', yedek = 0 WHERE id = 't3-tam-s-ifade';
UPDATE questions SET kavram = 'toplayici', yedek = 1 WHERE id = 't3-yarim-eksik';
UPDATE questions SET kavram = 'mantik-operatorleri', yedek = 0 WHERE id = 't3-xnor';
UPDATE questions SET kavram = 'mantik-operatorleri', yedek = 1 WHERE id = 't3-nor-zincir';
UPDATE questions SET kavram = 'mantik-operatorleri', yedek = 0 WHERE id = 't3-and-or-parantez';
UPDATE questions SET kavram = 'mantik-operatorleri', yedek = 1 WHERE id = 't3-not-oncelik2';
UPDATE questions SET kavram = 'mod-rem', yedek = 0 WHERE id = 't3-mod-7-3';
UPDATE questions SET kavram = 'mod-rem', yedek = 1 WHERE id = 't3-mod-neg-b';
UPDATE questions SET kavram = 'mod-rem', yedek = 0 WHERE id = 't3-mod-neg-a';
UPDATE questions SET kavram = 'mod-rem', yedek = 1 WHERE id = 't3-bolme-kuvvet';
UPDATE questions SET kavram = 'aritmetik-tasma', yedek = 0 WHERE id = 't3-tasma-4bit';
UPDATE questions SET kavram = 'aritmetik-tasma', yedek = 1 WHERE id = 't3-elde-bit';
UPDATE questions SET kavram = 'aritmetik-tasma', yedek = 1 WHERE id = 't3-cikarma-tasma';
UPDATE questions SET kavram = 'numeric-std-islem', yedek = 0 WHERE id = 't3-unsigned-arti';
UPDATE questions SET kavram = 'numeric-std-islem', yedek = 1 WHERE id = 't3-slv-cevir';
UPDATE questions SET kavram = 'numeric-std-islem', yedek = 0 WHERE id = 't3-integer-arti';
UPDATE questions SET kavram = 'karsilastirma', yedek = 0 WHERE id = 't3-signed-buyuk';
UPDATE questions SET kavram = 'karsilastirma', yedek = 1 WHERE id = 't3-esit';
UPDATE questions SET kavram = 'karsilastirma', yedek = 0 WHERE id = 't3-buyuk-esit';
UPDATE questions SET kavram = 'kaydirma-birlestirme', yedek = 0 WHERE id = 't3-birlestir-uzunluk';
UPDATE questions SET kavram = 'kaydirma-birlestirme', yedek = 0 WHERE id = 't3-sola-kaydir';
UPDATE questions SET kavram = 'kaydirma-birlestirme', yedek = 1 WHERE id = 't3-rol';
UPDATE questions SET kavram = 'kaydirma-birlestirme', yedek = 1 WHERE id = 't3-srl-sonuc';
UPDATE questions SET kavram = 'others-atama', yedek = 0 WHERE id = 't3-others-sifir';
UPDATE questions SET kavram = 'others-atama', yedek = 1 WHERE id = 't3-others-konum';
UPDATE questions SET kavram = 'others-atama', yedek = 0 WHERE id = 't3-others-downto';
UPDATE questions SET kavram = 'dizi-nitelikleri', yedek = 0 WHERE id = 't3-length';
UPDATE questions SET kavram = 'dizi-nitelikleri', yedek = 1 WHERE id = 't3-left-right';
UPDATE questions SET kavram = 'dizi-nitelikleri', yedek = 0 WHERE id = 't3-range-dongu';
UPDATE questions SET kavram = 'dizi-nitelikleri', yedek = 1 WHERE id = 't3-high-low';
UPDATE questions SET kavram = 'sinyal-nitelikleri', yedek = 0 WHERE id = 't3-rising-edge';
UPDATE questions SET kavram = 'sinyal-nitelikleri', yedek = 1 WHERE id = 't3-event';
UPDATE questions SET kavram = 'sinyal-nitelikleri', yedek = 0 WHERE id = 't3-dusen-kenar';
UPDATE questions SET kavram = 'enum-nitelikleri', yedek = 0 WHERE id = 't3-enum-pos';
UPDATE questions SET kavram = 'enum-nitelikleri', yedek = 1 WHERE id = 't3-enum-left';
UPDATE questions SET kavram = 'enum-nitelikleri', yedek = 1 WHERE id = 't3-enum-baslangic';
UPDATE questions SET kavram = 'generic', yedek = 0 WHERE id = 't3-generic-map';
UPDATE questions SET kavram = 'generic', yedek = 1 WHERE id = 't3-generic-varsayilan';
UPDATE questions SET kavram = 'generic', yedek = 0 WHERE id = 't3-generic-sabit';
UPDATE questions SET kavram = 'kullanici-nitelik', yedek = 1 WHERE id = 't3-attribute-bagla';
UPDATE questions SET kavram = 'kullanici-nitelik', yedek = 0 WHERE id = 't3-overload-isim';
UPDATE questions SET kavram = 'atama-zamani', yedek = 0 WHERE id = 't4-son-atama';
UPDATE questions SET kavram = 'atama-zamani', yedek = 0 WHERE id = 't4-swap';
UPDATE questions SET kavram = 'atama-zamani', yedek = 1 WHERE id = 't4-swap-var';
UPDATE questions SET kavram = 'atama-zamani', yedek = 0 WHERE id = 't4-delta';
UPDATE questions SET kavram = 'atama-zamani', yedek = 1 WHERE id = 't4-sinyal-sayac';
UPDATE questions SET kavram = 'atama-zamani', yedek = 1 WHERE id = 't4-after';
UPDATE questions SET kavram = 'variable-kullanim', yedek = 0 WHERE id = 't4-var-operator';
UPDATE questions SET kavram = 'variable-kullanim', yedek = 0 WHERE id = 't4-var-sayac';
UPDATE questions SET kavram = 'variable-kullanim', yedek = 1 WHERE id = 't4-var-kalici';
UPDATE questions SET kavram = 'variable-kullanim', yedek = 1 WHERE id = 't4-var-baska-process';
UPDATE questions SET kavram = 'variable-kullanim', yedek = 0 WHERE id = 't4-sabit-atama';
UPDATE questions SET kavram = 'tanimlayicilar', yedek = 0 WHERE id = 't4-isim-rakam';
UPDATE questions SET kavram = 'tanimlayicilar', yedek = 0 WHERE id = 't4-isim-cift-alt';
UPDATE questions SET kavram = 'tanimlayicilar', yedek = 1 WHERE id = 't4-isim-buyuk-kucuk';
UPDATE questions SET kavram = 'tanimlayicilar', yedek = 1 WHERE id = 't4-isim-son-alt';
UPDATE questions SET kavram = 'std-logic-degerleri', yedek = 0 WHERE id = 't4-dokuz-deger';
UPDATE questions SET kavram = 'std-logic-degerleri', yedek = 0 WHERE id = 't4-z-anlam';
UPDATE questions SET kavram = 'std-logic-degerleri', yedek = 1 WHERE id = 't4-tire-anlam';
UPDATE questions SET kavram = 'std-logic-degerleri', yedek = 1 WHERE id = 't4-l-anlam';
UPDATE questions SET kavram = 'std-logic-degerleri', yedek = 1 WHERE id = 't4-x-anlam';
UPDATE questions SET kavram = 'cozumleme', yedek = 0 WHERE id = 't4-coz-01';
UPDATE questions SET kavram = 'cozumleme', yedek = 0 WHERE id = 't4-coz-z1';
UPDATE questions SET kavram = 'cozumleme', yedek = 1 WHERE id = 't4-coz-lh';
UPDATE questions SET kavram = 'cozumleme', yedek = 1 WHERE id = 't4-coz-0l';
UPDATE questions SET kavram = 'vektor-indeks', yedek = 0 WHERE id = 't4-dilim-downto';
UPDATE questions SET kavram = 'vektor-indeks', yedek = 0 WHERE id = 't4-indeks-to';
UPDATE questions SET kavram = 'vektor-indeks', yedek = 1 WHERE id = 't4-dilim-yon';
UPDATE questions SET kavram = 'vektor-indeks', yedek = 1 WHERE id = 't4-dilim-birlestir';
UPDATE questions SET kavram = 'sayi-tabani', yedek = 0 WHERE id = 't4-hex-bit';
UPDATE questions SET kavram = 'sayi-tabani', yedek = 0 WHERE id = 't4-hex-ikili';
UPDATE questions SET kavram = 'sayi-tabani', yedek = 1 WHERE id = 't4-oktal';
UPDATE questions SET kavram = 'sayi-tabani', yedek = 1 WHERE id = 't4-tabanli-hex';
UPDATE questions SET kavram = 'sayi-tabani', yedek = 1 WHERE id = 't4-tabanli-ikili';
UPDATE questions SET kavram = 'signed-unsigned', yedek = 0 WHERE id = 't4-signed-1000';
UPDATE questions SET kavram = 'signed-unsigned', yedek = 0 WHERE id = 't4-unsigned-1000';
UPDATE questions SET kavram = 'signed-unsigned', yedek = 0 WHERE id = 't4-signed-aralik';
UPDATE questions SET kavram = 'signed-unsigned', yedek = 1 WHERE id = 't4-resize-signed';
UPDATE questions SET kavram = 'signed-unsigned', yedek = 1 WHERE id = 't4-resize-unsigned';
UPDATE questions SET kavram = 'tip-donusumu', yedek = 0 WHERE id = 't4-int-slv';
UPDATE questions SET kavram = 'tip-donusumu', yedek = 0 WHERE id = 't4-slv-int';
UPDATE questions SET kavram = 'tip-donusumu', yedek = 1 WHERE id = 't4-to-signed-neg';
UPDATE questions SET kavram = 'tip-donusumu', yedek = 1 WHERE id = 't4-signed-int';
UPDATE questions SET kavram = 'tip-donusumu', yedek = 1 WHERE id = 't4-donusum-maliyet';
UPDATE questions SET kavram = 'tip-uyumu', yedek = 0 WHERE id = 't4-slv-unsigned';
UPDATE questions SET kavram = 'tip-uyumu', yedek = 1 WHERE id = 't4-bit-stdlogic';
UPDATE questions SET kavram = 'tip-uyumu', yedek = 1 WHERE id = 't4-subtype-uyum';
UPDATE questions SET kavram = 'tip-uyumu', yedek = 1 WHERE id = 't4-yeni-tip';
UPDATE questions SET kavram = 'integer-aralik', yedek = 0 WHERE id = 't4-bit-0-15';
UPDATE questions SET kavram = 'integer-aralik', yedek = 1 WHERE id = 't4-bit-0-100';
UPDATE questions SET kavram = 'integer-aralik', yedek = 1 WHERE id = 't4-bit-negatif';
UPDATE questions SET kavram = 'integer-aralik', yedek = 1 WHERE id = 't4-aralik-arttirma';
UPDATE questions SET kavram = 'diziler', yedek = 0 WHERE id = 't4-dizi-bildirim';
UPDATE questions SET kavram = 'diziler', yedek = 1 WHERE id = 't4-dizi-eleman';
UPDATE questions SET kavram = 'diziler', yedek = 1 WHERE id = 't4-dizi-uzunluk';
UPDATE questions SET kavram = 'with-select', yedek = 0 WHERE id = 't5-ws-sonuc';
UPDATE questions SET kavram = 'with-select', yedek = 1 WHERE id = 't5-ws-dekoder';
UPDATE questions SET kavram = 'with-select', yedek = 0 WHERE id = 't5-ws-coklu';
UPDATE questions SET kavram = 'with-select', yedek = 1 WHERE id = 't5-ws-process';
UPDATE questions SET kavram = 'when-else', yedek = 0 WHERE id = 't5-we-ilk-dogru';
UPDATE questions SET kavram = 'when-else', yedek = 0 WHERE id = 't5-oncelik-kodlayici';
UPDATE questions SET kavram = 'when-else', yedek = 1 WHERE id = 't5-oncelik-kodlayici2';
UPDATE questions SET kavram = 'process-hassasiyet', yedek = 0 WHERE id = 't5-hassas-eksik';
UPDATE questions SET kavram = 'process-hassasiyet', yedek = 0 WHERE id = 't5-hassas-wait';
UPDATE questions SET kavram = 'process-hassasiyet', yedek = 1 WHERE id = 't5-process-baslangic';
UPDATE questions SET kavram = 'process-hassasiyet', yedek = 1 WHERE id = 't5-process-all';
UPDATE questions SET kavram = 'if-case', yedek = 0 WHERE id = 't5-if-sonuc';
UPDATE questions SET kavram = 'if-case', yedek = 1 WHERE id = 't5-if-sonuc2';
UPDATE questions SET kavram = 'if-case', yedek = 0 WHERE id = 't5-case-tekrar';
UPDATE questions SET kavram = 'if-case', yedek = 1 WHERE id = 't5-case-aralik';
UPDATE questions SET kavram = 'if-case', yedek = 1 WHERE id = 't5-case-null';
UPDATE questions SET kavram = 'if-case', yedek = 1 WHERE id = 't5-if-mandal';
UPDATE questions SET kavram = 'donguler', yedek = 0 WHERE id = 't5-for-sayi';
UPDATE questions SET kavram = 'donguler', yedek = 0 WHERE id = 't5-birleri-say';
UPDATE questions SET kavram = 'donguler', yedek = 1 WHERE id = 't5-for-indeks-atama';
UPDATE questions SET kavram = 'donguler', yedek = 1 WHERE id = 't5-exit-next';
UPDATE questions SET kavram = 'donguler', yedek = 1 WHERE id = 't5-ters-cevir';
UPDATE questions SET kavram = 'saatli-devre', yedek = 0 WHERE id = 't5-sayac-18';
UPDATE questions SET kavram = 'saatli-devre', yedek = 0 WHERE id = 't5-kaydirma';
UPDATE questions SET kavram = 'saatli-devre', yedek = 0 WHERE id = 't5-asenkron-reset';
UPDATE questions SET kavram = 'saatli-devre', yedek = 1 WHERE id = 't5-senkron-liste';
UPDATE questions SET kavram = 'saatli-devre', yedek = 1 WHERE id = 't5-kenar-esdeger';
