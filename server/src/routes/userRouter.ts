import { Router } from "express";
const userRouter = Router();

import {
  getUsersByPartialUsernameHandler,
  getFriendsHandler,
} from "../controllers/userController.js";
import { authenticateJWT } from "../middleware/authMiddlware.js";

userRouter.get("/search", authenticateJWT, getUsersByPartialUsernameHandler);
userRouter.get("/friends", authenticateJWT, getFriendsHandler);

export { userRouter };
