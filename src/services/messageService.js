import ENVIRONMENT from "../config/environment"

export async function sendMessage(workspace_id, channel_id, content, file = null) {
    const formData = new FormData();
    formData.append('content', content);
    if (file) {
        formData.append('file', file);
    }

    const response = await fetch(
        `${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/channels/${channel_id}/messages`,
        {
            method: 'POST',
            credentials: 'include',
            // El navegador setea automáticamente el Content-Type para FormData
            body: formData
        }
    )
    if (!response.ok) {
        throw new Error('Error al enviar el mensaje')
    }
    return await response.json()
}

export async function getMessages(workspace_id, channel_id) {
    const response = await fetch(
        `${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/channels/${channel_id}/messages`,
        {
            method: 'GET',
            credentials: 'include'
        }
    )
    if (!response.ok) {
        throw new Error('Error al obtener los mensajes')
    }
    return await response.json()
}
export async function updateMessage(workspace_id, channel_id, message_id, content) {
    const response = await fetch(
        `${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/channels/${channel_id}/messages/${message_id}`,
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content })
        }
    )
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el mensaje')
    }
    return data
}

export async function deleteMessage(workspace_id, channel_id, message_id) {
    const response = await fetch(
        `${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/channels/${channel_id}/messages/${message_id}`,
        {
            method: 'DELETE',
            credentials: 'include'
        }
    )
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar el mensaje')
    }
    return data
}
