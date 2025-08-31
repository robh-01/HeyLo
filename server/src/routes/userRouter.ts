import { Router } from "express";
const userRouter = Router();

import { getUsersByPartialUsernameHandler } from "../controllers/userController.js";
import { authenticateJWT } from "../middleware/authMiddlware.js";

userRouter.get(
  "/partial-username",
  authenticateJWT,
  getUsersByPartialUsernameHandler
);

export { userRouter };
