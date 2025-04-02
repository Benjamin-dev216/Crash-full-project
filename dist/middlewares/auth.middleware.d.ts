import { Request, Response, NextFunction } from "express";
import "dotenv/config";
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
