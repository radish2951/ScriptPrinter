import type { Dialogue } from "../types";
import { preprocessText, toZenKaku } from "./toZenKaku";

export type ParseWarningKind = "kagi-mismatch" | "malformed-dialogue";

export type ParseWarning = {
  line: number;
  rawLine: string;
  kind: ParseWarningKind;
  message: string;
};

const DIALOGUE_PATTERN = /^(.+?)「(.+?)」$/;

export function parseScript(raw: string): {
  dialogues: Dialogue[];
  characters: string[];
  warnings: ParseWarning[];
} {
  const text = preprocessText(raw);
  const dialogues: Dialogue[] = [];
  const characterSet = new Set<string>();
  const warnings: ParseWarning[] = [];
  let id = 0;

  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;
    const match = DIALOGUE_PATTERN.exec(line);

    if (match) {
      const name = toZenKaku(match[1].trim());
      const speech = toZenKaku(match[2].trim());
      dialogues.push({ id: id++, character: name, text: speech });
      characterSet.add(name);
    } else {
      dialogues.push({ id: id++, character: "", text: toZenKaku(line) });
      collectNarrativeWarnings(line, lineNumber, warnings);
    }
  }

  return { dialogues, characters: Array.from(characterSet), warnings };
}

function collectNarrativeWarnings(
  line: string,
  lineNumber: number,
  warnings: ParseWarning[],
): void {
  if (!line) return;

  const openCount = countChar(line, "「");
  const closeCount = countChar(line, "」");

  if (openCount !== closeCount) {
    warnings.push({
      line: lineNumber,
      rawLine: line,
      kind: "kagi-mismatch",
      message: "「」の数が合っていません",
    });
    return;
  }

  if (openCount > 0 && !isDecoratedLine(line)) {
    warnings.push({
      line: lineNumber,
      rawLine: line,
      kind: "malformed-dialogue",
      message:
        "セリフとして認識されませんでした（前後に余計な文字が混ざっていないかご確認ください）",
    });
  }
}

function isDecoratedLine(line: string): boolean {
  return /^[【『（(“"「]/.test(line);
}

function countChar(str: string, ch: string): number {
  let n = 0;
  for (const c of str) if (c === ch) n++;
  return n;
}
