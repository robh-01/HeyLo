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
export { sendMessage };
