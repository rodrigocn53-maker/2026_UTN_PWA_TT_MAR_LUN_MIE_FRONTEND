import React, { useContext } from 'react'
import { AuthContext } from '../Context/AuthContext'
import { Navigate, Outlet } from 'react-router'

const AuthMiddleware = () => {
    const { isLogged, isLoading } = useContext(AuthContext)

    // Si estamos cargando la validación inicial, no redirigimos todavía
    if (isLoading) return null;

    return (
        <>
            {
                isLogged 
                ? <Outlet/>
                : <Navigate to={'/login'}/>
            }
        </>
    )
}

export default AuthMiddleware