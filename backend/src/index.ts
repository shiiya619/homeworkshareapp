import "dotenv/config";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { apiRouter } from "./routes";

const app = express();

// CORS_ORIGIN が設定されていればそのオリジンのみ許可、無ければ全許可（MVPデフォルト）
const corsOrigin = process.env.CORS_ORIGIN;
app.use(cors(corsOrigin ? { origin: corsOrigin } : undefined));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", apiRouter);

// エラーハンドリング: zodの検証エラーは400、その他は500でJSONを返す
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: "入力値が正しくありません。", errors: err.errors });
  }
  console.error(err);
  res.status(500).json({ message: "サーバーエラーが発生しました。" });
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => {
  console.log(`backend listening on port ${port}`);
});
