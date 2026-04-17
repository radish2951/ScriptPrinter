# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド

```bash
pnpm install
pnpm dev      # 開発サーバ
pnpm build    # tsc -b && vite build（型チェック込み）
pnpm preview
```

- パッケージマネージャは pnpm 固定。Node は `>=22`
- テスト・リンタは未導入
- デプロイは Cloudflare Pages で `main` への push をトリガー（設定は Cloudflare 側、リポジトリに workflow ファイルはない）

## 押さえておきたい設計判断

- ハイライト条件（キャラ選択 ∧ ボイス不要でない）は `src/lib/dialogue.ts` の `isHighlighted` に集約。件数集計・表示判定・連番付与がすべてこれを共有する
- `Dialogue.character === ""` が地の文を表す（null ではなく空文字）
- `toggleCharacter` は選んだ名前を部分文字列として含む全キャラを一括トグルする（例 「田中」で「田中A」「田中B」も切り替わる）
