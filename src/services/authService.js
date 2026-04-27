import ENVIRONMENT from "../config/environment"

export async function login ({email, password, rememberMe}){
    const response_http = await fetch(
        `${ENVIRONMENT.API_URL}/api/auth/login`,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    email, 
                    password,
                    rememberMe
                }
            )
        }
    )

    const response = await response_http.json()
    return response
}


export async function register ({email, password, name}){
    console.log("fetch")
    const response_http = await fetch(
        `${ENVIRONMENT.API_URL}/api/auth/register`,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    email, 
                    password,
                    name
                }
            )
        }
    )
    const response = await response_http.json()
    return response
}

export async function resetPasswordRequest ({email}){
    /* 
    fetch sirve para hacer consultas HTTP
    */
     const response_http = await fetch(
        `${ENVIRONMENT.API_URL}/api/auth/reset-password-request`,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json" //Indica que enviamos un JSON
            },
            body: JSON.stringify( // Convertimos el objeto a JSON
                {
                    email
                }
            )
        }
    )

    const response = await response_http.json()
    return response
}

export async function resetPassword({ reset_password_token, password }) {
    const response_http = await fetch(
        `${ENVIRONMENT.API_URL}/api/auth/reset-password/${reset_password_token}`,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password })
        }
    )

    const response = await response_http.json()
    return response
}

export const verifyTokenAPI = async () => {
    try {
        const response = await fetch(`${ENVIRONMENT.API_URL}/api/auth/verify-token`, {
            method: 'GET',
            credentials: 'include'
        });
        const json = await response.json();
        return json;
    } catch (e) {
        return { ok: false };
    }
}

export const logoutAPI = async () => {
    try {
        await fetch(`${ENVIRONMENT.API_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (e) {
        console.error("Error logging out", e);
    }
}