
export const API_HOST =import.meta.env.VITE_API_HOST || 'http://localhost:3000'
export const isLogEnabled = import.meta.env.VITE_ENV !== 'production'

export const endpoints = {
    auth: 'api/v1/auth',
    me: 'api/v1/me',
    drive: 'api/v1/drive',
    scribbles: 'api/v1/scribbles',
    syncCreate: 'api/v1/sync-create',
    syncUpdate: 'api/v1/sync-update',
    load: 'api/v1/load'
}

export const IndexedDbName = 'Scribbler'

export const IndexedDbScribbleStore = 'scribbles'