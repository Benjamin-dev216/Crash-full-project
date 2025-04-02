"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const services_1 = require("@/services");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null;
    if (!token) {
        res.status(401).json({ error: "Authentication required!" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield services_1.authService.getUser(decoded);
        if (!user)
            throw "User Not Found!";
        next();
    }
    catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
});
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map