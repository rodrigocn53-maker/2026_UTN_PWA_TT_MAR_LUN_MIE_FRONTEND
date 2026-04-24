import { useEffect } from "react";
import useForm from "../../hooks/useForm";
import useRequest from "../../hooks/useRequest";
import { useNavigate } from "react-router";
import { createWorkspace } from "../../services/workspaceService";


export default function NewWorkspaceScreen() {
    const navigate = useNavigate();
    const { sendRequest, error, loading, response } = useRequest();
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
            navigate("/home");
        }
    }, [response, navigate]);

    return (
        <div className="auth-page">
            <header style={{ marginBottom: '40px' }}>
                <svg viewBox="0 0 244.8 244.8" width="120" height="120" xmlns="http://www.w3.org/2000/svg"><path d="m89.7 155.1c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#e01e5a"/><path d="m104 155.1c0-15.8-12.8-28.6-28.6-28.6s-28.6 12.8-28.6 28.6 12.8 28.6 28.6 28.6h28.6z" fill="#e01e5a"/><path d="m89.7 89.7c0 15.8-12.8 28.6-28.6 28.6s-28.6-12.8-28.6-28.6 12.8-28.6 28.6-28.6 28.6 12.8 28.6 28.6z" fill="#36c5f0"/><path d="m89.7 104c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#36c5f0"/><path d="m155.1 89.7c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#2eb67d"/><path d="m140.8 89.7c0 15.8 12.8 28.6 28.6 28.6s28.6-12.8 28.6-28.6-12.8-28.6-28.6-28.6h-28.6z" fill="#2eb67d"/><path d="m155.1 155.1c0-15.8 12.8-28.6 28.6-28.6s28.6 12.8 28.6 28.6-12.8 28.6-28.6 28.6-28.6-12.8-28.6-28.6z" fill="#ecb22e"/><path d="m155.1 140.8c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#ecb22e"/></svg>
            </header>

            <div className="auth-header">
                <h1>Crea un nuevo Workspace</h1>
                <p>Tu equipo se comunicará aquí.</p>
            </div>

            <div className="auth-form-card">
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
                        disabled={loading}
                    >
                        {loading ? "Creando Workspace..." : "Crear Workspace"}
                    </button>

                    {error && (
                        <div className="auth-error-box">
                            {error}
                        </div>
                    )}

                    {response && (
                        <div className="auth-error-box" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', borderColor: '#c8e6c9' }}>
                            {response.message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
