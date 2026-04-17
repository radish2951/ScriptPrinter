import { Fragment } from "react";

type Props = {
  characters: string[];
  selected: Set<string>;
  onToggle: (character: string) => void;
};

export function CharacterFilter({ characters, selected, onToggle }: Props) {
  return (
    <p id="characterList">
      {characters.length > 0 && "キャラクターリスト "}
      {characters.map((character, index) => (
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
          {index < characters.length - 1 && "、"}
        </Fragment>
      ))}
    </p>
  );
}
