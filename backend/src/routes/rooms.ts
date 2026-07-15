import { Router } from "express";

export const roomsRouter = Router();

// POST /api/rooms : Room作成 (F-4)
roomsRouter.post("/", (_req, res) => {
  res.status(501).json({ message: "not implemented" });
});

// POST /api/rooms/join : Room検索・入室 (F-5)
roomsRouter.post("/join", (_req, res) => {
  res.status(501).json({ message: "not implemented" });
});

// GET /api/rooms/:roomId/tasks : 課題一覧の取得 (F-2)
roomsRouter.get("/:roomId/tasks", (_req, res) => {
  res.status(501).json({ message: "not implemented" });
});
