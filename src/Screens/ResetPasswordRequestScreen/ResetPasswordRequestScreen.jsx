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
            <header style={{ marginBottom: '40px' }}>
                <svg viewBox="0 0 244.8 244.8" width="120" height="120" xmlns="http://www.w3.org/2000/svg"><path d="m89.7 155.1c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#e01e5a"/><path d="m104 155.1c0-15.8-12.8-28.6-28.6-28.6s-28.6 12.8-28.6 28.6 12.8 28.6 28.6 28.6h28.6z" fill="#e01e5a"/><path d="m89.7 89.7c0 15.8-12.8 28.6-28.6 28.6s-28.6-12.8-28.6-28.6 12.8-28.6 28.6-28.6 28.6 12.8 28.6 28.6z" fill="#36c5f0"/><path d="m89.7 104c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#36c5f0"/><path d="m155.1 89.7c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#2eb67d"/><path d="m140.8 89.7c0 15.8 12.8 28.6 28.6 28.6s28.6-12.8 28.6-28.6-12.8-28.6-28.6-28.6h-28.6z" fill="#2eb67d"/><path d="m155.1 155.1c0-15.8 12.8-28.6 28.6-28.6s28.6 12.8 28.6 28.6-12.8 28.6-28.6 28.6-28.6-12.8-28.6-28.6z" fill="#ecb22e"/><path d="m155.1 140.8c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#ecb22e"/></svg>
            </header>
            
            <div className="auth-header">
                <h1>Restablecer contraseña</h1>
                <p>Te enviaremos un correo con instrucciones.</p>
            </div>

            <div className="auth-form-card">
                {response && !loading && !error ? (
                    <div className="auth-error-box" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', borderColor: '#c8e6c9' }}>
                        {response.message}
                    </div>
                ) : (
                    <>
                        <form onSubmit={onSubmit}>
                            <div className="auth-input-container">
                                <label className="auth-label" htmlFor="email">Email</label>
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
                                {loading ? 'Cargando...' : 'Enviar solicitud'}
                            </button>
                        </form>
                        <div className="auth-links">
                            <span>¿Recuerdas tu contraseña? <Link to={'/login'}>Iniciar sesión</Link></span>
                            <span>¿No tienes una cuenta? <Link to="/register">Registrarse</Link></span>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ResetPasswordRequestScreen