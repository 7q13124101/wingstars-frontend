
import type { AxiosResponse } from "axios";
import { HTTP_STATUS } from "./constants";

export interface IResponseError<T = any> {
    key: string;
    message: string;
    errorCode: HTTP_STATUS;
    data?: T;
}

export interface IBodyResponse<T> extends AxiosResponse {
    success: boolean;
    isRequestError: boolean;
    code: HTTP_STATUS;
    message: string;
    error: string;
    data: T;
    errors?: IResponseError[];
}

export interface ICommomListQuery {
    page?: number;
    limit?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    keyword?: string;
    [key: string]: any;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface ILoginResponse {
    asscessToken: {
        token: string;
        expiresIn: number;
    };
    refreshToken: {
        token: string;
        expiresIn: number;
    };
    user: IUser;
}

export interface IGetListResponse<T> {
    items: T[];
    totalItems: number;
}