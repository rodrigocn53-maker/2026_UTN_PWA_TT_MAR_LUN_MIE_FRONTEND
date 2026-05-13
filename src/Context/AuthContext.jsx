import { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { verifyTokenAPI, logoutAPI } from "../services/authService";
import SlackLogo from "../Components/SlackLogo/SlackLogo";

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
                            <SlackLogo width="80px" height="80px" />
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