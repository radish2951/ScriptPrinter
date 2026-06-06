export type DialoguePosition = { id: number; center: number };

/**
 * 縦書き（vertical-rl）の台本で、基準位置から見た隣のセリフ id を返す。
 * start は右（中心 x が大きい）、end は左（中心 x が小さい）にあるため
 * - "next"（次のセリフ＝end 方向）は基準より左で最も近いもの
 * - "prev"（前のセリフ＝start 方向）は基準より右で最も近いもの
 * を選ぶ。該当が無ければ null。
 */
export function findAdjacentDialogue(
  positions: DialoguePosition[],
  reference: number,
  direction: "next" | "prev",
): number | null {
  const eps = 1; // 中央付近に居座るセリフを自分自身として拾わないための遊び
  let best: DialoguePosition | null = null;
  for (const p of positions) {
    if (direction === "next") {
      if (p.center < reference - eps && (!best || p.center > best.center)) {
        best = p;
      }
    } else {
      if (p.center > reference + eps && (!best || p.center < best.center)) {
        best = p;
      }
    }
  }
  return best ? best.id : null;
}
