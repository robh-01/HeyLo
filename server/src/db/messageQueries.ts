import prisma from "./prismaClient.js";

//message type: direct or group
async function sendMessage(
  messageType: "DIRECT" | "GROUP",
  fromId: string,
  toId: string,
  content: string
) {
  if (messageType === "DIRECT") {
    // check if user exists
    const user = await prisma.user.findUnique({
      where: { id: toId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    // check if users are friends
    const areFriends = await prisma.user.findFirst({
      where: {
        id: fromId,
        friends: {
          some: {
            id: toId,
          },
        },
      },
    });
    if (!areFriends) {
      throw new Error("You can only send messages to your friends");
    }
    const message = await prisma.chatMessage.create({
      data: {
        type: messageType,
        fromId,
        toUserId: toId,
        content,
      },
    });
    return message;
  }
  if (messageType === "GROUP") {
    // check if group exists
    const group = await prisma.group.findUnique({
      where: { id: toId },
    });
    if (!group) {
      throw new Error("Group not found");
    }

    // check if user is a member of the group
    const isMember = await prisma.group.findFirst({
      where: {
        id: toId,
        members: {
          some: {
            id: fromId,
          },
        },
      },
    });
    if (!isMember) {
      throw new Error(
        "You can only send messages to groups you are a member of"
      );
    }
    const message = await prisma.chatMessage.create({
      data: {
        type: messageType,
        fromId,
        toGroupId: toId,
        content,
      },
    });
    return message;
  }
}

async function getMessages(userId: string, chatWith: string) {
  // chatWith can be either userId for direct messages or groupId for group messages
  // first check if chatWith is a user
  const user = await prisma.user.findUnique({
    where: { id: chatWith },
  });
  if (user) {
    // get direct messages between the two users
    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [
          {
            fromId: userId,
            toUserId: chatWith,
            type: "DIRECT",
          },
          {
            fromId: chatWith,
            toUserId: userId,
            type: "DIRECT",
          },
        ],
      },
      orderBy: {
        sentAt: "asc",
      },
    });
    return messages;
  }
  // if not a user, check if chatWith is a group
  const group = await prisma.group.findUnique({
    where: { id: chatWith },
  });
  if (group) {
    // check if user is a member of the group
    const isMember = await prisma.group.findFirst({
      where: {
        id: chatWith,
        members: {
          some: {
            id: userId,
          },
        },
      },
    });
    if (!isMember) {
      throw new Error(
        "You can only view messages of groups you are a member of"
      );
    }
    // get group messages
    const messages = await prisma.chatMessage.findMany({
      where: {
        toGroupId: chatWith,
        type: "GROUP",
      },
      orderBy: {
        sentAt: "asc",
      },
    });
    return messages;
  }
  throw new Error("Chat not found");
}
export { sendMessage, getMessages };
