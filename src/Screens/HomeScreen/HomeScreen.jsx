import React, { useContext, useEffect } from 'react'
import { getWorkspaces } from '../../services/workspaceService'
import useRequest from '../../hooks/useRequest'
import { Link } from 'react-router'
import useWorkspaces from '../../hooks/useWorkspaces'
import { AuthContext } from '../../Context/AuthContext'

const HomeScreen = () => {

  const {response, loading, error, workspaces} = useWorkspaces()
  const {isLogged} = useContext(AuthContext)

  return (
    <div className="slack-app-layout">
        <header className="slack-top-nav">
            <div style={{ width: '260px' }}>
                {/* Space for the sidebar width */}
            </div>
            <div className="slack-search-bar">
                <input type="text" className="slack-search-input" placeholder="Buscar en Slack..." />
            </div>
            <div className="slack-profile-section">
                <div className="slack-user-name">Usuario</div>
                <div className="slack-avatar">
                    <img src="https://ui-avatars.com/api/?name=Usuario&background=random" alt="Avatar" />
                </div>
            </div>
        </header>

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
                            {loading && <li className="slack-sidebar-item">Cargando...</li>}
                            {!loading && workspaces && workspaces.length === 0 && (
                                <li className="slack-sidebar-item">No hay workspaces</li>
                            )}
                            {!loading && workspaces && workspaces.map((ws) => (
                                <li key={ws.workspace_id} className="slack-sidebar-item">
                                    <Link to={'/workspace/' + ws.workspace_id} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <span className="slack-channel-hash">#</span>
                                        <span style={{ marginLeft: '8px' }}>{ws.workspace_title}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </aside>

            <main className="slack-chat-area">
                <header className="slack-chat-header">
                    Bienvenido a Slack
                </header>
                <div className="slack-chat-messages" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#616061' }}>
                    <svg viewBox="0 0 244.8 244.8" width="80" height="80" style={{ marginBottom: '20px', opacity: 0.2 }} xmlns="http://www.w3.org/2000/svg"><path d="m89.7 155.1c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#e01e5a"/><path d="m104 155.1c0-15.8-12.8-28.6-28.6-28.6s-28.6 12.8-28.6 28.6 12.8 28.6 28.6 28.6h28.6z" fill="#e01e5a"/><path d="m89.7 89.7c0 15.8-12.8 28.6-28.6 28.6s-28.6-12.8-28.6-28.6 12.8-28.6 28.6-28.6 28.6 12.8 28.6 28.6z" fill="#36c5f0"/><path d="m89.7 104c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#36c5f0"/><path d="m155.1 89.7c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#2eb67d"/><path d="m140.8 89.7c0 15.8 12.8 28.6 28.6 28.6s28.6-12.8 28.6-28.6-12.8-28.6-28.6-28.6h-28.6z" fill="#2eb67d"/><path d="m155.1 155.1c0-15.8 12.8-28.6 28.6-28.6s28.6 12.8 28.6 28.6-12.8 28.6-28.6 28.6-28.6-12.8-28.6-28.6z" fill="#ecb22e"/><path d="m155.1 140.8c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#ecb22e"/></svg>
                    <h2>Selecciona un Espacio de Trabajo</h2>
                    <p>Elige uno en el menú lateral izquierdo para comenzar a chatear.</p>
                    <Link to={'/workspace/new'} style={{ marginTop: '20px', display: 'inline-block', padding: '10px 20px', backgroundColor: '#1164A3', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
                        Crear nuevo espacio de trabajo
                    </Link>
                </div>
            </main>
        </div>
    </div>
  )
}

export default HomeScreen