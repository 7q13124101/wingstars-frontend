import type { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from "axios";
import dayjs from "dayjs";
import axios from "axios";
import { throttle } from 'lodash';
import { sendRefreshTokenRequest } from "./utils";
import { localStorageService } from "../../common/storages";
import { HTTP_STATUS } from "../../common/constants";
import type { IBodyResponse } from "../../common/interface";


const options: AxiosRequestConfig = {
    headers: {
        'Content-Type': 'application/json',
        'X-Timezone': dayjs().format('Z'),
        'X-Timezone-Name': dayjs.tz.guess(),
    } as unknown as AxiosRequestHeaders,
    baseURL: import.meta.env.VITE_API_URL || '',
    responseType: 'json',
    withCredentials: false,
}

const axiosInstance = axios.create(options);
const throttled = throttle(sendRefreshTokenRequest, 10000, { trailing: false });

axiosInstance.interceptors.request.use(async (config: any) => {
    const tokenExpriredAt = localStorageService.getAccessTokenExpiresAt();
    if (tokenExpriredAt && dayjs(tokenExpriredAt).isBefore()) {
        await throttled();
    }
    Object.assign(config, {
        headers: {
            ...localStorageService.getHeader(),
            ...config.headers,
        }
    });
    return config;
})

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        if (!response.data) return {
            sucess: true,
        };
        if (typeof response.data === 'string') {
            response.data = JSON.parse(response.data);
        }
        response.data = {
            ...response.data,
            success: true,
        };
        return response.data;
    },
    async (error) => {
        if (error.code === HTTP_STATUS.NETWORK_ERROR) {
            error.request.data = {
                ...(error?.request.data ? JSON.parse(error.request.data) : {}),
                success: false,
                isRequestError: true,
                message: error.message,
                code: HTTP_STATUS.NETWORK_ERROR,
            };
            return error.request.data;
        } else if (error.response) {
            if (typeof error?.response?.data === 'string') {
                error.response.data = JSON.parse(error.response.data);
            }
            if (error?.response?.data) {
                error.response.data = {
                    ...((error?.response?.data as object) || {}),
                    success: false,
                };
            }

            return error.response.data as IBodyResponse<unknown>;
        } else if (error.request) {
            error.request.data = {
                ...(error?.request?.data || {}),
                success: false,
                isRequestError: true,
                message: error.message,
            };
            return error.request?.data;
        }
        return {
            ...error,
            config: error?.config as AxiosRequestConfig,
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            statusText: 'System error, please try again later',
            headers: error?.request?.headers || {},
            success: false,
            message: 'System error, please try again later',
            data: null,
            code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        }
    }
);
export default axiosInstance;
export * from "./utils";
export * from "./api";

