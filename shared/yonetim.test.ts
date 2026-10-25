import { describe, expect, it } from "vitest";
import { soruGirdisiHatasi, soruSutunlari, type SoruGirdi } from "./yonetim";

const temel: SoruGirdi = {
  topicId: "operatorler",
  type: "mcq",
  source: "derived",
  difficulty: 2,
  sourceRef: "Hafta 3",
  prompt: "`7 mod -2` kaçtır?",
  explanation: "mod bölenin işaretini alır.",
  choices: ["1", "-1"],
  answer: { index: 1 },
  status: "draft",
  active: true,
};

describe("panel soru girdisi", () => {
  it("geçerli soruları kabul eder", () => {
    expect(soruGirdisiHatasi(temel)).toBeNull();
    expect(soruGirdisiHatasi({ ...temel, type: "tf", answer: { value: false } })).toBeNull();
    expect(soruGirdisiHatasi({ ...temel, type: "fill", answer: { blanks: [["8", '"8"']] } })).toBeNull();
  });
  it("eksik ya da tutarsız alanları reddeder", () => {
    expect(soruGirdisiHatasi({ ...temel, prompt: "  " })).not.toBeNull();
    expect(soruGirdisiHatasi({ ...temel, difficulty: 4 })).not.toBeNull();
    expect(soruGirdisiHatasi({ ...temel, choices: ["tek"] })).not.toBeNull();
    expect(soruGirdisiHatasi({ ...temel, choices: ["1", "1"] })).not.toBeNull();
    expect(soruGirdisiHatasi({ ...temel, answer: { index: 2 } })).not.toBeNull();
    expect(soruGirdisiHatasi({ ...temel, type: "tf", answer: { index: 0 } })).not.toBeNull();
    expect(soruGirdisiHatasi({ ...temel, type: "fill", answer: { blanks: [[""]] } })).not.toBeNull();
    expect(soruGirdisiHatasi({ ...temel, type: "fill", answer: { blanks: [] } })).not.toBeNull();
  });
  it("veritabanı sütunlarını puanlamanın beklediği biçimde üretir", () => {
    expect(soruSutunlari(temel)).toEqual({ payload: '{"choices":["1","-1"]}', answer: '{"index":1}' });
    expect(soruSutunlari({ ...temel, type: "fill", answer: { blanks: [[" 8 ", "x"]] } })).toEqual({
      payload: '{"blanks":1}',
      answer: '{"blanks":[["8","x"]]}',
    });
  });
});
