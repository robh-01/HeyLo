import { Router } from "express";
const groupRouter = Router();

import {
  createGroupHandler,
  joinGroupHandler,
} from "../controllers/groupController.js";
import { authenticateJWT } from "../middleware/authMiddlware.js";

groupRouter.post("/join", authenticateJWT, joinGroupHandler);
groupRouter.post("/create", authenticateJWT, createGroupHandler);

export { groupRouter };
