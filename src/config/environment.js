const rawApiUrl = import.meta.env.VITE_API_URL || '';
const apiUrl = rawApiUrl.replace(/\/+$/, '');

const ENVIRONMENT = {
    API_URL: apiUrl
}

export default ENVIRONMENT