import { createServer } from "http";
import { setupSocket } from "./socket_server/socket.js";
import { indexRouter } from "./routes/indexRouter.js";

import dotenv from "dotenv";
dotenv.config();

//configs
import { configPassport } from "./configs/passport.config.js";

import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configPassport();

app.use("/api/v1", indexRouter);

const httpServer = createServer(app);
setupSocket(httpServer);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`server running on port ${PORT}...`);
});
