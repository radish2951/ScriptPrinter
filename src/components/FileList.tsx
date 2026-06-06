import type { LoadedFile } from "../types";

type Props = {
  files: LoadedFile[];
  onAddFiles: (files: FileList) => void;
  onRemove: (id: number) => void;
  onMove: (id: number, dir: -1 | 1) => void;
};

export function FileList({ files, onAddFiles, onRemove, onMove }: Props) {
  return (
    <div id="fileList">
      <ul>
        {files.map((file, i) => (
          <li key={file.id}>
            <span className="file-name">{file.name}</span>
            <span className="file-actions">
              <button
                type="button"
                onClick={() => onMove(file.id, -1)}
                disabled={i === 0}
                title="上へ移動"
                aria-label={`${file.name} を上へ移動`}
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => onMove(file.id, 1)}
                disabled={i === files.length - 1}
                title="下へ移動"
                aria-label={`${file.name} を下へ移動`}
              >
                ▼
              </button>
              <button
                type="button"
                onClick={() => onRemove(file.id)}
                title="削除"
                aria-label={`${file.name} を削除`}
              >
                ✕
              </button>
            </span>
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
