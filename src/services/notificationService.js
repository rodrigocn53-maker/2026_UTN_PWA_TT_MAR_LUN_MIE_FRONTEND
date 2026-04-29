import ENVIRONMENT from "../config/environment"

export async function getNotifications() {
    const response = await fetch(`${ENVIRONMENT.API_URL}/api/notifications`, {
        method: 'GET',
        credentials: 'include'
    });
    return await response.json();
}

export async function respondToInvitation(notification_id, action) {
    const response = await fetch(`${ENVIRONMENT.API_URL}/api/notifications/${notification_id}/respond`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ action })
    });
    return await response.json();
}

export async function markNotificationsAsRead() {
    const response = await fetch(`${ENVIRONMENT.API_URL}/api/notifications/mark-read`, {
        method: 'PUT',
        credentials: 'include'
    });
    return await response.json();
}

export async function markSingleNotificationAsRead(notification_id) {
    const response = await fetch(`${ENVIRONMENT.API_URL}/api/notifications/${notification_id}/read`, {
        method: 'PUT',
        credentials: 'include'
    });
    return await response.json();
}
