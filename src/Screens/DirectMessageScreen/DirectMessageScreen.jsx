import React, { useState, useEffect, useContext, useRef } from 'react'
import { useParams } from 'react-router'
import { AuthContext } from '../../Context/AuthContext'
import useWorkspaces from '../../hooks/useWorkspaces'
import { getChatHistory, sendDirectMessage } from '../../services/dmService'
import { getAllUsers } from '../../services/userService'
import Sidebar from '../../Components/Sidebar/Sidebar'
import TopNav from '../../Components/TopNav/TopNav'
import Avatar from '../../Components/Avatar/Avatar'
import Toast from '../../Components/Toast/Toast'
import SupportModal from '../../Components/SupportModal/SupportModal'

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
    const [toast, setToast] = useState(null)
    
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
            }
            
            if (resUsers.ok) {
                const found = resUsers.data.find(u => u._id === contact_id)
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Avatar user={contact} size="32px" borderRadius="4px" />
                                <div style={{ fontWeight: 'bold' }}>{contact.name}</div>
                            </div>
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
                                messages.map(msg => (
                                    <div key={msg._id} style={{ display: 'flex', gap: '12px', padding: '4px 8px', borderRadius: '8px' }}>
                                        <Avatar user={msg.sender} size="36px" borderRadius="4px" />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                                <span style={{ fontWeight: 'bold' }}>{msg.sender?.name}</span>
                                                <span style={{ fontSize: '11px', color: 'var(--text-soft)' }}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div style={{ marginTop: '2px', wordBreak: 'break-word' }}>{msg.content}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid var(--border-color)' }}>
                            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input 
                                    type="text" 
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder={`Mensaje para ${contact?.name}`}
                                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-color)', fontSize: '15px' }}
                                />
                                <button 
                                    type="submit" 
                                    disabled={!messageInput.trim()}
                                    style={{ background: messageInput.trim() ? 'var(--accent-color)' : '#ddd', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>

            <SupportModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    )
}

export default DirectMessageScreen
