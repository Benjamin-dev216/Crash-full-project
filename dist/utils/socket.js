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
exports.setupSocket = void 0;
const socket_io_1 = require("socket.io");
const datasource_1 = require("@/setup/datasource");
const entities_1 = require("@/entities");
const game_controller_1 = require("@/controllers/game.controller");
const axios_1 = __importDefault(require("axios"));
const setupSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);
        socket.on("placeBet", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { username, amount, user_id } = data;
                if (!username || !amount || amount <= 0) {
                    return socket.emit("error", { message: "Invalid bet data" });
                }
                const betRepository = datasource_1.AppDataSource.getRepository(entities_1.BetEntity);
                const userRepository = datasource_1.AppDataSource.getRepository(entities_1.UserEntity);
                const user = yield userRepository.findOne({
                    where: { name: username },
                });
                if (!user)
                    return socket.emit("error", { message: "User not found" });
                const rlt = yield axios_1.default.get(`https://jackpot-junction.org/api/user-details/${user_id}`);
                user.balance = rlt.data.balance;
                yield userRepository.save(user);
                if (rlt.data.balance < amount) {
                    return socket.emit("error", { message: "Insufficient balance" });
                }
                const bet = new entities_1.BetEntity();
                bet.user = user;
                bet.amount = parseFloat(amount.toFixed(4));
                bet.result = "pending";
                bet.crash = 0;
                bet.socketId = socket.id;
                yield betRepository.save(bet);
                if (game_controller_1.startPendingFlag)
                    (0, game_controller_1.addBetToCurrentRound)(bet, io);
                console.log(`Bet placed: ${amount} by User: ${username}`);
                socket.emit("betConfirmed", {
                    message: "Bet placed successfully",
                    bet,
                });
            }
            catch (error) {
                console.error("Error in placeBet:", error);
                socket.emit("error", {
                    message: "Internal server error",
                    details: error.message,
                });
            }
        }));
        socket.on("cashout", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { username, multiplier } = data;
                if (!username || !multiplier || multiplier <= 1) {
                    return socket.emit("error", { message: "Invalid cashout data" });
                }
                yield (0, game_controller_1.onCashout)(username, multiplier, io);
                console.log(`User ${username} cashed out at ${multiplier}x`);
            }
            catch (error) {
                console.error("Error in cashout:", error);
                socket.emit("error", {
                    message: "Internal server error",
                    details: error.message,
                });
            }
        }));
        socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`User disconnected: ${socket.id}`);
        }));
    });
    return io;
};
exports.setupSocket = setupSocket;
//# sourceMappingURL=socket.js.map