import bcrypt from "bcryptjs";
import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { prisma } from "../lib/prisma";
import { createRoomSchema, joinRoomSchema } from "../lib/validation";

export const roomsRouter = Router();

// レスポンスにパスワードハッシュを含めないための整形
function toPublicRoom(room: { id: string; roomName: string; createdById: number; createdAt: Date }) {
  return {
    id: room.id,
    roomName: room.roomName,
    createdById: room.createdById,
    createdAt: room.createdAt,
  };
}

// POST /api/rooms : Room作成 (F-4)。パスワードはハッシュ化して保存（Issue #3）。作成者は自動入室。
roomsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = createRoomSchema.parse(req.body);
    const roomPassHash = await bcrypt.hash(data.roomPass, 10);

    const room = await prisma.room.create({
      data: {
        roomName: data.roomName,
        roomPassHash,
        createdById: data.userId,
        roomUsers: { create: { userId: data.userId } },
      },
    });
    res.status(201).json(toPublicRoom(room));
  }),
);

// POST /api/rooms/join : Room検索・入室 (F-5)。roomIdで検索しハッシュ照合、成功でメンバー追加。
roomsRouter.post(
  "/join",
  asyncHandler(async (req, res) => {
    const data = joinRoomSchema.parse(req.body);

    const room = await prisma.room.findUnique({ where: { id: data.roomId } });
    if (!room) {
      return res.status(404).json({ message: "roomが見つかりませんでした。" });
    }

    const ok = await bcrypt.compare(data.roomPass, room.roomPassHash);
    if (!ok) {
      return res.status(401).json({ message: "パスワードが違います。" });
    }

    // 既に入室済みでもエラーにしないようupsert
    await prisma.roomUser.upsert({
      where: { roomId_userId: { roomId: room.id, userId: data.userId } },
      update: {},
      create: { roomId: room.id, userId: data.userId },
    });

    res.json(toPublicRoom(room));
  }),
);

// GET /api/rooms/:roomId/tasks : 課題一覧の取得 (F-2)。締切昇順、リアクション同梱。
roomsRouter.get(
  "/:roomId/tasks",
  asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return res.status(404).json({ message: "roomが見つかりませんでした。" });
    }

    const tasks = await prisma.task.findMany({
      where: { roomId },
      orderBy: { deadline: "asc" },
      include: {
        createdBy: { select: { id: true, name: true } },
        reactions: {
          include: { user: { select: { id: true, name: true } } },
        },
      },
    });
    res.json(tasks);
  }),
);
