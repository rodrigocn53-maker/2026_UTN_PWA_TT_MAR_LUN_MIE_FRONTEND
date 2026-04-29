import Avatar from "../../Components/Avatar/Avatar";
import { updateMemberRole, removeMember } from "../../services/workspaceService";
import useRequest from "../../hooks/useRequest";
import { useState } from "react";

export default function MembersListModalScreen({ isOpen, onClose, members, workspace_id, userRole, onSuccess }) {
    const { sendRequest, loading } = useRequest();
    const [actionLoading, setActionLoading] = useState(null);

    if (!isOpen) return null;

    // Helper para traducir roles
    const translateRole = (role) => {
        if (role === 'owner') return 'Propietario';
        if (role === 'admin') return 'Administrador';
        return 'Miembro';
    };

    const handlePromote = (user_id) => {
        if (!window.confirm("¿Seguro que quieres hacer a este usuario Administrador?")) return;
        setActionLoading(user_id);
        sendRequest({
            requestCb: async () => await updateMemberRole(workspace_id, user_id, 'admin'),
            onSuccess: () => {
                onSuccess(); 
                setActionLoading(null);
            },
            onError: () => setActionLoading(null)
        });
    };

    const handleRemove = (user_id, role) => {
        if (role === 'owner') return;
        if (!window.confirm("¿Seguro que quieres eliminar a este usuario del espacio?")) return;
        setActionLoading(user_id);
        sendRequest({
            requestCb: async () => await removeMember(workspace_id, user_id),
            onSuccess: () => {
                onSuccess();
                setActionLoading(null);
            },
            onError: () => setActionLoading(null)
        });
    };

    const canManageMembers = userRole === 'owner' || userRole === 'admin';

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '450px' }}>
                <button className="modal-close-btn" onClick={onClose} disabled={!!actionLoading}>&times;</button>
                
                <div className="auth-header" style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', margin: 0 }}>Miembros del Espacio</h2>
                    <p style={{ fontSize: '15px' }}>{members?.length || 0} participantes en total.</p>
                </div>

                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                    {members?.length > 0 ? (
                        members.map(member => (
                            <div 
                                key={member.user_id} 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '12px', 
                                    padding: '12px 8px', 
                                    borderBottom: '1px solid var(--border-color)',
                                    transition: 'background-color 0.2s ease',
                                    borderRadius: '4px',
                                    position: 'relative'
                                }}
                                className="slack-message-container" /* Reutilizamos esta clase para tener un hover sutil */
                            >
                                <Avatar user={{ name: member.user_name || '?' }} size="36px" borderRadius="4px" />
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '15px', color: 'var(--text-color)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {member.user_name}
                                        <span style={{ fontSize: '11px', background: 'var(--bg-soft)', padding: '2px 6px', borderRadius: '12px', color: 'var(--text-soft)', border: '1px solid var(--border-color)', fontWeight: 'normal' }}>
                                            {translateRole(member.member_role)}
                                        </span>
                                    </div>
                                    {member.user_email && (
                                        <div style={{ fontSize: '13px', color: 'var(--text-soft)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                            {member.user_email}
                                        </div>
                                    )}
                                </div>
                                
                                {canManageMembers && member.member_role !== 'owner' && (
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {member.member_role === 'user' && (
                                            <button 
                                                onClick={() => handlePromote(member.user_id)}
                                                disabled={!!actionLoading}
                                                style={{ background: 'transparent', border: '1px solid #1164A3', color: '#1164A3', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
                                                title="Hacer Admin"
                                            >
                                                +Admin
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleRemove(member.user_id, member.member_role)}
                                            disabled={!!actionLoading}
                                            style={{ background: 'transparent', border: '1px solid #e01e5a', color: '#e01e5a', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
                                            title="Expulsar"
                                        >
                                            Expulsar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-soft)' }}>
                            No hay miembros para mostrar.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
