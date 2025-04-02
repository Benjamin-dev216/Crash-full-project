import { BetEntity } from "./bet.entity";
import { CoreEntity } from "./core.entity";
export declare class UserEntity extends CoreEntity {
    uuid: string;
    name: string;
    user_id: number;
    balance: number;
    bets: BetEntity[];
}
