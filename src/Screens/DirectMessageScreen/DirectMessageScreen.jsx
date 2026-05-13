import React, { useState, useEffect, useContext, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { AuthContext } from '../../Context/AuthContext'
import useWorkspaces from '../../hooks/useWorkspaces'
import { getChatHistory, sendDirectMessage, updateDirectMessage, deleteDirectMessage, deleteChat } from '../../services/dmService'
import { getAllUsers } from '../../services/userService'
import Sidebar from '../../Components/Sidebar/Sidebar'
import TopNav from '../../Components/TopNav/TopNav'
import Avatar from '../../Components/Avatar/Avatar'
import Toast from '../../Components/Toast/Toast'
import SupportModal from '../../Components/SupportModal/SupportModal'
import NewWorkspaceModalScreen from '../NewWorkspaceModalScreen/NewWorkspaceModalScreen'
import ConfirmModal from '../../Components/ConfirmModal/ConfirmModal'

const DirectMessageScreen = () => {
    const { contact_id } = useParams()
    const { user: currentUser } = useContext(AuthContext)
    const { workspaces, loading: loadingWorkspaces } = useWorkspaces()
    
    const [messages, setMessages] = useState([])
    const [loadingMessages, setLoadingMessages] = useState(true)
    const [messageInput, setMessageInput] = useState('')
    const [contact, setContact] = useState(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)
    const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false)
    const [toast, setToast] = useState(null)
    
    // States for editing and deleting
    const [editingMessageId, setEditingMessageId] = useState(null)
    const [editInput, setEditInput] = useState('')
    const [isDeleteChatConfirmOpen, setIsDeleteChatConfirmOpen] = useState(false)
    const [isDeleteMessageConfirmOpen, setIsDeleteMessageConfirmOpen] = useState(false)
    const [messageToDelete, setMessageToDelete] = useState(null)
    const navigate = useNavigate()
    
    const scrollRef = useRef(null)

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
    }

    // Fetch history and contact info
    useEffect(() => {
        const fetchData = async () => {
            setLoadingMessages(true)
            const [resHistory, resUsers] = await Promise.all([
                getChatHistory(contact_id),
                getAllUsers()
            ])

            if (resHistory.ok) {
                setMessages(resHistory.data)
            } else {
                showToast("Esta conversación ya no está disponible o el chat ha sido eliminado", 'error')
                setTimeout(() => {
                    navigate('/')
                }, 2000)
                return
            }
            
            if (resUsers.ok) {
                const found = resUsers.data.find(u => u._id === contact_id)
                if (!found) {
                    showToast("El usuario no se encuentra disponible", 'error')
                    setTimeout(() => {
                        navigate('/')
                    }, 2000)
                    return
                }
                setContact(found)
            }
            setLoadingMessages(false)
        }
        fetchData()
    }, [contact_id])

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        const content = messageInput.trim()
        if (!content) return

        // Optimistic update
        const optimisticMsg = {
            _id: 'temp-' + Date.now(),
            content,
            sender: {
                _id: currentUser.id,
                name: currentUser.name,
                avatar: currentUser.avatar,
                avatar_config: currentUser.avatar_config
            },
            created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, optimisticMsg])
        setMessageInput('')

        const res = await sendDirectMessage(contact_id, content)
        if (!res.ok) {
            showToast(res.message || "Error al enviar mensaje", 'error')
            // Remove optimistic on error if needed, but for now we just show toast
        } else {
            // Replace optimistic with real one or just refetch
            const history = await getChatHistory(contact_id)
            if (history.ok) setMessages(history.data)
        }
    }

    const handleUpdateMessage = async (messageId) => {
        const content = editInput.trim()
        if (!content) return

        const res = await updateDirectMessage(messageId, content)
        if (res.ok) {
            setMessages(prev => prev.map(msg => msg._id === messageId ? { ...msg, content, is_edited: true } : msg))
            setEditingMessageId(null)
            showToast("Mensaje actualizado", 'success')
        } else {
            showToast(res.message || "Error al actualizar mensaje", 'error')
        }
    }

    const confirmDeleteMessage = async () => {
        if (!messageToDelete) return
        
        const res = await deleteDirectMessage(messageToDelete)
        if (res.ok) {
            setMessages(prev => prev.filter(msg => msg._id !== messageToDelete))
            showToast("Mensaje eliminado", 'success')
        } else {
            showToast(res.message || "Error al eliminar mensaje", 'error')
        }
        setIsDeleteMessageConfirmOpen(false)
        setMessageToDelete(null)
    }

    const handleDeleteMessage = (messageId) => {
        setMessageToDelete(messageId)
        setIsDeleteMessageConfirmOpen(true)
    }

    const confirmDeleteChat = async () => {
        const res = await deleteChat(contact_id)
        if (res.ok) {
            showToast("Chat eliminado exitosamente", 'success')
            setTimeout(() => {
                navigate('/')
            }, 1000)
        } else {
            showToast(res.message || "Error al eliminar el chat", 'error')
        }
        setIsDeleteChatConfirmOpen(false)
    }


    return (
        <div className="slack-app-layout">
            <TopNav />

            <div className="slack-main-body">
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)}
                    workspaces={workspaces}
                    loadingWorkspaces={loadingWorkspaces}
                    onSupportClick={() => setIsSupportModalOpen(true)}
                    onCreateWorkspace={() => setIsWorkspaceModalOpen(true)}
                    activeTab="dms"
                />

                <main className="slack-chat-area">
                    <header className="slack-chat-header" style={{ padding: '0 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button 
                            className="sidebar-toggle-btn"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </button>
                        {contact && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Avatar user={contact} size="32px" borderRadius="4px" />
                                    <div style={{ fontWeight: 'bold' }}>{contact.name}</div>
                                </div>
                                <div style={{ marginLeft: 'auto' }}>
                                    <button 
                                        onClick={() => setIsDeleteChatConfirmOpen(true)} 
                                        style={{ 
                                            padding: '6px 12px', 
                                            border: '1px solid #e01e5a', 
                                            color: '#e01e5a', 
                                            borderRadius: '4px', 
                                            background: 'transparent', 
                                            cursor: 'pointer', 
                                            fontSize: '13px', 
                                            fontWeight: 'bold',
                                            transition: 'all 0.2s ease' 
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = '#e01e5a';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#e01e5a';
                                        }}
                                    >
                                        Eliminar Chat
                                    </button>
                                </div>
                            </>
                        )}
                    </header>

                    <div className="slack-chat-messages" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div 
                            ref={scrollRef}
                            style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                        >
                            {loadingMessages ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-soft)' }}>Cargando conversación...</div>
                            ) : messages.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-soft)' }}>
                                    <Avatar user={contact} size="80px" style={{ margin: '0 auto 20px' }} />
                                    <h3>Este es el comienzo de tu conversación con {contact?.name}</h3>
                                    <p>Di hola para comenzar el chat.</p>
                                </div>
                            ) : (
                                messages.map(msg => {
                                    const isOwner = String(msg.sender?._id || msg.sender?.id || msg.sender) === String(currentUser.id || currentUser._id);
                                    const isTemp = String(msg._id).startsWith('temp-');

                                    return (
                                        <div key={msg._id} className="slack-message-container" style={{ display: 'flex', gap: '12px', padding: '8px', borderRadius: '8px', position: 'relative', opacity: isTemp ? 0.6 : 1 }}>
                                            <Avatar user={msg.sender} size="36px" borderRadius="4px" />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                                                    <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>
                                                        {isOwner && (
                                                            <span style={{ color: '#1164A3', marginRight: '6px', fontWeight: 'bold' }}>⤷ Tú:</span>
                                                        )}
                                                        {msg.sender?.name || 'Usuario'}
                                                    </span>
                                                    <span style={{ fontSize: '12px', color: 'var(--text-soft)', flexShrink: 0 }}>
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {msg.is_edited && <span style={{ fontSize: '11px', color: 'var(--text-soft)', fontStyle: 'italic', flexShrink: 0 }}>(editado)</span>}
                                                </div>
                                                
                                                {editingMessageId === msg._id ? (
                                                    <div style={{ marginTop: '4px' }}>
                                                        <input 
                                                            type="text" 
                                                            value={editInput}
                                                            onChange={(e) => setEditInput(e.target.value)}
                                                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--accent-color)', background: 'var(--bg-color)', color: 'var(--text-color)', outline: 'none' }}
                                                            autoFocus
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleUpdateMessage(msg._id);
                                                                if (e.key === 'Escape') setEditingMessageId(null);
                                                            }}
                                                        />
                                                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                                            <button onClick={() => handleUpdateMessage(msg._id)} style={{ fontSize: '11px', background: '#007a5a', color: 'white', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
                                                            <button onClick={() => setEditingMessageId(null)} style={{ fontSize: '11px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-color)', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {msg.content && <div style={{ marginTop: '2px', wordBreak: 'break-word', color: 'var(--text-color)' }}>{msg.content}</div>}
                                                        {msg.image && (
                                                            <div style={{ marginTop: '8px' }}>
                                                                <img src={msg.image} alt="Adjunto" style={{ maxWidth: 'min(300px, 100%)', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            {!editingMessageId && isOwner && !isTemp && (
                                                <div className="message-actions" style={{ position: 'absolute', top: '-10px', right: '10px', display: 'flex', gap: '4px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2px', boxShadow: '0 2px 5px var(--shadow)', zIndex: 10 }}>
                                                    <button onClick={() => { setEditingMessageId(msg._id); setEditInput(msg.content); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', color: 'var(--text-soft)' }} title="Editar">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    </button>
                                                    <button onClick={() => handleDeleteMessage(msg._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', color: '#e01e5a' }} title="Eliminar">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid var(--border-color)' }}>
                            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <textarea 
                                    value={messageInput}
                                    onChange={(e) => {
                                        setMessageInput(e.target.value);
                                        // Auto-resize
                                        e.target.style.height = 'auto';
                                        e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage(e);
                                            e.target.style.height = 'auto';
                                        }
                                    }}
                                    placeholder={`Mensaje para ${contact?.name}`}
                                    rows="1"
                                    style={{ 
                                        flex: 1, 
                                        border: 'none', 
                                        outline: 'none', 
                                        background: 'transparent', 
                                        color: 'var(--text-color)', 
                                        fontSize: '15px',
                                        resize: 'none',
                                        fontFamily: 'inherit',
                                        padding: '0',
                                        lineHeight: '1.5',
                                        overflowY: 'auto'
                                    }}
                                />
                                <button 
                                    type="submit" 
                                    disabled={!messageInput.trim()}
                                    style={{ background: messageInput.trim() ? 'var(--accent-color)' : '#ddd', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', alignSelf: 'flex-end' }}
                                >
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>

            <NewWorkspaceModalScreen isOpen={isWorkspaceModalOpen} onClose={() => setIsWorkspaceModalOpen(false)} />
            <SupportModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <ConfirmModal 
                isOpen={isDeleteMessageConfirmOpen} 
                onClose={() => setIsDeleteMessageConfirmOpen(false)} 
                onConfirm={confirmDeleteMessage}
                title="Eliminar Mensaje"
                message="¿Estás seguro de que quieres borrar este mensaje? Esta acción no se puede deshacer."
                confirmText="Borrar"
            />
            <ConfirmModal 
                isOpen={isDeleteChatConfirmOpen} 
                onClose={() => setIsDeleteChatConfirmOpen(false)} 
                onConfirm={confirmDeleteChat}
                title="Eliminar Historial de Chat"
                message={`¿Estás completamente seguro de querer borrar todo el historial de chat con ${contact?.name || "este contacto"}? Todos los mensajes serán borrados permanentemente.`}
                confirmText="Eliminar Todo"
            />
        </div>
    )
}

export default DirectMessageScreen
