import React, { useState, useContext } from 'react';
import { updateProfile } from '../../services/userService';
import { AuthContext } from '../../Context/AuthContext';
import Avatar from '../Avatar/Avatar';

const EditProfileModal = ({ isOpen, onClose, onUpdateSuccess }) => {
    const { user, verifyAuth } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || '');
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.avatar || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Crop State
    const [zoom, setZoom] = useState(user?.avatar_config?.zoom || 1);
    const [position, setPosition] = useState(user?.avatar_config?.position || { x: 50, y: 50 }); // Porcentajes
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setZoom(1);
            setPosition({ x: 50, y: 50 });
        }
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setPosition({ 
            x: Math.max(0, Math.min(100, x)), 
            y: Math.max(0, Math.min(100, y)) 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        if (name !== user?.name) formData.append('name', name);
        if (avatarFile) formData.append('avatar', avatarFile);
        
        // Siempre enviamos el config si ha cambiado o si hay nueva imagen
        const config = { zoom, position };
        formData.append('avatar_config', JSON.stringify(config));

        const result = await updateProfile(formData);
        if (result.ok) {
            await verifyAuth();
            if (onUpdateSuccess) onUpdateSuccess('Perfil actualizado con éxito');
            onClose();
        } else {
            setError(result.message || 'Error al actualizar el perfil');
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>Editar Perfil</h2>
                    <p style={{ color: 'var(--text-soft)', fontSize: '14px' }}>Ajusta tu foto de perfil</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                        <div 
                            style={{ 
                                width: '150px', height: '150px', 
                                borderRadius: '50%', border: '4px solid var(--accent-color)', 
                                overflow: 'hidden', position: 'relative', 
                                cursor: isDragging ? 'grabbing' : 'grab',
                                background: '#f0f0f0'
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onMouseMove={handleMouseMove}
                        >
                            {previewUrl ? (
                                <img 
                                    src={previewUrl} 
                                    alt="Preview" 
                                    style={{ 
                                        width: '100%', height: '100%', 
                                        objectFit: 'cover',
                                        transform: `scale(${zoom})`,
                                        objectPosition: `${position.x}% ${position.y}%`,
                                        userSelect: 'none',
                                        pointerEvents: 'none'
                                    }} 
                                />
                            ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>Sin foto</div>
                            )}
                        </div>
                        
                        <div style={{ width: '100%', marginTop: '16px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-soft)', display: 'block', marginBottom: '4px' }}>Zoom</label>
                            <input 
                                type="range" min="1" max="3" step="0.1" 
                                value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--accent-color)' }}
                            />
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-soft)', marginTop: '8px' }}>
                            Arrastra sobre la imagen para ajustar el encuadre
                        </p>

                        <input 
                            id="avatar-upload"
                            type="file" accept="image/*" 
                            onChange={handleFileChange} 
                            style={{ display: 'none' }}
                        />
                        <button 
                            type="button" 
                            onClick={() => document.getElementById('avatar-upload').click()}
                            style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '13px', marginTop: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            {previewUrl ? 'Cambiar imagen' : 'Subir imagen'}
                        </button>
                    </div>

                    <div className="auth-input-container">
                        <label className="auth-label">Nombre Completo</label>
                        <input 
                            type="text" className="auth-input" 
                            value={name} onChange={(e) => setName(e.target.value)}
                            required disabled={loading}
                        />
                    </div>

                    {error && <p style={{ color: '#e01e5a', fontSize: '13px', textAlign: 'center' }}>{error}</p>}

                    <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                        <button type="button" onClick={onClose} className="auth-btn" style={{ background: 'var(--bg-soft)', color: 'var(--text-color)', flex: 1 }} disabled={loading}>Cancelar</button>
                        <button type="submit" className="auth-btn" style={{ flex: 1 }} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
