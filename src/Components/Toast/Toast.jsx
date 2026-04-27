import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const getColors = () => {
        switch (type) {
            case 'error': return { bg: '#e01e5a', color: 'white' };
            case 'warning': return { bg: '#ecb22e', color: 'black' };
            case 'success':
            default: return { bg: '#007a5a', color: 'white' };
        }
    };

    const { bg, color } = getColors();

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: bg,
            color: color,
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'toast-in 0.3s ease-out',
            fontWeight: '500',
            fontSize: '14px'
        }}>
            {message}
            <button 
                onClick={onClose}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '18px',
                    lineHeight: '1',
                    padding: '0',
                    opacity: '0.8'
                }}
            >
                &times;
            </button>
        </div>
    );
};

export default Toast;
