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
VALUES ('h1-asic-seri-uretim', 'fpga-giris', 1, 'mcq', 'derived', 'Tasarımı tamamen kesinleşmiş bir oyuncak kontrol devresinden 1 milyon adet üretilecek. Birim maliyeti en düşük tutan seçenek hangisidir?', '{"choices":["FPGA","ASIC","Her cihaza bir geliştirme kartı (Nexys 4)","CPLD"]}', '{"index":1}', 'Çok yüksek adette ve değişmeyecek bir tasarımda ASIC''in yüksek NRE''si adetlere bölünür ve birim maliyet en düşük olur. FPGA ve CPLD esneklik için fazladan para ödetir.', 2, 'Hafta 1, FPGA ve mikrodenetleyici', 1)
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
VALUES ('h1-fpga-cpu-avantaj', 'fpga-giris', 1, 'mcq', 'derived', 'Aşağıdakilerden hangisi FPGA''nin değil, **CPU''nun** üstün olduğu bir özelliktir?', '{"choices":["Birçok işlemi aynı anda, paralel yürütmesi","Gerçek zamanlı uygulamalarda yüksek ve belirli (deterministik) hız","Kayan noktalı sayılar dahil tüm veri tiplerini ek tasarım yapmadan doğrudan işleyebilmesi","İşlevin donanım olarak kurulması"]}', '{"index":2}', 'Sunumdaki karşılaştırmaya göre CPU kayan nokta gibi işlemleri ve veri tiplerini doğrudan tanır. FPGA''de bunlar için ayrıca donanım tasarlamak gerekir.', 2, 'Hafta 1, FPGA ve CPU karşılaştırması', 1)
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
VALUES ('h2-fpga-yapi', 'pld', 2, 'mcq', 'original', 'Bir FPGA''nin üç temel yapı taşı hangisidir?', '{"choices":["ALU, kayıtçılar (register) ve program sayacı","Sabit AND dizisi, programlanabilir OR dizisi ve çıkış tamponu","Mantık blokları (CLB), programlanabilir ara bağlantılar ve G/Ç blokları","RAM, ROM ve DMA denetleyicisi"]}', '{"index":2}', 'FPGA; mantığın gerçeklendiği CLB''ler, bunları birbirine bağlayan programlanabilir ara bağlantılar ve dış dünyayla bağlantıyı sağlayan G/Ç bloklarından oluşur. İlk seçenek bir CPU''yu, ikincisi PROM''u anlatır.', 1, 'Hafta 2, FPGA yapısı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-clb-lut', 'pld', 2, 'mcq', 'original', 'Bir FPGA mantık bloğunda (CLB) kombinasyonel mantık fonksiyonunu gerçekleyen eleman hangisidir?', '{"choices":["D flip-flop","LUT (look-up table)","Çıkıştaki MUX","G/Ç bloğu"]}', '{"index":1}', 'LUT, girişlerin her kombinasyonu için çıkışı saklayan küçük bir bellektir, yani bir doğruluk tablosudur. D flip-flop sonucu saatle saklar, MUX ise çıkışın LUT''tan mı flip-flop''tan mı alınacağını seçer.', 1, 'Hafta 2, FPGA mantık bloğu (CLB)', 1)
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
VALUES ('h2-akis-sira', 'tasarim-akisi', 2, 'mcq', 'original', 'FPGA tasarım akışının doğru sırası hangisidir?', '{"choices":["Tasarım → Sentez → Simülasyon → Yönlendirme → Yerleştirme → Bitstream","Tasarım → Simülasyon → Sentez → Eşleme (mapping) → Yerleştirme → Yönlendirme → Bitstream","Simülasyon → Tasarım → Yerleştirme → Sentez → Yönlendirme → Bitstream","Tasarım → Simülasyon → Yerleştirme → Sentez → Eşleme → Yönlendirme → Bitstream"]}', '{"index":1}', 'Kod yazılır, simülasyonla test edilir, sentezle netlist''e dönüştürülür, elemanlar CLB''lere eşlenir, yerleştirilir, aralarındaki bağlantılar yönlendirilir ve en son bitstream üretilip karta yüklenir.', 2, 'Hafta 2, FPGA tasarım akışı', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-sentez', 'tasarim-akisi', 2, 'mcq', 'original', 'HDL kodunun mantıksal karşılığının, yani devre bağlantı listesinin (netlist) oluşturulduğu adım hangisidir?', '{"choices":["Simülasyon","Sentezleme (synthesis)","Yerleştirme (place)","Yönlendirme (route)"]}', '{"index":1}', 'Sentez, VHDL kodunu kapılar, flip-flop''lar ve aritmetik bloklardan oluşan bir netlist''e çevirir.', 1, 'Hafta 2, Adım 3: Sentezleme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-yonlendirme', 'tasarim-akisi', 2, 'mcq', 'original', 'Yerleştirilmiş mantık blokları ile giriş/çıkış pinleri arasındaki bağlantıların ara bağlantı kaynakları üzerinden kurulduğu adım hangisidir?', '{"choices":["Eşleme (mapping)","Sentezleme","Yönlendirme (routing)","Bitstream üretimi"]}', '{"index":2}', 'Yerleştirme (placing) elemanların hangi CLB''ye konacağını belirler. Yönlendirme (routing) ise bu blokları ve pinleri birbirine bağlayan yolları seçer.', 2, 'Hafta 2, Adım 6: Yönlendirme', 1)
  ON CONFLICT(id) DO UPDATE SET topic_id = excluded.topic_id, week = excluded.week, type = excluded.type,
    source = excluded.source, prompt = excluded.prompt, payload = excluded.payload, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty, source_ref = excluded.source_ref, active = 1
  WHERE questions.updated_at IS NULL;
INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation, difficulty, source_ref, active)
VALUES ('h2-modelleme-yapisal', 'tasarim-akisi', 2, 'mcq', 'original', 'Sistemi birbirine bağlanmış alt bileşenler (component) olarak tanımlayan modelleme yöntemi hangisidir?', '{"choices":["Veri akışı (dataflow)","Davranışsal (behavioral)","Yapısal (structural)","Algoritmik"]}', '{"index":2}', 'Yapısal modellemede devre, port map ile birbirine bağlanan bileşenlerden kurulur. Veri akışı eşzamanlı atamalarla, davranışsal modelleme ise process içindeki sıralı kodla yazılır.', 1, 'Hafta 2, VHDL modelleme yöntemleri', 1)
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
```', '{"choices":["Veri akışı (dataflow)","Davranışsal (behavioral)","Yapısal (structural)","Karma (yapısal + davranışsal)"]}', '{"index":0}', 'Process ya da component yok. Çıkışlar eşzamanlı sinyal atamalarıyla, verinin girişlerden çıkışa nasıl aktığı anlatılarak yazılmış. Bu veri akışı modellemesidir.', 2, 'Hafta 2, VHDL modelleme yöntemleri', 1)
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
VALUES ('h3-uc-bolum', 'vhdl-temel', 3, 'mcq', 'original', 'Bir VHDL tasarımının temel üç bölümü hangisidir?', '{"choices":["PROCESS, SIGNAL, VARIABLE","LIBRARY bildirimleri, ENTITY, ARCHITECTURE","PACKAGE, FUNCTION, PROCEDURE","ENTITY, PORT MAP, COMPONENT"]}', '{"index":1}', 'LIBRARY bildirimleri kullanılacak paketleri görünür yapar, ENTITY dış arayüzü (portları) tanımlar, ARCHITECTURE ise devrenin işlevini anlatır.', 1, 'Hafta 3, Temel VHDL yapısı', 1)
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
```', '{"choices":["a ve b aynı satırda bildirilemez","Son port bildiriminden sonra, kapanış parantezinden önce noktalı virgül olmamalı","Entity adı `ornek` olamaz","Port listesinde `in` ve `out` birlikte kullanılamaz"]}', '{"index":1}', 'Port bildirimleri birbirinden noktalı virgülle ayrılır, sonuncusundan sonra noktalı virgül konmaz. Doğrusu: `y : out std_logic );`', 2, 'Hafta 3, Entity', 1)
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
VALUES ('h3-tam-toplayici-cout', 'vhdl-temel', 3, 'mcq', 'original', 'Tam toplayıcının elde çıkışı için hangi VHDL ifadesi doğrudur?', '{"choices":["`Cout <= A xor B xor Cin;`","`Cout <= (A or B) and Cin;`","`Cout <= (A and B) xor Cin;`","`Cout <= (A and B) or (Cin and (A xor B));`"]}', '{"index":3}', 'Sunumdaki formül Cout = AB + Cin(A ⊕ B). İlk seçenek toplam bitidir. `(A or B) and Cin`, A=B=1 ve Cin=0''da 0 verir (yanlış). `(A and B) xor Cin` ise A=B=Cin=1''de 0 verir (yanlış).', 2, 'Hafta 3, Örnek 2 (tam toplayıcı)', 1)
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
VALUES ('h3-bolme-sentez', 'operatorler', 3, 'mcq', 'original', 'Sentez araçları `/` (bölme) operatörünü genellikle hangi durumda doğrudan kabul eder?', '{"choices":["Her durumda, bölücü ne olursa olsun","Bölen 2''nin sabit bir kuvveti olduğunda (bir kaydırmaya dönüşür)","Sadece REAL tipinde","Hiçbir durumda, bölme sentezlenemez"]}', '{"index":1}', '2''nin kuvvetine bölme sadece bitleri kaydırmaktır. Genel bölme pahalı bir devre gerektirir ve doğrudan desteklenmez. `mod`, `rem` ve `abs` için de destek sınırlıdır.', 2, 'Hafta 3, Aritmetik işlemler', 1)
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
VALUES ('h4-variable-yer', 'veri-nesneleri', 4, 'mcq', 'original', 'VHDL-93''te sıradan (shared olmayan) bir VARIABLE nerede bildirilir?', '{"choices":["Architecture''ın bildirim bölümünde","Entity''nin port listesinde","Process''in (ya da fonksiyon/prosedürün) bildirim bölümünde, `begin`''den önce","Bir package içinde"]}', '{"index":2}', 'Variable yereldir; sadece sıralı kodun içinde, process, function ya da procedure''ün bildirim bölümünde tanımlanır. Değerini process dışına taşımak için bir sinyale atanır.', 1, 'Hafta 4, VARIABLE', 1)
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
VALUES ('h4-out-okuma-cozum', 'veri-nesneleri', 4, 'mcq', 'original', 'Bir çıkış portunun değeri mimari içinde de okunmak isteniyor (VHDL-93). Ders notlarında önerilen iyi uygulama hangisidir?', '{"choices":["Portu `in` yapmak","Portu `out` bırakıp iç bir yardımcı sinyal kullanmak, portu da bu sinyalden sürmek","Portu `inout` yapmak","Port yerine bir variable kullanmak"]}', '{"index":1}', '`buffer` da çalışır, ama gerçekte tek yönlü olan bir çıkış için iç sinyal kullanmak daha temiz bir tasarım pratiğidir. `inout` çift yönlü veri yolları içindir.', 2, 'Hafta 4, SIGNAL vs VARIABLE (BUFFER notu)', 1)
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
VALUES ('h4-bit-vektor-hilesi', 'veri-tipleri', 4, 'mcq', 'original', 'Hafta 4_2''deki `artis := artis + to_integer(unsigned''(in_giris(n_i) & ""));` satırında `& ""` ne işe yarar?', '{"choices":["Biti tersler","Tek biti boş bir dizgiyle birleştirip 1 elemanlı bir vektör yapar, böylece `unsigned` olarak yorumlanabilir","Bitin değerini sıfırlar","Bir sözdizimi süsüdür, hiçbir etkisi yoktur"]}', '{"index":1}', '`unsigned` bir vektör tipidir, tek bir `std_logic` değeri doğrudan `unsigned` olamaz. Boş dizgiyle birleştirme 1 bitlik bir dizi üretir, `unsigned''(...)` onu niteler, `to_integer` de 0 ya da 1 döndürür.', 3, 'Hafta 4, Hafta 4_2', 1)
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
VALUES ('h4-port-dizisi', 'veri-tipleri', 4, 'mcq', 'original', 'Bir entity portunun vektör dizisi (örneğin 4 adet 8 bitlik vektör) olması isteniyor. Bu dizi tipi nerede tanımlanmalıdır?', '{"choices":["Entity''nin içinde, port listesinden önce","Bir PACKAGE içinde; sonra `use work.paket_adi.all;` ile entity''ye görünür yapılır","Architecture''ın bildirim bölümünde","Process içinde"]}', '{"index":1}', 'Port listesi architecture''dan önce okunur, bu yüzden tip ondan önce görünür olmalıdır. Kullanıcı tipleri bir package''ta tanımlanıp USE ile tasarıma açılır.', 2, 'Hafta 4, PORT ARRAYS', 1)
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

Araç "E is multiple driven" hatası verir. Neden?', '{"choices":["`not` operatörü `bit_vector` için tanımlı değildir","E(2) biti iki ayrı eşzamanlı atama tarafından sürülüyor ve BIT çözümlenmemiş bir tiptir","H sinyaline başlangıç değeri verilmemiştir","Çıkış portuna sabit değer atanamaz"]}', '{"index":1}', 'Her eşzamanlı atama ayrı bir sürücüdür. İlk atama E''nin tüm bitlerini, ikincisi E(2)''yi sürer, yani E(2)''nin iki sürücüsü olur. Doğru çözüm tek atamada birleştirmektir: `E <= ''0'' & not H(1 downto 0);`', 3, 'Hafta4_3 (E is multiple driven)', 1)
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

Bu yazımla ilgili hangisi doğrudur?', '{"choices":["Kod derlenmez, `when` ile bitemez","S ''0'' ve ''1'' dışında bir değer içerdiğinde (ör. \"X1\") hiçbir koşul sağlanmaz ve O eski değerini korur; bu davranış bir kilitleme (latch) anlamına gelir. Son satırı koşulsuz `else IN_4` yapmak daha doğrudur.","S = \"11\" iken O, IN_1''i alır","with/select ile tamamen aynı devreyi üretir, hiçbir fark yoktur"]}', '{"index":1}', 'VHDL-93 son koşullu dalı kabul eder, kod derlenir. Ama hiçbir koşul doğru olmadığında atama yapılmaz ve sinyal değerini saklar. Bu, kombinasyonel bir mux''ta istenmeyen bir bellek davranışıdır. Benzetimde S başlangıçta "UU" iken O de ''U'' olarak kalır.', 3, 'Hafta 5, Hafta 5_2 (when/else ile mux)', 1)
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

Girişler sadece ''0'' ya da ''1'' aldığında bu devre aslında hangi kapıya eşdeğerdir?', '{"choices":["4 girişli AND","4 girişli OR","4 girişli XOR","i3''ü seçen bir tampon (buffer)"]}', '{"index":1}', 'Her dal, seçtiği giriş ''1'' iken o girişi yani ''1''i verir. Hiçbiri ''1'' değilse ''0'' verilir. Sonuç, girişlerden en az biri ''1'' ise ''1'' olur, yani bir OR kapısıdır. Öncelik yapısını gerçekten kullanmak için seçim sinyalleri ile veri girişleri ayrı olmalıdır (sonraki soru).', 3, 'Hafta 5, priority_mux örneği', 1)
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
VALUES ('h5-select-oncelik', 'esz-atamalar', 5, 'mcq', 'original', 'with/select ile when/else arasındaki fark için hangisi doğrudur?', '{"choices":["with/select''te seçeneklerin sırası önemlidir, when/else''te önemli değildir","with/select''te seçeneklerin sırası önemli değildir; when/else''te koşullar yukarıdan aşağı öncelik sırasıyla denetlenir","İkisinde de sadece tek bir sinyal sorgulanabilir","when/else sadece process içinde kullanılabilir"]}', '{"index":1}', 'with/select tek bir ifadenin değerine göre seçer, seçenekler birbirini dışlar (sentezde genelde case tabanlı mux). when/else''te ilk doğru koşul kazanır ve her koşul farklı sinyalleri sorgulayabilir (öncelikli yapı).', 2, 'Hafta 5, with/select ve when/else', 1)
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
