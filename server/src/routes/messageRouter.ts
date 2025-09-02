import { Router } from "express";
const messageRouter = Router();

import { sendMessageHandler } from "../controllers/messageController.js";
import { authenticateJWT } from "../middleware/authMiddlware.js";

messageRouter.post("", authenticateJWT, sendMessageHandler);

export { messageRouter };
