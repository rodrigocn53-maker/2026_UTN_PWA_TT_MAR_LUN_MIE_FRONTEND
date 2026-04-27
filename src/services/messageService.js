import ENVIRONMENT from "../config/environment"

export async function sendMessage(workspace_id, channel_id, content) {
    const response = await fetch(
        `${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/channels/${channel_id}/messages`,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content })
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
