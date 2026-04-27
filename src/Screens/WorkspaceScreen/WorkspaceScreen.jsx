import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router'
import useWorkspace from '../../hooks/useWorkspace'
import useWorkspaces from '../../hooks/useWorkspaces'
import useChannels from '../../hooks/useChannels'
import useMessages from '../../hooks/useMessages'
import NewWorkspaceModalScreen from '../NewWorkspaceModalScreen/NewWorkspaceModalScreen'
import NewChannelModalScreen from '../NewChannelModalScreen/NewChannelModalScreen'
import { AuthContext } from '../../Context/AuthContext'
import { deleteWorkspace, leaveWorkspace, updateWorkspace, inviteToWorkspace } from '../../services/workspaceService'
import { sendMessage } from '../../services/messageService'
import { globalSearch } from '../../services/searchService'
import { getNotifications, respondToInvitation, markNotificationsAsRead } from '../../services/notificationService'
import Avatar from '../../Components/Avatar/Avatar'
import TopNav from '../../Components/TopNav/TopNav'

const WorkspaceScreen = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isChannelModalOpen, setIsChannelModalOpen] = useState(false)
    const [activeChannel, setActiveChannel] = useState(null)
    const [messageInput, setMessageInput] = useState('')
    
    // El estado de búsqueda, notificaciones y perfil ahora está en TopNav
    
    // Workspace & Messages State
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [inviteIdentifier, setInviteIdentifier] = useState('')
    const [isInviting, setIsInviting] = useState(false)

    const { workspace_id } = useParams()
    const { workspace, members, loading: loadingWorkspace, error: errorWorkspace } = useWorkspace(workspace_id)
    const { workspaces, loading: loadingWorkspaces } = useWorkspaces()
    const { channels, refetchChannels } = useChannels(workspace_id)
    const { messages, refetchMessages, loading: loadingMessages, isSyncing: isMessagesSyncing } = useMessages(workspace_id, activeChannel?.channel_id)

    // El tema ahora se maneja globalmente en TopNav

    // Si los canales se cargan y no hay canal activo, por defecto selecciona el primero
    useEffect(() => {
        if (channels && channels.length > 0 && !activeChannel) {
            setActiveChannel(channels[0]);
        }
    }, [channels, activeChannel]);

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!inviteIdentifier.trim()) return;
        setIsInviting(true);
        try {
            const res = await inviteToWorkspace(workspace_id, inviteIdentifier);
            if (res.ok) {
                alert("Invitación enviada con éxito");
                setIsInviteModalOpen(false);
                setInviteIdentifier('');
            } else {
                alert(res.message);
            }
        } catch (err) {
            alert("Error al enviar invitación");
        } finally {
            setIsInviting(false);
        }
    };

    // Track last seen for channels
    useEffect(() => {
        if (activeChannel) {
            localStorage.setItem(`lastSeen_${activeChannel.channel_id}`, new Date().toISOString());
        }
    }, [activeChannel, messages]); // Se actualiza al cambiar de canal o al recibir/enviar mensajes

    const isChannelUnread = (channel) => {
        if (!channel || !channel.last_message_at || activeChannel?.channel_id === channel.channel_id) return false;
        const lastSeen = localStorage.getItem(`lastSeen_${channel.channel_id}`);
        if (!lastSeen) return true; // Si nunca lo ha visto, es unread (o podemos poner false si preferimos)
        return new Date(channel.last_message_at) > new Date(lastSeen);
    };

    const { user } = useContext(AuthContext);
    const userId = user?.id;
    
    const currentUserMember = members?.find(m => String(m.user_id) === String(userId));
    const userRole = currentUserMember?.member_role;

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeChannel) return;

        try {
            await sendMessage(workspace_id, activeChannel.channel_id, messageInput);
            setMessageInput('');
            refetchMessages();
        } catch (err) {
            alert("Error al enviar el mensaje: " + err.message);
        }
    };

    const handleEditWorkspace = async () => {
        const newTitle = window.prompt("Ingresa el nuevo título para el Workspace:", workspace?.title || workspace?.workspace_title);
        if (newTitle && newTitle.trim() !== "") {
            try {
                await updateWorkspace(workspace_id, newTitle, workspace?.description, workspace?.url_image);
                window.location.reload();
            } catch (err) {
                alert("Error al actualizar el workspace: " + err.message);
            }
        }
    };

    const handleDeleteWorkspace = async () => {
        if (window.confirm("¿Estás seguro de que deseas ELIMINAR este Workspace para todos los miembros? Esta acción es irreversible.")) {
            try {
                await deleteWorkspace(workspace_id);
                window.location.href = '/home';
            } catch (err) {
                alert("Error al eliminar el workspace: " + err.message);
            }
        }
    };

    const handleLeaveWorkspace = async () => {
        if (window.confirm("¿Estás seguro de que deseas ABANDONAR este Workspace? Ya no tendrás acceso a él.")) {
            try {
                await leaveWorkspace(workspace_id);
                window.location.href = '/home';
            } catch (err) {
                alert("Error al abandonar el workspace: " + err.message);
            }
        }
    };

    return (
        <div className="slack-app-layout">
            <TopNav 
                currentWorkspaceId={workspace_id} 
                onChannelSelect={(ch) => setActiveChannel(ch)} 
            />

            <div className="slack-main-body">
                <aside className="slack-sidebar">
                    <div className="slack-sidebar-header">
                        Tus Workspaces
                    </div>
                    <div className="slack-sidebar-content">
                        <div className="slack-sidebar-group">
                            <div className="slack-sidebar-group-title">
                                ESPACIOS DE TRABAJO
                            </div>
                            <ul className="slack-sidebar-list">
                                {loadingWorkspaces && <li className="slack-sidebar-item">Cargando...</li>}
                                {!loadingWorkspaces && workspaces && workspaces.map((ws) => {
                                    const isSelected = String(ws.workspace_id) === String(workspace_id);
                                    return (
                                        <React.Fragment key={ws.workspace_id}>
                                            <li className={`slack-sidebar-item ${isSelected ? 'active' : ''}`}>
                                                <Link to={'/workspace/' + ws.workspace_id} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', width: '100%' }}>
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
                                                                onClick={() => setActiveChannel(channel)}
                                                            >
                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <span className="slack-channel-hash">#</span> 
                                                                        <span style={{ marginLeft: '8px', fontWeight: isChannelUnread(channel) ? 'bold' : 'normal' }}>
                                                                            {channel.channel_name}
                                                                        </span>
                                                                    </div>
                                                                    {isChannelUnread(channel) && (
                                                                        <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%', marginRight: '4px', boxShadow: '0 0 5px rgba(255,255,255,0.8)' }}></div>
                                                                    )}
                                                                </div>
                                                            </li>
                                                        ))}
                                                        <li 
                                                            className="slack-sidebar-item" 
                                                            style={{ padding: '2px 8px', opacity: 0.7, cursor: 'pointer' }}
                                                            onClick={() => setIsChannelModalOpen(true)}
                                                        >
                                                            <span className="slack-channel-hash">+</span> Añadir canal
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </ul>
                            
                            <div 
                                className="slack-sidebar-item" 
                                style={{ marginTop: '16px', opacity: 0.8 }}
                                onClick={() => setIsModalOpen(true)}
                            >
                                <span className="slack-channel-hash">+</span> 
                                <span style={{ marginLeft: '8px' }}>Añadir Workspace</span>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="slack-chat-area">
                    <header className="slack-chat-header" style={{ padding: '0 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ fontWeight: 'bold' }}>
                                    {loadingWorkspace ? 'Cargando...' : workspace ? `# ${workspace.title || workspace.workspace_title || 'general'}` : 'Selecciona un Workspace'}
                                </div>
                                <div 
                                    title={isMessagesSyncing ? "Sincronizando..." : "Conectado"} 
                                    style={{ 
                                        width: '7px', 
                                        height: '7px', 
                                        background: isMessagesSyncing ? '#048d21ff99' : '#03a54199', 
                                        borderRadius: '50%', 
                                        transition: 'background-color 0.5s ease',
                                        animation: isMessagesSyncing ? 'pulse 1.5s infinite' : 'none',
                                        marginLeft: '4px'
                                    }} 
                                />
                            </div>
                    </header>
                    <div className="slack-chat-messages">
                        {errorWorkspace && <p style={{ color: 'red' }}>Error: {errorWorkspace.message}</p>}
                        {workspace && activeChannel ? (
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h1 style={{ fontSize: '24px', margin: '0', color: 'var(--text-color)' }}>
                                            <span style={{ color: 'var(--text-soft)', marginRight: '4px' }}>#</span> 
                                            {activeChannel.channel_name}
                                        </h1>
                                        
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => setIsInviteModalOpen(true)} style={{ padding: '6px 12px', border: '1px solid #007a5a', color: '#007a5a', borderRadius: '4px', background: 'transparent', cursor: 'pointer', marginRight: '8px' }}>
                                                + Invitar
                                            </button>
                                            {userRole === 'owner' ? (
                                                <>
                                                    <button onClick={handleEditWorkspace} style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'transparent', cursor: 'pointer', color: 'var(--text-color)' }}>
                                                        Editar
                                                    </button>
                                                    <button onClick={handleDeleteWorkspace} style={{ padding: '6px 12px', border: '1px solid #e01e5a', color: '#e01e5a', borderRadius: '4px', background: 'transparent', cursor: 'pointer' }}>
                                                        Eliminar
                                                    </button>
                                                </>
                                            ) : (
                                                <button onClick={handleLeaveWorkspace} style={{ padding: '6px 12px', border: '1px solid #e01e5a', color: '#e01e5a', borderRadius: '4px', background: 'transparent', cursor: 'pointer' }}>
                                                    Abandonar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--text-soft)', fontSize: '15px', marginTop: '8px', marginBottom: 0 }}>
                                        {activeChannel.channel_description || `Este es el comienzo del canal #${activeChannel.channel_name}.`}
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                                        {members?.map(member => (
                                            <div 
                                                key={member.member_id}
                                                title={member.user_email}
                                                style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '6px', 
                                                    background: 'var(--bg-soft)', 
                                                    padding: '4px 10px', 
                                                    borderRadius: '16px',
                                                    border: '1px solid var(--border-color)',
                                                    fontSize: '13px',
                                                    color: 'var(--text-color)'
                                                }}
                                            >
                                                <Avatar user={{ name: member.user_name }} size="20px" borderRadius="4px" />
                                                <span style={{ fontWeight: member.user_id === userId ? 'bold' : 'normal' }}>
                                                    {member.user_name} {member.user_id === userId && '(tú)'}
                                                </span>
                                                {member.member_role === 'owner' && <span style={{ fontSize: '10px', color: '#616061' }}>(Admin)</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Messages Container */}
                                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {loadingMessages && messages.length === 0 ? (
                                        <p style={{ color: '#616061' }}>Cargando mensajes...</p>
                                    ) : messages.length > 0 ? (
                                        messages.map(msg => (
                                            <div key={msg.id} style={{ display: 'flex', gap: '8px' }}>
                                                <Avatar user={msg.sender} size="36px" borderRadius="4px" />
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                                        <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>{msg.sender?.name || 'Usuario'}</span>
                                                        <span style={{ fontSize: '12px', color: 'var(--text-soft)' }}>
                                                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </span>
                                                    </div>
                                                    <div style={{ color: 'var(--text-color)', marginTop: '2px', wordBreak: 'break-word' }}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ color: '#616061', fontStyle: 'italic' }}>No hay mensajes aún. ¡Sé el primero en escribir!</p>
                                    )}
                                </div>

                                {/* Message Input Box */}
                                <form onSubmit={handleSendMessage} style={{ marginTop: 'auto' }}>
                                    <div style={{ border: '1px solid #868686', borderRadius: '8px', padding: '8px', background: 'white' }}>
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            placeholder={`Enviar mensaje a #${activeChannel.channel_name}`}
                                            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '15px' }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                                            <button 
                                                type="submit" 
                                                disabled={!messageInput.trim()}
                                                style={{ 
                                                    background: messageInput.trim() ? '#007a5aff' : '#ddd', 
                                                    color: 'white', 
                                                    border: 'none', 
                                                    padding: '6px 12px', 
                                                    borderRadius: '4px', 
                                                    cursor: messageInput.trim() ? 'pointer' : 'not-allowed'
                                                }}
                                            >
                                                Enviar
                                            </button>
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
            <NewChannelModalScreen 
                isOpen={isChannelModalOpen} 
                onClose={() => setIsChannelModalOpen(false)} 
                workspace_id={workspace_id} 
                onSuccess={refetchChannels} 
            />

            {/* Modal de Invitación */}
            {isInviteModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ marginBottom: '8px' }}>Invitar personas a {workspace?.title}</h2>
                        <p style={{ color: '#616061', marginBottom: '24px', fontSize: '15px' }}>Ingresa su email o su ID público (ej. nombre#A9B2) para invitarlos.</p>
                        
                        <form onSubmit={handleInvite}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Email o ID Público</label>
                                <input 
                                    type="text" 
                                    placeholder="nombre@ejemplo.com o usuario#TAG"
                                    value={inviteIdentifier}
                                    onChange={(e) => setInviteIdentifier(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
                                    autoFocus
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="button" onClick={() => setIsInviteModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
                                <button type="submit" disabled={isInviting} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#007a5a', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {isInviting ? 'Invitando...' : 'Enviar invitación'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WorkspaceScreen
