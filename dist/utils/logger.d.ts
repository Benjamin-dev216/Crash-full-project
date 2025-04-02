declare class CustomLogger {
    log(...args: any): void;
    info(...args: any): void;
    error(...args: any): void;
    group(...args: any): void;
    groupEnd(): void;
}
export declare const Logger: CustomLogger;
export {};
