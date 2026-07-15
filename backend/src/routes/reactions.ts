import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { prisma } from "../lib/prisma";
import { createReactionSchema } from "../lib/validation";

export const reactionsRouter = Router();

// POST /api/reactions : 進捗リアクション (F-2)
// 1ユーザー1課題につき1リアクション（task+userでupsert）。
reactionsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = createReactionSchema.parse(req.body);

    const reaction = await prisma.reaction.upsert({
      where: { taskId_userId: { taskId: data.taskId, userId: data.userId } },
      update: { reactionType: data.reactionType },
      create: {
        taskId: data.taskId,
        userId: data.userId,
        reactionType: data.reactionType,
      },
    });
    res.status(201).json(reaction);
  }),
);
