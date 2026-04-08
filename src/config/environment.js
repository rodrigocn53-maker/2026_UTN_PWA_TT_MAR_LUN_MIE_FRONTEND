const rawApiUrl = import.meta.env.VITE_API_URL || '';
const apiUrl = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

const ENVIRONMENT = {
    API_URL: apiUrl
}

export default ENVIRONMENT