import { createContext, useState } from "react";
import { useNavigate } from "react-router";

export const AuthContext = createContext(
    {
        isLogged: false,
        manageLogin: (auth_token) => {}
    }
)

export const LOCALSTORAGE_TOKEN_KEY = 'auth_token_slack'

/* 
Va a manejar el estado de sesion del usuario
Es un contexto global
    Esto es asi porque queremos desde cualquier lugar de la aplicacion saber si el usuario esta o no logueado
*/
function AuthContextProvider ({children}){
    const navigate = useNavigate()
    const [isLogged, setIsLogged] = useState(
        Boolean(
            localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)
        )
    )

    function manageLogin (auth_token){
        //Guardar el auth_token en el localstorage
        localStorage.setItem('auth_token_slack', auth_token)
        setIsLogged(true)
        //Redirecciono a home
        navigate('/home')
    }

    const providerValues = {
        isLogged,
        manageLogin
    }

    return (
        <AuthContext.Provider value={providerValues}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider