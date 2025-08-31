import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";

import { getUserById } from "../db/userQueries.js";

export function setupSocket(httpServer: http.Server) {
  const io = new Server(httpServer, {
    serveClient: false,
  });

  io.on("connection", async (socket) => {
    if (socket.handshake.auth.token) {
      //todo: verify token
      const token = socket.handshake.auth.token;
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

        // token is valid
        const user = await getUserById(decoded.sub as string)
        if (user) {
          console.log(`${user.username} is online.`);
        }

      } catch (err) {
        // invalid token
        console.log("invalid token:", err);
        socket.disconnect();
        return;
      }
    } else {
      console.log("no token provided");
      socket.disconnect();
      return;
    }

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("global message", (msg) => {
      socket.broadcast.emit("global message", msg);
    });
  });
}
