export type Dialogue = {
  id: number;
  character: string;
  text: string;
  /** 元の台本にある「」の中身。全角化などの変換を行っていない生テキスト */
  rawText: string;
};
