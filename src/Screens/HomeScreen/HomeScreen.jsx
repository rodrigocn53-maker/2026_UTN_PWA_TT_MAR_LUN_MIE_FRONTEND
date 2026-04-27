import React, { useState, useContext } from 'react'
import { Link } from 'react-router'
import useWorkspaces from '../../hooks/useWorkspaces'
import { AuthContext } from '../../Context/AuthContext'
import NewWorkspaceModalScreen from '../NewWorkspaceModalScreen/NewWorkspaceModalScreen'
import TopNav from '../../Components/TopNav/TopNav'

const HomeScreen = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { workspaces, loading: loadingWorkspaces } = useWorkspaces()

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
                            </ul>
                        </div>
                    </div>
                </aside>

                <main className="slack-chat-area">
                    <header className="slack-chat-header" style={{ padding: '0 20px' }}>Bienvenido a Slack</header>
                    <div className="slack-chat-messages" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <svg viewBox="0 0 244.8 244.8" width="80" height="80" style={{ marginBottom: '20px', opacity: 0.2 }} xmlns="http://www.w3.org/2000/svg">
                            <path d="m89.7 155.1c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#e01e5a"/>
                            <path d="m104 155.1c0-15.8-12.8-28.6-28.6-28.6s-28.6 12.8-28.6 28.6 12.8 28.6 28.6 28.6h28.6z" fill="#e01e5a"/>
                            <path d="m89.7 89.7c0 15.8-12.8 28.6-28.6 28.6s-28.6-12.8-28.6-28.6 12.8-28.6 28.6-28.6 28.6 12.8 28.6 28.6z" fill="#36c5f0"/>
                            <path d="m89.7 104c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#36c5f0"/>
                            <path d="m155.1 89.7c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#2eb67d"/>
                            <path d="m140.8 89.7c0 15.8 12.8 28.6 28.6 28.6s28.6-12.8 28.6-28.6-12.8-28.6-28.6-28.6h-28.6z" fill="#2eb67d"/>
                            <path d="m155.1 155.1c0-15.8 12.8-28.6 28.6-28.6s28.6 12.8 28.6 28.6-12.8 28.6-28.6 28.6-28.6-12.8-28.6-28.6z" fill="#ecb22e"/>
                            <path d="m155.1 140.8c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#ecb22e"/>
                        </svg>
                        <h2 style={{ color: 'var(--text-color)' }}>Selecciona un Espacio de Trabajo</h2>
                        <p style={{ color: 'var(--text-soft)' }}>Elige uno en el menú lateral izquierdo para comenzar a chatear.</p>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: 'var(--accent-color)', color: 'white', borderRadius: '4px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                        >
                            + Crear nuevo espacio de trabajo
                        </button>
                    </div>
                </main>
            </div>

            <NewWorkspaceModalScreen isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}

export default HomeScreen