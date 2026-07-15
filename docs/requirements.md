# 要件定義書（PDR v0.2）

元となった資料:
- `PDR.md`（v0.0.1, 2026/6/24作成）
- バックエンド設計PDF「セキプロ＿ハッカソン」（ER図・API一覧）

この文書は上記2つの資料を統合し、記述漏れ・矛盾点を整理したものです。未決定・要議論の項目には「⚠️ 要決定」を付け、対応するGitHub issueへのリンクを記載しています。

---

## 1. プロジェクト概要

- プロダクト名：ToDo共有アプリ（課題共有・進捗リアクションアプリ）
- バージョン / フェーズ：v0.0.1 → v0.2（要件整理）
- 作成日：2026/6/24（原案）／2026/7/15（改訂）
- 作成者：かずや、ぜんき、ながい君、はると、まなつ
- 関係者：チームメンバー5名（役割分担は下記の通り。⚠️ たたき台であり、チーム合意後に確定 → [Issue #12](https://github.com/shiiya619/homeworkshareapp/issues/12)）

### 役割分担（案）

| 役割 | 担当（仮） | 主な作業内容 |
|---|---|---|
| PM・ドキュメント | かずや | 進行管理、issue整理、要件定義書の更新、チーム間の調整 |
| フロントエンド | ぜんき | React/LIFFの画面5ページ（Room作成・入室、課題登録・一覧・提出）の実装 |
| バックエンド | ながい君 | Express/PrismaのAPI実装（rooms/tasks/users/reactions） |
| インフラ・DB | はると | PostgreSQL・デプロイ先の構築、環境変数管理、Prismaマイグレーション運用 |
| LINE連携・QA | まなつ | LINE Login/LIFF/Messaging APIの検証、動作確認・テスト |

運用ルール（案）：
- 名前の割り当ては**仮**。各自の得意分野・希望に応じてチームで入れ替えて確定する。
- フロントエンド・バックエンドは作業量が多いため、PM・QA担当が実装を兼務して手伝う。
- 担当外の領域のコードレビューにも参加し、属人化を防ぐ。

## 2. 背景・目的

- 背景：金沢工業大学のeシラバスには課題の一覧・締切がまとまって表示されず、友人間での課題共有もLINEでの個別連絡など手間がかかる。
- 解決したい課題：課題の締切確認と、グループ内での課題情報共有の手間。
- 目的（Why）：課題の共有を同期的に行い、確認・共有の手間を減らす。
- 成功イメージ：仲の良い少人数グループ（Room）内で、誰か一人が課題を登録すれば全員が締切と進捗を把握できる状態になる。

## 3. スコープ

- 対象ユーザー：金沢工業大学の学生（主に少人数の友人グループ、6人程度を想定）
- 対象プラットフォーム：LINE（LIFF: LINE Front-end Framework によるWebアプリとして実装）
- スコープに含めるもの：
  - 課題登録フォーム（F-1）
  - 課題共有閲覧ページ（F-2）
  - 課題提出（取り組み結果）共有フォーム（F-3）
  - Room作成（F-4）
  - Room検索・入室（F-5）
  - LINEログインによるユーザー認証
- スコープ外とするもの：
  - 凝ったUI/デザイン（シンプルさを優先）
  - LINE以外のプラットフォーム対応
  - 課題の自動収集（eシラバス等からのスクレイピング）は将来検討、MVPでは対象外
- ⚠️ 要決定：「Microsoft系列ファイル」との連携（原PDRのセキュリティ欄に記載）が何を指すか不明確。OneDrive等のファイル添付を指すのであればF-3の「ファイル共有」の実装方式に影響するため、スコープに含めるか要確認。→ [Issue #6](https://github.com/shiiya619/homeworkshareapp/issues/6)

## 4. ユーザーペルソナ

- ペルソナ名：学生（主に大学生、少人数の友人グループ単位で利用）
- 属性：金沢工業大学の学生、ITスキルはLINE操作程度を想定
- 利用シーン：①課題が提示されたとき（登録・共有）、②課題に取り組むとき（進捗確認・提出共有）
- ニーズ・ペインポイント：課題共有に時間がかかる、締切確認の抜け漏れ

## 5. ユースケース / ユーザーストーリー

- ユーザーストーリー：学生が課題を提示されたときに、Room内で共有することでグループ全体の確認の手間を減らせる。課題に取り組むときも、誰かの進捗を参照して取り組める。

代表的なユースケース：
- UC1：課題が提示されたら、Roomメンバーの誰か一人が締切をメモして共有すると、全員が確認できる。
- UC2：課題に取り組むとき、Roomメンバーの誰かが取り組み済みであれば、その内容を参照して取り組める。
- UC3：課題の分担ができる？ → ⚠️ 要決定：MVPスコープに含めるか未確定。含める場合は担当者アサインのデータモデル・UIが必要になる。→ [Issue #4](https://github.com/shiiya619/homeworkshareapp/issues/4)

## 6. 機能要件

### F-1：課題登録フォーム
- 概要：課題の情報を入力しサーバーに送るためのページ
- 詳細仕様：タイトル・内容(詳細)・締切日時を入力し登録。登録するとRoomメンバー全員に表示される。
- 入力：`title`（課題名）, `description`（内容, 任意）, `deadline`（締切日時, 必須）
- 出力：Room内の課題一覧に反映
- 対応API：`POST /api/tasks`
- 例外・エラー時の挙動：「正常に共有されませんでした。」（バリデーションエラー時は入力項目ごとにエラーメッセージを表示）

### F-2：課題共有閲覧ページ
- 概要：Room内で共有されている課題を閲覧するページ
- 詳細仕様：課題を締切が近い順に一覧表示。各課題に対し進捗リアクション（例：着手中／完了）を付けられる。
- 入力：Room参加状態
- 出力：課題一覧（締切昇順）、各課題のリアクション状況
- 対応API：`GET /api/rooms/{room_id}/tasks`, `POST /api/reactions`
- 例外・エラー時の挙動：「正常にログインできませんでした。」「正常にデータ取得できませんでした。」

### F-3：課題提出（取り組み結果）共有フォーム
- 概要：取り組んだ課題の成果物を共有するフォーム
- 詳細仕様：取り組んだ課題の写真・ファイルをアップロードし、課題共有閲覧ページから参照できるようにする。
- 入力：`file`（画像・ファイル）, 対象`task_id`
- 出力：課題共有閲覧ページに提出内容が反映
- 対応API：`POST /api/tasks/{task_id}/submissions`
- 例外・エラー時の挙動：「正常に共有されませんでした。」
- ⚠️ 要決定：ファイル保存先（S3等のオブジェクトストレージを想定）と許容ファイル形式・サイズ上限。→ [Issue #5](https://github.com/shiiya619/homeworkshareapp/issues/5)

### F-4：Room作成フォーム
- 概要：グループ単位のRoomを作成する機能
- 詳細仕様：Room名・Roomパスワードを設定して作成する。作成者は自動的にRoomメンバーとなる。
- 入力：`room_name`, `room_pass`
- 出力：`room_id`が発行される
- 対応API：`POST /api/rooms`
- 例外・エラー時の挙動：「正常に作成されませんでした。」
- 改善：Roomパスワードは平文で保存せずハッシュ化して保存する（原PDF ER図では`room_pass`が平文文字列カラムとして設計されていたため修正）。→ [Issue #3](https://github.com/shiiya619/homeworkshareapp/issues/3)

### F-5：Room検索・入室フォーム
- 概要：作成済みのRoomを検索し入室する機能
- 詳細仕様：`room_id`で検索し、`room_pass`が一致すれば入室（Room_Usersに追加）。
- 入力：`room_id`, `room_pass`
- 出力：入室成功時はRoomメンバー一覧・課題一覧へ遷移
- 対応API：`POST /api/rooms/join`
- 例外・エラー時の挙動：「roomが見つかりませんでした。」「パスワードが違います。」（原PDRには後者が未記載のため追加）

## 7. 非機能要件

- パフォーマンス：Room人数は6人程度の少人数グループを想定。同時アクセス数は小規模（1Roomあたり同時十数リクエスト程度）を想定し、特別なスケーリング対策は不要。
- セキュリティ：
  - 認証：LINE Login API / LIFF APIでLINEユーザーIDとプロフィール情報を取得し、これをユーザー識別子として利用する（`line_user_id`をUsersテーブルに追加。原PDF ER図には認証キーとなるLINEユーザーIDのカラムが存在しなかったため改善）。→ [Issue #1](https://github.com/shiiya619/homeworkshareapp/issues/1)
  - Roomパスワードはハッシュ化して保存（上記F-4改善参照）
  - 通信はHTTPS必須
  - 個人情報（氏名・学籍番号・メールアドレス）は最小限の保持とし、第三者提供は行わない
- 可用性：ハッカソン規模のため常時稼働SLAは定めない。障害時は手動復旧で許容する。
- スケーラビリティ：MVPでは考慮不要（少人数Room運用のため）。
- 運用・監視：エラーログをサーバー側で記録する程度とし、詳細な監視基盤（メトリクス収集等）はMVPスコープ外とする。
- ⚠️ 要決定：上記は暫定方針のため、チームでの合意が必要。→ [Issue #7](https://github.com/shiiya619/homeworkshareapp/issues/7)

## 8. 画面・UI/UX

- 主要画面一覧：Room作成画面／Room検索・入室画面／課題一覧（閲覧）画面／課題登録画面／課題提出（共有）画面
- 画面遷移図：未作成 → [Issue #8](https://github.com/shiiya619/homeworkshareapp/issues/8)
- ワイヤーフレーム / モック：未作成（Figma等）→ 同上issue
- UX上の重要なポイント：デザインに凝らずシンプルにする（原PDR方針を踏襲）。LIFFブラウザ内での操作が完結すること（LINEアプリからの離脱を避ける）。

## 9. データ要件

### 主要エンティティ（ER設計、原PDF ER図をベースに改善）

**Users（学生）**
| カラム | 型 | 説明 |
|---|---|---|
| id | int (PK) | 内部ID |
| line_user_id | string (unique) | LINEのユーザーID。改善：認証のキーとして追加 |
| name | string | 氏名 |
| department | string | 所属学科 |
| student_number | string | 学籍番号 |
| email | string | メールアドレス |
| created_at | datetime | 作成日時 |

**Rooms**
| カラム | 型 | 説明 |
|---|---|---|
| id | string (PK) | Room ID |
| room_name | string | Room名 |
| room_pass_hash | string | Roomパスワードのハッシュ値。改善：平文保存を廃止 |
| created_by | int (FK → Users) | 作成者。改善：原ER図に存在しなかったため追加 |
| created_at | datetime | 作成日時 |

**Room_Users（Room参加者、中間テーブル）**
| カラム | 型 | 説明 |
|---|---|---|
| id | int (PK) | |
| room_id | string (FK → Rooms) | |
| user_id | int (FK → Users) | |
| joined_at | datetime | 参加日時 |

**Tasks（課題）**
| カラム | 型 | 説明 |
|---|---|---|
| id | string (PK) | |
| room_id | string (FK → Rooms) | |
| created_by | int (FK → Users) | 登録者 |
| title | string | 課題名 |
| description | string (nullable) | 課題内容。改善：原ER図にはtitleのみでdescriptionが無く、PDR本文の「課題の内容」を格納できなかったため追加 |
| deadline | datetime | 締切。改善：原ER図はstring型だったためdatetime型に修正 |
| created_at | datetime | 作成日時 |

**Task_Submissions（課題提出＝取り組み結果の共有）**
| カラム | 型 | 説明 |
|---|---|---|
| id | string (PK) | |
| task_id | string (FK → Tasks) | |
| user_id | int (FK → Users) | |
| file_url | string | 提出ファイルのURL |
| submitted_at | datetime | 提出日時 |

**Reactions（進捗リアクション）**
| カラム | 型 | 説明 |
|---|---|---|
| id | int (PK) | |
| task_id | string (FK → Tasks) | |
| user_id | int (FK → Users) | |
| reaction_type | string | 例：`in_progress`（着手中）／`done`（完了） |
| created_at | datetime | |

- 改善：原PDF ER図の「Reactions」テーブルは`user_id, name, department, student_number, email`というUsersテーブルと同一のカラム構成になっており、リアクション自体を表すデータ（対象タスク・リアクション種別）が欠落していた。上記の通り再設計した。→ [Issue #2](https://github.com/shiiya619/homeworkshareapp/issues/2)

### データフロー
学生（LINEアプリ）→ LIFF Webアプリ（フロントエンド）→ バックエンドAPI → DB（PostgreSQL）
リアクション・課題更新時は必要に応じてLINE Messaging APIで通知し、他の学生のLINEに進捗確認を届ける（プッシュ通知範囲はMVPでは「Room内投稿時のみ」を想定、詳細は今後決定）。

### 外部サービス・API連携
- LINE Login API / LIFF API：ユーザー認証・プロフィール取得
- LINE Messaging API：Roomメンバーへの通知（任意機能、MVP後期 or β版）

### API一覧（原PDFより。エラーレスポンス形式は今後統一）

| メソッド/エンドポイント | 機能 |
|---|---|
| POST /api/users | ユーザー登録/取得 |
| POST /api/rooms | Room作成 |
| POST /api/rooms/join | Room検索・入室 |
| GET /api/rooms/{room_id}/tasks | 課題一覧の取得 |
| POST /api/tasks | 課題の作成 |
| POST /api/tasks/{task_id}/submissions | 課題の提出 |
| POST /api/reactions | リアクション |

- ⚠️ 要決定：削除系API（課題削除、Room退出など）が未定義。→ [Issue #9](https://github.com/shiiya619/homeworkshareapp/issues/9)

### ログ設計
- MVPではアプリケーションエラーログのみ記録。個人情報を含むアクセスログの長期保存は行わない。

## 10. リリース計画

- MVP定義：課題登録・共有、課題提出共有、進捗リアクションまでを実装する。原PDRの「リアクション後消える」という記載は、リアクションでタスクを完了扱いにして一覧から非表示にする（論理的な非表示であり物理削除ではない）という意図と解釈する。⚠️ 要決定：物理削除か非表示（アーカイブ）かをチームで確定する。→ [Issue #10](https://github.com/shiiya619/homeworkshareapp/issues/10)
- スケジュール：未定（ハッカソン期間内でのタイムラインを別途設定）→ [Issue #11](https://github.com/shiiya619/homeworkshareapp/issues/11)
- ロールアウト戦略：段階的リリースは行わず、ハッカソン成果物として一括リリースを想定。

## 11. リスク・課題

- 想定リスク：LIFF・LINE Login導入の学習コストがチームの開発速度に影響する可能性。
- 技術的不確実性：ファイルアップロードの保存先未定（Issue化済み）、LINE Messaging APIの通知範囲未定。
- ビジネス上の懸念点：特になし（学内利用の小規模ツールのため）。
- リスクへの対応方針：早期に技術検証（LIFFログインの疎通確認）を行い、詰まった場合はスコープを機能要件からさらに絞る。

---

## 改善サマリー（PDR/PDF からの変更点）

1. Usersテーブルに`line_user_id`を追加し、LINEログインとの整合を取った。
2. Roomパスワードを平文カラム(`room_pass`)からハッシュ保存(`room_pass_hash`)に変更。
3. Tasksに`description`カラムを追加し、`deadline`をstring型からdatetime型に修正。
4. Reactionsテーブルの設計不整合（Usersと同一カラムになっていた）を修正し、`task_id`・`reaction_type`を持つ本来の構造に再設計。
5. 非機能要件・画面設計・データ保持方針など、原PDRで空欄だった項目を暫定方針として埋め、要決定事項をissue化。
