/** @format */

import { CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity()
export class CoreEntity {
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
