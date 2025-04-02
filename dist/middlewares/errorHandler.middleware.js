"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
const utils_1 = require("@/utils");
const errorHandlerMiddleware = (err, req, res, next) => {
    utils_1.Logger.error(err);
    res.status(500).json({ message: "Internal Server Error!" });
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
//# sourceMappingURL=errorHandler.middleware.js.map