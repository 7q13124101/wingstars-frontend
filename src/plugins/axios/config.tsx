import type { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";


export const config: AxiosRequestConfig = {
    headers: {
        'Content-Type': 'application/json',
        'X-Timezone': dayjs().format('Z'),
        'X-Timezone-Name': dayjs.tz.guess(),
    },
    baseURL: import.meta.env.VITE_API_URL || '',
    responseType: 'json',
}