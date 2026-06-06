import type { Dialogue } from "../types";
import { isHighlighted } from "./dialogue";

/**
 * 選択中キャラ（かつボイス不要でない）のセリフを 1 行 1 セリフで連結する。
 * 変換は一切行わず、元の台本にある「」の中身（rawText）をそのまま書き出す。
 */
export function buildDialogueText(
  dialogues: Dialogue[],
  selected: Set<string>,
  noVoice: Set<number>,
): string {
  return dialogues
    .filter((d) => isHighlighted(d, selected, noVoice))
    .map((d) => d.rawText)
    .join("\n");
}

/** タイトルから書き出し用のファイル名を組み立てる */
export function exportFileName(title: string): string {
  const base = title.replace(/\.txt$/i, "").trim() || "script";
  return `${base}_セリフ.txt`;
}
