import { describe, expect, it } from "vitest";
import { AVATARLAR } from "../../shared/avatarlar";
import { avatarVar } from "./Avatar";

describe("avatar çizimleri", () => {
  it("listedeki her avatarın bir çizimi var", () => {
    expect(AVATARLAR.filter((a) => !avatarVar(a.id)).map((a) => a.id)).toEqual([]);
  });
});
