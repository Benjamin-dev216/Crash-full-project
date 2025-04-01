/** @format */

import { Logger } from "@/utils";
import { Request, Response, NextFunction } from "express";

export const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.error(err);

  res.status(500).json({ message: "Internal Server Error!" });
};
