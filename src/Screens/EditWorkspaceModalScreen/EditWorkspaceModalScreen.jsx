import { useEffect, useState } from "react";
import useForm from "../../hooks/useForm";
import useRequest from "../../hooks/useRequest";
import { updateWorkspace } from "../../services/workspaceService";

export default function EditWorkspaceModalScreen({ isOpen, onClose, workspace, onSuccess }) {
    const { sendRequest, error, loading, response } = useRequest();
    const [isSuccess, setIsSuccess] = useState(false);

    const EDIT_WORKSPACE_FORM_FIELD = {
        TITLE: "title",
        DESCRIPTION: "description"
    };

    const [initialFormState, setInitialFormState] = useState({
        [EDIT_WORKSPACE_FORM_FIELD.TITLE]: "",
        [EDIT_WORKSPACE_FORM_FIELD.DESCRIPTION]: ""
    });

    useEffect(() => {
        if (workspace) {
            setInitialFormState({
                [EDIT_WORKSPACE_FORM_FIELD.TITLE]: workspace.title || workspace.workspace_title || "",
                [EDIT_WORKSPACE_FORM_FIELD.DESCRIPTION]: workspace.description || ""
            });
        }
    }, [workspace]);

    const onWorkspaceUpdate = (formData) => {
        sendRequest({
            requestCb: async () => {
                return await updateWorkspace(
                    workspace.workspace_id || workspace.id,
                    formData[EDIT_WORKSPACE_FORM_FIELD.TITLE],
                    formData[EDIT_WORKSPACE_FORM_FIELD.DESCRIPTION],
                    workspace.url_image
                );
            },
        });
    };

    const { handleChangeInput, onSubmit, formState } = useForm({
        initialFormState,
        submitFn: onWorkspaceUpdate,
    });

    useEffect(() => {
        if (response?.ok) {
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onSuccess(); 
                onClose();
            }, 1000);
        }
    }, [response]);

    if (!isOpen || !workspace) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                
                {isSuccess ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <svg viewBox="0 0 24 24" width="64" height="64" fill="#2eb67d" style={{ marginBottom: '16px' }}>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <h2 style={{ margin: 0, color: 'var(--text-color)' }}>¡Actualizado con éxito!</h2>
                    </div>
                ) : (
                    <>
                        <div className="auth-header" style={{ marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '24px', margin: 0 }}>Editar Workspace</h2>
                            <p style={{ fontSize: '15px' }}>Modifica el nombre o descripción de tu espacio.</p>
                        </div>

                        <div style={{ width: '100%' }}>
                            <form onSubmit={onSubmit}>
                                <div className="auth-input-container">
                                    <label className="auth-label" htmlFor="name">Título <span style={{color: 'red'}}>*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name={EDIT_WORKSPACE_FORM_FIELD.TITLE}
                                        value={formState[EDIT_WORKSPACE_FORM_FIELD.TITLE]}
                                        onChange={handleChangeInput}
                                        className="auth-input"
                                        placeholder="Ej: Marketing, Desarrollo, etc."
                                        required
                                    />
                                </div>

                                <div className="auth-input-container">
                                    <label className="auth-label" htmlFor="description">Descripción</label>
                                    <input
                                        type="text"
                                        id="description"
                                        name={EDIT_WORKSPACE_FORM_FIELD.DESCRIPTION}
                                        value={formState[EDIT_WORKSPACE_FORM_FIELD.DESCRIPTION]}
                                        onChange={handleChangeInput}
                                        className="auth-input"
                                        placeholder="¿De qué trata este workspace?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="auth-btn"
                                    style={{ marginTop: '12px' }}
                                    disabled={loading}
                                >
                                    {loading ? "Guardando..." : "Guardar Cambios"}
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
