import { createContext, useContext } from "react";

type ToastContextValue = {
    open: (message: string) => void;
    close: (id: string) => void;
};

export const ToastContext = createContext(null as ToastContextValue | null);

export const useToast = () => useContext(ToastContext);
