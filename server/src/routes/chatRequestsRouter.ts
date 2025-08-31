import { Router } from "express";
const chatRequestsRouter = Router();

import {
  sendChatRequestHandler,
  getReceivedChatRequestsHandler,
  getSentChatRequestsHandler,
  patchChatRequestHandler,
} from "../controllers/chatRequestsController.js";
import { authenticateJWT } from "../middleware/authMiddlware.js";

chatRequestsRouter.get(
  "/received",
  authenticateJWT,
  getReceivedChatRequestsHandler
);
chatRequestsRouter.get("/sent", authenticateJWT, getSentChatRequestsHandler);
chatRequestsRouter.patch(
  "/:requestId",
  authenticateJWT,
  patchChatRequestHandler
);
chatRequestsRouter.post("", authenticateJWT, sendChatRequestHandler);

export { chatRequestsRouter };
