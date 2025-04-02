import { UserEntity } from "@/entities";
import { CreateUserRequestType } from "@/types";
export declare const createUser: ({ name, hashedPassword, }: CreateUserRequestType) => Promise<UserEntity | null>;
export declare const getUser: ({ userId }: {
    userId: any;
}) => Promise<UserEntity | null>;
