import { findAdjacentDialogue } from "../lib/scriptNav";

type Props = {
  hasHighlight: boolean;
};

export function ScriptNav({ hasHighlight }: Props) {
  const scrollToStart = () =>
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  const scrollToEnd = () =>
    window.scrollTo({
      left: -document.documentElement.scrollWidth,
      top: 0,
      behavior: "smooth",
    });

  // ハイライト中セリフのうち、現在の画面中央から見た隣のセリフを中央へ寄せる
  const scrollToAdjacent = (direction: "next" | "prev") => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(
        "#scriptContainer .character-dialogue.highlighted",
      ),
    );
    const reference = window.innerWidth / 2;
    const positions = els.map((el) => {
      const r = el.getBoundingClientRect();
      return { id: Number(el.dataset.dialogueId), center: r.left + r.width / 2 };
    });
    const targetId = findAdjacentDialogue(positions, reference, direction);
    if (targetId === null) return;
    const target = els.find((el) => Number(el.dataset.dialogueId) === targetId);
    if (!target) return;
    const r = target.getBoundingClientRect();
    window.scrollBy({
      left: r.left + r.width / 2 - reference,
      behavior: "smooth",
    });
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
