import { Request, Response } from "express";
import { getUsersByPartialUsername } from "../db/userQueries.js";

async function getUsersByPartialUsernameHandler(req: Request, res: Response) {
  const { username } = req.body;
  try {
    const users = await getUsersByPartialUsername(username);
    res.status(200).json({
      status: "success",
      data: users.map((user) => ({ id: user.id, username: user.username })),
    });
  } catch (err) {
    console.error("Error fetching users by partial username:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch users. Please try again later.",
    });
  }
}

export { getUsersByPartialUsernameHandler };
