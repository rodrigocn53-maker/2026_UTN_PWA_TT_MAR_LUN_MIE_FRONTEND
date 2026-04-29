import React from 'react';
import { useNavigate } from 'react-router';

const NotificationItem = ({ notification, onRespond, onCloseMenu, onRead }) => {
    const navigate = useNavigate();
    const n = notification;

    // Si n.type no está definido, asumimos que es una invitación de workspace (por compatibilidad con notificaciones antiguas)
    const isWorkspaceInvitation = !n.type || n.type === 'workspace_invitation';
    const isChannelMessage = n.type === 'channel_message';

    const isUnread = !n.read || (isWorkspaceInvitation && n.status === 'pending');

    return (
        <div style={{ 
            padding: '12px', 
            borderBottom: '1px solid var(--border-color)', 
            // "blanca" (transparente a la lista) si está no leída, más oscuro si ya se leyó
            background: isUnread ? 'transparent' : 'rgba(128, 128, 128, 0.1)' 
        }}>
            <div style={{ marginBottom: '8px', fontSize: '13px' }}>
                {isChannelMessage ? (
                    <div onClick={() => {
                        if (isUnread && onRead) onRead(n._id || n.id);
                        if(n.workspace_id?._id) navigate(`/workspace/${n.workspace_id._id}`);
                        onCloseMenu();
                    }} style={{ cursor: 'pointer' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>#{n.workspace_id?.title}</span>{' '}
                        <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>#{n.channel_id?.name}</span>{' - '}
                        {n.sender_id?.name || 'Alguien'}, dijo: ... {n.message_count > 1 ? `[${n.message_count}]` : ''}
                    </div>
                ) : n.message || (
                    <><strong>{n.sender_id?.username || 'Alguien'}</strong> te invitó a <strong>{n.workspace_id?.title || 'un workspace'}</strong></>
                )}
            </div>
            
            {n.status === 'pending' && isWorkspaceInvitation && (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        onClick={() => {
                            onRespond(n._id || n.id, 'accepted');
                            if (isUnread && onRead) onRead(n._id || n.id);
                        }} 
                        style={{ padding: '4px 8px', background: '#007a5a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                        Aceptar
                    </button>
                    <button 
                        onClick={() => {
                            onRespond(n._id || n.id, 'rejected');
                            if (isUnread && onRead) onRead(n._id || n.id);
                        }} 
                        style={{ padding: '4px 8px', background: '#e01e5a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                        Rechazar
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationItem;
