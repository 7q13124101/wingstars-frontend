import { createContext, useContext, useState } from "react";

export const TOAST_TYPE = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning',
} as const;
export type TOAST_TYPE = (typeof TOAST_TYPE)[keyof typeof TOAST_TYPE];

export interface IToast {
    id: string;
    type: TOAST_TYPE;
    title: string;
    message: string;
    isAutoClose?: boolean;
    duration?: number;
}

export interface IToastOptions {
    type: TOAST_TYPE;
    title: string;
    message: string;
    isAutoClose?: boolean;
    duration?: number;
}

const defaultToastOptions: IToastOptions = {
    type: TOAST_TYPE.INFO,
    title: '',
    message: '',
    isAutoClose: true,
    duration: 3000,
}

function createUUID(): string {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<IToast[]>([]);

    const addToast = (options: IToastOptions) => {
        const toast: IToast = {
            id: createUUID(),
            ...defaultToastOptions,
            ...options,
        };
        setToasts((prevToasts) => [...prevToasts, toast]);
    };

    const removeToast = (id: string) => {
        setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const ToastContext = createContext<{
    toasts: IToast[];
    addToast: (options: IToastOptions) => void;
    removeToast: (id: string) => void;
}>({
    toasts: [],
    addToast: () => { },
    removeToast: () => { },
});

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}