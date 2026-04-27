import ENVIRONMENT from "../config/environment"

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${ENVIRONMENT.API_URL}/api/users`, {
            method: 'GET',
            credentials: 'include'
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching users", error);
        return { ok: false, message: "Error al conectar con el servidor" };
    }
}
