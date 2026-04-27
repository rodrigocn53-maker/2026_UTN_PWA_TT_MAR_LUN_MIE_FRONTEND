import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import useForm from '../../hooks/useForm';
import useRequest from '../../hooks/useRequest';
import { resetPassword } from '../../services/authService';

const ResetPasswordScreen = () => {
    const { reset_password_token } = useParams();
    const { sendRequest, error, response, loading } = useRequest();
    
    const RESET_FORM_FIELDS = {
        PASSWORD: 'password',
        CONFIRM_PASSWORD: 'confirm_password'
    };

    const initialFormState = {
        [RESET_FORM_FIELDS.PASSWORD]: '',
        [RESET_FORM_FIELDS.CONFIRM_PASSWORD]: ''
    };

    const [formError, setFormError] = useState(null);

    const onResetPassword = (formState) => {
        setFormError(null);
        const password = formState[RESET_FORM_FIELDS.PASSWORD];
        const confirmPassword = formState[RESET_FORM_FIELDS.CONFIRM_PASSWORD];

        if (password !== confirmPassword) {
            setFormError("Las contraseñas no coinciden");
            return;
        }

        if (password.length < 6) {
            setFormError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        sendRequest({
            requestCb: async () => {
                return await resetPassword({
                    reset_password_token,
                    password: password
                });
            }
        });
    };

    const {
        handleChangeInput,
        onSubmit,
        formState
    } = useForm({
        initialFormState,
        submitFn: onResetPassword
    });

    return (
        <div className="auth-page">
            <header style={{ marginBottom: '40px' }}>
                <svg viewBox="0 0 244.8 244.8" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
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
            
            <div className="auth-header">
                <h1>Elige una nueva contraseña</h1>
                <p>Ingresa y confirma tu nueva contraseña a continuación.</p>
            </div>
            
            <div className="auth-form-card">
                {response && response.ok ? (
                    <div style={{ textAlign: 'center' }}>
                        <div className="auth-error-box" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', borderColor: '#c8e6c9', marginBottom: '20px' }}>
                            {response.message}
                        </div>
                        <Link to="/login" className="auth-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
                            Ir a Iniciar Sesión
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={onSubmit}>
                        <div className="auth-input-container">
                            <label className="auth-label" htmlFor="password">Nueva Contraseña</label>
                            <input 
                                className="auth-input"
                                type="password" 
                                id="password" 
                                name={RESET_FORM_FIELDS.PASSWORD} 
                                onChange={handleChangeInput}
                                placeholder="Tu nueva contraseña"
                                required
                            />
                        </div>
                        <div className="auth-input-container">
                            <label className="auth-label" htmlFor="confirm_password">Confirmar Contraseña</label>
                            <input 
                                className="auth-input"
                                type="password" 
                                id="confirm_password" 
                                name={RESET_FORM_FIELDS.CONFIRM_PASSWORD} 
                                onChange={handleChangeInput}
                                placeholder="Repite la nueva contraseña"
                                required
                            />
                        </div>

                        {formError && (
                            <div className="auth-error-box" style={{ marginBottom: '15px', color: 'red', textAlign: 'center' }}>
                                {formError}
                            </div>
                        )}

                        {error && (
                            <div className="auth-error-box" style={{ marginBottom: '15px', color: 'red', textAlign: 'center' }}>
                                {error.message}
                            </div>
                        )}

                        {response && !response.ok && (
                            <div className="auth-error-box" style={{ marginBottom: '15px', color: 'red', textAlign: 'center' }}>
                                {response.message}
                            </div>
                        )}

                        <button className="auth-btn" type="submit" disabled={loading}>
                            {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordScreen;
