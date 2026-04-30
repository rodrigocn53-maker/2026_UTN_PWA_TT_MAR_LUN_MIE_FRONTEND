import ENVIRONMENT from "../config/environment"

export const getConversations = async () => {
    try {
        const response = await fetch(`${ENVIRONMENT.API_URL}/api/dm/conversations`, {
            method: 'GET',
            credentials: 'include'
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching conversations", error);
        return { ok: false, message: "Error al conectar con el servidor" };
    }
}

export const getChatHistory = async (contactId) => {
    try {
        const response = await fetch(`${ENVIRONMENT.API_URL}/api/dm/history/${contactId}`, {
            method: 'GET',
            credentials: 'include'
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching history", error);
        return { ok: false, message: "Error al conectar con el servidor" };
    }
}

export const sendDirectMessage = async (receiverId, content, imageFile = null) => {
    try {
        const formData = new FormData();
        if (content) formData.append('content', content);
        if (imageFile) formData.append('image', imageFile);

        const response = await fetch(`${ENVIRONMENT.API_URL}/api/dm/send/${receiverId}`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        return await response.json();
    } catch (error) {
        console.error("Error sending DM", error);
        return { ok: false, message: "Error al conectar con el servidor" };
    }
}
