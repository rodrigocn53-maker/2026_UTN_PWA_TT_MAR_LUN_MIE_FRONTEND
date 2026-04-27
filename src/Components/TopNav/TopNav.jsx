import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';
import Avatar from '../Avatar/Avatar';
import { globalSearch } from '../../services/searchService';
import { getNotifications, respondToInvitation, markNotificationsAsRead } from '../../services/notificationService';

/**
 * Componente de Navegación Superior Unificado.
 * @param {string} currentWorkspaceId - ID del workspace actual (opcional)
 * @param {Function} onChannelSelect - Función para cuando se selecciona un canal en la búsqueda (opcional)
 */
const TopNav = ({ currentWorkspaceId, onChannelSelect }) => {
    const { user, manageLogout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Notifications & Profile State
    const [notifications, setNotifications] = useState([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    // Theme State
    const [themeMode, setThemeMode] = useState(localStorage.getItem('theme') || 'light');
    const [accentColor, setAccentColor] = useState(localStorage.getItem('accentColor') || '#3f0e40');

    const hasUnreadNotifications = notifications.some(n => n.status === 'pending');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', themeMode);
        localStorage.setItem('theme', themeMode);
        document.documentElement.style.setProperty('--accent-color', accentColor);
        localStorage.setItem('accentColor', accentColor);
        
        const darkenColor = (hex, amount) => {
            let col = hex.replace('#', '');
            let r = parseInt(col.substring(0, 2), 16);
            let g = parseInt(col.substring(2, 4), 16);
            let b = parseInt(col.substring(4, 6), 16);
            r = Math.max(0, r - amount);
            g = Math.max(0, g - amount);
            b = Math.max(0, b - amount);
            return `rgb(${r}, ${g}, ${b})`;
        };
        document.documentElement.style.setProperty('--accent-color-dark', darkenColor(accentColor, 30));
    }, [themeMode, accentColor]);

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

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults(null);
            setIsSearchOpen(false);
            return;
        }
        setIsSearchOpen(true);
        setIsSearching(true);
        try {
            const results = await globalSearch(query);
            setSearchResults(results);
        } catch (err) {
            console.error("Search error", err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleRespondNotification = async (notifId, action) => {
        try {
            const res = await respondToInvitation(notifId, action);
            if (res.ok) {
                alert(`Has ${action === 'accepted' ? 'aceptado' : 'rechazado'} la invitación.`);
                fetchNotifications();
                if (action === 'accepted') window.location.reload(); 
                else setIsNotificationOpen(false);
            } else {
                alert(res.message || "Error al procesar la invitación");
            }
        } catch (err) {
            console.error("Error responding", err);
            alert("Error de conexión al responder la invitación");
        }
    };

    const toggleNotifications = async () => {
        const nextState = !isNotificationOpen;
        setIsNotificationOpen(nextState);
        if (nextState) {
            await markNotificationsAsRead();
            fetchNotifications();
        }
    };

    const handleResultClick = (type, item) => {
        setIsSearchOpen(false);
        if (type === 'workspace') {
            navigate(`/workspace/${item._id}`);
        } else if (type === 'channel' || type === 'message') {
            const wsId = type === 'channel' ? item.workspace_id : item.workspace_id;
            const chId = type === 'channel' ? item.id : item.channel_id;
            const chName = type === 'channel' ? item.name : item.channel_name;

            if (wsId === currentWorkspaceId && onChannelSelect) {
                onChannelSelect({ channel_id: chId, channel_name: chName });
            } else {
                window.location.href = `/workspace/${wsId}`;
            }
        }
    };

    return (
        <header className="slack-top-nav" onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '260px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link to="/home" style={{ color: 'white', display: 'flex', alignItems: 'center', textDecoration: 'none', opacity: 0.8, padding: '4px 8px' }} title="Ir al Inicio">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                </Link>
            </div>

            <div className="slack-search-bar" style={{ position: 'relative' }}>
                <input 
                    type="text" 
                    className="slack-search-input" 
                    placeholder="Buscar en Slack..." 
                    value={searchQuery}
                    onChange={handleSearch}
                    onClick={() => { if(searchQuery.trim() !== '') setIsSearchOpen(true); }}
                />
                {isSearchOpen && (
                    <div 
                        style={{ 
                            position: 'absolute', top: '100%', left: 0, right: 0, 
                            background: 'var(--bg-color)', borderRadius: '8px', 
                            boxShadow: '0 4px 12px var(--shadow)', border: '1px solid var(--border-color)',
                            marginTop: '4px', zIndex: 100, maxHeight: '400px', overflowY: 'auto',
                            color: 'var(--text-color)', textAlign: 'left'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {isSearching ? (
                            <div style={{ padding: '16px', color: 'var(--text-soft)' }}>Buscando...</div>
                        ) : searchResults ? (
                            <div>
                                {searchResults.workspaces?.length > 0 && (
                                    <div style={{ padding: '8px 16px' }}>
                                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-soft)', marginBottom: '4px' }}>ESPACIOS DE TRABAJO</div>
                                        {searchResults.workspaces.map(ws => (
                                            <div key={ws._id} onClick={() => handleResultClick('workspace', ws)} style={{ padding: '4px 0', color: '#1164A3', cursor: 'pointer' }}>
                                                <strong>{ws.title}</strong>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {searchResults.channels?.length > 0 && (
                                    <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-color)' }}>
                                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-soft)', marginBottom: '4px' }}>CANALES</div>
                                        {searchResults.channels.map(ch => (
                                            <div key={ch.id} onClick={() => handleResultClick('channel', ch)} style={{ padding: '4px 0', color: '#1164A3', cursor: 'pointer' }}>
                                                # {ch.name} <span style={{ fontSize: '11px', color: 'var(--text-soft)' }}>en {ch.workspace_title}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {searchResults.messages?.length > 0 && (
                                    <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-color)' }}>
                                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-soft)', marginBottom: '4px' }}>MENSAJES</div>
                                        {searchResults.messages.map(msg => (
                                            <div key={msg.id} onClick={() => handleResultClick('message', msg)} style={{ padding: '8px 0', cursor: 'pointer' }}>
                                                <div style={{ fontSize: '12px', color: 'var(--text-soft)' }}><strong>{msg.sender_name}</strong> en #{msg.channel_name}</div>
                                                <div style={{ fontSize: '14px' }}>{msg.content}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {(!searchResults.workspaces?.length && !searchResults.channels?.length && !searchResults.messages?.length) && (
                                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-soft)' }}>
                                        No se encontraron coincidencias para "<strong>{searchQuery}</strong>"
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                            <div style={{ padding: '12px', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>Notificaciones</div>
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {notifications.length === 0 ? (
                                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-soft)' }}>No tienes notificaciones</div>
                                ) : (
                                    notifications.map(n => (
                                        <div key={n._id || n.id} style={{ padding: '12px', borderBottom: '1px solid var(--border-color)', background: n.status === 'pending' ? 'rgba(0,122,90,0.05)' : 'transparent' }}>
                                            <div style={{ marginBottom: '8px', fontSize: '13px' }}>
                                                {n.message || (
                                                    <><strong>{n.sender_id?.username || 'Alguien'}</strong> te invitó a <strong>{n.workspace_id?.title || 'un workspace'}</strong></>
                                                )}
                                            </div>
                                            {n.status === 'pending' && (
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={() => handleRespondNotification(n._id || n.id, 'accepted')} style={{ padding: '4px 8px', background: '#007a5a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Aceptar</button>
                                                    <button onClick={() => handleRespondNotification(n._id || n.id, 'rejected')} style={{ padding: '4px 8px', background: '#e01e5a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Rechazar</button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                    <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>{user?.name || 'Usuario'}</div>
                    <div onClick={(e) => { e.stopPropagation(); setIsProfileMenuOpen(!isProfileMenuOpen); }} style={{ cursor: 'pointer' }}>
                        <Avatar user={user} size="32px" />
                    </div>
                    {isProfileMenuOpen && (
                        <div style={{ position: 'absolute', top: '40px', right: 0, width: '250px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 20px var(--shadow)', zIndex: 1001, padding: '16px', color: 'var(--text-color)' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                                <Avatar user={user} size="40px" />
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-soft)' }}>
                                        {user?.username || user?.name?.toLowerCase().replace(/\s/g, '')}#{user?.tag || '0000'}
                                    </div>
                                </div>
                            </div>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '12px 0' }} />
                            <div style={{ marginBottom: '12px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-soft)', marginBottom: '8px', textTransform: 'uppercase' }}>Apariencia</div>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                    <button onClick={() => setThemeMode('light')} style={{ flex: 1, padding: '6px', fontSize: '12px', borderRadius: '4px', border: themeMode === 'light' ? '2px solid var(--accent-color)' : '1px solid var(--border-color)', background: '#fff', color: '#000', cursor: 'pointer' }}>Claro</button>
                                    <button onClick={() => setThemeMode('dark')} style={{ flex: 1, padding: '6px', fontSize: '12px', borderRadius: '4px', border: themeMode === 'dark' ? '2px solid var(--accent-color)' : '1px solid var(--border-color)', background: '#1a1d21', color: '#fff', cursor: 'pointer' }}>Oscuro</button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                    {['#3f0e40', '#1164A3', '#007a5a', '#e01e5a', '#ecb22e', '#616061'].map(color => (
                                        <div key={color} onClick={() => setAccentColor(color)} style={{ width: '100%', height: '30px', background: color, borderRadius: '4px', cursor: 'pointer', border: accentColor === color ? '2px solid white' : 'none', boxShadow: accentColor === color ? '0 0 0 2px ' + color : 'none' }} />
                                    ))}
                                </div>
                            </div>
                            <button onClick={manageLogout} style={{ width: '100%', padding: '8px', background: 'none', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#e01e5a', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar Sesión</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopNav;
