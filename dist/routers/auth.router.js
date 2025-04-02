"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const controllers_1 = require("@/controllers");
const express_1 = require("express");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/signup", controllers_1.authController.signUp);
exports.authRouter.post("/signin", controllers_1.authController.signIn);
//# sourceMappingURL=auth.router.js.map