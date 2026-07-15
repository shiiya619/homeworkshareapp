import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { prisma } from "../lib/prisma";
import { upsertUserSchema } from "../lib/validation";

export const usersRouter = Router();

// POST /api/users : LINEログイン後のユーザー登録/取得 (docs/requirements.md 9章)
// line_user_id をキーにupsert。プロフィールは毎回更新する。
usersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = upsertUserSchema.parse(req.body);
    const user = await prisma.user.upsert({
      where: { lineUserId: data.lineUserId },
      update: {
        name: data.name,
        department: data.department,
        studentNumber: data.studentNumber,
        email: data.email,
      },
      create: {
        lineUserId: data.lineUserId,
        name: data.name,
        department: data.department,
        studentNumber: data.studentNumber,
        email: data.email,
      },
    });
    res.json(user);
  }),
);
