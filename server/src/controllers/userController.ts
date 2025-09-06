import { Request, Response } from "express";
import { getUsersByPartialUsername, getFriends } from "../db/userQueries.js";

async function getUsersByPartialUsernameHandler(req: Request, res: Response) {
  const { username } = req.params;
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
      message: `Failed to fetch users. ${err instanceof Error ? err.message : "Please try again later."}`,
    });
  }
}

async function getFriendsHandler(req: Request, res: Response) {
  const userId = (req.user as { id: string })?.id;
  if (!userId) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  try {
    const friends = await getFriends(userId);
    res.status(200).json({
      status: "success",
      data: friends.map((friend) => ({
        id: friend.id,
        username: friend.username,
      })),
    });
  } catch (err) {
    console.error("Error fetching friends:", err);
    res.status(500).json({
      status: "error",
      message: `Failed to fetch friends. ${err instanceof Error ? err.message : "Please try again later."}`,
    });
  }
}

export { getUsersByPartialUsernameHandler, getFriendsHandler };
