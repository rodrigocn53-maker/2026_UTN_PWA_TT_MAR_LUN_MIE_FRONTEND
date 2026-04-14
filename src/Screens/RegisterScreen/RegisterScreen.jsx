import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { register } from '../../services/authService'

const RegisterScreen = () => {

    const {
        sendRequest,
        response,
        error,
        loading
    } = useRequest()

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
                alert('Te has registrado exitosamente, te enviamos un mail con instrucciones')
                navigate('/login')
            }
        },
        [response]
    )

    return (
        <div className="auth-page">
            <div className="auth-header">
                <h1>Primero, ingresa tu email</h1>
                <p>Te sugerimos usar la dirección de correo electrónico que usas en tu trabajo.</p>
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
                        <label className="auth-label" htmlFor="email">Dirección de correo electrónico</label>
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
                        />
                    </div>
                    <button className="auth-btn" type="submit">Continuar</button>
                </form>

                <div className="auth-links">
                    <span>¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link></span>
                </div>
            </div>
        </div>
    )
}

export default RegisterScreen