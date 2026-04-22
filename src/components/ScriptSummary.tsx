import type { ParseWarning } from "../lib/parseScript";
import { CharacterFilter } from "./CharacterFilter";
import { DialogueCount } from "./DialogueCount";
import { FileTitle } from "./FileTitle";
import { ScriptWarnings } from "./ScriptWarnings";

type Props = {
  title: string;
  fileLoaded: boolean;
  onTitleChange: (value: string) => void;
  onFile: (file: File) => void;
  characters: string[];
  selected: Set<string>;
  onToggleCharacter: (character: string) => void;
  dialogueCount: number;
  warnings: ParseWarning[];
  error: string | null;
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
  warnings,
  error,
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
      {error && (
        <p id="fileError" role="alert">
          {error}
        </p>
      )}
      <CharacterFilter
        characters={characters}
        selected={selected}
        onToggle={onToggleCharacter}
      />
      <DialogueCount count={dialogueCount} />
      <ScriptWarnings warnings={warnings} />
    </div>
  );
}
