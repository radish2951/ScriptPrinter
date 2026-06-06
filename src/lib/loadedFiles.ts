import type { LoadedFile } from "../types";

/** 複数ファイルを 1 本の台本として扱うため、生テキストを改行で連結する */
export function combineContents(files: LoadedFile[]): string {
  return files.map((f) => f.content).join("\n");
}

/** ファイル名（.txt を除く）を連結して既定のタイトルを作る */
export function deriveTitle(files: LoadedFile[]): string {
  return files.map((f) => f.name.replace(/\.txt$/i, "")).join(" + ");
}

/**
 * id のファイルを「元の配列の insertBefore 番目の直前」へ移動した新しい配列を返す。
 * insertBefore は 0〜files.length（末尾に置く場合は files.length）。
 */
export function reorderFiles(
  files: LoadedFile[],
  id: number,
  insertBefore: number,
): LoadedFile[] {
  const from = files.findIndex((f) => f.id === id);
  if (from < 0) return files;
  const next = [...files];
  const [moved] = next.splice(from, 1);
  // 自分より前の要素を抜いた分、挿入位置が 1 つ手前にずれる
  const dest = from < insertBefore ? insertBefore - 1 : insertBefore;
  next.splice(dest, 0, moved);
  return next;
}

/** id のファイルを取り除いた新しい配列を返す */
export function removeFile(files: LoadedFile[], id: number): LoadedFile[] {
  return files.filter((f) => f.id !== id);
}
