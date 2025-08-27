import { Request, Response } from "express";
import { createUser, getUserByUsername } from "../db/userQueries.js";
import { Prisma } from "../../generated/prisma/client.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function signupController(req: Request, res: Response) {
  console.log(req.body);
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { username, password: hashedPassword };
  try {
    await createUser(user);
    res.status(201).json({
      status: "success",
      message: `User ${username} created successfully.`,
    });
  } catch (err: unknown) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      res.status(500).json({
        status: "error",
        message:
          "Failed to create user. There is a unique constraint violation",
        violatedField: err.meta!.target,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to create user. Please try again later.",
      });
    }
  }
}

async function loginController(req: Request, res: Response) {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({
        status: "failure",
        message: "Invalid credentials.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "failure",
        message: "Invalid credentials.",
      });
    }

    const payload = {
      sub: user.id,
    };

    const opts: jwt.SignOptions = {
      expiresIn: "1h",
      algorithm: "HS256",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, opts);
    res.status(200).json({
      status: "success",
      message: `User ${user.username} logged in successfully`,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      status: "failure",
      message: "Unable to login at the moment. Please try again later",
    });
  }
}

export { signupController, loginController };
