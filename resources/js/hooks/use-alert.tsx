import { useState } from 'react';

interface AlertState {
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
}

export function useAlert() {
    const [alertState, setAlertState] = useState<AlertState>({
        isOpen: false,
        type: 'info',
        title: '',
        message: ''
    });

    const showAlert = (
        type: 'success' | 'error' | 'warning' | 'info', 
        title: string, 
        message: string
    ) => {
        setAlertState({
            isOpen: true,
            type,
            title,
            message
        });
    };

    const hideAlert = () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
    };

    const success = (title: string, message: string) => {
        showAlert('success', title, message);
    };

    const error = (title: string, message: string) => {
        showAlert('error', title, message);
    };

    const warning = (title: string, message: string) => {
        showAlert('warning', title, message);
    };

    const info = (title: string, message: string) => {
        showAlert('info', title, message);
    };

    return {
        alertState,
        showAlert,
        hideAlert,
        success,
        error,
        warning,
        info
    };
} 