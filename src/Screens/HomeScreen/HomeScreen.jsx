import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router'
import useWorkspaces from '../../hooks/useWorkspaces'
import { AuthContext } from '../../Context/AuthContext'
import NewWorkspaceModalScreen from '../NewWorkspaceModalScreen/NewWorkspaceModalScreen'
import TopNav from '../../Components/TopNav/TopNav'
import { getAllUsers } from '../../services/userService'
import { inviteToWorkspace } from '../../services/workspaceService'
import Avatar from '../../Components/Avatar/Avatar'
import Toast from '../../Components/Toast/Toast'

const HomeScreen = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { workspaces, loading: loadingWorkspaces } = useWorkspaces()
    const { user: currentUser } = useContext(AuthContext)
    
    const [users, setUsers] = useState([])
    const [loadingUsers, setLoadingUsers] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [invitingUserId, setInvitingUserId] = useState(null)
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('')
    const [isInviting, setIsInviting] = useState(false)

    // Toast State
    const [toast, setToast] = useState(null)
    const showToast = (message, type = 'success') => {
        setToast({ message, type })
    }

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await getAllUsers()
            if (res.ok) {
                setUsers(res.data)
            }
            setLoadingUsers(false)
        }
        fetchUsers()
    }, [])

    const handleInvite = async (userToInvite) => {
        if (!selectedWorkspaceId) {
            showToast("Por favor selecciona un espacio de trabajo", 'warning')
            return
        }
        
        setIsInviting(true)
        try {
            const identifier = `${userToInvite.username}#${userToInvite.tag}`
            const res = await inviteToWorkspace(selectedWorkspaceId, identifier)
            if (res.ok) {
                showToast(`¡Invitación enviada a ${userToInvite.name}!`)
                setInvitingUserId(null)
                setSelectedWorkspaceId('')
            } else {
                showToast(res.message || "Error al enviar invitación", 'error')
            }
        } catch (err) {
            showToast("Error al procesar la invitación", 'error')
        } finally {
            setIsInviting(false)
        }
    }

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="slack-app-layout">
            <TopNav />

            <div className="slack-main-body">
                <aside className="slack-sidebar">
                    <div className="slack-sidebar-header">Tus Workspaces</div>
                    <div className="slack-sidebar-content">
                        <div className="slack-sidebar-group">
                            <div className="slack-sidebar-group-title">ESPACIOS DE TRABAJO</div>
                            <ul className="slack-sidebar-list">
                                {loadingWorkspaces && <li className="slack-sidebar-item">Cargando...</li>}
                                {!loadingWorkspaces && workspaces?.map((ws) => (
                                    <li key={ws.workspace_id} className="slack-sidebar-item">
                                        <Link to={'/workspace/' + ws.workspace_id} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <span style={{ opacity: 0.7 }}>#</span>
                                            <span style={{ marginLeft: '8px' }}>{ws.workspace_title}</span>
                                        </Link>
                                    </li>
                                ))}
                                <li className="slack-sidebar-item" style={{ opacity: 0.7, cursor: 'pointer' }} onClick={() => setIsModalOpen(true)}>
                                    <span>+</span>
                                    <span style={{ marginLeft: '8px' }}>Crear workspace</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </aside>

                <main className="slack-chat-area">
                    <header className="slack-chat-header" style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Bienvenido, {currentUser?.name}</span>
                        <div style={{ fontSize: '12px', color: 'var(--text-soft)', fontWeight: 'normal' }}>
                            {users.length} usuarios en la plataforma
                        </div>
                    </header>
                    
                    <div className="slack-chat-messages" style={{ padding: '40px', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'start' }}>
                        
                        {/* Welcome Panel */}
                        <div style={{ background: 'var(--bg-color)', padding: '40px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 4px 12px var(--shadow)' }}>
                            <svg viewBox="0 0 244.8 244.8" width="80" height="80" style={{ marginBottom: '20px' }} xmlns="http://www.w3.org/2000/svg">
                                <path d="m89.7 155.1c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#e01e5a"/>
                                <path d="m104 155.1c0-15.8-12.8-28.6-28.6-28.6s-28.6 12.8-28.6 28.6 12.8 28.6 28.6 28.6h28.6z" fill="#e01e5a"/>
                                <path d="m89.7 89.7c0 15.8-12.8 28.6-28.6 28.6s-28.6-12.8-28.6-28.6 12.8-28.6 28.6-28.6 28.6 12.8 28.6 28.6z" fill="#36c5f0"/>
                                <path d="m89.7 104c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#36c5f0"/>
                                <path d="m155.1 89.7c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#2eb67d"/>
                                <path d="m140.8 89.7c0 15.8 12.8 28.6 28.6 28.6s28.6-12.8 28.6-28.6-12.8-28.6-28.6-28.6h-28.6z" fill="#2eb67d"/>
                                <path d="m155.1 155.1c0-15.8 12.8-28.6 28.6-28.6s28.6 12.8 28.6 28.6-12.8 28.6-28.6 28.6-28.6-12.8-28.6-28.6z" fill="#ecb22e"/>
                                <path d="m155.1 140.8c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#ecb22e"/>
                            </svg>
                            <h1 style={{ color: 'var(--text-color)', fontSize: '28px', marginBottom: '12px' }}>Es genial tenerte aquí</h1>
                            <p style={{ color: 'var(--text-soft)', fontSize: '16px', maxWidth: '500px', margin: '0 auto 24px' }}>
                                Slack es el lugar donde ocurre el trabajo. Comienza seleccionando un espacio de trabajo a la izquierda o crea uno nuevo para tu equipo.
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    style={{ padding: '12px 24px', backgroundColor: 'var(--accent-color)', color: 'white', borderRadius: '4px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                                >
                                    + Crear nuevo espacio
                                </button>
                            </div>
                        </div>

                        {/* User Roster Panel */}
                        <div style={{ background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '600px', overflow: 'hidden', boxShadow: '0 4px 12px var(--shadow)' }}>
                            <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-soft)' }}>
                                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Conecta con otros usuarios</h3>
                                <input 
                                    type="text" 
                                    placeholder="Buscar por nombre o email..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        padding: '8px 12px', 
                                        borderRadius: '6px', 
                                        border: '1px solid var(--border-color)', 
                                        background: 'var(--bg-color)',
                                        color: 'var(--text-color)',
                                        fontSize: '14px',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                                {loadingUsers ? (
                                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-soft)' }}>Cargando usuarios...</div>
                                ) : filteredUsers.length === 0 ? (
                                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-soft)' }}>No se encontraron usuarios</div>
                                ) : (
                                    filteredUsers.map(u => (
                                        <div key={u._id} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between', 
                                            padding: '12px', 
                                            borderRadius: '8px',
                                            transition: 'background 0.2s',
                                            marginBottom: '4px',
                                            border: invitingUserId === u._id ? '1px solid var(--accent-color)' : '1px solid transparent'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <Avatar user={u} size="36px" />
                                                <div style={{ overflow: 'hidden' }}>
                                                    <div style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-soft)' }}>{u.username}#{u.tag}</div>
                                                </div>
                                            </div>
                                            
                                            {invitingUserId === u._id ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                                                    <select 
                                                        value={selectedWorkspaceId} 
                                                        onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                                                        style={{ padding: '4px', borderRadius: '4px', fontSize: '12px', background: 'var(--bg-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
                                                    >
                                                        <option value="">Selecciona Workspace</option>
                                                        {workspaces?.map(ws => (
                                                            <option key={ws.workspace_id} value={ws.workspace_id}>{ws.workspace_title}</option>
                                                        ))}
                                                    </select>
                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                        <button 
                                                            onClick={() => setInvitingUserId(null)}
                                                            style={{ padding: '4px 8px', fontSize: '11px', background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-color)', borderRadius: '4px', cursor: 'pointer' }}
                                                        >
                                                            X
                                                        </button>
                                                        <button 
                                                            onClick={() => handleInvite(u)}
                                                            disabled={isInviting || !selectedWorkspaceId}
                                                            style={{ padding: '4px 8px', fontSize: '11px', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                        >
                                                            {isInviting ? '...' : 'Enviar'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => setInvitingUserId(u._id)}
                                                    style={{ 
                                                        padding: '6px 12px', 
                                                        fontSize: '12px', 
                                                        borderRadius: '4px', 
                                                        border: '1px solid var(--accent-color)', 
                                                        background: 'transparent', 
                                                        color: 'var(--accent-color)', 
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    Invitar
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            <NewWorkspaceModalScreen isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    )
}

export default HomeScreen