const ENVIRONMENT = {
    API_URL: (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '')
}

export default ENVIRONMENT