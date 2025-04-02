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
exports.getUser = exports.createUser = void 0;
const entities_1 = require("@/entities");
const datasource_1 = require("@/setup/datasource");
const createUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, hashedPassword, }) {
    const userRepository = datasource_1.AppDataSource.getRepository(entities_1.UserEntity);
    const existingUser = yield userRepository.findOne({ where: { name } });
    if (existingUser) {
        return null;
    }
    const newUser = new entities_1.UserEntity();
    Object.assign(newUser, { name, hashedPassword });
    return yield userRepository.save(newUser);
});
exports.createUser = createUser;
const getUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
    const userRepository = datasource_1.AppDataSource.getRepository(entities_1.UserEntity);
    const gettingUser = yield userRepository.findOne({
        where: { user_id: userId },
    });
    if (gettingUser)
        return gettingUser;
    return null;
});
exports.getUser = getUser;
//# sourceMappingURL=auth.service.js.map