import React, { useState, useEffect } from 'react';
import { getNotifications, respondToInvitation, markNotificationsAsRead, markSingleNotificationAsRead } from '../../services/notificationService';
import NotificationItem from '../NotificationItem/NotificationItem';

const NotificationDropdown = ({ showToast }) => {
    const [notifications, setNotifications] = useState([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const hasUnreadNotifications = notifications.some(n => 
        !n.read || ((!n.type || n.type === 'workspace_invitation') && n.status === 'pending')
    );

    const fetchNotifications = async () => {
        if (document.visibilityState !== 'visible') return;
        try {
            const res = await getNotifications();
            if (res.ok) setNotifications(res.data);
        } catch (err) {
            console.error("Error fetching notifications", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 20000);
        return () => clearInterval(interval);
    }, []);

    const toggleNotifications = () => {
        const nextState = !isNotificationOpen;
        setIsNotificationOpen(nextState);
        if (nextState) {
            fetchNotifications();
        }
    };

    const handleMarkAllAsRead = async (e) => {
        e.stopPropagation();
        await markNotificationsAsRead();
        fetchNotifications();
    };

    const handleMarkSingleAsRead = async (id) => {
        await markSingleNotificationAsRead(id);
        fetchNotifications();
    };

    const handleRespondNotification = async (notifId, action) => {
        try {
            const res = await respondToInvitation(notifId, action);
            if (res.ok) {
                showToast(`Has ${action === 'accepted' ? 'aceptado' : 'rechazado'} la invitación.`);
                fetchNotifications();
                if (action === 'accepted') setTimeout(() => window.location.reload(), 1500); 
                else setIsNotificationOpen(false);
            } else {
                showToast(res.message || "Error al procesar la invitación", 'error');
            }
        } catch (err) {
            console.error("Error responding", err);
            showToast("Error de conexión al responder la invitación", 'error');
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <button 
                onClick={(e) => { e.stopPropagation(); toggleNotifications(); }}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', position: 'relative', opacity: 0.8 }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
            >
                {/* ICONO DE CAMPANA SIN RELLENO (OUTLINE) */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {notifications.length > 0 && (
                    <span style={{ 
                        position: 'absolute', top: '-2px', right: '-2px', 
                        width: '10px', height: '10px', 
                        background: hasUnreadNotifications ? '#e01e5a' : 'rgba(255,255,255,0.3)', 
                        borderRadius: '50%', border: '2px solid var(--accent-color-dark)' 
                    }} />
                )}
            </button>
            {isNotificationOpen && (
                <div style={{ position: 'absolute', top: '40px', right: '-40px', width: '300px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 12px var(--shadow)', zIndex: 1001, color: 'var(--text-color)' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ padding: '12px', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Notificaciones</span>
                        {hasUnreadNotifications && (
                            <button 
                                onClick={handleMarkAllAsRead} 
                                style={{ background: 'none', border: 'none', color: '#1164A3', fontSize: '12px', cursor: 'pointer', padding: 0 }}>
                                Marcar todo como leído
                            </button>
                        )}
                    </div>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-soft)' }}>No tienes notificaciones</div>
                        ) : (
                            notifications.map(n => (
                                <NotificationItem 
                                    key={n._id || n.id} 
                                    notification={n} 
                                    onRespond={handleRespondNotification} 
                                    onCloseMenu={() => setIsNotificationOpen(false)} 
                                    onRead={handleMarkSingleAsRead}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
