"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameRouter = void 0;
const controllers_1 = require("@/controllers");
const express_1 = require("express");
exports.gameRouter = (0, express_1.Router)();
exports.gameRouter.get("/history/:userId", controllers_1.gameController.fetchHistory);
//# sourceMappingURL=game.router.js.map