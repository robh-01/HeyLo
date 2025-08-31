import { Request, Response } from "express";
import {
  createMessageRequest,
  getMessageRequestByRequestId,
  getReceivedMessageRequests,
  getSentMessageRequests,
  deleteMessageRequest,
  acceptMessageRequest,
  rejectMessageRequest,
} from "../db/requestQueries.js";

async function sendChatRequestHandler(req: Request, res: Response) {
  const { toId } = req.body;
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

  if (fromId === toId) {
    return res.status(400).json({
      status: "failure",
      message: "You cannot send a chat request to yourself.",
    });
  }

  try {
    const messageRequest = await createMessageRequest(fromId, toId);
    if (!messageRequest) {
      return res.status(400).json({
        status: "failure",
        message: "Chat request already exists or cannot be created.",
      });
    }

    res.status(200).json({
      status: "success",
      message: `Chat request sent to user ID ${toId}.`,
    });
  } catch (err) {
    console.error("Error sending chat request:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to send chat request. Please try again later.",
    });
  }
}

async function getReceivedChatRequestsHandler(req: Request, res: Response) {
  if (req.user === undefined) {
    return res.status(401).json({
      status: "failure",
      message: "Unauthorized. User not found in token.",
    });
  }
  const userId = (req.user as { id: string }).id;

  if (!userId) {
    return res.status(401).json({
      status: "failure",
      message: "Unauthorized. User ID not found in token.",
    });
  }

  try {
    const chatRequests = await getReceivedMessageRequests(userId);
    res.status(200).json({
      status: "success",
      message: "Fetched all revieved chat requests.",
      data: chatRequests,
    });
  } catch (err) {
    console.error("Error retrieving chat requests:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve chat requests. Please try again later.",
    });
  }
}

async function getSentChatRequestsHandler(req: Request, res: Response) {
  if (req.user === undefined) {
    return res.status(401).json({
      status: "failure",
      message: "Unauthorized. User not found in token.",
    });
  }
  const userId = (req.user as { id: string }).id;

  if (!userId) {
    return res.status(401).json({
      status: "failure",
      message: "Unauthorized. User ID not found in token.",
    });
  }

  try {
    const chatRequests = await getSentMessageRequests(userId);
    res.status(200).json({
      status: "success",
      message: "Fetched all sent chat requests.",
      data: chatRequests,
    });
  } catch (err) {
    console.error("Error retrieving chat requests:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve chat requests. Please try again later.",
    });
  }
}

async function patchChatRequestHandler(req: Request, res: Response) {
  const action = req.body.action; //accept reject or delete
  // user who sent the request can delete it whereas user who received it can accept or reject it
  const requestId = req.params.requestId;

  if (req.user === undefined) {
    return res.status(401).json({
      status: "failure",
      message: "Unauthorized. User not found in token.",
    });
  }
  const userId = (req.user as { id: string }).id;

  if (!userId) {
    return res.status(401).json({
      status: "failure",
      message: "Unauthorized. User ID not found in token.",
    });
  }

  const chatRequest = await getMessageRequestByRequestId(requestId);
  if (!chatRequest) {
    return res.status(404).json({
      status: "failure",
      message: `Chat request with ID ${requestId} not found.`,
    });
  }

  // Check if the user is authorized to perform the action
  if (
    (action === "accept" || action === "reject") &&
    chatRequest.toId !== userId
  ) {
    return res.status(403).json({
      status: "failure",
      message: "You are not authorized to accept or reject this chat request.",
    });
  }

  if (action === "delete" && chatRequest.fromId !== userId) {
    return res.status(403).json({
      status: "failure",
      message: "You are not authorized to delete this chat request.",
    });
  }

  switch (action) {
    case "accept":
      await acceptMessageRequest(requestId);
      return res.status(200).json({
        status: "success",
        message: `Chat request ${requestId} accepted.`,
      });
    case "reject":
      await rejectMessageRequest(requestId);
      return res.status(200).json({
        status: "success",
        message: `Chat request ${requestId} rejected.`,
      });
    case "delete":
      await deleteMessageRequest(requestId);
      return res.status(200).json({
        status: "success",
        message: `Chat request ${requestId} deleted.`,
      });
    default:
      return res.status(400).json({
        status: "failure",
        message: "Invalid action. Must be 'accept', 'reject', or 'delete'.",
      });
  }
}

export {
  sendChatRequestHandler,
  getReceivedChatRequestsHandler,
  getSentChatRequestsHandler,
  patchChatRequestHandler,
};
