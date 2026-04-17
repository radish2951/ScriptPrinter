import { CharacterFilter } from "./CharacterFilter";
import { DialogueCount } from "./DialogueCount";
import { FileTitle } from "./FileTitle";

type Props = {
  title: string;
  fileLoaded: boolean;
  onTitleChange: (value: string) => void;
  onFile: (file: File) => void;
  characters: string[];
  selected: Set<string>;
  onToggleCharacter: (character: string) => void;
  dialogueCount: number;
};

export function ScriptSummary({
  title,
  fileLoaded,
  onTitleChange,
  onFile,
  characters,
  selected,
  onToggleCharacter,
  dialogueCount,
}: Props) {
  return (
    <div id="scriptSummary">
      <h1>
        {!fileLoaded && (
          <input
            type="file"
            id="fileInput"
            accept=".txt"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFile(file);
            }}
          />
        )}
        {fileLoaded && <FileTitle title={title} onChange={onTitleChange} />}
      </h1>
      <CharacterFilter
        characters={characters}
        selected={selected}
        onToggle={onToggleCharacter}
      />
      <DialogueCount count={dialogueCount} />
    </div>
  );
}
