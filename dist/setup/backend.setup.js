"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backendSetup = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routers_1 = __importDefault(require("@/routers"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const utils_1 = require("@/utils");
const middlewares_1 = require("@/middlewares");
const game_controller_1 = require("@/controllers/game.controller");
const socket_1 = require("@/utils/socket");
const backendSetup = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use("/health", (_req, res) => {
        res.send("It's healthy!");
    });
    if (process.env.NODE_ENV === 'production') {
        const clientBuildPath = path_1.default.resolve(__dirname, '../../../client/dist');
        app.use(express_1.default.static(clientBuildPath));
    }
    app.use("/api", routers_1.default);
    if (process.env.NODE_ENV === 'production') {
        const clientBuildPath = path_1.default.resolve(__dirname, '../../../client/dist');
        app.get('*', (_req, res) => {
            res.sendFile(path_1.default.join(clientBuildPath, 'index.html'));
        });
    }
    app.use(middlewares_1.errorHandlerMiddleware);
    const server = (0, http_1.createServer)(app);
    const io = (0, socket_1.setupSocket)(server);
    const port = process.env.PORT || 4000;
    server.listen(port, () => {
        utils_1.Logger.info(`Server is running on port ${port}`);
        (0, game_controller_1.startGame)(io);
    });
};
exports.backendSetup = backendSetup;
//# sourceMappingURL=backend.setup.js.map