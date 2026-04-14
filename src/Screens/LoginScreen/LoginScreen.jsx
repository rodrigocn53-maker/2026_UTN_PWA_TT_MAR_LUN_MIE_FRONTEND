import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import { login } from '../../services/authService'
import useRequest from '../../hooks/useRequest'
import { AuthContext } from '../../Context/AuthContext.jsx'

const LoginScreen = () => {

    const {
        sendRequest, 
        error, 
        response, 
        loading
    } = useRequest()

    const LOGIN_FORM_FIELDS = {
        EMAIL: 'email',
        PASSWORD: 'password'
    }

    const initialFormState = {
        [LOGIN_FORM_FIELDS.EMAIL]: '',
        [LOGIN_FORM_FIELDS.PASSWORD]: ''
    }

    const {manageLogin} = useContext(AuthContext)

    function onLogin (formState){
        sendRequest({
            requestCb: async () => {
                return await login({
                    email: formState[LOGIN_FORM_FIELDS.EMAIL],
                    password: formState[LOGIN_FORM_FIELDS.PASSWORD]
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

    console.log(
        {
            response,
            error,
            loading
        }
    )

    /* 
    La funcion se carga cada vez que cambie response
    */
    useEffect(
        () => {
            //Si la respuesta es correcta
            if(response && response.ok){
                //Guardo el token en mi contexto
                manageLogin(response.data.auth_token)
            } else if (response && !response.ok && response.message) {
                alert(response.message)
            }
        },
        [response]
    )

   
    return (
        <div className="auth-page">
            <div className="auth-header">
                <h1>Iniciar sesión</h1>
                <p>Te sugerimos usar la dirección de correo electrónico que usas en tu trabajo.</p>
            </div>
            
            <div className="auth-form-card">
                <form onSubmit={onSubmit}>
                    <div className="auth-input-container">
                        <label className="auth-label" htmlFor="email">Dirección de correo electrónico</label>
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
                    <button className="auth-btn" type="submit">Iniciar sesión con Correo</button>
                </form>

                <div className="auth-links">
                    <span>¿No tienes una cuenta? <Link to="/register">Crear una cuenta</Link></span>
                    <span>¿Olvidaste tu contraseña? <Link to="/reset-password-request">Restablecer la contraseña</Link></span>
                </div>
            </div>
        </div>
    )
}

export default LoginScreen