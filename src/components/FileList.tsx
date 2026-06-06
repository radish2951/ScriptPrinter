import { useState } from "react";
import type { LoadedFile } from "../types";

type Props = {
  files: LoadedFile[];
  onAddFiles: (files: FileList) => void;
  onRemove: (id: number) => void;
  onReorder: (id: number, insertBefore: number) => void;
};

export function FileList({ files, onAddFiles, onRemove, onReorder }: Props) {
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [insertBefore, setInsertBefore] = useState<number | null>(null);

  const clearDrag = () => {
    setDraggingId(null);
    setInsertBefore(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (draggingId === null) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const after = e.clientY > rect.top + rect.height / 2;
    setInsertBefore(after ? index + 1 : index);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggingId !== null && insertBefore !== null) {
      onReorder(draggingId, insertBefore);
    }
    clearDrag();
  };

  return (
    <div id="fileList">
      <ul>
        {files.map((file, i) => (
          <li
            key={file.id}
            draggable
            onDragStart={(e) => {
              setDraggingId(file.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={handleDrop}
            onDragEnd={clearDrag}
            className={
              (draggingId === file.id ? "dragging" : "") +
              (insertBefore === i ? " drop-before" : "") +
              (insertBefore === i + 1 ? " drop-after" : "")
            }
          >
            <span className="file-handle" aria-hidden="true">
              ⠿
            </span>
            <span className="file-name">{file.name}</span>
            <button
              type="button"
              onClick={() => onRemove(file.id)}
              title="削除"
              aria-label={`${file.name} を削除`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <label className="file-add">
        ＋ ファイルを追加
        <input
          type="file"
          accept=".txt"
          multiple
          onChange={(e) => {
            if (e.target.files?.length) onAddFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
