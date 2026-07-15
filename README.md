# ToDo共有アプリ（homeworkshareapp）

金沢工業大学の学生向け、LINE上で使う課題共有アプリ。少人数のRoom（グループ）内で課題の登録・共有・進捗リアクションができる。

詳細な要件定義は [docs/requirements.md](docs/requirements.md) を参照。未決事項はGitHub Issuesで管理しています。

## 技術スタック

- フロントエンド：Vite + React + TypeScript + LINE LIFF SDK（LINEアプリ内で動作するWebアプリ）
- バックエンド：Node.js + Express + TypeScript + Prisma
- DB：PostgreSQL

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
cp .env.example .env   # DATABASE_URL等を設定
npm install
npm run prisma:migrate
npm run dev
```

### フロントエンド

```bash
cd frontend
cp .env.example .env   # VITE_LIFF_ID等を設定
npm install
npm run dev
```

## ドキュメント / Issue

- 要件定義書：[docs/requirements.md](docs/requirements.md)
- 未決定事項・改善タスクは [Issues](https://github.com/shiiya619/homeworkshareapp/issues) を参照
