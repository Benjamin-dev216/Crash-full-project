import { Request, Response } from "express";
import "dotenv/config";
export declare const signUp: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
export declare const signIn: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
