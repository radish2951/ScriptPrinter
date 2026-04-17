import { describe, it, expect } from "vitest";
import { toggleInSet } from "./setOps";

describe("toggleInSet", () => {
  it("未含有の要素を追加した新しい Set を返す", () => {
    const original = new Set(["a"]);
    const result = toggleInSet(original, "b");
    expect(result.has("a")).toBe(true);
    expect(result.has("b")).toBe(true);
  });

  it("含有済みの要素を削除した新しい Set を返す", () => {
    const original = new Set(["a", "b"]);
    const result = toggleInSet(original, "a");
    expect(result.has("a")).toBe(false);
    expect(result.has("b")).toBe(true);
  });

  it("元の Set を破壊しない", () => {
    const original = new Set(["a"]);
    const result = toggleInSet(original, "b");
    expect(result).not.toBe(original);
    expect(original.has("b")).toBe(false);
    expect(original.size).toBe(1);
  });
});
