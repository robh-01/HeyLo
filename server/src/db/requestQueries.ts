import prisma from "./prismaClient.js";

async function createMessageRequest(fromId: string, toId: string) {
  const chatRequest = await prisma.chatRequest.create({
    data: {
      fromId,
      toId,
    },
  });
  return chatRequest;
}

async function getMessageRequestByRequestId(requestId: string) {
  const chatRequest = await prisma.chatRequest.findUnique({
    where: {
      id: requestId,
    },
  });
  return chatRequest;
}

async function getReceivedMessageRequests(userId: string) {
  const chatRequests = await prisma.chatRequest.findMany({
    where: {
      toId: userId,
    },
    include: {
      from: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
  return chatRequests;
}

async function getSentMessageRequests(userId: string) {
  const chatRequests = await prisma.chatRequest.findMany({
    where: {
      fromId: userId,
    },
    include: {
      to: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
  return chatRequests;
}

async function deleteMessageRequest(requestId: string) {
  const deletedRequest = await prisma.chatRequest.delete({
    where: {
      id: requestId,
    },
  });
  return deletedRequest;
}

async function acceptMessageRequest(requestId: string) {
  const updatedRequest = await prisma.chatRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: "accepted",
    },
  });

  //make users freinds after request is accepted
  await prisma.user.update({
    where: {
      id: updatedRequest.fromId,
    },
    data: {
      friends: {
        connect: {
          id: updatedRequest.toId,
        },
      },
    },
  });
  await prisma.user.update({
    where: {
      id: updatedRequest.toId,
    },
    data: {
      friends: {
        connect: {
          id: updatedRequest.fromId,
        },
      },
    },
  });
  return updatedRequest;
}

async function rejectMessageRequest(requestId: string) {
  const updatedRequest = await prisma.chatRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: "rejected",
    },
  });
  return updatedRequest;
}

export {
  createMessageRequest,
  getMessageRequestByRequestId,
  getReceivedMessageRequests,
  getSentMessageRequests,
  deleteMessageRequest,
  acceptMessageRequest,
  rejectMessageRequest,
};
