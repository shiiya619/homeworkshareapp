import { Router } from "express";

export const tasksRouter = Router();

// POST /api/tasks : 課題の作成 (F-1)
tasksRouter.post("/", (_req, res) => {
  res.status(501).json({ message: "not implemented" });
});

// POST /api/tasks/:taskId/submissions : 課題の提出 (F-3)
tasksRouter.post("/:taskId/submissions", (_req, res) => {
  res.status(501).json({ message: "not implemented" });
});
