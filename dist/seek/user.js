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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
const entities_1 = require("@/entities");
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_DATABASE,
    entities: [entities_1.UserEntity, entities_1.BetEntity, entities_1.RoundEntity],
    logging: false,
    synchronize: true,
    ssl: { rejectUnauthorized: false }
});
const REMOTE_API = "https://jackpot-junction.org/api/users";
const syncUsersFromRemote = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(REMOTE_API);
        const data = response.data;
        if (!data.status || !Array.isArray(data.data)) {
            console.error("❌ Invalid API response");
            return;
        }
        const remoteUsers = data.data;
        const userRepo = AppDataSource.getRepository(entities_1.UserEntity);
        for (const remoteUser of remoteUsers) {
            const exists = yield userRepo.findOne({
                where: { name: remoteUser.username },
            });
            if (!exists) {
                const user = userRepo.create({
                    name: remoteUser.username,
                    user_id: remoteUser.id,
                    balance: 1000
                });
                yield userRepo.save(user);
                console.log(`✅ Created user: ${remoteUser.username}`);
            }
            else {
                console.log(`ℹ️ User already exists: ${remoteUser.username}`);
            }
        }
        console.log("🎉 Sync completed!");
    }
    catch (err) {
        console.error("❌ Error syncing users:", err.message);
    }
});
AppDataSource.initialize()
    .then(() => {
    console.log("📦 DB Connected. Syncing users...");
    return syncUsersFromRemote();
})
    .catch((err) => {
    console.error("❌ DB init error:", err.message);
});
//# sourceMappingURL=user.js.map