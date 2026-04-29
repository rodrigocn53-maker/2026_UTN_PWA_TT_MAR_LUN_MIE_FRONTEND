import React from 'react';
import { useNavigate } from 'react-router';

const NotificationItem = ({ notification, onRespond, onCloseMenu, onRead }) => {
    const navigate = useNavigate();
    const n = notification;

    // Tipos de notificación
    const isWorkspaceInvitation = !n.type || n.type === 'workspace_invitation';
    const isChannelMessage = n.type === 'channel_message';
    const isContactRequest = n.type === 'contact_request';
    const isContactAccepted = n.type === 'contact_accepted';
    const isContactRejected = n.type === 'contact_rejected';

    const isUnread = !n.read || ((isWorkspaceInvitation || isContactRequest) && n.status === 'pending');

    return (
        <div style={{ 
            padding: '12px', 
            borderBottom: '1px solid var(--border-color)', 
            background: isUnread ? 'transparent' : 'rgba(128, 128, 128, 0.1)' 
        }}>
            <div style={{ marginBottom: '8px', fontSize: '13px', color: 'var(--text-color)' }}>
                {isChannelMessage ? (
                    <div onClick={() => {
                        if (isUnread && onRead) onRead(n._id || n.id);
                        if(n.workspace_id?._id) navigate(`/workspace/${n.workspace_id._id}`);
                        onCloseMenu();
                    }} style={{ cursor: 'pointer' }}>
                        <span style={{ fontWeight: 'bold' }}>#{n.workspace_id?.title}</span>{' '}
                        <span style={{ fontWeight: 'bold' }}>#{n.channel_id?.name}</span>{' - '}
                        {n.sender_id?.name || 'Alguien'}, dijo: ... {n.message_count > 1 ? `[${n.message_count}]` : ''}
                    </div>
                ) : isContactRequest ? (
                    <><strong>{n.sender_id?.username || 'Alguien'}</strong> te envió una <strong>solicitud de contacto</strong></>
                ) : isContactAccepted ? (
                    <>¡<strong>{n.sender_id?.username || 'Alguien'}</strong> aceptó tu solicitud! Ahora están en contacto.</>
                ) : isContactRejected ? (
                    <span style={{ color: '#e01e5a' }}><strong>{n.sender_id?.username || 'Alguien'}</strong> rechazó tu solicitud de contacto.</span>
                ) : n.message || (
                    <><strong>{n.sender_id?.username || 'Alguien'}</strong> te invitó a <strong>{n.workspace_id?.title || 'un workspace'}</strong></>
                )}
            </div>
            
            {n.status === 'pending' && (isWorkspaceInvitation || isContactRequest) && (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        onClick={() => {
                            onRespond(n._id || n.id, 'accepted');
                            if (isUnread && onRead) onRead(n._id || n.id);
                        }} 
                        style={{ padding: '4px 8px', background: '#007a5a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        Aceptar
                    </button>
                    <button 
                        onClick={() => {
                            onRespond(n._id || n.id, 'rejected');
                            if (isUnread && onRead) onRead(n._id || n.id);
                        }} 
                        style={{ padding: '4px 8px', background: '#e01e5a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        Rechazar
                    </button>
                </div>
            )}

            {(isContactAccepted || isContactRejected) && !n.read && (
                <button 
                    onClick={() => onRead(n._id || n.id)}
                    style={{ background: 'none', border: 'none', color: '#1164A3', fontSize: '11px', cursor: 'pointer', padding: 0 }}>
                    Entendido
                </button>
            )}
        </div>
    );
};

export default NotificationItem;
