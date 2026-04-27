import { useEffect, useState } from "react";
import useForm from "../../hooks/useForm";
import useRequest from "../../hooks/useRequest";
import { createWorkspace } from "../../services/workspaceService";

export default function NewWorkspaceModalScreen({ isOpen, onClose }) {
    const { sendRequest, error, loading, response } = useRequest();
    const [isSuccess, setIsSuccess] = useState(false);

    const CREATE_WORKSPACE_FORM_FIELD = {
        TITLE: "title",
        DESCRIPTION: "description",
        URL_IMAGE: "url_image",
    };

    const initialFormState = {
        [CREATE_WORKSPACE_FORM_FIELD.TITLE]: "",
        [CREATE_WORKSPACE_FORM_FIELD.DESCRIPTION]: "",
        [CREATE_WORKSPACE_FORM_FIELD.URL_IMAGE]: "",
    };

    const onWorkspaceCreate = (formData) => {
        sendRequest({
            requestCb: async () => {
                return await createWorkspace({
                    title: formData[CREATE_WORKSPACE_FORM_FIELD.TITLE],
                    description: formData[CREATE_WORKSPACE_FORM_FIELD.DESCRIPTION],
                    url_image: formData[CREATE_WORKSPACE_FORM_FIELD.URL_IMAGE],
                });
            },
        });
    };

    const { handleChangeInput, onSubmit } = useForm({
        initialFormState,
        submitFn: onWorkspaceCreate,
    });

    useEffect(() => {
        if (response?.ok) {
            setIsSuccess(true);
            setTimeout(() => {
                window.location.reload();
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
                        <h2 style={{ margin: 0, color: 'var(--text-color)' }}>¡Creado con éxito!</h2>
                        <p style={{ color: 'var(--text-soft)', marginTop: '8px' }}>Cargando tu nuevo espacio de trabajo...</p>
                    </div>
                ) : (
                    <>
                        <header style={{ marginBottom: '24px' }}>
                            <svg viewBox="0 0 244.8 244.8" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                                <path d="m89.7 155.1c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#e01e5a"/>
                                <path d="m104 155.1c0-15.8-12.8-28.6-28.6-28.6s-28.6 12.8-28.6 28.6 12.8 28.6 28.6 28.6h28.6z" fill="#e01e5a"/>
                                <path d="m89.7 89.7c0 15.8-12.8 28.6-28.6 28.6s-28.6-12.8-28.6-28.6 12.8-28.6 28.6-28.6 28.6 12.8 28.6 28.6z" fill="#36c5f0"/>
                                <path d="m89.7 104c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#36c5f0"/>
                                <path d="m155.1 89.7c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#2eb67d"/>
                                <path d="m140.8 89.7c0 15.8 12.8 28.6 28.6 28.6s28.6-12.8 28.6-28.6-12.8-28.6-28.6-28.6h-28.6z" fill="#2eb67d"/>
                                <path d="m155.1 155.1c0-15.8 12.8-28.6 28.6-28.6s28.6 12.8 28.6 28.6-12.8 28.6-28.6 28.6-28.6-12.8-28.6-28.6z" fill="#ecb22e"/>
                                <path d="m155.1 140.8c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#ecb22e"/>
                            </svg>
                        </header>

                        <div className="auth-header" style={{ marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '24px', margin: 0 }}>Crear un nuevo Workspace</h2>
                            <p style={{ fontSize: '15px' }}>Tu equipo se comunicará aquí.</p>
                        </div>

                        <div style={{ width: '100%' }}>
                            <form onSubmit={onSubmit}>
                                <div className="auth-input-container">
                                    <label className="auth-label" htmlFor="name">Título <span style={{color: 'red'}}>*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name={CREATE_WORKSPACE_FORM_FIELD.TITLE}
                                        onChange={handleChangeInput}
                                        className="auth-input"
                                        placeholder="Ej: Marketing, Desarrollo, etc."
                                        required
                                    />
                                </div>

                                <div className="auth-input-container">
                                    <label className="auth-label" htmlFor="description">Descripción <span style={{color: 'gray', fontSize: '12px'}}>(Opcional)</span></label>
                                    <input
                                        type="text"
                                        id="description"
                                        name={CREATE_WORKSPACE_FORM_FIELD.DESCRIPTION}
                                        onChange={handleChangeInput}
                                        className="auth-input"
                                        placeholder="¿De qué trata este workspace?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="auth-btn"
                                    style={{ marginBottom: '0' }}
                                    disabled={loading}
                                >
                                    {loading ? "Creando..." : "Crear Workspace"}
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
