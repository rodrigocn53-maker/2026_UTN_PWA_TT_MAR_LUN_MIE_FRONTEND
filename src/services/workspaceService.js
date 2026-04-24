import ENVIRONMENT from "../config/environment";
import { LOCALSTORAGE_TOKEN_KEY } from "../Context/AuthContext";

export async function getWorkspaces (){
    const response_http = await fetch(
        ENVIRONMENT.API_URL + '/api/workspace',
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)
            }
        }
    )

    const response = await response_http.json()
    return response
}


export async function createWorkspace(params) {
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
  const response = await fetch(`${ENVIRONMENT.API_URL}/api/workspace`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({...params, url_image: params.url_image || "https://placehold.co/600x400"}),
  });
  if (!response.ok) {
    throw new Error("Failed to create workspace");
  }
  return response.json();
}

export async function getWorkspaceById(workspace_id) {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
    const response = await fetch(`${ENVIRONMENT.API_URL}/api/workspace/${workspace_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch workspace");
    }
    return response.json();
  }
