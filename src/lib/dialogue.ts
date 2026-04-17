import type { Dialogue } from "../types";

export function isHighlighted(
  dialogue: Dialogue,
  selected: Set<string>,
  noVoice: Set<number>,
): boolean {
  return (
    dialogue.character !== "" &&
    selected.has(dialogue.character) &&
    !noVoice.has(dialogue.id)
  );
}
