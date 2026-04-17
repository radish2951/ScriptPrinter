export function toZenKaku(str: string): string {
  return str.replace(/[A-Za-z0-9]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) + 0xfee0),
  );
}

export function preprocessText(text: string): string {
  return text
    .split(/\r\n|\r|\n/g)
    .map((line) => line.trim())
    .join("\n");
}
