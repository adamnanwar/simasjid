import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    confirmText?: string;
    onConfirm?: () => void;
    cancelText?: string;
    showCancel?: boolean;
}

export function AlertModal({
    isOpen,
    onClose,
    type,
    title,
    message,
    confirmText = 'OK',
    onConfirm,
    cancelText = 'Batal',
    showCancel = false
}: AlertModalProps) {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-6 h-6 text-green-600" />;
            case 'error':
                return <XCircle className="w-6 h-6 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
            case 'info':
                return <Info className="w-6 h-6 text-blue-600" />;
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success':
                return 'border-green-200 bg-green-50';
            case 'error':
                return 'border-red-200 bg-red-50';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50';
            case 'info':
                return 'border-blue-200 bg-blue-50';
        }
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className={`p-4 rounded-lg border-2 ${getColor()}`}>
                    <DialogTitle className="flex items-center gap-3">
                        {getIcon()}
                        <span>{title}</span>
                    </DialogTitle>
                </DialogHeader>
                
                <div className="p-4">
                    <p className="text-gray-600 mb-6">{message}</p>
                    
                    <div className="flex gap-3 justify-end">
                        {showCancel && (
                            <Button
                                variant="outline"
                                onClick={onClose}
                            >
                                {cancelText}
                            </Button>
                        )}
                        <Button
                            onClick={handleConfirm}
                            className={`${
                                type === 'success' ? 'bg-green-600 hover:bg-green-700' :
                                type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                                type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
                                'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 