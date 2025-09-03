import prisma from "./prismaClient.js";
import bcrypt from "bcryptjs";

async function createGroup(name: string, creatorId: string, joinCode: string) {
  // check if group with the same name already exists
  const existingGroup = await prisma.group.findUnique({
    where: { name },
  });
  if (existingGroup) {
    throw new Error("Group with this name already exists");
  }

  // create the group
  const group = await prisma.group.create({
    data: {
      name,
      creatorId,
      joinCode,
    },
  });

  // add the creator as a member of the group
  await prisma.group.update({
    where: { id: group.id },
    data: {
      members: {
        connect: { id: creatorId },
      },
    },
  });
  return group;
}

async function joinGroup(
  userId: string,
  groupIdentifier: string,
  joinCode: string
) {
  // groupIdentifier can be either group id or group name
  let identifierType: "id" | "name" = "name";
  let group = await prisma.group.findUnique({
    where: {
      name: groupIdentifier,
    },
  });

  if (!group) {
    group = await prisma.group.findUnique({
      where: {
        id: groupIdentifier,
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }
    identifierType = "id";
  }

  const isMatch = await bcrypt.compare(joinCode, group.joinCode);
  if (!isMatch) {
    throw new Error("Invalid join code");
  }

  const where =
    identifierType === "id"
      ? { id: groupIdentifier }
      : { name: groupIdentifier };

  await prisma.group.update({
    where,
    data: {
      members: {
        connect: { id: userId },
      },
    },
  });
  return group;
}

async function searchGroup(groupName: string) {
  const groups = await prisma.group.findMany({
    where: {
      name: {
        startsWith: groupName.trim(),
      },
    },
  });
  return groups;
}

async function getJoinedGroups(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      groupsMemberOf: true,
    },
  });
  return user?.groupsMemberOf || [];
}

export { createGroup, joinGroup, searchGroup, getJoinedGroups };
