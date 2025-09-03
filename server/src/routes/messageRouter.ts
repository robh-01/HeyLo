import { Router } from "express";
const messageRouter = Router();

import {
  sendMessageHandler,
  getMessagesHandler,
} from "../controllers/messageController.js";
import { authenticateJWT } from "../middleware/authMiddlware.js";

messageRouter.post("", authenticateJWT, sendMessageHandler);
messageRouter.get("", authenticateJWT, getMessagesHandler);

export { messageRouter };
