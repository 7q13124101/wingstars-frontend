export const LOGIN_PROVIDER = {
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
    GITHUB: 'github',
    EMAIL: 'email',
} as const;
export type LOGIN_PROVIDER = (typeof LOGIN_PROVIDER)[keyof typeof LOGIN_PROVIDER];

