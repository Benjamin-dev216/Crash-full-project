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
const setup_1 = require("./setup");
const backend_setup_1 = require("./setup/backend.setup");
const utils_1 = require("./utils");
const setupServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, setup_1.databaseSetup)();
        utils_1.Logger.info(utils_1.MESSAGES.CONNECTED_DATABASE);
    }
    catch (err) {
        utils_1.Logger.error(err);
        utils_1.Logger.info(utils_1.MESSAGES.FAILED_TO_CONNECT_DATABASE);
    }
    try {
        yield (0, backend_setup_1.backendSetup)();
        utils_1.Logger.info(utils_1.MESSAGES.SERVER_RUNNING);
    }
    catch (err) {
        utils_1.Logger.error(err);
        utils_1.Logger.info(utils_1.MESSAGES.SERVER_RUNNING_FAILED);
    }
});
setupServer();
//# sourceMappingURL=index.js.map