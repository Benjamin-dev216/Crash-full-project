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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHistory = exports.emitUserList = exports.onCashout = exports.addBetToCurrentRound = exports.emitUserHistory = exports.startGame = exports.startPendingFlag = void 0;
const entities_1 = require("@/entities");
const datasource_1 = require("@/setup/datasource");
const typeorm_1 = require("typeorm");
let currentRound = null;
let gameInterval;
let currentRoundBets = [];
exports.startPendingFlag = false;
const startGame = (io) => __awaiter(void 0, void 0, void 0, function* () {
    clearInterval(gameInterval);
    for (const bet of currentRoundBets) {
        io.to(bet.socketId).emit("cashoutDisabled", false);
    }
    const roundRepository = datasource_1.AppDataSource.getRepository(entities_1.RoundEntity);
    currentRound = new entities_1.RoundEntity();
    currentRound.crashPoint = generateCrashPoint();
    try {
        currentRound = yield roundRepository.save(currentRound);
    }
    catch (error) {
        console.error("Error saving round:", error);
        return;
    }
    io.emit("gameStart", {
        crashPoint: currentRound.crashPoint,
        roundId: currentRound.id,
    });
    let multiplier = 1;
    let timeElapsed = 0;
    let rate = 0.05;
    const updateInterval = 50;
    gameInterval = setInterval(() => {
        if (!currentRound) {
            console.error("Error: currentRound is null during game loop!");
            clearInterval(gameInterval);
            return;
        }
        timeElapsed += updateInterval / 1000;
        rate = 0.05 + Math.min(timeElapsed * 0.005, 0.15);
        multiplier = parseFloat((1 * Math.pow(Math.E, rate * timeElapsed)).toFixed(4));
        io.emit("multiplierUpdate", { multiplier });
        if (multiplier >= currentRound.crashPoint) {
            clearInterval(gameInterval);
            endGame(currentRound.crashPoint, io);
        }
    }, updateInterval);
});
exports.startGame = startGame;
const endGame = (crashPoint, io) => __awaiter(void 0, void 0, void 0, function* () {
    io.emit("gameEnd", { crashPoint });
    io.emit("cashoutDisabled", true);
    const betRepository = datasource_1.AppDataSource.getRepository(entities_1.BetEntity);
    const userRepository = datasource_1.AppDataSource.getRepository(entities_1.UserEntity);
    try {
        const processedUsers = new Map();
        for (const bet of currentRoundBets) {
            if (bet.cashoutAt && bet.cashoutAt <= crashPoint) {
                bet.result = "win";
                bet.user.balance = parseFloat((Number(bet.user.balance) +
                    Number(bet.amount) * Number(bet.cashoutAt)).toFixed(4));
            }
            else {
                bet.result = "lose";
                bet.user.balance = Math.max(0, parseFloat((bet.user.balance - bet.amount).toFixed(4)));
            }
            bet.crash = crashPoint;
            bet.round = currentRound;
            yield betRepository.save(bet);
            yield userRepository.save(bet.user);
            processedUsers.set(bet.user.name, bet.socketId);
            io.to(bet.socketId).emit("betResult", { win: bet.result === 'win', amount: bet.amount });
        }
        (0, exports.emitUserList)(io, true);
        for (const [username, socketId] of processedUsers) {
            (0, exports.emitUserHistory)(username, socketId, io);
        }
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            currentRoundBets = [];
            const result = yield betRepository.find({
                where: { currentFlag: true },
                relations: ["user"],
                order: { amount: "DESC" },
            });
            result.forEach((item) => (item.currentFlag = false));
            yield betRepository.save(result);
            currentRoundBets = [...result];
            (0, exports.emitUserList)(io, false);
            io.emit("startPending", true);
            for (const bet of currentRoundBets) {
                io.to(bet.socketId).emit("startPending", false);
            }
            exports.startPendingFlag = true;
            let remainingTime = 7;
            const countdownInterval = setInterval(() => {
                io.emit("countdown", { time: remainingTime });
                remainingTime--;
                if (remainingTime === 0) {
                    clearInterval(countdownInterval);
                    io.emit("startPending", false);
                }
            }, 1000);
            setTimeout(() => {
                exports.startPendingFlag = false;
                (0, exports.startGame)(io);
                io.emit("startPending", true);
            }, 8000);
        }), 1000);
    }
    catch (error) {
        console.error("Error in endGame:", error);
    }
});
const emitUserHistory = (username, socketId, io) => __awaiter(void 0, void 0, void 0, function* () {
    const betRepository = datasource_1.AppDataSource.getRepository(entities_1.BetEntity);
    try {
        const bets = yield betRepository.find({
            where: {
                user: { name: username },
                round: { id: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) },
            },
            relations: ["round"],
            order: { createdAt: "DESC" },
            take: 10,
        });
        io.to(socketId).emit("userHistoryUpdate", {
            bets: bets.map(({ id, amount, result, round, createdAt, multiplier, crash }) => ({
                id,
                createdAt,
                roundId: round.id,
                amount,
                odds: multiplier || 0,
                winAmount: multiplier ? amount * multiplier : 0,
                crashPoint: crash,
                result,
            })),
        });
    }
    catch (error) {
        console.error("Error emitting user history:", error);
    }
});
exports.emitUserHistory = emitUserHistory;
const addBetToCurrentRound = (bet, io) => __awaiter(void 0, void 0, void 0, function* () {
    const betRepository = datasource_1.AppDataSource.getRepository(entities_1.BetEntity);
    try {
        if (exports.startPendingFlag) {
            const existingBet = currentRoundBets.find((b) => b.id === bet.id);
            if (!existingBet) {
                bet.currentFlag = false;
                yield betRepository.save(bet);
                insertSorted(bet);
                (0, exports.emitUserList)(io, false);
            }
        }
    }
    catch (error) {
        console.error("Error adding bet to current round:", error);
    }
});
exports.addBetToCurrentRound = addBetToCurrentRound;
const onCashout = (username, multiplier, io) => __awaiter(void 0, void 0, void 0, function* () {
    if (exports.startPendingFlag)
        return null;
    currentRoundBets.forEach((item) => {
        if (item.user.name !== username)
            return;
        item.cashoutAt = parseFloat(multiplier.toFixed(4));
        item.result = multiplier <= currentRound.crashPoint ? "win" : "lose";
        item.multiplier = multiplier <= currentRound.crashPoint ? multiplier : null;
        if (item.result === "win") {
            (0, exports.emitUserList)(io, false);
        }
    });
});
exports.onCashout = onCashout;
const insertSorted = (bet) => {
    const exists = currentRoundBets.some((b) => b.id === bet.id);
    if (exists)
        return;
    let index = currentRoundBets.findIndex((b) => b.amount < bet.amount);
    if (index === -1) {
        currentRoundBets.push(bet);
    }
    else {
        currentRoundBets.splice(index, 0, bet);
    }
};
const emitUserList = (io, gameEndFlag) => __awaiter(void 0, void 0, void 0, function* () {
    const filteredBets = currentRoundBets
        .map(({ id, user, amount, cashoutAt, result, multiplier }) => ({
        id,
        username: user.name,
        amount,
        cashoutAt,
        result,
        multiplier,
    }))
        .slice(0, 40);
    const numberOfPlayers = currentRoundBets === null || currentRoundBets === void 0 ? void 0 : currentRoundBets.length;
    const totalBets = currentRoundBets.reduce((sum, bet) => sum + Number(bet.amount || 0), 0);
    const totalWinnings = currentRoundBets.reduce((sum, bet) => sum +
        (bet.result === "win"
            ? Number(bet.amount || 0) * (Number(bet.multiplier) || 1)
            : 0), 0);
    io.emit("userList", {
        filteredBets,
        gameEndFlag,
        numberOfPlayers,
        totalBets: parseFloat(totalBets.toFixed(4)),
        totalWinnings: parseFloat(totalWinnings.toFixed(4)),
    });
});
exports.emitUserList = emitUserList;
const fetchHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!userId) {
            res.status(400).json({ error: "User name is required" });
        }
        const betRepository = datasource_1.AppDataSource.getRepository(entities_1.BetEntity);
        const bets = yield betRepository.find({
            where: { user: { uuid: userId } },
            relations: ["round"],
            order: { createdAt: "DESC" },
            take: 10,
        });
        if (!bets) {
            res.status(404).json({ error: "Bets not found" });
        }
        res.json({
            bets: bets.map(({ id, amount, result, round, createdAt, multiplier, crash }) => ({
                id,
                createdAt,
                roundId: round.id,
                amount,
                odds: multiplier ? multiplier : 0,
                winAmount: amount * multiplier,
                crashPoint: crash,
                result,
            })),
        });
    }
    catch (error) {
        console.error("Error fetching user history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.fetchHistory = fetchHistory;
function generateCrashPoint() {
    const r = Math.random();
    if (r < 0.01) {
        return 1.00;
    }
    if (r < 0.81) {
        return parseFloat((Math.random() * (3.0 - 1.01) + 1.01).toFixed(2));
    }
    else {
        const base = Math.random();
        const crash = 3.01 + Math.pow(1 - base, 2) * (100 - 3.01);
        return parseFloat(crash.toFixed(2));
    }
}
//# sourceMappingURL=game.controller.js.map