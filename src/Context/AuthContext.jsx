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

    const manageLogin = (userData) => {
        setIsLogged(true);
        setUser(userData);
        navigate('/home');
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

    const verifyAuth = async () => {
        const response = await verifyTokenAPI();
        if (response.ok) {
            setIsLogged(true);
            setUser(response.data.user);
        } else {
            setIsLogged(false);
            setUser(null);
        }
        return response;
    };

    const providerValues = {
        isLogged,
        isLoading,
        user,
        manageLogin,
        manageLogout,
        verifyAuth
    }

    return (
        <AuthContext.Provider value={providerValues}>
            {isLoading && !['/login', '/register', '/'].includes(location.pathname) ? (
                <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, sans-serif', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div className="slack-loading-pulse" style={{ marginBottom: '20px' }}>
                            <svg viewBox="0 0 244.8 244.8" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
                                <path d="m89.7 155.1c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#e01e5a"/>
                                <path d="m104 155.1c0-15.8-12.8-28.6-28.6-28.6s-28.6 12.8-28.6 28.6 12.8 28.6 28.6 28.6h28.6z" fill="#e01e5a"/>
                                <path d="m89.7 89.7c0 15.8-12.8 28.6-28.6 28.6s-28.6-12.8-28.6-28.6 12.8-28.6 28.6-28.6 28.6 12.8 28.6 28.6z" fill="#36c5f0"/>
                                <path d="m89.7 104c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#36c5f0"/>
                                <path d="m155.1 89.7c15.8 0 28.6-12.8 28.6-28.6s-12.8-28.6-28.6-28.6-28.6 12.8-28.6 28.6v28.6z" fill="#2eb67d"/>
                                <path d="m140.8 89.7c0 15.8 12.8 28.6 28.6 28.6s28.6-12.8 28.6-28.6-12.8-28.6-28.6-28.6h-28.6z" fill="#2eb67d"/>
                                <path d="m155.1 155.1c0-15.8 12.8-28.6 28.6-28.6s28.6 12.8 28.6 28.6-12.8 28.6-28.6 28.6-28.6-12.8-28.6-28.6z" fill="#ecb22e"/>
                                <path d="m155.1 140.8c-15.8 0-28.6 12.8-28.6 28.6s12.8 28.6 28.6 28.6 28.6-12.8 28.6-28.6v-28.6z" fill="#ecb22e"/>
                            </svg>
                        </div>
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Cargando sesión...</h2>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider