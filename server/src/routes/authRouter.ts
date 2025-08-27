import { Router } from "express";
const authRouter = Router();

import {
  signupController,
  loginController,
} from "../controllers/authController.js";

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);

export { authRouter };
