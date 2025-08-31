import { Router } from "express";
import { authRouter } from "./authRouter.js";
import { userRouter } from "./userRouter.js";
import { chatRequestsRouter } from "./chatRequestsRouter.js";
const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/users", userRouter);
indexRouter.use("/chat-requests", chatRequestsRouter);

export { indexRouter };
