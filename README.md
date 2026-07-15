# ToDo共有アプリ（homeworkshareapp）

金沢工業大学の学生向け、LINE上で使う課題共有アプリ。少人数のRoom（グループ）内で課題の登録・共有・進捗リアクションができる。

詳細な要件定義は [docs/requirements.md](docs/requirements.md) を参照。未決事項はGitHub Issuesで管理しています。

## 技術スタック

- フロントエンド：Vite + React + TypeScript + LINE LIFF SDK（LINEアプリ内で動作するWebアプリ）
- バックエンド：Node.js + Express + TypeScript + Prisma
- DB：PostgreSQL（ローカルはdocker-compose、本番はRenderの無料PostgreSQL）
- デプロイ：Render（Blueprint = `render.yaml`）

## MVPで動く機能

dev/LIFFログイン → Room作成/入室 → 課題登録 → 課題一覧（締切順）→ 進捗リアクション（着手中/完了）

- ローカルでは `VITE_LIFF_ID` 未設定でも「開発ユーザー」として動作確認できます（devフォールバック）。
- 課題提出（ファイル共有）・LINE通知などは次フェーズ（[Issues](https://github.com/shiiya619/homeworkshareapp/issues) 参照）。

## フォルダ構成

```
homeworkshareapp/
├── docs/
│   └── requirements.md   # 要件定義書
├── backend/               # Express API サーバー
│   ├── prisma/
│   │   └── schema.prisma  # DBスキーマ（ER設計）
│   └── src/
│       ├── index.ts       # エントリーポイント
│       ├── routes/        # APIルーティング
│       └── lib/           # Prisma Client等の共通処理
└── frontend/               # LIFF Webアプリ
    └── src/
        ├── main.tsx        # エントリーポイント
        ├── App.tsx         # ルーティング定義
        ├── pages/          # 画面（Room作成/入室、課題一覧/登録/提出）
        └── lib/            # LIFF初期化等の共通処理
```

## ローカルセットアップ

### 0. DB（PostgreSQL）を起動

Docker があれば、リポジトリ直下で：

```bash
docker compose up -d   # localhost:5432 に postgres を起動
```

> Dockerを使わない場合は、Renderで作った無料PostgreSQLの External URL を
> `backend/.env` の `DATABASE_URL` に貼っても動きます。

### 1. バックエンド

```bash
cd backend
cp .env.example .env   # 初期値のままdocker-composeのDBに繋がります
npm install
npm run db:push        # スキーマをDBに反映（テーブル作成）
npm run dev            # http://localhost:3000
```

### 2. フロントエンド

```bash
cd frontend
cp .env.example .env   # ローカルはVITE_LIFF_ID空のままでOK（開発ユーザーで動作）
npm install
npm run dev            # http://localhost:5173
```

> バックエンドとフロントエンドの両方を起動した状態でアクセスしてください。

## デプロイ（Render + LINE LIFF）

概要（詳細な手順は別途）:

1. Render で「New +」→「Blueprint」→ このリポジトリを選択（`render.yaml` を読み込み、DB/API/フロントを一括作成）。
2. デプロイ完了後、フロントのURLを LINE Developers の LIFF エンドポイントに登録し、発行された **LIFF ID** を取得。
3. Render のフロントの環境変数に `VITE_LIFF_ID`（と `VITE_API_BASE_URL` = APIのURL+`/api`）を設定して再デプロイ。

- `VITE_*` はビルド時に埋め込まれるため、変更後はフロントの再デプロイが必要です。
- 無料枠のWeb Serviceは無アクセス時にスリープし、初回起動が遅い点に注意。

## ドキュメント / Issue

- 要件定義書：[docs/requirements.md](docs/requirements.md)
- 未決定事項・改善タスクは [Issues](https://github.com/shiiya619/homeworkshareapp/issues) を参照
