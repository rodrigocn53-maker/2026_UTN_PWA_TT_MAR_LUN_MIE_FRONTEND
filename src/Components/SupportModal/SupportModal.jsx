import React, { useState } from 'react';
import ENVIRONMENT from '../../config/environment';

const SupportModal = ({ isOpen, onClose }) => {
    const [problem, setProblem] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch(`${ENVIRONMENT.API_URL}/api/support`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ problem, description })
            });

            const data = await response.json();
            if (data.ok) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                    setProblem('');
                    setDescription('');
                }, 3000);
            } else {
                setError(data.message || 'Error al enviar el ticket');
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '450px' }}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>💬</div>
                    <h2 style={{ margin: 0 }}>Soporte Técnico</h2>
                    <p style={{ color: 'var(--text-soft)', fontSize: '14px', marginTop: '8px' }}>
                        ¿Tienes algún problema? Cuéntanos y te ayudaremos.
                    </p>
                </div>

                {success ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#007a5a' }}>
                        <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
                        <h3 style={{ margin: 0 }}>¡Mensaje Enviado!</h3>
                        <p>Hemos recibido tu consulta. Te contactaremos pronto.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="auth-input-container">
                            <label className="auth-label">Problema / Asunto</label>
                            <input 
                                type="text" 
                                className="auth-input" 
                                placeholder="Ej: No puedo subir imágenes" 
                                value={problem}
                                onChange={(e) => setProblem(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="auth-input-container">
                            <label className="auth-label">Descripción detallada</label>
                            <textarea 
                                className="auth-input" 
                                style={{ height: '120px', resize: 'none', padding: '12px' }}
                                placeholder="Cuéntanos más sobre lo que sucede..." 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <p style={{ color: '#e01e5a', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
                                {error}
                            </p>
                        )}

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="auth-btn" 
                                style={{ background: 'var(--bg-soft)', color: 'var(--text-color)', flex: 1 }}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="auth-btn" 
                                style={{ flex: 2 }}
                                disabled={loading}
                            >
                                {loading ? 'Enviando...' : 'Enviar Reporte'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SupportModal;
