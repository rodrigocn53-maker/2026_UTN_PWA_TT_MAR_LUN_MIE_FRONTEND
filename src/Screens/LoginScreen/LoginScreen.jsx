import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import { login } from '../../services/authService'
import useRequest from '../../hooks/useRequest'
import { AuthContext } from '../../context/AuthContext'

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
            }
        },
        [response]
    )

   
    console.log(formState)

    return (
        <div>
            <h1>
                Iniciar sesion
            </h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email"  
                        name={LOGIN_FORM_FIELDS.EMAIL} 
                        onChange={handleChangeInput}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name={LOGIN_FORM_FIELDS.PASSWORD} 
                        onChange={handleChangeInput}
                    />
                </div>
                <button type="submit">Iniciar sesion</button>
            </form>
            <span>No tienes una cuenta? <Link to="/register">Registrarse</Link></span>
            <br/>
            <span>Olvidaste tu contraseña? <Link to="/reset-password-request">Restablecer</Link></span>
        </div>
    )
}

export default LoginScreen