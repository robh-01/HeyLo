import { Router } from "express";
import { authRouter } from "./authRouter.js";
import { userRouter } from "./userRouter.js";
import { groupRouter } from "./groupRouter.js";
import { chatRequestsRouter } from "./chatRequestsRouter.js";
import { messageRouter } from "./messageRouter.js";
const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/users", userRouter);
indexRouter.use("/chat-requests", chatRequestsRouter);
indexRouter.use("/groups", groupRouter);
indexRouter.use("/messages", messageRouter);

export { indexRouter };
