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

  it("キャラ名と「の間の空白は trim でキャラ名から除去される", () => {
    const { dialogues } = parseScript("田中 「セリフ」");
    expect(dialogues[0].character).toBe("田中");
  });

  it("キャラ名と「の間の全角空白も trim でキャラ名から除去される", () => {
    const { dialogues } = parseScript("田中　「セリフ」");
    expect(dialogues[0].character).toBe("田中");
  });
});

describe("parseScript warnings", () => {
  it("正しくマッチする入力では warnings が空", () => {
    const { warnings } = parseScript("田中「おはよう」\n山田「こんにちは」");
    expect(warnings).toEqual([]);
  });

  describe("kagi-mismatch: 「」の数が合わない", () => {
    it("閉じカッコが不足している行を検出する", () => {
      const { warnings } = parseScript("田中「今日はいい天気。");
      expect(warnings).toHaveLength(1);
      expect(warnings[0].kind).toBe("kagi-mismatch");
    });

    it("開きカッコが不足している行を検出する", () => {
      const { warnings } = parseScript("今日はいい天気。」");
      expect(warnings).toHaveLength(1);
      expect(warnings[0].kind).toBe("kagi-mismatch");
    });

    it("「が2つあるのに」が1つしかない行を検出する", () => {
      const { warnings } = parseScript("田中「A」山田「B");
      expect(warnings).toHaveLength(1);
      expect(warnings[0].kind).toBe("kagi-mismatch");
    });
  });

  describe("malformed-dialogue: セリフとして認識されなかった行", () => {
    it("セリフの末尾に句点が続く行を検出する", () => {
      const { warnings } = parseScript("田中「セリフ」。");
      expect(warnings).toHaveLength(1);
      expect(warnings[0].kind).toBe("malformed-dialogue");
    });

    it("空セリフ「」も検出する", () => {
      const { warnings } = parseScript("田中「」");
      expect(warnings).toHaveLength(1);
      expect(warnings[0].kind).toBe("malformed-dialogue");
    });

    it("末尾に余計な記号が続く行を検出する", () => {
      const { warnings } = parseScript("田中「セリフ」！");
      expect(warnings).toHaveLength(1);
      expect(warnings[0].kind).toBe("malformed-dialogue");
    });
  });

  describe("警告しない（意図的な地の文）", () => {
    it("囲み装飾【「セリフ」】", () => {
      const { warnings } = parseScript("【「デートだと思う」】");
      expect(warnings).toEqual([]);
    });

    it("行頭が「で始まる選択肢", () => {
      const { warnings } = parseScript("「選択肢っぽいセリフ」");
      expect(warnings).toEqual([]);
    });

    it("ト書き（…）", () => {
      const { warnings } = parseScript("（桜の根元に本が置いてある）");
      expect(warnings).toEqual([]);
    });

    it("登場人物紹介 キャラ名（読み）：説明", () => {
      const { warnings } = parseScript(
        "賢木光（さかきひかる）：主人公。高校2年生。",
      );
      expect(warnings).toEqual([]);
    });

    it("地の文中の引用『書名』", () => {
      const { warnings } = parseScript("『霧ヶ峰の桜』が見えてきた。");
      expect(warnings).toEqual([]);
    });

    it("地の文中の引用 俺は『ごめん』と謝った。", () => {
      const { warnings } = parseScript("俺は『ごめん』と謝った。");
      expect(warnings).toEqual([]);
    });

    it("別種カッコ 田中『セリフ』は検知しない（「」は使っていない）", () => {
      const { warnings } = parseScript("田中『セリフ』");
      expect(warnings).toEqual([]);
    });
  });

  it("line 番号は 1 始まりで行単位に対応する", () => {
    const { warnings } = parseScript(
      "田中「OK」\n山田「今日は。\n佐藤「NG」",
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].line).toBe(2);
  });
});
