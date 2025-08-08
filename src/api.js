import { API_HOST, endpoints } from './constants'
import { getLogger } from './util'
import axios from 'axios'

// and handle that directly in the calling code
const logger = getLogger(`API.JS`)

export async function getAuthURL() {
    try {
        const response = await fetch(`${API_HOST}/${endpoints.auth}`, {
            method: 'GET',
        })
        const authObj = await response.json()
        return authObj
    } catch ({ response }) {
        // TODO: carefully evaluate why we do this
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to get AUTH url',
            ...response,
        }
    }
}

export async function createDriveFolder() {
    // const log = logger(`createDriveFolder`)
    try {
        const response = await axios({
            url: `${API_HOST}/${endpoints.drive}`,
            method: 'POST',
            withCredentials: true,
        })

        return response
    } catch ({ response }) {
        // TODO: carefully evaluate why we do this
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to create app folder.',
            ...response,
        }
    }
}


export async function fetchScribbles() {
    const log = logger(`fetchScribbles`)
    try {
        const response = await axios({
            url: `${API_HOST}/${endpoints.load}`,
            method: 'GET',
            withCredentials: true,
        })
        return response
    } catch ({ response }) {
        log(`response`, response)
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to get existing scribbles.',
            ...response,
        }
    }
}


export async function fetchScribble(scribbleId) {
    try {
        const response = await axios({
            url: `${API_HOST}/${endpoints.load}/${scribbleId}`,
            method: 'GET',
            withCredentials: true,
        })
        return response
    } catch ({ response }) {
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to get existing scribbles.',
            ...response,
        }
    }
}

export async function createScribble(
    { name = '', js = '', css = '', html = '' }
) {
    const response = await axios({
        url: `${API_HOST}/${endpoints.syncCreate}`,
        method: 'POST',
        withCredentials: true,
        data: {
            scribble: {
                name,
                js,
                css,
                html,
            }
        },
    })

    return response
}

export async function updateScribble({sid,name,js,css,html,version}) {
    const log = logger(`updateScribble`)
    try {
        const response = await axios({
            url: `${API_HOST}/${endpoints.syncUpdate}`,
            method: 'PUT',
            withCredentials: true,
            data: {
               scribble: {
                    sid,
                    name,
                    js,
                    css,
                    html,
                    version
               }
            },
        })
        log(`response`, response)

        return response
    } catch ({ response }) {
        return {
            message:
                response?.data?.message ||
                response?.data ||
                `unable to update scribble with id ${sid}`,
            ...response,
        }
    }
}

export async function fetchMe(signal) {
    const response = axios.get(`${API_HOST}/${endpoints.me}`, {
        signal,
        withCredentials: true,
    })
    return response
}


export async function sync(scribbles) {
    try {
        // eslint-disable-next-line no-unused-vars
        const response = await axios( {
            url: `${API_HOST}/${endpoints.sync}`,
            method: 'POST',
            data: {
                scribbles,
            },
            withCredentials: true
        })
    } catch ({response}) {
         return {
            message:
                response?.data?.message ||
                response?.data ||
                `unable to sync`,
            ...response,
        }
    }
}