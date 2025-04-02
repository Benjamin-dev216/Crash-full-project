"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetEntity = void 0;
const typeorm_1 = require("typeorm");
const round_entity_1 = require("./round.entity");
const user_entity_1 = require("./user.entity");
let BetEntity = class BetEntity {
};
exports.BetEntity = BetEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BetEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.bets, {
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", user_entity_1.UserEntity)
], BetEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => round_entity_1.RoundEntity, (round) => round.bets, {
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: "roundId" }),
    __metadata("design:type", round_entity_1.RoundEntity)
], BetEntity.prototype, "round", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], BetEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], BetEntity.prototype, "cashoutAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], BetEntity.prototype, "multiplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 10, default: "pending" }),
    __metadata("design:type", String)
], BetEntity.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], BetEntity.prototype, "crash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], BetEntity.prototype, "currentFlag", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], BetEntity.prototype, "socketId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BetEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BetEntity.prototype, "updatedAt", void 0);
exports.BetEntity = BetEntity = __decorate([
    (0, typeorm_1.Entity)("bets")
], BetEntity);
//# sourceMappingURL=bet.entity.js.map