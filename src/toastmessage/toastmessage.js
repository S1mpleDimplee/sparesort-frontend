import React, { useState, useMemo, createContext, useContext } from "react";
import { createPortal } from 'react-dom';
import './toastmessage.css';

function ToastMessage({ message, close }) {
    return (
        <div className="toast show">
            <span className="toast-message">{message}</span>
            <button className="toast-close" onClick={close}>
                ×
            </button>
        </div>
    );
}

function openToast(message, setToasts) {
    const newToast = {
        id: Date.now(),
        message: message
    };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Automatically close the toast after 5 seconds
    setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== newToast.id));
    }, 8000);
}

function closeToast(id, setToasts) {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
}

const ToastProviderContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const contextValue = useMemo(() => ({
        openToast: (message) => openToast(message, setToasts),
        closeToast: (id) => closeToast(id, setToasts)
    }), [setToasts]);

    return (
        <ToastProviderContext.Provider value={contextValue}>
            {children}
            {/* Use createPortal to render toasts directly to document.body */}
            {createPortal(
                <div className="toast-container">
                    {toasts.map((toast) => (
                        <ToastMessage
                            key={toast.id}
                            message={toast.message}
                            close={() => closeToast(toast.id, setToasts)}
                        />
                    ))}
                </div>,
                document.body
            )}
        </ToastProviderContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastProviderContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}