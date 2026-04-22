export function FloatingActions() {
  const scrollToStart = () =>
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  const scrollToEnd = () =>
    window.scrollTo({
      left: -document.documentElement.scrollWidth,
      top: 0,
      behavior: "smooth",
    });
  const handlePrint = () => window.print();

  return (
    <div id="floatingActions">
      <button
        type="button"
        onClick={scrollToStart}
        title="先頭に戻る"
        aria-label="先頭に戻る"
      >
        →
      </button>
      <button
        type="button"
        onClick={scrollToEnd}
        title="末尾に進む"
        aria-label="末尾に進む"
      >
        ←
      </button>
      <button
        type="button"
        onClick={handlePrint}
        title="印刷"
        aria-label="印刷"
      >
        印刷
      </button>
    </div>
  );
}
