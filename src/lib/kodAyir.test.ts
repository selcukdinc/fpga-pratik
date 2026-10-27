import { describe, expect, it } from "vitest";
import { koduAyir } from "./kodAyir";

describe("koduAyir", () => {
  it("kod bloğu yoksa ayırmaz", () => {
    expect(koduAyir("Düz bir soru `a <= b` satır içi kodla.")).toBeNull();
  });

  it("önü, kodu ve arkasını ayırır", () => {
    const p = koduAyir("Aşağıdaki kodda:\n\n```vhdl\ny <= a and b;\n```\n\nY ne olur?");
    expect(p).toEqual({ once: "Aşağıdaki kodda:\n\n", kod: "```\ny <= a and b;\n```", sonra: "\n\nY ne olur?" });
  });

  it("art arda kod bloklarını birlikte taşır", () => {
    const p = koduAyir("Kod:\n```\nA\n```\n\n```\nB\n```\nSoru?");
    expect(p?.kod).toBe("```\nA\n```\n\n```\nB\n```");
  });

  it("kod blokları arasında yazı varsa ayırmaz", () => {
    expect(koduAyir("```\nA\n```\nŞimdi şuna bak:\n```\nB\n```")).toBeNull();
  });

  it("veritabanındaki kaçışlı satır sonlarını çözer", () => {
    expect(koduAyir("Kod:\\n```\\nA\\n```")?.kod).toBe("```\nA\n```");
  });
});
