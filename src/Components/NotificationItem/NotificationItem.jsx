import React from 'react';
import { useNavigate } from 'react-router';

const NotificationItem = ({ notification, onRespond, onCloseMenu, onRead }) => {
    const navigate = useNavigate();

    // Tipos de notificación
    const isWorkspaceInvitation = !notification.type || notification.type === 'workspace_invitation';
    const isChannelMessage = notification.type === 'channel_message';
    const isContactRequest = notification.type === 'contact_request';
    const isContactAccepted = notification.type === 'contact_accepted';
    const isContactRejected = notification.type === 'contact_rejected';

    const isUnread = !notification.read || ((isWorkspaceInvitation || isContactRequest) && notification.status === 'pending');

    return (
        <div style={{ 
            padding: '12px', 
            borderBottom: '1px solid var(--border-color)', 
            background: isUnread ? 'transparent' : 'rgba(128, 128, 128, 0.1)' 
        }}>
            <div style={{ marginBottom: '8px', fontSize: '13px', color: 'var(--text-color)' }}>
                {isChannelMessage ? (
                    <div onClick={() => {
                        if (isUnread && onRead) onRead(notification._id || notification.id);
                        if(notification.workspace_id?._id) navigate(`/workspace/${notification.workspace_id._id}`);
                        onCloseMenu();
                    }} style={{ cursor: 'pointer' }}>
                        <span style={{ fontWeight: 'bold' }}>#{notification.workspace_id?.title}</span>{' '}
                        <span style={{ fontWeight: 'bold' }}>#{notification.channel_id?.name}</span>{' - '}
                        {notification.sender_id?.name || 'Alguien'}, dijo: ... {notification.message_count > 1 ? `[${notification.message_count}]` : ''}
                    </div>
                ) : isContactRequest ? (
                    <><strong>{notification.sender_id?.username || 'Alguien'}</strong> te envió una <strong>solicitud de contacto</strong></>
                ) : isContactAccepted ? (
                    <>¡<strong>{notification.sender_id?.username || 'Alguien'}</strong> aceptó tu solicitud! Ahora están en contacto.</>
                ) : isContactRejected ? (
                    <span style={{ color: '#e01e5a' }}><strong>{notification.sender_id?.username || 'Alguien'}</strong> rechazó tu solicitud de contacto.</span>
                ) : notification.message || (
                    <><strong>{notification.sender_id?.username || 'Alguien'}</strong> te invitó a <strong>{notification.workspace_id?.title || 'un workspace'}</strong></>
                )}
            </div>
            
            {notification.status === 'pending' && (isWorkspaceInvitation || isContactRequest) && (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        onClick={() => {
                            onRespond(notification._id || notification.id, 'accepted');
                            if (isUnread && onRead) onRead(notification._id || notification.id);
                        }} 
                        style={{ padding: '4px 8px', background: '#007a5a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        Aceptar
                    </button>
                    <button 
                        onClick={() => {
                            onRespond(notification._id || notification.id, 'rejected');
                            if (isUnread && onRead) onRead(notification._id || notification.id);
                        }} 
                        style={{ padding: '4px 8px', background: '#e01e5a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        Rechazar
                    </button>
                </div>
            )}

            {(isContactAccepted || isContactRejected) && !notification.read && (
                <button 
                    onClick={() => onRead(notification._id || notification.id)}
                    style={{ background: 'none', border: 'none', color: '#1164A3', fontSize: '11px', cursor: 'pointer', padding: 0 }}>
                    Entendido
                </button>
            )}
        </div>
    );
};

export default NotificationItem;
