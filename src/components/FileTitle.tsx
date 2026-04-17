import { useAutoSizeTextarea } from "../hooks/useAutoSizeTextarea";

type Props = {
  title: string;
  onChange: (value: string) => void;
};

export function FileTitle({ title, onChange }: Props) {
  const ref = useAutoSizeTextarea(title);

  return (
    <textarea
      ref={ref}
      id="fileTitle"
      value={title}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
