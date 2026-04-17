import { Fragment, useMemo } from "react";

type Props = {
  characters: string[];
  selected: Set<string>;
  onToggle: (character: string) => void;
};

export function CharacterFilter({ characters, selected, onToggle }: Props) {
  const visible = useMemo(
    () => characters.filter((c) => c.trim() !== ""),
    [characters],
  );

  return (
    <p id="characterList">
      {visible.length > 0 && "キャラクターリスト "}
      {visible.map((character, index) => (
        <Fragment key={character}>
          <label>
            <input
              type="checkbox"
              value={character}
              checked={selected.has(character)}
              onChange={() => onToggle(character)}
            />
            {character}
          </label>
          {index < visible.length - 1 && "、"}
        </Fragment>
      ))}
    </p>
  );
}
