import { Router } from "express";
const groupRouter = Router();

import {
  createGroupHandler,
  joinGroupHandler,
  searchGroupHandler,
  getJoinedGroupsHandler,
} from "../controllers/groupController.js";
import { authenticateJWT } from "../middleware/authMiddlware.js";

groupRouter.post("/join", authenticateJWT, joinGroupHandler);
groupRouter.post("/create", authenticateJWT, createGroupHandler);
groupRouter.get("/search", authenticateJWT, searchGroupHandler);
groupRouter.get("/joined", authenticateJWT, getJoinedGroupsHandler);

export { groupRouter };
