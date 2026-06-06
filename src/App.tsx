import { useEffect, useMemo, useRef, useState } from "react";
import { FloatingActions } from "./components/FloatingActions";
import { ScriptSummary } from "./components/ScriptSummary";
import { ScriptView } from "./components/ScriptView";
import { toggleCharactersByMatch } from "./lib/characterToggle";
import { isHighlighted } from "./lib/dialogue";
import { buildDialogueText, exportFileName } from "./lib/exportDialogue";
import {
  combineContents,
  deriveTitle,
  moveFile,
  removeFile,
} from "./lib/loadedFiles";
import { parseScript } from "./lib/parseScript";
import { toggleInSet } from "./lib/setOps";
import type { LoadedFile } from "./types";

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") resolve(result);
      else reject(new Error("read failed"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("read failed"));
    reader.readAsText(file, "UTF-8");
  });
}

export function App() {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<LoadedFile[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [noVoice, setNoVoice] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const nextId = useRef(0);

  const { dialogues, characters, warnings } = useMemo(
    () =>
      files.length
        ? parseScript(combineContents(files))
        : { dialogues: [], characters: [], warnings: [] },
    [files],
  );

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

  const readFiles = async (fileList: FileList): Promise<LoadedFile[]> =>
    Promise.all(
      Array.from(fileList).map(async (file) => ({
        id: nextId.current++,
        name: file.name,
        content: await readFileAsText(file),
      })),
    );

  // 最初の読み込み（全置き換え）。選択・ボイス不要はリセットする
  const loadFiles = async (fileList: FileList) => {
    try {
      const loaded = await readFiles(fileList);
      setFiles(loaded);
      setTitle(deriveTitle(loaded));
      setSelected(new Set());
      setNoVoice(new Set());
      setError(null);
    } catch {
      setError("ファイルの読み込みに失敗いたしました");
    }
  };

  // 追加読み込み（末尾に連結）。既存セリフの id は不変なのでボイス不要は維持
  const addFiles = async (fileList: FileList) => {
    try {
      const loaded = await readFiles(fileList);
      setFiles((prev) => [...prev, ...loaded]);
      setError(null);
    } catch {
      setError("ファイルの読み込みに失敗いたしました");
    }
  };

  // 並び替え・削除は id がずれるためボイス不要をリセットする
  const handleMove = (id: number, dir: -1 | 1) => {
    setFiles((prev) => moveFile(prev, id, dir));
    setNoVoice(new Set());
  };

  const handleRemove = (id: number) => {
    setFiles((prev) => removeFile(prev, id));
    setNoVoice(new Set());
  };

  const toggleCharacter = (target: string) => {
    setSelected((prev) => toggleCharactersByMatch(characters, prev, target));
  };

  const toggleNoVoice = (id: number) => {
    setNoVoice((prev) => toggleInSet(prev, id));
  };

  const exportText = () => {
    const text = buildDialogueText(dialogues, selected, noVoice);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportFileName(title);
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <ScriptSummary
        title={title}
        files={files}
        onTitleChange={setTitle}
        onLoadFiles={loadFiles}
        onAddFiles={addFiles}
        onRemoveFile={handleRemove}
        onMoveFile={handleMove}
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
      <FloatingActions onExportText={exportText} />
    </>
  );
}
