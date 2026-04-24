import React from 'react'
import { useParams, Link } from 'react-router'
import useWorkspace from '../../hooks/useWorkspace'
import useWorkspaces from '../../hooks/useWorkspaces'

const WorkspaceScreen = () => {
    const { workspace_id } = useParams()
    const { workspace, loading: loadingWorkspace, error: errorWorkspace } = useWorkspace(workspace_id)
    const { workspaces, loading: loadingWorkspaces } = useWorkspaces()

    return (
        <div className="slack-app-layout">
            <header className="slack-top-nav">
                <div style={{ width: '260px' }}></div>
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
                                                        <li className="slack-sidebar-item" style={{ padding: '2px 8px' }}>
                                                            <span className="slack-channel-hash">#</span> general
                                                        </li>
                                                        <li className="slack-sidebar-item" style={{ padding: '2px 8px' }}>
                                                            <span className="slack-channel-hash">#</span> random
                                                        </li>
                                                        <li className="slack-sidebar-item" style={{ padding: '2px 8px', opacity: 0.7 }}>
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
                    <header className="slack-chat-header">
                        {loadingWorkspace ? 'Cargando...' : workspace ? `# ${workspace.title || workspace.workspace_title || 'general'}` : 'Selecciona un Workspace'}
                    </header>
                    <div className="slack-chat-messages">
                        {errorWorkspace && <p style={{ color: 'red' }}>Error: {errorWorkspace}</p>}
                        {workspace && (
                            <div style={{ paddingBottom: '20px' }}>
                                <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Te damos la bienvenida a #{workspace.title || workspace.workspace_title || 'general'}!</h1>
                                <p style={{ color: '#616061', fontSize: '15px' }}>
                                    {workspace.description || 'Este es el comienzo del canal.'}
                                </p>
                            </div>
                        )}
                    </div>
                    
                    {workspace && (
                        <div className="slack-chat-input-container">
                            <div className="slack-chat-input-box">
                                <textarea 
                                    className="slack-chat-input" 
                                    placeholder={`Enviar mensaje a #${workspace.title || workspace.workspace_title || 'general'}`}
                                ></textarea>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                                    <button style={{ backgroundColor: '#007a5a', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer', fontWeight: 'bold' }}>
                                        Enviar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default WorkspaceScreen
