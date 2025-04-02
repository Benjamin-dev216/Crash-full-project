"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = require("./auth.router");
const game_router_1 = require("./game.router");
const router = express_1.default.Router();
router.use("/auth", auth_router_1.authRouter);
router.use("/game", game_router_1.gameRouter);
exports.default = router;
//# sourceMappingURL=index.js.map