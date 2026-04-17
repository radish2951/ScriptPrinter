import { useMemo } from "react";
import { isHighlighted } from "../lib/dialogue";
import type { Dialogue } from "../types";

type Props = {
  dialogues: Dialogue[];
  selected: Set<string>;
  noVoice: Set<number>;
  onToggleNoVoice: (id: number) => void;
};

export function ScriptView({
  dialogues,
  selected,
  noVoice,
  onToggleNoVoice,
}: Props) {
  const indexById = useMemo(() => {
    const m = new Map<number, number>();
    let n = 0;
    for (const d of dialogues) {
      if (isHighlighted(d, selected, noVoice)) m.set(d.id, ++n);
    }
    return m;
  }, [dialogues, selected, noVoice]);

  return (
    <div id="scriptContainer" className="page">
      {dialogues.map((d) => {
        const isSelected = d.character !== "" && selected.has(d.character);
        const isNoVoice = noVoice.has(d.id);
        const highlighted = isSelected && !isNoVoice;
        const index = indexById.get(d.id);

        return (
          <button
            key={d.id}
            type="button"
            className={
              "character-dialogue" + (highlighted ? " highlighted" : "")
            }
            disabled={!isSelected}
            aria-pressed={isSelected ? isNoVoice : undefined}
            onClick={() => onToggleNoVoice(d.id)}
          >
            <span className="character-name">
              {isSelected && isNoVoice && (
                <span className="no-voice">【ボイス不要】</span>
              )}
              {d.character}
            </span>
            <span className="dialogue">{d.text}</span>
            {index !== undefined && (
              <span className="dialogue-index">
                {String(index).padStart(4, "0")}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
