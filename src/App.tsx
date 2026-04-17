import { useEffect, useMemo, useState } from "react";
import { ScriptSummary } from "./components/ScriptSummary";
import { ScriptView } from "./components/ScriptView";
import { parseScript } from "./lib/parseScript";
import type { Dialogue } from "./types";

export function App() {
  const [title, setTitle] = useState("");
  const [fileLoaded, setFileLoaded] = useState(false);
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [characters, setCharacters] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [noVoice, setNoVoice] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  const dialogueCount = useMemo(
    () =>
      dialogues.filter(
        (d) =>
          d.character !== "" && selected.has(d.character) && !noVoice.has(d.id),
      ).length,
    [dialogues, selected, noVoice],
  );

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) ?? "";
      const { dialogues, characters } = parseScript(text);
      setDialogues(dialogues);
      setCharacters(characters);
      setSelected(new Set());
      setNoVoice(new Set());
    };
    reader.readAsText(file, "UTF-8");
    setTitle(file.name);
    setFileLoaded(true);
  };

  const toggleCharacter = (target: string) => {
    setSelected((prev) => {
      const willCheck = !prev.has(target);
      const next = new Set(prev);
      for (const c of characters) {
        if (c.includes(target)) {
          if (willCheck) next.add(c);
          else next.delete(c);
        }
      }
      return next;
    });
  };

  const toggleNoVoice = (id: number) => {
    setNoVoice((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <ScriptSummary
        title={title}
        fileLoaded={fileLoaded}
        onTitleChange={setTitle}
        onFile={onFile}
        characters={characters}
        selected={selected}
        onToggleCharacter={toggleCharacter}
        dialogueCount={dialogueCount}
      />
      <ScriptView
        dialogues={dialogues}
        selected={selected}
        noVoice={noVoice}
        onToggleNoVoice={toggleNoVoice}
      />
    </>
  );
}
