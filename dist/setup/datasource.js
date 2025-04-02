"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("@/entities");
require("dotenv/config");
exports.AppDataSource = new typeorm_1.DataSource({
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
//# sourceMappingURL=datasource.js.map