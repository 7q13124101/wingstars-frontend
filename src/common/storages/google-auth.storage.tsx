
export const GOOGLE_AUTH_SERVICE_KEY = {
    GOOGLE_LOGIN_CODE: 'google_login_code',
    GOOGLE_LOGIN_EMAIL: 'google_login_email',
} as const;
export type GOOGLE_AUTH_SERVICE_KEY = (typeof GOOGLE_AUTH_SERVICE_KEY)[keyof typeof GOOGLE_AUTH_SERVICE_KEY];

class GoogleAuthStorageService {
    setGoogleLoginCode(code: string): void {
        localStorage.setItem(GOOGLE_AUTH_SERVICE_KEY.GOOGLE_LOGIN_CODE, code);
    }
    getGoogleLoginCode(): string {
        return localStorage.getItem(GOOGLE_AUTH_SERVICE_KEY.GOOGLE_LOGIN_CODE) || '';
    }
    resetGoogleLoginCode(): void {
        localStorage.removeItem(GOOGLE_AUTH_SERVICE_KEY.GOOGLE_LOGIN_CODE);
    }

    setGoogleLoginEmail(email: string): void {
        localStorage.setItem(GOOGLE_AUTH_SERVICE_KEY.GOOGLE_LOGIN_EMAIL, email);
    }
    getGoogleLoginEmail(): string {
        return localStorage.getItem(GOOGLE_AUTH_SERVICE_KEY.GOOGLE_LOGIN_EMAIL) || '';
    }
    resetGoogleLoginEmail(): void {
        localStorage.removeItem(GOOGLE_AUTH_SERVICE_KEY.GOOGLE_LOGIN_EMAIL);
    }
}

export const googleAuthStorageService = new GoogleAuthStorageService();