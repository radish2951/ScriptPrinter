import { useEffect, useMemo, useState } from "react";
import { FloatingActions } from "./components/FloatingActions";
import { ScriptSummary } from "./components/ScriptSummary";
import { ScriptView } from "./components/ScriptView";
import { toggleCharactersByMatch } from "./lib/characterToggle";
import { isHighlighted } from "./lib/dialogue";
import { parseScript, type ParseWarning } from "./lib/parseScript";
import { toggleInSet } from "./lib/setOps";
import type { Dialogue } from "./types";

export function App() {
  const [title, setTitle] = useState("");
  const [fileLoaded, setFileLoaded] = useState(false);
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [characters, setCharacters] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [noVoice, setNoVoice] = useState<Set<number>>(new Set());
  const [warnings, setWarnings] = useState<ParseWarning[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      if (e.ctrlKey || e.metaKey) return;
      const target = e.target as Element | null;
      if (target?.closest("[data-native-scroll]")) return;
      window.scrollBy({ left: -e.deltaY, behavior: "auto" });
      e.preventDefault();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  const dialogueCount = useMemo(
    () => dialogues.filter((d) => isHighlighted(d, selected, noVoice)).length,
    [dialogues, selected, noVoice],
  );

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result !== "string") {
        setError("ファイルの読み込みに失敗いたしました");
        return;
      }
      const { dialogues, characters, warnings } = parseScript(result);
      setTitle(file.name);
      setDialogues(dialogues);
      setCharacters(characters);
      setSelected(new Set());
      setNoVoice(new Set());
      setWarnings(warnings);
      setFileLoaded(true);
      setError(null);
    };
    reader.onerror = () => {
      setError("ファイルの読み込みに失敗いたしました");
    };
    reader.readAsText(file, "UTF-8");
  };

  const toggleCharacter = (target: string) => {
    setSelected((prev) => toggleCharactersByMatch(characters, prev, target));
  };

  const toggleNoVoice = (id: number) => {
    setNoVoice((prev) => toggleInSet(prev, id));
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
        warnings={warnings}
        error={error}
      />
      <ScriptView
        dialogues={dialogues}
        selected={selected}
        noVoice={noVoice}
        onToggleNoVoice={toggleNoVoice}
      />
      <FloatingActions />
    </>
  );
}
