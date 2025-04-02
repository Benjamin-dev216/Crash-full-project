export type CreateUserRequestType = {
    uuid?: string;
    name: string;
    hashedPassword: string;
    role?: string;
};
