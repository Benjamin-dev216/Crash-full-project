// services/bet.service.ts
import { AppDataSource } from "@/setup/datasource";
import { BetEntity, RoundEntity } from "@/entities";

export const resetBets = async () => {
    const roundRepo = AppDataSource.getRepository(RoundEntity);
    const betRepo = AppDataSource.getRepository(BetEntity);

    // await roundRepo.clear()
    await betRepo.clear(); // Completely wipes the bets table
};
