import { describe, it, expect } from "vitest";
import { parseScript } from "./parseScript";

describe("parseScript", () => {
  it("基本形「キャラ「セリフ」」を抽出する", () => {
    const { dialogues, characters } = parseScript("田中「おはよう」");
    expect(dialogues[0]).toEqual({ id: 0, character: "田中", text: "おはよう" });
    expect(characters).toEqual(["田中"]);
  });

  it("地の文とセリフを混在させて連番 id を振る", () => {
    const { dialogues } = parseScript("朝だった。\n田中「おはよう」");
    expect(dialogues[0]).toEqual({ id: 0, character: "", text: "朝だった。" });
    expect(dialogues[1]).toEqual({ id: 1, character: "田中", text: "おはよう" });
  });

  it("同一キャラの登場を重複排除する", () => {
    const { characters } = parseScript("田中「A」\n田中「B」\n山田「C」");
    expect(characters).toEqual(["田中", "山田"]);
  });

  it("セリフ中とキャラ名の ASCII 英数字を全角化する", () => {
    const { dialogues } = parseScript("tanaka「hello 123」");
    expect(dialogues[0].character).toBe("ｔａｎａｋａ");
    expect(dialogues[0].text).toBe("ｈｅｌｌｏ １２３");
  });

  it("複数行の地の文が複数のエントリに分解される", () => {
    const { dialogues } = parseScript("一行目\n二行目\n田中「セリフ」");
    expect(dialogues[0]).toEqual({ id: 0, character: "", text: "一行目" });
    expect(dialogues[1]).toEqual({ id: 1, character: "", text: "二行目" });
    expect(dialogues[2]).toEqual({ id: 2, character: "田中", text: "セリフ" });
  });
});
