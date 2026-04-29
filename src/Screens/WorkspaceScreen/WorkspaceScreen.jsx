import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router'
import useWorkspace from '../../hooks/useWorkspace'
import useWorkspaces from '../../hooks/useWorkspaces'
import useChannels from '../../hooks/useChannels'
import useMessages from '../../hooks/useMessages'
import NewWorkspaceModalScreen from '../NewWorkspaceModalScreen/NewWorkspaceModalScreen'
import NewChannelModalScreen from '../NewChannelModalScreen/NewChannelModalScreen'
import EditChannelModalScreen from '../EditChannelModalScreen/EditChannelModalScreen'
import MembersListModalScreen from '../MembersListModalScreen/MembersListModalScreen'
import { AuthContext } from '../../Context/AuthContext'
import { deleteWorkspace, leaveWorkspace, updateWorkspace, inviteToWorkspace } from '../../services/workspaceService'
import { sendMessage, updateMessage, deleteMessage } from '../../services/messageService'
import { globalSearch } from '../../services/searchService'
import { getNotifications, respondToInvitation, markNotificationsAsRead } from '../../services/notificationService'
import Avatar from '../../Components/Avatar/Avatar'
import TopNav from '../../Components/TopNav/TopNav'
import Toast from '../../Components/Toast/Toast'
import ENVIRONMENT from '../../config/environment'

const WorkspaceScreen = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isChannelModalOpen, setIsChannelModalOpen] = useState(false)
    const [isEditChannelModalOpen, setIsEditChannelModalOpen] = useState(false)
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activeChannel, setActiveChannel] = useState(null)
    const [messageInput, setMessageInput] = useState('')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    
    // Workspace & Messages State
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [inviteIdentifier, setInviteIdentifier] = useState('')
    const [inviteRole, setInviteRole] = useState('user')
    const [isInviting, setIsInviting] = useState(false)

    // Multimedia State
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    // Edit State
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editInput, setEditInput] = useState('');

    // Toast State
    const [toast, setToast] = useState(null)
    const showToast = (message, type = 'success') => {
        setToast({ message, type })
    }

    // Emoji State
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const commonEmojis = ['😊', '😂', '❤️', '👍', '🔥', '👏', '🙌', '🎉', '😎', '🤔', '👀', '✨'];

    const addEmoji = (emoji) => {
        setMessageInput(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const { workspace_id } = useParams()
    const { workspace, members, loading: loadingWorkspace, error: errorWorkspace, refetchWorkspace } = useWorkspace(workspace_id)
    const { workspaces, loading: loadingWorkspaces } = useWorkspaces()
    const { channels, refetchChannels } = useChannels(workspace_id)
    const { messages, refetchMessages, addOptimisticMessage, loading: loadingMessages, isSyncing: isMessagesSyncing } = useMessages(workspace_id, activeChannel?.channel_id)
    
    const { user } = useContext(AuthContext);
    const userId = user?.id;

    const currentUserMember = members?.find(m => String(m.user_id) === String(userId));
    const userRole = currentUserMember?.member_role;

    // Si los canales se cargan y no hay canal activo, por defecto selecciona el primero
    useEffect(() => {
        if (channels && channels.length > 0 && !activeChannel) {
            setActiveChannel(channels[0]);
        }
    }, [channels, activeChannel]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            if (file.type.startsWith('image/')) {
                setFilePreview(URL.createObjectURL(file));
            } else {
                setFilePreview('audio');
            }
        }
        // Reseteamos el valor del input para que onChange se vuelva a disparar si el usuario elige la misma foto de nuevo
        e.target.value = '';
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!inviteIdentifier.trim()) return;
        setIsInviting(true);
        try {
            const res = await inviteToWorkspace(workspace_id, inviteIdentifier, inviteRole);
            if (res.ok) {
                showToast("Invitación enviada con éxito");
                setIsInviteModalOpen(false);
                setInviteIdentifier('');
            } else {
                showToast(res.message, 'error');
            }
        } catch (err) {
            showToast("Error al enviar invitación", 'error');
        } finally {
            setIsInviting(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const content = messageInput.trim();
        if (!content && !selectedFile) return;

        // --- OPTIMISTIC UI ---
        setMessageInput('');
        const preview = filePreview;
        const fileType = selectedFile?.type.startsWith('image/') ? 'image' : (selectedFile?.type.startsWith('audio/') ? 'audio' : null);
        const fileToUpload = selectedFile;
        
        setSelectedFile(null);
        setFilePreview(null);
        setShowEmojiPicker(false);
        
        const optimisticMessage = {
            id: 'temp-' + Date.now(),
            content: content,
            sender: {
                id: user.id,
                name: user.name,
                url_image: user.url_image
            },
            created_at: new Date().toISOString(),
            isOptimistic: true,
            file_url: preview && preview !== 'audio' ? preview : null,
            file_type: fileType
        };
        addOptimisticMessage(optimisticMessage);

        try {
            await sendMessage(workspace_id, activeChannel.channel_id, content, fileToUpload);
            refetchMessages();
        } catch (err) {
            showToast("Error al enviar el mensaje: " + err.message, 'error');
            refetchMessages();
        }
    };

    const handleUpdateMessage = async (message_id) => {
        if (!editInput.trim()) return;
        try {
            await updateMessage(workspace_id, activeChannel.channel_id, message_id, editInput);
            setEditingMessageId(null);
            refetchMessages();
            showToast("Mensaje editado");
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleDeleteMessage = async (message_id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este mensaje?")) return;
        try {
            await deleteMessage(workspace_id, activeChannel.channel_id, message_id);
            refetchMessages();
            showToast("Mensaje eliminado");
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const canEditOrDelete = (msg) => {
        if (!msg.created_at || msg.isOptimistic) return false;
        const diffInMinutes = (new Date() - new Date(msg.created_at)) / 1000 / 60;
        const isMyMessage = String(msg.sender.id) === String(userId);
        const isAdminOrOwner = userRole === 'admin' || userRole === 'owner';
        
        // El admin puede borrar todo, siempre.
        if (isAdminOrOwner) return true;
        
        // Usuario normal: solo si es su mensaje y pasaron menos de 5 min
        return diffInMinutes < 5 && isMyMessage;
    };

    const handleEditWorkspace = async () => {
        const newTitle = window.prompt("Ingresa el nuevo título para el Workspace:", workspace?.title || workspace?.workspace_title);
        if (newTitle && newTitle.trim() !== "") {
            try {
                await updateWorkspace(workspace_id, newTitle, workspace?.description, workspace?.url_image);
                showToast("Espacio de trabajo actualizado");
                setTimeout(() => window.location.reload(), 1000);
            } catch (err) {
                showToast("Error al actualizar el workspace: " + err.message, 'error');
            }
        }
    };

    const handleDeleteWorkspace = async () => {
        if (window.confirm("¿Estás seguro de que deseas ELIMINAR este Workspace para todos los miembros? Esta acción es irreversible.")) {
            try {
                await deleteWorkspace(workspace_id);
                showToast("Espacio de trabajo eliminado");
                setTimeout(() => window.location.href = '/home', 1000);
            } catch (err) {
                showToast("Error al eliminar el workspace: " + err.message, 'error');
            }
        }
    };

    const handleLeaveWorkspace = async () => {
        if (window.confirm("¿Estás seguro de que deseas ABANDONAR este Workspace? Ya no tendrás acceso a él.")) {
            try {
                await leaveWorkspace(workspace_id);
                showToast("Has abandonado el espacio de trabajo");
                setTimeout(() => window.location.href = '/home', 1000);
            } catch (err) {
                showToast("Error al abandonar el workspace: " + err.message, 'error');
            }
        }
    };

    // Track last seen for channels
    useEffect(() => {
        if (activeChannel) {
            localStorage.setItem(`lastSeen_${activeChannel.channel_id}`, new Date().toISOString());
        }
    }, [activeChannel, messages]);

    const isChannelUnread = (channel) => {
        if (!channel || !channel.last_message_at || activeChannel?.channel_id === channel.channel_id) return false;
        const lastSeen = localStorage.getItem(`lastSeen_${channel.channel_id}`);
        if (!lastSeen) return true;
        return new Date(channel.last_message_at) > new Date(lastSeen);
    };

    return (
        <div className="slack-app-layout">
            <TopNav 
                currentWorkspaceId={workspace_id} 
                onChannelSelect={(ch) => setActiveChannel(ch)} 
            />

            <div className="slack-main-body">
                <div 
                    className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`} 
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
                <aside className={`slack-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="slack-sidebar-header">
                        <span>Tus Workspaces</span>
                        <button 
                            className="sidebar-toggle-btn" 
                            style={{ color: 'white', marginLeft: 'auto' }}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    <div className="slack-sidebar-content">
                        <div className="slack-sidebar-group">
                            <div className="slack-sidebar-group-title">ESPACIOS DE TRABAJO</div>
                            <ul className="slack-sidebar-list">
                                {loadingWorkspaces && <li className="slack-sidebar-item">Cargando...</li>}
                                {!loadingWorkspaces && workspaces && workspaces.map((ws) => {
                                    const isSelected = String(ws.workspace_id) === String(workspace_id);
                                    return (
                                        <React.Fragment key={ws.workspace_id}>
                                            <li className={`slack-sidebar-item ${isSelected ? 'active' : ''}`}>
                                                <Link to={'/workspace/' + ws.workspace_id} onClick={() => setIsSidebarOpen(false)} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    <span className="slack-channel-hash">#</span>
                                                    <span style={{ marginLeft: '8px', fontWeight: isSelected ? 'bold' : 'normal' }}>{ws.workspace_title}</span>
                                                </Link>
                                            </li>
                                            {isSelected && (
                                                <div style={{ paddingLeft: '24px', margin: '4px 0 12px 0' }}>
                                                    <div className="slack-sidebar-group-title" style={{ padding: '0 8px', fontSize: '11px' }}>CANALES</div>
                                                    <ul className="slack-sidebar-list">
                                                        {channels && channels.map(channel => (
                                                            <li 
                                                                key={channel.channel_id} 
                                                                className="slack-sidebar-item" 
                                                                style={{ 
                                                                    padding: '2px 8px', 
                                                                    cursor: 'pointer',
                                                                    backgroundColor: activeChannel?.channel_id === channel.channel_id ? '#1164A3' : 'transparent',
                                                                    color: activeChannel?.channel_id === channel.channel_id ? 'white' : 'inherit'
                                                                }}
                                                                onClick={() => { setActiveChannel(channel); setIsSidebarOpen(false); }}
                                                            >
                                                                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <span className="slack-channel-hash">#</span> 
                                                                        <span style={{ marginLeft: '8px', fontWeight: isChannelUnread(channel) ? 'bold' : 'normal' }}>{channel.channel_name}</span>
                                                                    </div>
                                                                    {isChannelUnread(channel) && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%', marginRight: '4px' }}></div>}
                                                                </div>
                                                            </li>
                                                        ))}
                                                        <li className="slack-sidebar-item" style={{ padding: '2px 8px', opacity: 0.7, cursor: 'pointer' }} onClick={() => setIsChannelModalOpen(true)}>
                                                            <span className="slack-channel-hash">+</span> Añadir canal
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </aside>

                <main className="slack-chat-area">
                    <header className="slack-chat-header" style={{ padding: '0 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button 
                                className="sidebar-toggle-btn"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                            </button>
                            <div style={{ fontWeight: 'bold' }}>
                                {loadingWorkspace ? 'Cargando...' : workspace ? `# ${workspace.title || workspace.workspace_title || 'general'}` : 'Selecciona un Workspace'}
                            </div>
                            <div title={isMessagesSyncing ? "Sincronizando..." : "Conectado"} style={{ width: '7px', height: '7px', background: isMessagesSyncing ? '#048d21ff99' : '#03a54199', borderRadius: '50%', animation: isMessagesSyncing ? 'slack-pulse 1.5s infinite' : 'none', marginLeft: '4px' }} />
                        </div>
                    </header>

                    <div className="slack-chat-messages">
                        {workspace && activeChannel ? (
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <h1 style={{ fontSize: '24px', margin: '0', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div>
                                                    <span style={{ color: 'var(--text-soft)', marginRight: '4px' }}>#</span> {activeChannel.channel_name}
                                                </div>
                                                {(userRole === 'owner' || userRole === 'admin') && (
                                                    <button onClick={() => setIsEditChannelModalOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-soft)', display: 'flex', alignItems: 'center', padding: '4px' }} title="Editar Canal">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    </button>
                                                )}
                                            </h1>
                                            
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap', gap: '12px' }}>
                                                <p style={{ color: 'var(--text-soft)', margin: 0 }}>{activeChannel.channel_description || `Este es el comienzo del canal #${activeChannel.channel_name}.`}</p>
                                                
                                                {members && members.length > 0 && (
                                                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '4px', borderRadius: '4px', transition: 'background-color 0.2s ease' }} className="slack-sidebar-item" onClick={() => setIsMembersModalOpen(true)} title="Ver todos los miembros">
                                                        <div style={{ width: '1px', height: '16px', background: 'var(--border-color)', margin: '0 8px' }}></div>
                                                        {members.slice(0, 3).map((m, i) => (
                                                            <div key={m.user_id} style={{ marginLeft: i > 0 ? '-8px' : '0', border: '2px solid var(--bg-color)', borderRadius: '50%', overflow: 'hidden', position: 'relative', zIndex: 3 - i }}>
                                                                <Avatar user={{ name: m.user_name || 'U' }} size="24px" borderRadius="50%" />
                                                            </div>
                                                        ))}
                                                        {members.length > 3 && <div style={{ fontSize: '12px', color: 'var(--text-soft)', marginLeft: '4px', fontWeight: 'bold' }}>+{members.length - 3}</div>}
                                                        <div style={{ fontSize: '12px', color: 'var(--text-soft)', marginLeft: '8px' }}>{members.length} {members.length === 1 ? 'miembro' : 'miembros'}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="desktop-actions">
                                            <button onClick={() => setIsInviteModalOpen(true)} style={{ padding: '6px 12px', border: '1px solid #007a5a', color: '#007a5a', borderRadius: '4px', background: 'transparent', cursor: 'pointer' }}>+ Invitar</button>
                                            {userRole === 'owner' ? (
                                                <>
                                                    <button onClick={handleEditWorkspace} style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'transparent', cursor: 'pointer', color: 'var(--text-color)' }}>Editar</button>
                                                    <button onClick={handleDeleteWorkspace} style={{ padding: '6px 12px', border: '1px solid #e01e5a', color: '#e01e5a', borderRadius: '4px', background: 'transparent', cursor: 'pointer' }}>Eliminar</button>
                                                </>
                                            ) : (
                                                <button onClick={handleLeaveWorkspace} style={{ padding: '6px 12px', border: '1px solid #e01e5a', color: '#e01e5a', borderRadius: '4px', background: 'transparent', cursor: 'pointer' }}>Abandonar</button>
                                            )}
                                        </div>
                                        
                                        <div className="mobile-actions">
                                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: 'var(--text-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                            </button>
                                            {isMobileMenuOpen && (
                                                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 12px var(--shadow)', zIndex: 100, minWidth: '160px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                                    <button onClick={() => { setIsInviteModalOpen(true); setIsMobileMenuOpen(false); }} style={{ padding: '12px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#007a5a', borderBottom: '1px solid var(--border-color)', fontSize: '15px' }}>+ Invitar Miembros</button>
                                                    {userRole === 'owner' ? (
                                                        <>
                                                            <button onClick={() => { handleEditWorkspace(); setIsMobileMenuOpen(false); }} style={{ padding: '12px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--text-color)', borderBottom: '1px solid var(--border-color)', fontSize: '15px' }}>Editar Espacio</button>
                                                            <button onClick={() => { handleDeleteWorkspace(); setIsMobileMenuOpen(false); }} style={{ padding: '12px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#e01e5a', fontSize: '15px' }}>Eliminar Espacio</button>
                                                        </>
                                                    ) : (
                                                        <button onClick={() => { handleLeaveWorkspace(); setIsMobileMenuOpen(false); }} style={{ padding: '12px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#e01e5a', fontSize: '15px' }}>Abandonar</button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 4px' }}>
                                    {loadingMessages && messages.length === 0 ? (
                                        <div className="loading-container">
                                            <div className="spinner"></div>
                                            <p>Cargando mensajes...</p>
                                        </div>
                                    ) : messages.length > 0 ? (
                                        messages.map(msg => (
                                            <div key={msg.id} className="slack-message-container" style={{ display: 'flex', gap: '12px', opacity: msg.isOptimistic ? 0.6 : 1, transition: 'opacity 0.3s ease', position: 'relative', padding: '8px', borderRadius: '8px' }}>
                                                <Avatar user={msg.sender} size="36px" borderRadius="4px" />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                                        <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>{msg.sender?.name || 'Usuario'}</span>
                                                        <span style={{ fontSize: '12px', color: 'var(--text-soft)' }}>
                                                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </span>
                                                        {msg.is_edited && <span style={{ fontSize: '11px', color: 'var(--text-soft)', fontStyle: 'italic' }}>(editado)</span>}
                                                    </div>
                                                    
                                                    {editingMessageId === msg.id ? (
                                                        <div style={{ marginTop: '4px' }}>
                                                            <input 
                                                                type="text" 
                                                                value={editInput}
                                                                onChange={(e) => setEditInput(e.target.value)}
                                                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--accent-color)', background: 'var(--bg-color)', color: 'var(--text-color)', outline: 'none' }}
                                                                autoFocus
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') handleUpdateMessage(msg.id);
                                                                    if (e.key === 'Escape') setEditingMessageId(null);
                                                                }}
                                                            />
                                                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                                                <button onClick={() => handleUpdateMessage(msg.id)} style={{ fontSize: '11px', background: '#007a5a', color: 'white', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
                                                                <button onClick={() => setEditingMessageId(null)} style={{ fontSize: '11px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-color)', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {msg.content && <div style={{ color: 'var(--text-color)', marginTop: '2px', wordBreak: 'break-word' }}>{msg.content}</div>}
                                                            {msg.file_url && (
                                                                <div style={{ marginTop: '8px' }}>
                                                                    {msg.file_type === 'image' ? (
                                                                        <img src={msg.file_url.startsWith('http') || msg.file_url.startsWith('data:') || msg.file_url.startsWith('blob:') ? msg.file_url : `${ENVIRONMENT.API_URL}${msg.file_url}`} alt="Attached" style={{ maxWidth: '300px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                                                    ) : msg.file_type === 'audio' ? (
                                                                        <audio controls src={msg.file_url.startsWith('http') || msg.file_url.startsWith('data:') || msg.file_url.startsWith('blob:') ? msg.file_url : `${ENVIRONMENT.API_URL}${msg.file_url}`} style={{ height: '32px' }} />
                                                                    ) : null}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                                {!editingMessageId && canEditOrDelete(msg) && (
                                                    <div className="message-actions" style={{ position: 'absolute', top: '-10px', right: '10px', display: 'flex', gap: '4px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2px', boxShadow: '0 2px 5px var(--shadow)' }}>
                                                        {/* Solo mostrar editar si NO hay archivo */}
                                                        {!msg.file_url && (
                                                            <button onClick={() => { setEditingMessageId(msg.id); setEditInput(msg.content); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', color: 'var(--text-soft)' }}>
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleDeleteMessage(msg.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', color: '#e01e5a' }}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ color: '#616061', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>No hay mensajes aún en este canal.</p>
                                    )}
                                </div>

                                <form onSubmit={handleSendMessage} style={{ marginTop: 'auto', position: 'relative' }}>
                                    {showEmojiPicker && (
                                        <div style={{ position: 'absolute', bottom: '100%', left: '0', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '200px', boxShadow: '0 5px 15px var(--shadow)', marginBottom: '8px', zIndex: 10 }}>
                                            {commonEmojis.map(emoji => (
                                                <span key={emoji} onClick={() => addEmoji(emoji)} style={{ cursor: 'pointer', fontSize: '20px', padding: '4px', borderRadius: '4px', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = 'var(--bg-soft)'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                                                    {emoji}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {filePreview && (
                                        <div style={{ padding: '8px', background: 'var(--bg-soft)', border: '1px solid var(--border-color)', borderBottom: 'none', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {filePreview === 'audio' ? (
                                                <div style={{ color: 'var(--text-soft)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path></svg>
                                                    Audio listo
                                                </div>
                                            ) : (
                                                <img src={filePreview} alt="Preview" style={{ height: '60px', borderRadius: '4px' }} />
                                            )}
                                            <button type="button" onClick={() => { setSelectedFile(null); setFilePreview(null); }} style={{ background: '#e01e5a', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                                        </div>
                                    )}
                                    <div 
                                        onClick={() => document.getElementById('chat-input').focus()}
                                        style={{ border: '1px solid var(--border-color)', borderRadius: filePreview ? '0 0 8px 8px' : '8px', padding: '12px', background: 'var(--bg-color)', cursor: 'text' }}
                                    >
                                        <input
                                            id="chat-input"
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            placeholder={`Enviar mensaje a #${activeChannel?.channel_name}`}
                                            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '15px', background: 'transparent', color: 'var(--text-color)' }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <input type="file" id="file-upload" hidden onChange={handleFileChange} accept="image/*,audio/*" />
                                                <button type="button" onClick={() => document.getElementById('file-upload').click()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-soft)', padding: '4px' }} title="Subir archivo">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                                </button>
                                                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-soft)', padding: '4px' }} title="Emojis">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <path d="M8 15s1.5 2 4 2 4-2 4-2"></path>
                                                        <circle cx="9" cy="9" r="1.5" fill="currentColor"></circle>
                                                        <circle cx="15" cy="9" r="1.5" fill="currentColor"></circle>
                                                    </svg>
                                                </button>
                                            </div>
                                            <button type="submit" disabled={!messageInput.trim() && !selectedFile} style={{ background: (messageInput.trim() || selectedFile) ? '#007a5aff' : '#ddd', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Enviar</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <p style={{ color: '#616061' }}>Selecciona un canal para comenzar a chatear.</p>
                        )}
                    </div>
                </main>
            </div>

            <NewWorkspaceModalScreen isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <NewChannelModalScreen isOpen={isChannelModalOpen} onClose={() => setIsChannelModalOpen(false)} workspace_id={workspace_id} onSuccess={refetchChannels} />
            <EditChannelModalScreen isOpen={isEditChannelModalOpen} onClose={() => setIsEditChannelModalOpen(false)} workspace_id={workspace_id} channel={activeChannel} onSuccess={(action) => { 
                if (action === 'delete') {
                    setActiveChannel(null); 
                } else if (action === 'update') {
                    // Force refresh or just let refetchChannels update the list. 
                    // Active channel name will update next time they click, or we could manually update it here.
                    setActiveChannel({...activeChannel});
                }
                refetchChannels(); 
            }} />
            <MembersListModalScreen 
                isOpen={isMembersModalOpen} 
                onClose={() => setIsMembersModalOpen(false)} 
                members={members} 
                workspace_id={workspace_id}
                userRole={userRole}
                onSuccess={() => refetchWorkspace()}
            />

            {isInviteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Invitar a {workspace?.title}</h2>
                        <form onSubmit={handleInvite}>
                            <input type="text" value={inviteIdentifier} onChange={(e) => setInviteIdentifier(e.target.value)} placeholder="Email o ID público" className="auth-input" style={{ marginTop: '16px' }} />
                            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="auth-input" style={{ marginTop: '16px' }}>
                                <option value="user">Usuario</option>
                                <option value="admin">Administrador</option>
                            </select>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                                <button type="button" onClick={() => setIsInviteModalOpen(false)} className="auth-btn" style={{ background: 'var(--bg-soft)', color: 'var(--text-color)' }}>Cancelar</button>
                                <button type="submit" className="auth-btn">{isInviting ? 'Invitando...' : 'Invitar'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    )
}

export default WorkspaceScreen
