import { describe, it, expect } from "vitest";
import { buildDialogueText, exportFileName } from "./exportDialogue";
import type { Dialogue } from "../types";

const make = (over: Partial<Dialogue>): Dialogue => ({
  id: 0,
  character: "田中",
  text: "セリフ",
  rawText: "セリフ",
  ...over,
});

describe("buildDialogueText", () => {
  it("選択キャラのセリフを 1 行 1 セリフで書き出す", () => {
    const dialogues = [
      make({ id: 0, character: "田中", rawText: "おはよう" }),
      make({ id: 1, character: "山田", rawText: "こんにちは" }),
      make({ id: 2, character: "田中", rawText: "またね" }),
    ];
    const text = buildDialogueText(dialogues, new Set(["田中"]), new Set());
    expect(text).toBe("おはよう\nまたね");
  });

  it("地の文 (character === '') は書き出さない", () => {
    const dialogues = [
      make({ id: 0, character: "", rawText: "朝だった。" }),
      make({ id: 1, character: "田中", rawText: "おはよう" }),
    ];
    const text = buildDialogueText(dialogues, new Set(["田中"]), new Set());
    expect(text).toBe("おはよう");
  });

  it("ボイス不要のセリフは除外する", () => {
    const dialogues = [
      make({ id: 0, character: "田中", rawText: "A" }),
      make({ id: 1, character: "田中", rawText: "B" }),
    ];
    const text = buildDialogueText(dialogues, new Set(["田中"]), new Set([1]));
    expect(text).toBe("A");
  });

  it("全角化などの変換をせず rawText をそのまま書き出す", () => {
    const dialogues = [make({ character: "田中", rawText: "hello 123" })];
    const text = buildDialogueText(dialogues, new Set(["田中"]), new Set());
    expect(text).toBe("hello 123");
  });

  it("該当セリフがなければ空文字を返す", () => {
    const dialogues = [make({ character: "田中", rawText: "A" })];
    expect(buildDialogueText(dialogues, new Set(["山田"]), new Set())).toBe("");
  });
});

describe("exportFileName", () => {
  it("末尾の .txt を除いてサフィックスを付ける", () => {
    expect(exportFileName("script.txt")).toBe("script_セリフ.txt");
  });

  it("拡張子がなければそのままサフィックスを付ける", () => {
    expect(exportFileName("台本")).toBe("台本_セリフ.txt");
  });

  it("空タイトルは script にフォールバックする", () => {
    expect(exportFileName("")).toBe("script_セリフ.txt");
  });
});
