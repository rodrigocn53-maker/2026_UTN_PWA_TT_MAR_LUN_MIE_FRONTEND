import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { register } from '../../services/authService'
import Toast from '../../Components/Toast/Toast'
import { useState } from 'react'

const RegisterScreen = () => {

    const {
        loading
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
    function onRegister(formState) {
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
    useEffect (
        () => {
            if(response && response.ok){
                showToast('Te has registrado exitosamente, te enviamos un mail con instrucciones')
                setTimeout(() => navigate('/login'), 2000)
            }
        },
        [response]
    )

    return (
        <div className="auth-page">
            <header style={{ marginBottom: '40px' }}>
                <svg viewBox="0 0 244.8 244.8" width="120" height="120" xmlns="http://www.w3.org/2000/svg"><path d="m89.7 155.1c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#e01e5a"/><path d="m104 155.1c0-15.8-12.8-28.6-28.6-28.6s-28.6 12.8-28.6 28.6 12.8 28.6 28.6 28.6h28.6z" fill="#e01e5a"/><path d="m89.7 89.7c0 15.8-12.8 28.6-28.6 28.6s-28.6-12.8-28.6-28.6 12.8-28.6 28.6-28.6 28.6 12.8 28.6 28.6z" fill="#36c5f0"/><path d="m89.7 104c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#36c5f0"/><path d="m155.1 89.7c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#2eb67d"/><path d="m140.8 89.7c0 15.8 12.8 28.6 28.6 28.6s28.6-12.8 28.6-28.6-12.8-28.6-28.6-28.6h-28.6z" fill="#2eb67d"/><path d="m155.1 155.1c0-15.8 12.8-28.6 28.6-28.6s28.6 12.8 28.6 28.6-12.8 28.6-28.6 28.6-28.6-12.8-28.6-28.6z" fill="#ecb22e"/><path d="m155.1 140.8c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#ecb22e"/></svg>
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