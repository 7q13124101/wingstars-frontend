import { SUPPORT_LANGUAGE } from "../constants";
import { storageService } from "./local-storage";


const BUFFER_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export const AUTH_SERVICE_KEY = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
    ROLE: 'role',
    LANGUAGE: 'language',
    ACCESS_TOKEN_EXPIRES_AT: 'access_token_expires_at',
    REFRESH_TOKEN_EXPIRES_AT: 'refresh_token_expires_at',
} as const;
export type AUTH_SERVICE_KEY = (typeof AUTH_SERVICE_KEY)[keyof typeof AUTH_SERVICE_KEY];

class LocalStorageService {
    // Access Token
    setAccessToken(token: string): void {
        storageService.setLocalStorageItem(AUTH_SERVICE_KEY.ACCESS_TOKEN, token);
    }
    getAccessToken(): string {
        return storageService.getLocalStorageItem(AUTH_SERVICE_KEY.ACCESS_TOKEN) || '';
    }
    resetAccessToken(): void {
        storageService.setLocalStorageItem(AUTH_SERVICE_KEY.ACCESS_TOKEN, '');
    }

    // Refresh Token
    setRefreshToken(token: string): void {
        storageService.setLocalStorageItem(AUTH_SERVICE_KEY.REFRESH_TOKEN, token);
    }
    getRefreshToken(): string {
        return storageService.getLocalStorageItem(AUTH_SERVICE_KEY.REFRESH_TOKEN) || '';
    }
    resetRefreshToken(): void {
        storageService.setLocalStorageItem(AUTH_SERVICE_KEY.REFRESH_TOKEN, '');
    }

    // Access Token Expires At
    setAccessTokenExpiresAt(expiresIn: number): void {
        const expiresAt = Date.now() + expiresIn * 1000 - BUFFER_TIME;
        storageService.setLocalStorageItem(AUTH_SERVICE_KEY.ACCESS_TOKEN_EXPIRES_AT, expiresAt.toString());
    }
    getAccessTokenExpiresAt(): number {
        return parseInt(storageService.getLocalStorageItem(AUTH_SERVICE_KEY.ACCESS_TOKEN_EXPIRES_AT) || '0');
    }
    resetAccessTokenExpiresAt(): void {
        storageService.setLocalStorageItem(AUTH_SERVICE_KEY.ACCESS_TOKEN_EXPIRES_AT, '');
    }

    // Language
    setLanguage(language: SUPPORT_LANGUAGE): void {
        storageService.setLocalStorageItem(AUTH_SERVICE_KEY.LANGUAGE, language);
    }
    getLanguage(): SUPPORT_LANGUAGE {
        return (storageService.getLocalStorageItem(AUTH_SERVICE_KEY.LANGUAGE) as SUPPORT_LANGUAGE) || SUPPORT_LANGUAGE.EN;
    }

    // Header
    getHeader() {
        return {
            Authorization: `Bearer ${this.getAccessToken()}`,
            'Accept-Language': this.getLanguage() || SUPPORT_LANGUAGE.EN,
        }
    }

    getAuthorizationHeader() {
        return {
            Authorization: `Bearer ${this.getAccessToken()}`,
        }
    }

    // Login user
    // setLoginUser(user: null | )

    
}

export const localStorageService = new LocalStorageService();