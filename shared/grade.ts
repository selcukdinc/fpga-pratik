// Kapalı uçlu soruların puanlaması. Sunucuda çalışır; doğru cevaplar
// istemciye hiç gönderilmez.

export type QuestionType = "tf" | "mcq" | "fill" | "code" | "wave";

export type Answer =
  | { value: boolean }
  | { index: number }
  | { blanks: string[] };

// fill sorularında her boşluk için kabul edilen yazımlar
type Expected =
  | { value: boolean }
  | { index: number }
  | { blanks: string[][] };

// VHDL büyük/küçük harf duyarsızdır; boşluklar da önemsizdir
function normalize(s: string): string {
  return s.replace(/\s+/g, "").toLowerCase();
}

export function grade(type: QuestionType, expected: Expected, answer: Answer): boolean {
  switch (type) {
    case "tf":
      return "value" in expected && "value" in answer && expected.value === answer.value;
    case "mcq":
      return "index" in expected && "index" in answer && expected.index === answer.index;
    case "fill": {
      if (!("blanks" in expected) || !("blanks" in answer)) return false;
      const want = expected.blanks as string[][];
      const got = answer.blanks as string[];
      if (got.length !== want.length) return false;
      return want.every((options, i) =>
        options.some((o) => normalize(o) === normalize(got[i] ?? "")),
      );
    }
    default:
      // code ve wave soruları tohumlu iz karşılaştırmasıyla puanlanacak
      return false;
  }
}
