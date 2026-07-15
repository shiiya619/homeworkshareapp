import { Router } from "express";

export const reactionsRouter = Router();

// POST /api/reactions : 進捗リアクション (F-2)
reactionsRouter.post("/", (_req, res) => {
  res.status(501).json({ message: "not implemented" });
});
