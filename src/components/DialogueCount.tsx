import { toZenKaku } from "../lib/toZenKaku";

type Props = { count: number };

export function DialogueCount({ count }: Props) {
  return (
    <p id="dialogueCountResult">
      {count > 0 ? "ワード数 " + toZenKaku(String(count)) : ""}
    </p>
  );
}
