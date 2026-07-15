# ToDo共有アプリ（homeworkshareapp）

金沢工業大学の学生向け、LINE上で使う課題共有アプリ。少人数のRoom（グループ）内で課題の登録・共有・進捗リアクションができる。

詳細な要件定義は [docs/requirements.md](docs/requirements.md) を参照。未決事項はGitHub Issuesで管理しています。

## 技術スタック

- フロントエンド：Vite + React + TypeScript + LINE LIFF SDK（LINEアプリ内で動作するWebアプリ）
- バックエンド：Node.js + Express + TypeScript + Prisma
- DB：MVP開発中は SQLite（本番はPostgreSQLへ切替予定）

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

## セットアップ

### バックエンド

```bash
cd backend
cp .env.example .env   # 初期値のままSQLiteで動きます
npm install
npm run prisma:migrate # SQLite(dev.db)を作成
npm run dev            # http://localhost:3000
```

### フロントエンド

```bash
cd frontend
cp .env.example .env   # ローカルはVITE_LIFF_ID空のままでOK
npm install
npm run dev            # http://localhost:5173
```

> バックエンドとフロントエンドの両方を起動した状態でアクセスしてください。

## ドキュメント / Issue

- 要件定義書：[docs/requirements.md](docs/requirements.md)
- 未決定事項・改善タスクは [Issues](https://github.com/shiiya619/homeworkshareapp/issues) を参照
