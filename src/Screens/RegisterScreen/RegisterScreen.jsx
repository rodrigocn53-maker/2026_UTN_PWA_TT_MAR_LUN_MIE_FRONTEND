import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { register } from '../../services/authService'
import Toast from '../../Components/Toast/Toast'
import { useState } from 'react'
import SlackLogo from '../../Components/SlackLogo/SlackLogo'

const RegisterScreen = () => {

    const {
        loading,
        sendRequest,
        response,
        error
    } = useRequest()

    const [toast, setToast] = useState(null)
    const showToast = (message, type = 'success') => {
        setToast({ message, type })
    }

    const REGISTER_FORM_FIELDS = {
        EMAIL: 'email',
        PASSWORD: 'password',
        NAME: 'name'
    }

    /* 
    CONSIGNA: 
    Implementar el useForm para este formulario de registro
    */
    const initialFormState = {
        [REGISTER_FORM_FIELDS.NAME]: '',
        [REGISTER_FORM_FIELDS.EMAIL]: '',
        [REGISTER_FORM_FIELDS.PASSWORD]: ''
    }
    const [passwordError, setPasswordError] = useState('')

    function onRegister(formState) {
        const password = formState[REGISTER_FORM_FIELDS.PASSWORD];
        
        // Validación de contraseña
        if (password.length < 8 || password.length > 16) {
            setPasswordError('Falla: La contraseña debe tener entre 8 y 16 caracteres.');
            return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setPasswordError('Falla: La contraseña debe contener al menos un carácter especial.');
            return;
        }
        
        setPasswordError(''); // Limpiar errores si todo está bien

        try {
            sendRequest(
                {
                    requestCb: () => {
                        return register(
                            {
                                email: formState[REGISTER_FORM_FIELDS.EMAIL],
                                password: formState[REGISTER_FORM_FIELDS.PASSWORD],
                                name: formState[REGISTER_FORM_FIELDS.NAME]
                            }
                        )
                    }
                }
            )
        }
        catch (error) {
            console.log(error)
        }

    }
    const { handleChangeInput, onSubmit, formState } = useForm({ initialFormState, submitFn: onRegister })
    const navigate = useNavigate()
    useEffect(
        () => {
            if (response) {
                if (response.ok) {
                    showToast('Te has registrado exitosamente, te enviamos un mail con instrucciones')
                    setTimeout(() => navigate('/login'), 2000)
                } else {
                    showToast(response.message || 'Error al registrarse', 'error')
                }
            }
        },
        [response]
    )

    useEffect(
        () => {
            if (error) {
                showToast('Error de conexión con el servidor', 'error')
            }
        },
        [error]
    )

    return (
        <div className="auth-page">
            <header style={{ marginBottom: '40px' }}>
                <SlackLogo width="120px" height="120px" />
            </header>
            <div className="auth-header">
                <h1>Únete a Slack</h1>
                <p>Te sugerimos usar la <strong>dirección de correo que usas en el trabajo.</strong></p>
            </div>
            <div className="auth-form-card">
                <form onSubmit={onSubmit}>
                    <div className="auth-input-container">
                        <label className="auth-label" htmlFor="name">Nombre</label>
                        <input 
                            className="auth-input"
                            type="text" 
                            id="name" 
                            name={REGISTER_FORM_FIELDS.NAME} 
                            onChange={handleChangeInput} 
                            value={formState[REGISTER_FORM_FIELDS.NAME]} 
                            placeholder="Tu nombre completo"
                        />
                    </div>
                    <div className="auth-input-container">
                        <label className="auth-label" htmlFor="email">Email</label>
                        <input 
                            className="auth-input"
                            type="email" 
                            id="email" 
                            name={REGISTER_FORM_FIELDS.EMAIL} 
                            onChange={handleChangeInput} 
                            value={formState[REGISTER_FORM_FIELDS.EMAIL]} 
                            placeholder="nombre@trabajo.com"
                        />
                    </div>
                    <div className="auth-input-container">
                        <label className="auth-label" htmlFor="password">Contraseña</label>
                        <input 
                            className="auth-input"
                            type="password" 
                            id="password" 
                            name={REGISTER_FORM_FIELDS.PASSWORD} 
                            onChange={handleChangeInput} 
                            value={formState[REGISTER_FORM_FIELDS.PASSWORD]} 
                            placeholder="Crea una contraseña"
                        />
                        <p style={{ fontSize: '12px', color: 'var(--text-soft)', marginTop: '6px' }}>
                            Mínimo 8-16 caracteres, incluyendo al menos un carácter especial (ej: @, #, $).
                        </p>
                        {passwordError && <div style={{ color: '#e01e5a', fontSize: '12px', marginTop: '6px', fontWeight: 'bold' }}>{passwordError}</div>}
                    </div>
                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>
                <div className="auth-links">
                    <span>¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link></span>
                </div>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    )
}

export default RegisterScreen