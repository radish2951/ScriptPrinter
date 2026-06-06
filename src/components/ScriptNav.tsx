import { findAdjacentDialogue } from "../lib/scriptNav";

type Props = {
  hasHighlight: boolean;
};

// 指定の scrollX まで素早く（250ms）スクロールする。
// 縦書き（vertical-rl）では scrollX は負。ネイティブの smooth より速い。
function animateScrollX(targetLeft: number) {
  const startLeft = window.scrollX;
  const dist = targetLeft - startLeft;
  if (dist === 0) return;
  const duration = 250;
  let startTime: number | null = null;
  const step = (now: number) => {
    if (startTime === null) startTime = now;
    const t = Math.min(1, (now - startTime) / duration);
    const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
    window.scrollTo({ left: startLeft + dist * ease, top: 0 });
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function ScriptNav({ hasHighlight }: Props) {
  const scrollToStart = () => animateScrollX(0);
  const scrollToEnd = () =>
    animateScrollX(-document.documentElement.scrollWidth);

  // ハイライト中セリフのうち、画面中央から見た隣のセリフを左右中央へ寄せる
  const scrollToAdjacent = (direction: "next" | "prev") => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(
        "#scriptContainer .character-dialogue.highlighted",
      ),
    );
    // サマリ（キャラリスト等）は右側に sticky で居座るため、その左端までを
    // 読める領域とみなし、その左右中央を基準にする
    const summary = document.getElementById("scriptSummary");
    const rightEdge = summary
      ? summary.getBoundingClientRect().left
      : window.innerWidth;
    const center = rightEdge / 2;
    const positions = els.map((el) => {
      const r = el.getBoundingClientRect();
      return { id: Number(el.dataset.dialogueId), center: r.left + r.width / 2 };
    });
    const targetId = findAdjacentDialogue(positions, center, direction);
    if (targetId === null) return;
    const target = els.find((el) => Number(el.dataset.dialogueId) === targetId);
    if (!target) return;
    const r = target.getBoundingClientRect();
    // 対象の中心を画面の左右中央へ。目標 scrollX を直接指定して正確に合わせる
    animateScrollX(window.scrollX + (r.left + r.width / 2 - center));
  };

  return (
    <div id="scriptNav">
      <button type="button" onClick={scrollToEnd} title="最後へ" aria-label="最後へ">
        «
      </button>
      <button
        type="button"
        onClick={() => scrollToAdjacent("next")}
        disabled={!hasHighlight}
        title="次のセリフへ"
        aria-label="次のセリフへ"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scrollToAdjacent("prev")}
        disabled={!hasHighlight}
        title="前のセリフへ"
        aria-label="前のセリフへ"
      >
        ›
      </button>
      <button
        type="button"
        onClick={scrollToStart}
        title="最初へ"
        aria-label="最初へ"
      >
        »
      </button>
    </div>
  );
}
