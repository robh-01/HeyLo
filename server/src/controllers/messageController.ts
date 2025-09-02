import { Request, Response } from "express";
import { sendMessage } from "../db/messageQueries.js";

async function sendMessageHandler(req: Request, res: Response) {
  const { messageType, toId, content } = req.body;
  if (req.user === undefined) {
    return res.status(401).json({
      status: "failure",
      message: "Unauthorized. User not found in token.",
    });
  }
  const fromId = (req.user as { id: string }).id;

  if (!fromId) {
    return res.status(401).json({
      status: "failure",
      message: "Unauthorized. User ID not found in token.",
    });
  }

  if (!messageType || !toId || !content) {
    return res.status(400).json({
      status: "failure",
      message: "messageType, toId, and content are required.",
    });
  }

  try {
    const message = await sendMessage(
      messageType.toUpperCase(),
      fromId,
      toId,
      content
    );
    res.status(200).json({
      status: "success",
      data: message,
    });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(400).json({
      status: "error",
      message: `Failed to send message. ${err instanceof Error ? err.message : "Please try again later."}`,
    });
  }
}

export { sendMessageHandler };
