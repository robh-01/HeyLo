import { Router } from "express";
const authRouter = Router();

import {
  signupController,
  loginController,
  tokenValidationController,
} from "../controllers/authController.js";

import { authenticateJWT } from "../middleware/authMiddlware.js";

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);
authRouter.post("/validate-token", authenticateJWT, tokenValidationController);

export { authRouter };
