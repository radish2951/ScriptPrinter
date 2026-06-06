import type { ParseWarning } from "../lib/parseScript";
import type { LoadedFile } from "../types";
import { CharacterFilter } from "./CharacterFilter";
import { DialogueCount } from "./DialogueCount";
import { FileList } from "./FileList";
import { FileTitle } from "./FileTitle";
import { ScriptWarnings } from "./ScriptWarnings";

type Props = {
  title: string;
  files: LoadedFile[];
  onTitleChange: (value: string) => void;
  onLoadFiles: (files: FileList) => void;
  onAddFiles: (files: FileList) => void;
  onRemoveFile: (id: number) => void;
  onReorderFile: (id: number, insertBefore: number) => void;
  characters: string[];
  selected: Set<string>;
  onToggleCharacter: (character: string) => void;
  dialogueCount: number;
  warnings: ParseWarning[];
  error: string | null;
};

export function ScriptSummary({
  title,
  files,
  onTitleChange,
  onLoadFiles,
  onAddFiles,
  onRemoveFile,
  onReorderFile,
  characters,
  selected,
  onToggleCharacter,
  dialogueCount,
  warnings,
  error,
}: Props) {
  const fileLoaded = files.length > 0;

  return (
    <div id="scriptSummary">
      <h1>
        {!fileLoaded && (
          <input
            type="file"
            id="fileInput"
            accept=".txt"
            multiple
            onChange={(e) => {
              if (e.target.files?.length) onLoadFiles(e.target.files);
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
      {fileLoaded && (
        <FileList
          files={files}
          onAddFiles={onAddFiles}
          onRemove={onRemoveFile}
          onReorder={onReorderFile}
        />
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
