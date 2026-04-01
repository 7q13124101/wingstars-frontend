// import {  } from '@/components/toast/store';
import dayjs from "dayjs";
import { TOAST_TYPE, useToast } from "../components/toast/store";
import { DATE_TIME_FORMAT } from "./constants";



export function isValidJSON(jsonString: string): boolean {
    try {
        const object = JSON.parse(jsonString);
        if (object && typeof object === 'object') return true;
        return false;
    } catch (error) {
        return false;
    }
}

export function showErrorNotification(message: string, title: string, duration: number = 2000) {
    if (!message) return;
    const { addToast } = useToast();
    addToast({
        type: TOAST_TYPE.ERROR,
        title,
        message,
        duration,
    })
}

export function showSuccessNotification(message: string, title: string, duration: number = 2000) {
    if (!message) return;
    const { addToast } = useToast();
    addToast({
        type: TOAST_TYPE.SUCCESS,
        title,
        message,
        duration,
    })
}

export function showWarningNotification(message: string, title: string, duration: number = 2000) {
    if (!message) return;
    const { addToast } = useToast();
    addToast({
        type: TOAST_TYPE.WARNING,
        title,
        message,
        duration,
    })
}

export function showInfoNotification(message: string, title: string, duration: number = 2000) {
    if (!message) return;
    const { addToast } = useToast();
    addToast({
        type: TOAST_TYPE.INFO,
        title,
        message,
        duration,
    })
}

export function maskPhoneNumber(phoneNumber: string, pattern = '###-###-####'): string {
    let i = 0;
    return pattern.replace(/#/g, (_) => phoneNumber[i++] || '');
}

export function fomatDateTime(date: Date | string): string {
    return dayjs(date).format(DATE_TIME_FORMAT.YYYY_MM_DD_DASH);
}

export const normalizeString = (str: string): string => {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');;
}

// export const getToggleOrderDirection = (orderDirection: )



