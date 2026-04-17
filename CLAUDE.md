# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド

```bash
pnpm install
pnpm dev         # 開発サーバ
pnpm build       # tsc -b && vite build（型チェック込み）
pnpm preview
pnpm test        # Vitest（watch）
pnpm test:run    # Vitest ワンショット
pnpm lint        # ESLint
pnpm typecheck   # tsc -b のみ
```

- パッケージマネージャは pnpm 固定。Node は `>=22`
- テストは `src/lib/` の純粋関数のみ対象。UI 側のテストは入れていない
- CI/CD は `.github/workflows/ci.yml` に一本化。PR で typecheck + lint + test + build、main への push でさらに `cloudflare/wrangler-action` で Cloudflare Pages にデプロイ
- デプロイには `CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID` の GitHub Secrets が必要。Cloudflare 側の git 連携は停止する前提

## 押さえておきたい設計判断

- ハイライト条件（キャラ選択 ∧ ボイス不要でない）は `src/lib/dialogue.ts` の `isHighlighted` に集約。件数集計・表示判定・連番付与がすべてこれを共有する
- `Dialogue.character === ""` が地の文を表す（null ではなく空文字）
- `toggleCharacter` は選んだ名前を部分文字列として含む全キャラを一括トグルする（例 「田中」で「田中A」「田中B」も切り替わる）
