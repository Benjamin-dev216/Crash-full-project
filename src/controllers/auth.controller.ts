/** @format */

import { authService } from "@/services";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { errorHandlerWrapper } from "@/utils";

const signUpHandler = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await authService.createUser({
    name: username,
    hashedPassword,
  });

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  if (newUser) {
    res.status(201).json({
      token: token,
      username: newUser.name,
      userId: newUser.uuid,
    });
  } else {
    res.status(409).json({ message: "User already exists" });
  }
};

const signInHandler = async (req: Request, res: Response) => {
  const { userId } = req.body;

  const user = await authService.getUser({ userId: userId });

  if (!user) {
    res.status(409).json({ message: "User not found" });
    return;
  }

  const token = jwt.sign({ username: user.name }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  res.status(200).json({
    token: token,
    username: user.name,
    userId: user.uuid,
    user_id: user.user_id
  });
};

export const signUp = errorHandlerWrapper(signUpHandler);
export const signIn = errorHandlerWrapper(signInHandler);
