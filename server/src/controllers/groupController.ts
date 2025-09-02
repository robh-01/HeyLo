import { Request, Response } from "express";
import { createGroup, joinGroup } from "../db/groupQueries.js";
import bcrypt from "bcryptjs";

async function createGroupHandler(req: Request, res: Response) {
  const userId = (req.user as { id: string })?.id;
  const { name, joinCode } = req.body;

  if (!userId) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }
  if (!name || !joinCode) {
    return res
      .status(400)
      .json({ status: "error", message: "Name and join code are required" });
  }
  const hashedJoinCode = await bcrypt.hash(joinCode, 10);

  try {
    const group = await createGroup(name, userId, hashedJoinCode);
    res.status(201).json({ status: "success", data: group });
  } catch (err) {
    console.error("Error creating group:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to create group. Please try again later.",
    });
  }
}

async function joinGroupHandler(req: Request, res: Response) {
  const userId = (req.user as { id: string })?.id;
  const { groupIdentifier, joinCode } = req.body;

  if (!userId) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }
  if (!groupIdentifier || !joinCode) {
    return res.status(400).json({
      status: "error",
      message: "Group identifier and join code are required",
    });
  }

  try {
    await joinGroup(userId, groupIdentifier, joinCode);
    res
      .status(200)
      .json({ status: "success", message: `Joined group ${groupIdentifier}` });
  } catch (err) {
    console.error("Error joining group:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to join group. Please try again later.",
    });
  }
}

export { createGroupHandler, joinGroupHandler };
