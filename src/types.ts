export type LoadedFile = {
  id: number;
  name: string;
  /** ファイルの生テキスト。複数ファイルはこれを改行で連結して 1 本の台本として扱う */
  content: string;
};

export type Dialogue = {
  id: number;
  character: string;
  text: string;
  /** 元の台本にある「」の中身。全角化などの変換を行っていない生テキスト */
  rawText: string;
};
