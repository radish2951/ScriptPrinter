import { describe, it, expect } from "vitest";
import { findAdjacentDialogue } from "./scriptNav";

// start 寄り（右・中心大）から end 寄り（左・中心小）の順
const positions = [
  { id: 1, center: 900 },
  { id: 2, center: 600 },
  { id: 3, center: 300 },
];

describe("findAdjacentDialogue", () => {
  it("next は基準より左で最も近いセリフを選ぶ", () => {
    expect(findAdjacentDialogue(positions, 650, "next")).toBe(2);
  });

  it("prev は基準より右で最も近いセリフを選ぶ", () => {
    expect(findAdjacentDialogue(positions, 650, "prev")).toBe(1);
  });

  it("中央のセリフからさらに next で次へ進む", () => {
    expect(findAdjacentDialogue(positions, 600, "next")).toBe(3);
  });

  it("中央のセリフから prev で前へ戻る", () => {
    expect(findAdjacentDialogue(positions, 600, "prev")).toBe(1);
  });

  it("next 方向に対象が無ければ null", () => {
    expect(findAdjacentDialogue(positions, 200, "next")).toBe(null);
  });

  it("prev 方向に対象が無ければ null", () => {
    expect(findAdjacentDialogue(positions, 1000, "prev")).toBe(null);
  });

  it("空配列は null", () => {
    expect(findAdjacentDialogue([], 500, "next")).toBe(null);
  });
});
