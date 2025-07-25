
export const API_HOST =import.meta.env.VITE_API_HOST || 'http://localhost:3000'

export const endpoints = {
    auth: 'api/v1/auth',
    me: 'api/v1/me',
    drive: 'api/v1/drive',
    scribbles: 'api/v1/scribbles'
}

export const IndexedDbName = 'Scribbler'

export const IndexedDbScribbleStore = 'scribbles'