import { RoundEntity } from "./round.entity";
import { UserEntity } from "./user.entity";
export declare class BetEntity {
    id: number;
    user: UserEntity;
    round: RoundEntity;
    amount: number;
    cashoutAt?: number;
    multiplier?: number;
    result: string;
    crash?: number;
    currentFlag: boolean;
    socketId?: string;
    createdAt: Date;
    updatedAt: Date;
}
