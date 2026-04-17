import { useLayoutEffect, useRef } from "react";

type Props = {
  title: string;
  onChange: (value: string) => void;
};

export function FileTitle({ title, onChange }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.width = "0";
    el.style.width = el.scrollWidth + "px";
  }, [title]);

  return (
    <textarea
      ref={ref}
      id="fileTitle"
      value={title}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
