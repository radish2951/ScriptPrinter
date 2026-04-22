import type { ParseWarning } from "../lib/parseScript";

type Props = {
  warnings: ParseWarning[];
};

export function ScriptWarnings({ warnings }: Props) {
  if (warnings.length === 0) return null;

  return (
    <details id="scriptWarnings">
      <summary>{warnings.length} 件の警告</summary>
      <ul data-native-scroll>
        {warnings.map((w, i) => (
          <li key={i}>
            <span className="warning-line">行 {w.line}</span>{" "}
            <span className="warning-message">{w.message}</span>
            <code className="warning-raw">{w.rawLine}</code>
          </li>
        ))}
      </ul>
    </details>
  );
}
