/** @format */

import { UserEntity } from "@/entities";
import { AppDataSource } from "@/setup/datasource";
import { CreateUserRequestType } from "@/types";

export const createUser = async ({
  name,
  hashedPassword,
}: CreateUserRequestType): Promise<UserEntity | null> => {
  const userRepository = AppDataSource.getRepository(UserEntity);

  const existingUser = await userRepository.findOne({ where: { name } });
  if (existingUser) {
    return null;
  }

  const newUser = new UserEntity();
  Object.assign(newUser, { name, hashedPassword });

  return await userRepository.save(newUser);
};

export const getUser = async ({ userId }): Promise<UserEntity | null> => {
  const userRepository = AppDataSource.getRepository(UserEntity);

  const gettingUser: UserEntity | null = await userRepository.findOne({
    where: { user_id: userId },
  });
  if (gettingUser) return gettingUser;
  return null;
};
