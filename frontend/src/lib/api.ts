const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `リクエストに失敗しました (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export type User = {
  id: number;
  lineUserId: string;
  name: string;
};

export type Room = {
  id: string;
  roomName: string;
  createdById: number;
  createdAt: string;
};

export type Reaction = {
  id: number;
  reactionType: "in_progress" | "done";
  user: { id: number; name: string };
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  deadline: string;
  createdBy: { id: number; name: string };
  reactions: Reaction[];
};

export const api = {
  upsertUser: (body: { lineUserId: string; name: string }) =>
    request<User>("/users", { method: "POST", body: JSON.stringify(body) }),

  createRoom: (body: { roomName: string; roomPass: string; userId: number }) =>
    request<Room>("/rooms", { method: "POST", body: JSON.stringify(body) }),

  joinRoom: (body: { roomId: string; roomPass: string; userId: number }) =>
    request<Room>("/rooms/join", { method: "POST", body: JSON.stringify(body) }),

  listTasks: (roomId: string) => request<Task[]>(`/rooms/${roomId}/tasks`),

  createTask: (body: {
    roomId: string;
    createdBy: number;
    title: string;
    description?: string;
    deadline: string;
  }) => request<Task>("/tasks", { method: "POST", body: JSON.stringify(body) }),

  react: (body: { taskId: string; userId: number; reactionType: "in_progress" | "done" }) =>
    request<Reaction>("/reactions", { method: "POST", body: JSON.stringify(body) }),
};
