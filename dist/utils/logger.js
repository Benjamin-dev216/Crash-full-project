"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class CustomLogger {
    log(...args) {
        console.log(...args);
    }
    info(...args) {
        console.info(...args);
    }
    error(...args) {
        console.error(...args);
    }
    group(...args) {
        console.group(...args);
    }
    groupEnd() {
        console.groupEnd();
    }
}
exports.Logger = new CustomLogger();
//# sourceMappingURL=logger.js.map