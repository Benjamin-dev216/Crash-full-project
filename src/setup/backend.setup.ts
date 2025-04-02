/** @format */

import express, { Express, Request, Response } from "express";
import cors from "cors";
import router from "@/routers";
import path from 'path'
import { createServer } from "http";
import { Logger } from "@/utils";
import {
  authMiddleware,
  errorHandlerMiddleware,
} from "@/middlewares";
import { startGame } from "@/controllers/game.controller";
import { setupSocket } from "@/utils/socket";

export const backendSetup = () => {
  const app: Express = express();

  app.use(cors({
    origin: 'https://royel7.club',
    credentials: true,
  }));
  app.use(express.json());

  app.use("/api/health", (_req: Request, res: Response) => {
    res.send("It's healthy!");
  });

  // 👇 Serve frontend only in production

  // ✅ Mount API routes before catch-all
  app.use("/api", router);

  // ✅ Catch-all AFTER API routes

  // Error handler
  app.use(errorHandlerMiddleware);

  const server = createServer(app);
  const io = setupSocket(server);

  const port = Number(process.env.PORT) || 4000;
  server.listen(port, () => {
    Logger.info(`Server is running on port ${port}`);
    startGame(io);
  });
};
