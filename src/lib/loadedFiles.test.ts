import { describe, it, expect } from "vitest";
import {
  combineContents,
  deriveTitle,
  moveFile,
  removeFile,
} from "./loadedFiles";
import type { LoadedFile } from "../types";

const f = (id: number, name: string, content: string): LoadedFile => ({
  id,
  name,
  content,
});

describe("combineContents", () => {
  it("生テキストを改行で連結する", () => {
    const files = [f(0, "a.txt", "田中「A」"), f(1, "b.txt", "山田「B」")];
    expect(combineContents(files)).toBe("田中「A」\n山田「B」");
  });

  it("空配列は空文字", () => {
    expect(combineContents([])).toBe("");
  });
});

describe("deriveTitle", () => {
  it(".txt を除いたファイル名を + で連結する", () => {
    const files = [f(0, "第1幕.txt", ""), f(1, "第2幕.txt", "")];
    expect(deriveTitle(files)).toBe("第1幕 + 第2幕");
  });

  it("拡張子がなければそのまま使う", () => {
    expect(deriveTitle([f(0, "台本", "")])).toBe("台本");
  });
});

describe("moveFile", () => {
  const files = [f(0, "a", ""), f(1, "b", ""), f(2, "c", "")];

  it("上に移動する", () => {
    expect(moveFile(files, 1, -1).map((x) => x.id)).toEqual([1, 0, 2]);
  });

  it("下に移動する", () => {
    expect(moveFile(files, 1, 1).map((x) => x.id)).toEqual([0, 2, 1]);
  });

  it("先頭をさらに上へは動かさない", () => {
    expect(moveFile(files, 0, -1)).toBe(files);
  });

  it("末尾をさらに下へは動かさない", () => {
    expect(moveFile(files, 2, 1)).toBe(files);
  });

  it("存在しない id は無変更", () => {
    expect(moveFile(files, 99, -1)).toBe(files);
  });
});

describe("removeFile", () => {
  it("指定 id を取り除く", () => {
    const files = [f(0, "a", ""), f(1, "b", ""), f(2, "c", "")];
    expect(removeFile(files, 1).map((x) => x.id)).toEqual([0, 2]);
  });
});
