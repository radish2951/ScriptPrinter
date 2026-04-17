import { describe, it, expect } from "vitest";
import { preprocessText, toZenKaku } from "./toZenKaku";

describe("toZenKaku", () => {
  it("ASCII 英数字を全角に変換する", () => {
    expect(toZenKaku("abc")).toBe("ａｂｃ");
    expect(toZenKaku("ABC")).toBe("ＡＢＣ");
    expect(toZenKaku("0123456789")).toBe("０１２３４５６７８９");
  });

  it("日本語と記号は変換しない", () => {
    expect(toZenKaku("こんにちは")).toBe("こんにちは");
    expect(toZenKaku("！？。、 -_")).toBe("！？。、 -_");
  });

  it("混在文字列では英数字のみ置換する", () => {
    expect(toZenKaku("hello 世界 123")).toBe("ｈｅｌｌｏ 世界 １２３");
  });

  it("空文字列はそのまま返す", () => {
    expect(toZenKaku("")).toBe("");
  });
});

describe("preprocessText", () => {
  it("CRLF・CR を LF に統一する", () => {
    expect(preprocessText("a\r\nb\rc\nd")).toBe("a\nb\nc\nd");
  });

  it("各行をトリムする", () => {
    expect(preprocessText("  hello  \n\tworld\t")).toBe("hello\nworld");
  });

  it("空文字列はそのまま返す", () => {
    expect(preprocessText("")).toBe("");
  });
});
