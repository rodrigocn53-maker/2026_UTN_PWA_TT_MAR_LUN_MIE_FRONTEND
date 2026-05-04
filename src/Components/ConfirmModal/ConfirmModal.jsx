import React from 'react';

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'Confirmar acción', 
    message = '¿Estás seguro de que deseas realizar esta acción?', 
    confirmText = 'Confirmar', 
    cancelText = 'Cancelar',
    type = 'danger' // 'danger' or 'primary'
}) => {
    if (!isOpen) return null;

    const confirmBtnStyle = {
        padding: '10px 20px',
        borderRadius: '4px',
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '14px',
        background: type === 'danger' ? '#e01e5a' : 'var(--accent-color)',
        color: 'white'
    };

    const cancelBtnStyle = {
        padding: '10px 20px',
        borderRadius: '4px',
        border: '1px solid var(--border-color)',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '14px',
        background: 'transparent',
        color: 'var(--text-color)'
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: '0 0 12px 0', fontSize: '20px' }}>{title}</h2>
                    <p style={{ color: 'var(--text-soft)', fontSize: '15px', lineHeight: '1.5' }}>{message}</p>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button style={cancelBtnStyle} onClick={onClose}>{cancelText}</button>
                    <button style={confirmBtnStyle} onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
