import type { Dialogue } from "../types";
import { preprocessText, toZenKaku } from "./toZenKaku";

export function parseScript(raw: string): {
  dialogues: Dialogue[];
  characters: string[];
} {
  const text = preprocessText(raw);
  const pattern = /^(.+?)「(.+?)」$/gm;
  const dialogues: Dialogue[] = [];
  const characterSet = new Set<string>();
  let id = 0;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (lastIndex < match.index) {
      // 直前の改行は地の文に含めない
      const before = text.slice(lastIndex, match.index - 1);
      for (const line of before.split("\n")) {
        dialogues.push({ id: id++, character: "", text: toZenKaku(line) });
      }
    }
    const name = toZenKaku(match[1].trim());
    const line = toZenKaku(match[2].trim());
    dialogues.push({ id: id++, character: name, text: line });
    characterSet.add(name);
    // 直後の改行をスキップして次の地の文の先頭に進める
    lastIndex = pattern.lastIndex + 1;
  }

  const after = text.slice(lastIndex);
  for (const line of after.split("\n")) {
    dialogues.push({ id: id++, character: "", text: toZenKaku(line) });
  }

  return { dialogues, characters: Array.from(characterSet) };
}
