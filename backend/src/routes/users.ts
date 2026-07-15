import { Router } from "express";

export const usersRouter = Router();

// POST /api/users : LINEログイン後のユーザー登録/取得 (docs/requirements.md 9章)
usersRouter.post("/", (_req, res) => {
  res.status(501).json({ message: "not implemented" });
});
