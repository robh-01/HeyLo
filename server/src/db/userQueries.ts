import prisma from "./prismaClient.js";
import type { User } from "../../generated/prisma/index.d.ts";

async function createUser(user: Omit<User, "id">) {
  const createdUser = await prisma.user.create({
    data: {
      ...user,
    },
  });
  return createdUser;
}

async function getUserByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  return user;
}

async function getUsersByPartialUsername(username: string) {
  const user = await prisma.user.findMany({
    where: {
      username: {
        startsWith: username.trim()
      }
    },
  });
  return user;
}

async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });
  return user;
}

export { createUser, getUserByUsername, getUsersByPartialUsername, getUserById };
