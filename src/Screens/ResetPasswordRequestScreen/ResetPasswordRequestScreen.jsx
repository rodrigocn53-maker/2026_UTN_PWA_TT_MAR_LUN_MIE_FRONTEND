import React, { useEffect } from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { resetPasswordRequest } from '../../services/authService'

const ResetPasswordRequestScreen = () => {

  const {
    sendRequest,
    response,
    error,
    loading
  } = useRequest()

  /* Hacer un formulario donde se solcite el email, este email sera usado para saber a quien debemos mandar el mail para restablecer la contraseña */
  const FORM_FIELDS = {
    EMAIL: 'email'
  }
  const initalFormState = {
    [FORM_FIELDS.EMAIL]: ''
  }

  function submitResetPasswordRequest() {
    sendRequest(
      {
        requestCb: async () => {
          return await resetPasswordRequest({ email: formState[FORM_FIELDS.EMAIL] })
        }
      }
    )
  }

  const {
    handleChangeInput,
    onSubmit,
    formState,
    resetForm
  } = useForm({
    initialFormState: initalFormState,
    submitFn: submitResetPasswordRequest
  })
  console.log(formState)



    return (
        <div className="auth-page">
            <div className="auth-header">
                <h1>Restablecer contraseña</h1>
                <p>Para restablecer tu contraseña, introduce tu dirección de correo electrónico a continuación.</p>
            </div>

            <div className="auth-form-card">
                {
                    response && !loading && !error ?
                    <div className="auth-error-box" style={{backgroundColor: '#e6f2ed', color: '#007a5a', borderColor: '#cbe2d9'}}>
                        {response.message}
                    </div>
                    :
                    <>
                        <form onSubmit={onSubmit}>
                            <div className="auth-input-container">
                                <label className="auth-label" htmlFor="email">Dirección de correo electrónico</label>
                                <input
                                    className="auth-input"
                                    type="email"
                                    name={FORM_FIELDS.EMAIL}
                                    id="email"
                                    onChange={handleChangeInput}
                                    value={formState[FORM_FIELDS.EMAIL]}
                                    placeholder="nombre@trabajo.com"
                                />
                            </div>
                            <button className="auth-btn" type='submit' disabled={loading}>
                                {loading ? 'Cargando...' : 'Obtener enlace de restablecimiento'}
                            </button>
                        </form>
                        
                        <div className="auth-links">
                            <span>¿Recuerdas tu contraseña? <Link to={'/login'}>Iniciar sesión</Link></span>
                            <span>¿No tienes una cuenta? <Link to="/register">Crear una cuenta</Link></span>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default ResetPasswordRequestScreen