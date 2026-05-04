import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import Avatar from '../Avatar/Avatar'
import { getConversations } from '../../services/dmService'

const Sidebar = ({ 
    isOpen, 
    onClose, 
    workspaces, 
    loadingWorkspaces, 
    currentWorkspaceId,
    onSupportClick,
    channels = [],
    activeChannelId,
    onChannelSelect,
    onCreateChannel,
    activeTab = 'workspaces' 
}) => {
    const [sidebarTab, setSidebarTab] = useState(activeTab)
    const [conversations, setConversations] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchDMs = async () => {
            const res = await getConversations()
            if (res.ok) setConversations(res.data)
        }
        fetchDMs()
    }, [])

    return (
        <>
            <div 
                className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} 
                onClick={onClose}
            ></div>
            <aside className={`slack-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="slack-sidebar-header">
                    <span>Menu</span>
                    <button 
                        className="sidebar-toggle-btn" 
                        style={{ color: 'white', marginLeft: 'auto' }}
                        onClick={onClose}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                
                <div className="slack-sidebar-content">
                    {/* Tabs */}
                    <div style={{ padding: '0 16px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '8px' }}>
                            <button 
                                onClick={() => setSidebarTab('workspaces')}
                                style={{ flex: 1, padding: '6px', fontSize: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: sidebarTab === 'workspaces' ? 'var(--accent-color)' : 'transparent', color: 'white', fontWeight: 'bold' }}
                            >
                                Workspaces
                            </button>
                            <button 
                                onClick={() => setSidebarTab('dms')}
                                style={{ flex: 1, padding: '6px', fontSize: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: sidebarTab === 'dms' ? 'var(--accent-color)' : 'transparent', color: 'white', fontWeight: 'bold' }}
                            >
                                Chats
                            </button>
                        </div>
                    </div>

                    {sidebarTab === 'workspaces' ? (
                        <div className="slack-sidebar-group">
                            {/* Canales del Workspace Actual */}
                            {currentWorkspaceId && (
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px', marginBottom: '8px' }}>
                                        <div className="slack-sidebar-group-title" style={{ margin: 0 }}>CANALES</div>
                                        <button 
                                            onClick={onCreateChannel}
                                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.7, padding: '4px', display: 'flex' }}
                                            title="Crear canal"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                        </button>
                                    </div>
                                    <ul className="slack-sidebar-list">
                                        {channels?.length > 0 ? (
                                            channels.map((ch) => (
                                                <li 
                                                    key={ch.channel_id} 
                                                    className={`slack-sidebar-item ${String(ch.channel_id) === String(activeChannelId) ? 'active' : ''}`}
                                                    onClick={() => {
                                                        if (onChannelSelect) onChannelSelect(ch);
                                                        onClose();
                                                    }}
                                                >
                                                    <span style={{ opacity: 0.7 }}>#</span>
                                                    <span style={{ marginLeft: '8px' }}>{ch.channel_name}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="slack-sidebar-item" style={{ opacity: 0.5, fontSize: '13px' }}>No hay canales</li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            <div className="slack-sidebar-group-title">ESPACIOS DE TRABAJO</div>
                            <ul className="slack-sidebar-list">
                                {loadingWorkspaces && <li className="slack-sidebar-item">Cargando...</li>}
                                {!loadingWorkspaces && workspaces?.map((ws) => (
                                    <li key={ws.workspace_id} className={`slack-sidebar-item ${String(ws.workspace_id) === String(currentWorkspaceId) ? 'active' : ''}`}>
                                        <Link to={'/workspace/' + ws.workspace_id} onClick={onClose} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <div style={{ width: '20px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                                                {ws.workspace_title?.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ marginLeft: '8px', fontWeight: String(ws.workspace_id) === String(currentWorkspaceId) ? 'bold' : 'normal', fontSize: '14px' }}>{ws.workspace_title}</span>
                                        </Link>
                                    </li>
                                ))}
                                <li className="slack-sidebar-item" style={{ opacity: 0.7, cursor: 'pointer', marginTop: '8px' }} onClick={() => navigate('/home')}>
                                    <span>+</span>
                                    <span style={{ marginLeft: '8px' }}>Explorar / Crear</span>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="slack-sidebar-group">
                            <div className="slack-sidebar-group-title">CHATS PRIVADOS</div>
                            <ul className="slack-sidebar-list">
                                {conversations.length === 0 ? (
                                    <li className="slack-sidebar-item" style={{ opacity: 0.7, fontSize: '13px' }}>No hay chats activos</li>
                                ) : (
                                    conversations.map(conv => (
                                        <li key={conv.contact.id} className="slack-sidebar-item" style={{ padding: '8px 12px' }}>
                                            <Link to={`/chat/${conv.contact.id}`} onClick={onClose} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                                                <Avatar user={conv.contact} size="24px" borderRadius="4px" />
                                                <div style={{ overflow: 'hidden', flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.contact.name}</div>
                                                    <div style={{ fontSize: '11px', opacity: 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.lastMessage.content}</div>
                                                </div>
                                            </Link>
                                        </li>
                                    ))
                                )}
                                <li className="slack-sidebar-item" style={{ opacity: 0.7, cursor: 'pointer', marginTop: '12px' }} onClick={() => navigate('/home')}>
                                    <span>+</span>
                                    <span style={{ marginLeft: '8px' }}>Nuevo chat (Contactos)</span>
                                </li>
                            </ul>
                        </div>
                    )}

                    <div style={{ marginTop: 'auto', padding: '16px' }}>
                        <li 
                            className="slack-sidebar-item" 
                            style={{ 
                                opacity: 0.8, 
                                cursor: 'pointer', 
                                listStyle: 'none', 
                                width: '100%', 
                                justifyContent: 'center',
                                margin: 0,
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }} 
                            onClick={onSupportClick}
                        >
                            <span style={{ fontSize: '16px' }}>💬</span>
                            <span style={{ marginLeft: '8px', fontSize: '14px', fontWeight: 'bold' }}>Soporte Técnico</span>
                        </li>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
