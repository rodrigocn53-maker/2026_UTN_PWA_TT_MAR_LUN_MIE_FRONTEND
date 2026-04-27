import ENVIRONMENT from "../config/environment";

export async function getWorkspaces (){
    const response_http = await fetch(
        ENVIRONMENT.API_URL + '/api/workspace',
        {
            method: 'GET',
            credentials: 'include'
        }
    )

    const response = await response_http.json()
    return response
}


export async function createWorkspace(params) {
  const response = await fetch(`${ENVIRONMENT.API_URL}/api/workspace`, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({...params, url_image: params.url_image || "https://placehold.co/600x400"}),
  });
  if (!response.ok) {
    throw new Error("Failed to create workspace");
  }
  return response.json();
}

export async function getWorkspaceById(workspace_id) {
    const response = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}`, {
      method: "GET",
      credentials: 'include'
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch workspace");
    }
    return response.json();
  }

export async function updateWorkspace(workspace_id, title, description, url_image) {
    const response = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}`, {
      method: "PUT",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, description, url_image })
    });
    if (!response.ok) {
      throw new Error("Error al actualizar el espacio de trabajo");
    }
    return response.json();
}

export async function deleteWorkspace(workspace_id) {
    const response = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}`, {
      method: "DELETE",
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el espacio de trabajo");
    }
    return response.json();
}

export async function leaveWorkspace(workspace_id) {
    const response = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/leave`, {
      method: "DELETE",
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error("Error al abandonar el espacio de trabajo");
    }
    return response.json();
}

export async function inviteToWorkspace(workspace_id, identifier, role = 'user') {
    const response = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}/member/invite`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ identifier, role })
    });
    return response.json();
}
