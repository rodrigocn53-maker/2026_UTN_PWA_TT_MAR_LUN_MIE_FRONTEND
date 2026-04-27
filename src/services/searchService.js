import ENVIRONMENT from "../config/environment"

export async function globalSearch(query) {
    if (!query) return null;
    
    const response = await fetch(
        `${ENVIRONMENT.API_URL}/api/search?q=${encodeURIComponent(query)}`,
        {
            method: 'GET',
            credentials: 'include'
        }
    )
    if (!response.ok) {
        throw new Error('Error al realizar la búsqueda')
    }
    const json = await response.json()
    return json.data
}
