import { z } from "zod";

// POST /api/users : LINEログイン後のユーザー登録/取得
export const upsertUserSchema = z.object({
  lineUserId: z.string().min(1),
  name: z.string().min(1),
  department: z.string().default(""),
  studentNumber: z.string().default(""),
  email: z.string().default(""),
});

// POST /api/rooms : Room作成 (F-4)
export const createRoomSchema = z.object({
  roomName: z.string().min(1),
  roomPass: z.string().min(1),
  userId: z.number().int(),
});

// POST /api/rooms/join : Room検索・入室 (F-5)
export const joinRoomSchema = z.object({
  roomId: z.string().min(1),
  roomPass: z.string().min(1),
  userId: z.number().int(),
});

// POST /api/tasks : 課題の作成 (F-1)
export const createTaskSchema = z.object({
  roomId: z.string().min(1),
  createdBy: z.number().int(),
  title: z.string().min(1),
  description: z.string().optional(),
  deadline: z.coerce.date(),
});

// POST /api/reactions : 進捗リアクション
export const createReactionSchema = z.object({
  taskId: z.string().min(1),
  userId: z.number().int(),
  reactionType: z.enum(["in_progress", "done"]),
});
