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
  let counter = 0;

  return (
    <div id="scriptContainer" className="page">
      {dialogues.map((d) => {
        const isSelected = d.character !== "" && selected.has(d.character);
        const isNoVoice = noVoice.has(d.id);
        const isHighlighted = isSelected && !isNoVoice;
        const index = isHighlighted ? ++counter : null;

        return (
          <div
            key={d.id}
            className={
              "character-dialogue" + (isHighlighted ? " highlighted" : "")
            }
            onClick={isSelected ? () => onToggleNoVoice(d.id) : undefined}
          >
            <span className="character-name">
              {isSelected && isNoVoice && (
                <span className="no-voice">【ボイス不要】</span>
              )}
              {d.character}
            </span>
            <span className="dialogue">{d.text}</span>
            {index !== null && (
              <span className="dialogue-index">
                {String(index).padStart(4, "0")}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
