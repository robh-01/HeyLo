import { io } from "socket.io-client";

const socket = io("ws://localhost:3000", {
  auth: {
    token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWV1YzNpcWYwMDAwbTRiMW40dWZyOGF3IiwiaWF0IjoxNzU2NjExNTMxLCJleHAiOjE3NTY2MTUxMzF9.w4V1iy1ZUfU9P8BVp-uB0qLuMBZ_vdzoVBMbEtlgbsU`
  }
});

socket.on("connect", () => {
  console.log("connected to the ws server");
})

socket.on("global message", (msg) => {
  console.log("global message received: ", msg);
})

socket.on("disconnect", () => {
  console.log("disconnected from the ws server");
})

