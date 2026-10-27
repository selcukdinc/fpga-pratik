import { describe, expect, it } from "vitest";
import { sorular } from "../content/sorular/index";
import { KAVRAMLAR } from "./kavramlar";

describe("kavramlar", () => {
  it("her soru tam olarak bir kavramda", () => {
    const sayac = new Map<string, number>();
    for (const k of Object.values(KAVRAMLAR)) for (const id of k.sorular) sayac.set(id, (sayac.get(id) ?? 0) + 1);
    const kimlikler = new Set(sorular.map((s) => s.id));
    expect([...sayac.keys()].filter((id) => !kimlikler.has(id)), "olmayan soru").toEqual([]);
    expect(sorular.map((s) => s.id).filter((id) => !sayac.has(id)), "kavramı yok").toEqual([]);
    expect([...sayac].filter(([, n]) => n > 1).map(([id]) => id), "iki kavramda").toEqual([]);
  });
});
