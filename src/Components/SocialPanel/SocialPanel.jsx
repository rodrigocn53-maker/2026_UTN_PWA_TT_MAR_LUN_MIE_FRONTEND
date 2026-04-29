import React from 'react';
import Avatar from '../Avatar/Avatar';

const SocialPanel = ({ 
    isOpen, 
    onClose, 
    searchTerm, 
    onSearchChange, 
    loadingUsers, 
    filteredContacts, 
    filteredOthers, 
    renderUserItem 
}) => {
    return (
        <div className={`social-panel-container ${isOpen ? 'open' : ''}`}>
            <div className="social-panel-overlay" onClick={onClose}></div>
            <div className="social-panel-content">
                <div className="social-panel-header">
                    <h3>Contactos y Usuarios</h3>
                    <button onClick={onClose}>&times;</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input 
                        type="text" 
                        placeholder="Buscar contactos o usuarios..." 
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            borderRadius: '8px', 
                            border: '1px solid var(--border-color)', 
                            background: 'var(--bg-color)',
                            color: 'var(--text-color)',
                            fontSize: '14px',
                            outline: 'none',
                            boxShadow: '0 2px 8px var(--shadow)'
                        }}
                    />

                    {/* Contacts List */}
                    <div style={{ background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 12px var(--shadow)' }}>
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-soft)', borderRadius: '12px 12px 0 0' }}>
                            <h3 style={{ margin: 0, fontSize: '14px' }}>Tus Contactos</h3>
                        </div>
                        <div style={{ overflowY: 'auto', padding: '8px', maxHeight: '280px' }}>
                            {loadingUsers ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-soft)' }}>Cargando...</div>
                            ) : filteredContacts.length === 0 ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-soft)', fontSize: '13px' }}>No tienes contactos.</div>
                            ) : (
                                filteredContacts.map(c => renderUserItem(c, true))
                            )}
                        </div>
                    </div>

                    {/* Others List */}
                    <div style={{ background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 12px var(--shadow)' }}>
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-soft)', borderRadius: '12px 12px 0 0' }}>
                            <h3 style={{ margin: 0, fontSize: '14px' }}>Conecta con otros usuarios</h3>
                        </div>
                        <div style={{ overflowY: 'auto', padding: '8px', maxHeight: '280px' }}>
                            {loadingUsers ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-soft)' }}>Cargando...</div>
                            ) : filteredOthers.length === 0 ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-soft)', fontSize: '13px' }}>No se encontraron usuarios.</div>
                            ) : (
                                filteredOthers.map(u => renderUserItem(u, false))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialPanel;
