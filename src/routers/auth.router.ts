/** @format */

import { authController } from "@/controllers";
import { Router } from "express";

export const authRouter = Router();

authRouter.post("/signup", authController.signUp);
authRouter.post("/signin", authController.signIn);
