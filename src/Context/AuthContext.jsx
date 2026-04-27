import { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { verifyTokenAPI, logoutAPI } from "../services/authService";

export const AuthContext = createContext(
    {
        isLogged: false,
        isLoading: true,
        user: null,
        manageLogin: () => {},
        manageLogout: () => {}
    }
)

function AuthContextProvider ({children}){
    const navigate = useNavigate()
    const location = useLocation()
    
    const [isLogged, setIsLogged] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const initAuth = async () => {
            const response = await verifyTokenAPI();
            if (response.ok) {
                setIsLogged(true);
                setUser(response.data.user);
            } else {
                setIsLogged(false);
                setUser(null);
            }
            setIsLoading(false);
        };
        initAuth();
    }, [])

    const manageLogin = async () => {
        // Volvemos a validar con el servidor para obtener los datos del usuario recién logueado
        const response = await verifyTokenAPI();
        if (response.ok) {
            setIsLogged(true);
            setUser(response.data.user);
            navigate('/home');
        }
    }

    async function manageLogout (){
        setIsLoading(true);
        await logoutAPI();
        
        // Reset theme to light on logout
        localStorage.removeItem('theme');
        localStorage.removeItem('accentColor');
        document.documentElement.removeAttribute('data-theme');
        document.documentElement.style.removeProperty('--accent-color');
        document.documentElement.style.removeProperty('--accent-color-dark');
        
        setIsLogged(false);
        setUser(null);
        setIsLoading(false);
        navigate('/login');
    }

    const providerValues = {
        isLogged,
        isLoading,
        user,
        manageLogin,
        manageLogout
    }

    return (
        <AuthContext.Provider value={providerValues}>
            {isLoading && location.pathname !== '/login' && location.pathname !== '/register' ? (
                <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, sans-serif' }}>
                    <h2>Cargando sesión...</h2>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider