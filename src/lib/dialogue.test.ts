import { describe, it, expect } from "vitest";
import { isHighlighted } from "./dialogue";
import type { Dialogue } from "../types";

const make = (over: Partial<Dialogue>): Dialogue => ({
  id: 0,
  character: "田中",
  text: "セリフ",
  ...over,
});

describe("isHighlighted", () => {
  it("地の文 (character === '') は常にハイライトされない", () => {
    const d = make({ character: "" });
    expect(isHighlighted(d, new Set([""]), new Set())).toBe(false);
  });

  it("キャラが選択集合に含まれなければハイライトされない", () => {
    const d = make({ character: "田中" });
    expect(isHighlighted(d, new Set(["山田"]), new Set())).toBe(false);
  });

  it("id が noVoice に含まれればハイライトされない", () => {
    const d = make({ id: 3, character: "田中" });
    expect(isHighlighted(d, new Set(["田中"]), new Set([3]))).toBe(false);
  });

  it("キャラ選択済みかつ noVoice 対象外なら true", () => {
    const d = make({ id: 3, character: "田中" });
    expect(isHighlighted(d, new Set(["田中"]), new Set([99]))).toBe(true);
  });
});
