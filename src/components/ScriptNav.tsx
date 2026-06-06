import { useEffect, useState } from "react";
import { findAdjacentDialogue } from "../lib/scriptNav";

type Props = {
  hasHighlight: boolean;
};

// 読める領域の右端 x を返す。サマリ（キャラリスト等）は右側に sticky で
// 白マスクごと居座るため、その白マスク左端（＝サマリの margin-box 左端）までを
// 読める領域とみなす。サマリが無ければビューポート幅。
function readAreaRightEdge(): number {
  const summary = document.getElementById("scriptSummary");
  if (!summary) return window.innerWidth;
  const rect = summary.getBoundingClientRect();
  const marginLeft = parseFloat(getComputedStyle(summary).marginLeft) || 0;
  return rect.left - marginLeft;
}

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
  // ナビバー自体も読める領域の左右中央へ置く
  const [areaCenter, setAreaCenter] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setAreaCenter(readAreaRightEdge() / 2);
    update();
    window.addEventListener("resize", update);
    const summary = document.getElementById("scriptSummary");
    let ro: ResizeObserver | null = null;
    if (summary && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(summary);
    }
    return () => {
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, []);

  const scrollToStart = () => animateScrollX(0);
  const scrollToEnd = () =>
    animateScrollX(-document.documentElement.scrollWidth);

  // ハイライト中セリフのうち、読める領域の中央から見た隣のセリフを中央へ寄せる
  const scrollToAdjacent = (direction: "next" | "prev") => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(
        "#scriptContainer .character-dialogue.highlighted",
      ),
    );
    const center = readAreaRightEdge() / 2;
    const positions = els.map((el) => {
      const r = el.getBoundingClientRect();
      return { id: Number(el.dataset.dialogueId), center: r.left + r.width / 2 };
    });
    const targetId = findAdjacentDialogue(positions, center, direction);
    if (targetId === null) return;
    const target = els.find((el) => Number(el.dataset.dialogueId) === targetId);
    if (!target) return;
    const r = target.getBoundingClientRect();
    // 対象の中心を読める領域の左右中央へ。目標 scrollX を直接指定して正確に合わせる
    animateScrollX(window.scrollX + (r.left + r.width / 2 - center));
  };

  return (
    <div
      id="scriptNav"
      style={{ left: areaCenter != null ? `${areaCenter}px` : undefined }}
    >
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
