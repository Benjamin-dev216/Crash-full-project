import { BetEntity } from "./bet.entity";
export declare class RoundEntity {
    id: number;
    startTime: Date;
    crashPoint: number;
    bets: BetEntity[];
}
