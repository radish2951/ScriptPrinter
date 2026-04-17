import { describe, it, expect } from "vitest";
import { toggleCharactersByMatch } from "./characterToggle";

describe("toggleCharactersByMatch", () => {
  it("未選択の単一キャラを追加する", () => {
    const result = toggleCharactersByMatch(["田中"], new Set(), "田中");
    expect(result.has("田中")).toBe(true);
  });

  it("選択済みの単一キャラを削除する", () => {
    const result = toggleCharactersByMatch(["田中"], new Set(["田中"]), "田中");
    expect(result.has("田中")).toBe(false);
  });

  it("部分一致する全キャラを同時に追加する", () => {
    const characters = ["田中", "田中A", "田中B", "山田"];
    const result = toggleCharactersByMatch(characters, new Set(), "田中");
    expect(result.has("田中")).toBe(true);
    expect(result.has("田中A")).toBe(true);
    expect(result.has("田中B")).toBe(true);
    expect(result.has("山田")).toBe(false);
  });

  it("target が選択済みのとき部分一致する全キャラを同時に削除する", () => {
    const characters = ["田中", "田中A", "田中B"];
    const prev = new Set(["田中", "田中A", "田中B"]);
    const result = toggleCharactersByMatch(characters, prev, "田中");
    expect(result.size).toBe(0);
  });

  it("target を部分文字列として含まないキャラは影響を受けない", () => {
    const characters = ["田中", "山田"];
    const result = toggleCharactersByMatch(
      characters,
      new Set(["山田"]),
      "田中",
    );
    expect(result.has("田中")).toBe(true);
    expect(result.has("山田")).toBe(true);
  });

  it("元の Set を破壊しない", () => {
    const prev = new Set(["田中"]);
    const result = toggleCharactersByMatch(["田中"], prev, "田中");
    expect(result).not.toBe(prev);
    expect(prev.has("田中")).toBe(true);
  });
});
