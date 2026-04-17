// target を部分文字列として含むキャラを一括トグルする。
// 例「田中」選択時に「田中」「田中A」「田中B」を同じ向きに揃える。
export function toggleCharactersByMatch(
  characters: string[],
  prev: Set<string>,
  target: string,
): Set<string> {
  const willCheck = !prev.has(target);
  const next = new Set(prev);
  for (const c of characters) {
    if (c.includes(target)) {
      if (willCheck) next.add(c);
      else next.delete(c);
    }
  }
  return next;
}
