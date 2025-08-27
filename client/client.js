import { io } from "socket.io-client";

const socket = io("ws://localhost:3000", {
  auth: {
    token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWV1YzNpcWYwMDAwbTRiMW40dWZyOGF3IiwiaWF0IjoxNzU2MzIwODc4LCJleHAiOjE3NTYzMjQ0Nzh9.ZD_Xib7fE7NMC1zG14Jj54soKLkoF7MRSFQN3cpKhck`
  }
});

socket.on("connect", () => {
  console.log("connected to the ws server");
})


