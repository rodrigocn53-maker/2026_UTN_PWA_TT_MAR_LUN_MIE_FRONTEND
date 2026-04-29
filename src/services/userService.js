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

export const addContact = async (contact_id) => {
    try {
        const response = await fetch(`${ENVIRONMENT.API_URL}/api/users/contacts`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ contact_id })
        });
        return await response.json();
    } catch (error) {
        console.error("Error adding contact", error);
        return { ok: false, message: "Error al conectar con el servidor" };
    }
}

export const removeContact = async (contact_id) => {
    try {
        const response = await fetch(`${ENVIRONMENT.API_URL}/api/users/contacts/${contact_id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        return await response.json();
    } catch (error) {
        console.error("Error removing contact", error);
        return { ok: false, message: "Error al conectar con el servidor" };
    }
}

export const getContacts = async () => {
    try {
        const response = await fetch(`${ENVIRONMENT.API_URL}/api/users/contacts`, {
            method: 'GET',
            credentials: 'include'
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching contacts", error);
        return { ok: false, message: "Error al conectar con el servidor" };
    }
}
