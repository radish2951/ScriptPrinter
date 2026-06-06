import type { LoadedFile } from "../types";

/** 複数ファイルを 1 本の台本として扱うため、生テキストを改行で連結する */
export function combineContents(files: LoadedFile[]): string {
  return files.map((f) => f.content).join("\n");
}

/** ファイル名（.txt を除く）を連結して既定のタイトルを作る */
export function deriveTitle(files: LoadedFile[]): string {
  return files.map((f) => f.name.replace(/\.txt$/i, "")).join(" + ");
}

/** id のファイルを dir 方向（-1 上 / +1 下）に 1 つ入れ替えた新しい配列を返す */
export function moveFile(
  files: LoadedFile[],
  id: number,
  dir: -1 | 1,
): LoadedFile[] {
  const i = files.findIndex((f) => f.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= files.length) return files;
  const next = [...files];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/** id のファイルを取り除いた新しい配列を返す */
export function removeFile(files: LoadedFile[], id: number): LoadedFile[] {
  return files.filter((f) => f.id !== id);
}
