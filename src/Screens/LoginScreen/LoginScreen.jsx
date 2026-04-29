import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import useForm from '../../hooks/useForm'
import { login } from '../../services/authService'
import useRequest from '../../hooks/useRequest'
import { AuthContext } from '../../Context/AuthContext'

const LoginScreen = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const isVerified = searchParams.get('verified') === 'true'

    const {
        sendRequest, 
        error, 
        response, 
        loading
    } = useRequest()

    const LOGIN_FORM_FIELDS = {
        EMAIL: 'email',
        PASSWORD: 'password',
        REMEMBER_ME: 'rememberMe'
    }

    const initialFormState = {
        [LOGIN_FORM_FIELDS.EMAIL]: '',
        [LOGIN_FORM_FIELDS.PASSWORD]: '',
        [LOGIN_FORM_FIELDS.REMEMBER_ME]: false
    }

    const {manageLogin, isLogged, isLoading} = useContext(AuthContext)

    function onLogin (formState){
        sendRequest({
            requestCb: async () => {
                return await login({
                    email: formState[LOGIN_FORM_FIELDS.EMAIL],
                    password: formState[LOGIN_FORM_FIELDS.PASSWORD],
                    rememberMe: formState[LOGIN_FORM_FIELDS.REMEMBER_ME]
                })
            }
        })
    }

    const {
        handleChangeInput, //Funcion de cambio del input, debemos asociarlas a cada input
        onSubmit, //Funcion que asociaremos al evento submit del formario
        formState
    } = useForm({ //Usamos useForm cada vez que tengamos que capurar campos de un formulario (Manejo de formularios)
        initialFormState,  //Estado incial del formulario
        submitFn: onLogin //Funcion que se activa al enviar formulario
    })



    /* 
    La funcion se carga cada vez que cambie response
    */
    useEffect(
        () => {
            //Si la respuesta es correcta
            if(response && response.ok){
                // Pasamos los datos del usuario directamente al context
                manageLogin(response.data.user)
            }
        },
        [response]
    )

    // Redirigir si ya está logueado
    useEffect(() => {
        if (!isLoading && isLogged) {
            navigate('/home');
        }
    }, [isLogged, isLoading, navigate]);

   


    return (
        <div className="auth-page">
            <header style={{ marginBottom: '40px' }}>
                <svg viewBox="0 0 244.8 244.8" width="120" height="120" xmlns="http://www.w3.org/2000/svg"><path d="m89.7 155.1c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#e01e5a"/><path d="m104 155.1c0-15.8-12.8-28.6-28.6-28.6s-28.6 12.8-28.6 28.6 12.8 28.6 28.6 28.6h28.6z" fill="#e01e5a"/><path d="m89.7 89.7c0 15.8-12.8 28.6-28.6 28.6s-28.6-12.8-28.6-28.6 12.8-28.6 28.6-28.6 28.6 12.8 28.6 28.6z" fill="#36c5f0"/><path d="m89.7 104c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#36c5f0"/><path d="m155.1 89.7c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#2eb67d"/><path d="m140.8 89.7c0 15.8 12.8 28.6 28.6 28.6s28.6-12.8 28.6-28.6-12.8-28.6-28.6-28.6h-28.6z" fill="#2eb67d"/><path d="m155.1 155.1c0-15.8 12.8-28.6 28.6-28.6s28.6 12.8 28.6 28.6-12.8 28.6-28.6 28.6-28.6-12.8-28.6-28.6z" fill="#ecb22e"/><path d="m155.1 140.8c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#ecb22e"/></svg>
            </header>
            <div className="auth-header">
                <h1>Iniciar sesión en Slack</h1>
                <p>Te sugerimos usar la <strong>dirección de correo que usas en el trabajo.</strong></p>
            </div>
            <div className="auth-form-card">
                {isVerified && (
                    <div style={{ 
                        backgroundColor: '#e6f4f1', 
                        color: '#007a5a', 
                        padding: '12px', 
                        borderRadius: '4px', 
                        marginBottom: '20px', 
                        textAlign: 'center',
                        fontWeight: '500',
                        border: '1px solid #007a5a'
                    }}>
                        ¡Email verificado con éxito! Ya puedes iniciar sesión.
                    </div>
                )}
                <form onSubmit={onSubmit}>
                    <div className="auth-input-container">
                        <label className="auth-label" htmlFor="email">Email</label>
                        <input 
                            className="auth-input"
                            type="email" 
                            id="email"  
                            name={LOGIN_FORM_FIELDS.EMAIL} 
                            onChange={handleChangeInput}
                            placeholder="nombre@trabajo.com"
                        />
                    </div>
                    <div className="auth-input-container">
                        <label className="auth-label" htmlFor="password">Contraseña</label>
                        <input 
                            className="auth-input"
                            type="password" 
                            id="password" 
                            name={LOGIN_FORM_FIELDS.PASSWORD} 
                            onChange={handleChangeInput}
                            placeholder="Tu contraseña"
                        />
                    </div>
                    <div className="auth-input-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <input 
                            type="checkbox" 
                            id="rememberMe" 
                            name={LOGIN_FORM_FIELDS.REMEMBER_ME}
                            checked={formState[LOGIN_FORM_FIELDS.REMEMBER_ME]}
                            onChange={handleChangeInput}
                            style={{ 
                                cursor: 'pointer', 
                                width: '18px', 
                                height: '18px', 
                                margin: 0 
                            }}
                        />
                        <label className="auth-label" htmlFor="rememberMe" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: 'normal', display: 'inline-block' }}>
                            Mantener sesión iniciada
                        </label>
                    </div>
                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? 'Cargando...' : 'Iniciar sesión'}
                    </button>
                    {response && !response.ok && (
                        <div className="auth-error-box" style={{ marginTop: '15px', color: 'red', textAlign: 'center' }}>
                            {response.message}
                        </div>
                    )}
                </form>
                <div className="auth-links">
                    <span>¿No tienes una cuenta? <Link to="/register">Registrarse</Link></span>
                    <span>¿Olvidaste tu contraseña? <Link to="/reset-password-request">Restablecer</Link></span>
                </div>
            </div>
        </div>
    )
}

export default LoginScreen