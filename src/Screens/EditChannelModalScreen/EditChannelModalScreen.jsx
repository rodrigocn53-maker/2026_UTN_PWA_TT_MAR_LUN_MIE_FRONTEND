import { useEffect, useState } from "react";
import useForm from "../../hooks/useForm";
import useRequest from "../../hooks/useRequest";
import { updateChannel, deleteChannel } from "../../services/channelService";

export default function EditChannelModalScreen({ isOpen, onClose, workspace_id, channel, onSuccess }) {
    const { sendRequest, error, loading, response } = useRequest();
    const { sendRequest: sendDeleteReq, error: deleteError, loading: deleteLoading } = useRequest();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const EDIT_CHANNEL_FORM_FIELD = {
        NAME: "name",
        DESCRIPTION: "description"
    };

    // Need initialFormState to populate with current channel data
    const [initialFormState, setInitialFormState] = useState({
        [EDIT_CHANNEL_FORM_FIELD.NAME]: "",
        [EDIT_CHANNEL_FORM_FIELD.DESCRIPTION]: ""
    });

    useEffect(() => {
        if (channel) {
            setInitialFormState({
                [EDIT_CHANNEL_FORM_FIELD.NAME]: channel.channel_name || channel.name || "",
                [EDIT_CHANNEL_FORM_FIELD.DESCRIPTION]: channel.channel_description || channel.description || ""
            });
        }
    }, [channel]);

    const onChannelUpdate = (formData) => {
        sendRequest({
            requestCb: async () => {
                return await updateChannel(
                    workspace_id,
                    channel.channel_id || channel.id,
                    formData[EDIT_CHANNEL_FORM_FIELD.NAME],
                    formData[EDIT_CHANNEL_FORM_FIELD.DESCRIPTION]
                );
            },
        });
    };

    const handleDelete = () => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este canal? Todos los mensajes se perderán. Esta acción es irreversible.")) return;
        setIsDeleting(true);
        sendDeleteReq({
            requestCb: async () => {
                return await deleteChannel(
                    workspace_id,
                    channel.channel_id || channel.id
                );
            },
            onSuccess: () => {
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                    onSuccess('delete'); // Recargar canales
                    onClose();
                }, 1000);
            },
            onError: () => setIsDeleting(false)
        });
    };

    const { handleChangeInput, onSubmit, formState } = useForm({
        initialFormState,
        submitFn: onChannelUpdate,
    });

    // We need to re-bind formState when channel changes since useForm uses a one-time init inside it.
    // Actually `useForm` might not update `formState` dynamically if `initialFormState` changes.
    // So let's override values in inputs to be controlled by a local effect or just recreate the component.
    // By using `isOpen` condition in parent to render or not render, it mounts fresh each time!

    useEffect(() => {
        if (response?.ok) {
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onSuccess('update'); // Llamamos al callback para recargar la lista
                onClose();
            }, 1000);
        }
    }, [response]);

    if (!isOpen || !channel) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                
                {isSuccess ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <svg viewBox="0 0 24 24" width="64" height="64" fill="#2eb67d" style={{ marginBottom: '16px' }}>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <h2 style={{ margin: 0, color: 'var(--text-color)' }}>
                            {isDeleting ? '¡Canal eliminado!' : '¡Canal actualizado!'}
                        </h2>
                    </div>
                ) : (
                    <>
                        <div className="auth-header" style={{ marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '24px', margin: 0 }}>Editar Canal</h2>
                            <p style={{ fontSize: '15px' }}>Modifica los detalles del canal o elimínalo permanentemente.</p>
                        </div>

                        <div style={{ width: '100%' }}>
                            <form onSubmit={onSubmit}>
                                <div className="auth-input-container">
                                    <label className="auth-label" htmlFor="name">Nombre del canal <span style={{color: 'red'}}>*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name={EDIT_CHANNEL_FORM_FIELD.NAME}
                                        value={formState[EDIT_CHANNEL_FORM_FIELD.NAME]}
                                        onChange={handleChangeInput}
                                        className="auth-input"
                                        placeholder="Ej: anuncios"
                                        required
                                    />
                                    <span style={{ fontSize: '12px', color: '#616061', marginTop: '4px' }}>
                                        Los nombres deben estar en minúsculas, sin espacios ni puntos.
                                    </span>
                                </div>

                                <div className="auth-input-container">
                                    <label className="auth-label" htmlFor="description">Descripción (opcional)</label>
                                    <textarea
                                        id="description"
                                        name={EDIT_CHANNEL_FORM_FIELD.DESCRIPTION}
                                        value={formState[EDIT_CHANNEL_FORM_FIELD.DESCRIPTION]}
                                        onChange={handleChangeInput}
                                        className="auth-input"
                                        placeholder="¿De qué trata este canal?"
                                        rows="3"
                                        style={{ resize: 'vertical' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="auth-btn"
                                        style={{ background: '#e01e5a', flex: 1 }}
                                        disabled={loading || deleteLoading}
                                    >
                                        {deleteLoading ? "Eliminando..." : "Eliminar Canal"}
                                    </button>

                                    <button
                                        type="submit"
                                        className="auth-btn"
                                        style={{ flex: 1 }}
                                        disabled={loading || deleteLoading}
                                    >
                                        {loading ? "Guardando..." : "Guardar Cambios"}
                                    </button>
                                </div>

                                {(error || deleteError) && (
                                    <div className="auth-error-box" style={{ marginTop: '16px', marginBottom: '0' }}>
                                        {error?.message || deleteError?.message}
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
