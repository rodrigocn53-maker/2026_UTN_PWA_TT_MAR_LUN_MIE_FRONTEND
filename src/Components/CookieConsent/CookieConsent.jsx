import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '600px',
            backgroundColor: 'var(--bg-color)',
            color: 'var(--text-color)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
            zIndex: 9999,
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            animation: 'toast-in 0.5s ease-out'
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{ fontSize: '24px' }}>🍪</div>
                <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>Cookies necesarias</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-soft)', lineHeight: '1.5' }}>
                        Utilizamos cookies técnicas necesarias para el funcionamiento de la aplicación, como mantener tu sesión iniciada y recordar tus preferencias de seguridad. Al continuar usando el sitio, aceptas estas cookies esenciales.
                    </p>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                    onClick={handleAccept}
                    style={{
                        backgroundColor: 'var(--accent-color)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 20px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}
                >
                    Entendido
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;
