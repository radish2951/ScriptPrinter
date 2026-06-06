type Props = {
  onExportText: () => void;
};

export function FloatingActions({ onExportText }: Props) {
  const handlePrint = () => window.print();

  return (
    <div id="floatingActions">
      <button
        type="button"
        onClick={onExportText}
        title="選択キャラのセリフを txt で書き出す"
        aria-label="セリフを txt で書き出す"
      >
        txt
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
