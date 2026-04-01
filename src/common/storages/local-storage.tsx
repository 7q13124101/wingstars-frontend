import { isValidJSON } from "../helper";

export class StorageService {
    getLocalStorageItem(key: string): string | null {
        if(!localStorage) return null;
        return localStorage.getItem(key) || null;
    }

    setLocalStorageItem(key: string, value: string): void {
        if(!localStorage) return;
        localStorage.setItem(key, value);
    }

    getObjectFromLocalStorage(key: string): any | null {
        const jsonString = this.getLocalStorageItem(key);
        if (isValidJSON(jsonString || '')) {
            return JSON.parse(jsonString!);
        }
        return null;
    }
}

export const storageService = new StorageService();