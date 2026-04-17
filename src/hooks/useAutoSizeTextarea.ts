import { useLayoutEffect, useRef } from "react";

export function useAutoSizeTextarea(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.width = "0";
    el.style.width = el.scrollWidth + "px";
  }, [value]);

  return ref;
}
