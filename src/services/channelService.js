import ENVIRONMENT from "../config/environment"

export async function createChannel(workspace_id, name, description) {
    const response = await fetch(
        `${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/channels`,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, description })
        }
    )
    return await response.json()
}

export async function getChannels(workspace_id) {
    const response = await fetch(
        `${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/channels`,
        {
            method: 'GET',
            credentials: 'include'
        }
    )
    return await response.json()
}

export async function updateChannel(workspace_id, channel_id, name, description) {
    const response = await fetch(
        `${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/channels/${channel_id}`,
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, description })
        }
    )
    return await response.json()
}

export async function deleteChannel(workspace_id, channel_id) {
    const response = await fetch(
        `${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/channels/${channel_id}`,
        {
            method: 'DELETE',
            credentials: 'include'
        }
    )
    return await response.json()
}
