import { useEffect, useState } from "react";
import useForm from "../../hooks/useForm";
import useRequest from "../../hooks/useRequest";
import { createChannel } from "../../services/channelService";

export default function NewChannelModalScreen({ isOpen, onClose, workspace_id, onSuccess }) {
    const { sendRequest, error, loading, response } = useRequest();
    const [isSuccess, setIsSuccess] = useState(false);

    const CREATE_CHANNEL_FORM_FIELD = {
        NAME: "name"
    };

    const initialFormState = {
        [CREATE_CHANNEL_FORM_FIELD.NAME]: ""
    };

    const onChannelCreate = (formData) => {
        sendRequest({
            requestCb: async () => {
                return await createChannel(
                    workspace_id,
                    formData[CREATE_CHANNEL_FORM_FIELD.NAME],
                    "" // Descripción vacía por defecto
                );
            },
        });
    };

    const { handleChangeInput, onSubmit } = useForm({
        initialFormState,
        submitFn: onChannelCreate,
    });

    useEffect(() => {
        if (response?.ok) {
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onSuccess(); // Llamamos al callback para recargar la lista
                onClose();
            }, 1000);
        }
    }, [response]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                
                {isSuccess ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <svg viewBox="0 0 24 24" width="64" height="64" fill="#2eb67d" style={{ marginBottom: '16px' }}>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <h2 style={{ margin: 0, color: 'var(--text-color)' }}>¡Canal creado!</h2>
                    </div>
                ) : (
                    <>
                        <div className="auth-header" style={{ marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '24px', margin: 0 }}>Crear un nuevo Canal</h2>
                            <p style={{ fontSize: '15px' }}>Los canales son donde se comunica tu equipo.</p>
                        </div>

                        <div style={{ width: '100%' }}>
                            <form onSubmit={onSubmit}>
                                <div className="auth-input-container">
                                    <label className="auth-label" htmlFor="name">Nombre <span style={{color: 'red'}}>*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name={CREATE_CHANNEL_FORM_FIELD.NAME}
                                        onChange={handleChangeInput}
                                        className="auth-input"
                                        placeholder="Ej: anuncios, equipo-ventas"
                                        required
                                    />
                                    <span style={{ fontSize: '12px', color: '#616061', marginTop: '4px' }}>
                                        Los nombres deben estar en minúsculas, sin espacios ni puntos.
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    className="auth-btn"
                                    style={{ marginBottom: '0' }}
                                    disabled={loading}
                                >
                                    {loading ? "Creando..." : "Crear Canal"}
                                </button>

                                {error && (
                                    <div className="auth-error-box" style={{ marginTop: '16px', marginBottom: '0' }}>
                                        {error.message}
                                    </div>
                                )}
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
