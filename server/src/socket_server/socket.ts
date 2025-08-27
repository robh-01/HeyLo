import { Server } from "socket.io";
import http from "http";

export function setupSocket(httpServer: http.Server) {
  const io = new Server(httpServer, {
    serveClient: false,
  });


  io.on("connection", (socket) => {
    console.log("a user connected");
    if (socket.handshake.auth.token) {
      //todo: verify token
      console.log("token:", socket.handshake.auth.token);
    } else {
      console.log("no token provided");
      socket.disconnect();
      return;
    }

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}
