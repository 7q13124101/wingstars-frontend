import type { LOGIN_PROVIDER } from "./auth.contants"


export type IBodyLogin = {
    provider: LOGIN_PROVIDER;
    email?: string;
    password?: string;
    code?: string;
    redirectUri?: string;
}

export type ILoginResponse = {
    accessToken: string;
    expiresIn: number;
}