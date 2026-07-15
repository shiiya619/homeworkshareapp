import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { prisma } from "../lib/prisma";
import { createTaskSchema } from "../lib/validation";

export const tasksRouter = Router();

// POST /api/tasks : 課題の作成 (F-1)
tasksRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = createTaskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        roomId: data.roomId,
        createdById: data.createdBy,
        title: data.title,
        description: data.description,
        deadline: data.deadline,
      },
    });
    res.status(201).json(task);
  }),
);

// POST /api/tasks/:taskId/submissions : 課題の提出 (F-3)
// MVPスコープ外（Issue #5）。次フェーズで実装予定。
tasksRouter.post("/:taskId/submissions", (_req, res) => {
  res.status(501).json({ message: "not implemented (post-MVP)" });
});
