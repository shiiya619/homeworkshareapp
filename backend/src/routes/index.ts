import { Router } from "express";
import { usersRouter } from "./users";
import { roomsRouter } from "./rooms";
import { tasksRouter } from "./tasks";
import { reactionsRouter } from "./reactions";

export const apiRouter = Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/rooms", roomsRouter);
apiRouter.use("/tasks", tasksRouter);
apiRouter.use("/reactions", reactionsRouter);
