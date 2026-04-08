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
        <div>
            <h1>
                Registrarse
            </h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name={REGISTER_FORM_FIELDS.NAME} onChange={handleChangeInput} value={formState[REGISTER_FORM_FIELDS.NAME]} />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name={REGISTER_FORM_FIELDS.EMAIL} onChange={handleChangeInput} value={formState[REGISTER_FORM_FIELDS.EMAIL]} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name={REGISTER_FORM_FIELDS.PASSWORD} onChange={handleChangeInput} value={formState[REGISTER_FORM_FIELDS.PASSWORD]} />
                </div>
                <button type="submit" >Registrarse</button>
            </form>
            <span>Ya tienes una cuenta? <Link to="/login">Iniciar sesion</Link></span>
        </div>
    )
}

export default RegisterScreen