import { useEffect, useState } from "react";
import { findAdjacentDialogue } from "../lib/scriptNav";
import type { Dialogue } from "../types";

type Props = {
  // 内容は使わず、ハイライト集合が変化したら可否を再計算するための依存として受け取る
  dialogues: Dialogue[];
  selected: Set<string>;
  noVoice: Set<number>;
};

type NavState = {
  areaCenter: number | null;
  atStart: boolean;
  atEnd: boolean;
  canNext: boolean;
  canPrev: boolean;
};

// 読める領域の右端 x を返す。サマリ（キャラリスト等）は右側に sticky で
// 居座るため、その左端までを読める領域とみなす。サマリが無ければビューポート幅。
function readAreaRightEdge(): number {
  const summary = document.getElementById("scriptSummary");
  if (!summary) return window.innerWidth;
  const rect = summary.getBoundingClientRect();
  const marginLeft = parseFloat(getComputedStyle(summary).marginLeft) || 0;
  return rect.left - marginLeft;
}

function highlightPositions() {
  const els = Array.from(
    document.querySelectorAll<HTMLElement>(
      "#scriptContainer .character-dialogue.highlighted",
    ),
  );
  return els.map((el) => {
    const r = el.getBoundingClientRect();
    return { id: Number(el.dataset.dialogueId), center: r.left + r.width / 2 };
  });
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

export function ScriptNav({ dialogues, selected, noVoice }: Props) {
  const [state, setState] = useState<NavState>({
    areaCenter: null,
    atStart: true,
    atEnd: false,
    canNext: false,
    canPrev: false,
  });

  useEffect(() => {
    const recompute = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollWidth - doc.clientWidth; // overflow 量（正）
      const x = -window.scrollX; // 0（先頭・右）〜 maxScroll（末尾・左）
      const center = readAreaRightEdge() / 2;
      const positions = highlightPositions();
      setState({
        areaCenter: center,
        atStart: x <= 1,
        atEnd: x >= maxScroll - 1,
        canNext: findAdjacentDialogue(positions, center, "next") !== null,
        canPrev: findAdjacentDialogue(positions, center, "prev") !== null,
      });
    };

    // スクロール中は rAF で間引く
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        recompute();
      });
    };

    recompute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recompute);
    const summary = document.getElementById("scriptSummary");
    let ro: ResizeObserver | null = null;
    if (summary && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(recompute);
      ro.observe(summary);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recompute);
      ro?.disconnect();
    };
  }, [dialogues, selected, noVoice]);

  const scrollToStart = () => animateScrollX(0);
  const scrollToEnd = () =>
    animateScrollX(-document.documentElement.scrollWidth);

  // ハイライト中セリフのうち、読める領域の中央から見た隣のセリフを中央へ寄せる
  const scrollToAdjacent = (direction: "next" | "prev") => {
    const center = readAreaRightEdge() / 2;
    const positions = highlightPositions();
    const targetId = findAdjacentDialogue(positions, center, direction);
    if (targetId === null) return;
    const target = document.querySelector<HTMLElement>(
      `#scriptContainer [data-dialogue-id="${targetId}"]`,
    );
    if (!target) return;
    const r = target.getBoundingClientRect();
    // 対象の中心を読める領域の左右中央へ。目標 scrollX を直接指定して正確に合わせる
    animateScrollX(window.scrollX + (r.left + r.width / 2 - center));
  };

  return (
    <div
      id="scriptNav"
      style={{
        left: state.areaCenter != null ? `${state.areaCenter}px` : undefined,
      }}
    >
      <button
        type="button"
        onClick={scrollToEnd}
        disabled={state.atEnd}
        title="最後へ"
        aria-label="最後へ"
      >
        «
      </button>
      <button
        type="button"
        onClick={() => scrollToAdjacent("next")}
        disabled={!state.canNext}
        title="次のセリフへ"
        aria-label="次のセリフへ"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scrollToAdjacent("prev")}
        disabled={!state.canPrev}
        title="前のセリフへ"
        aria-label="前のセリフへ"
      >
        ›
      </button>
      <button
        type="button"
        onClick={scrollToStart}
        disabled={state.atStart}
        title="最初へ"
        aria-label="最初へ"
      >
        »
      </button>
    </div>
  );
}
