import { API_HOST, endpoints } from './constants'
import { getLogger } from './util'
import axios from 'axios'

// and handle that directly in the calling code
const logger = getLogger(`API.JS`)

export async function getAuthURL() {
    try {
        const response = await fetch(`${API_HOST}/${endpoints.auth}`, {
            method: 'GET',
            headers: {
                // TODO: do we need this
                'Access-Control-Allow-Origin': '*',
            },
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
        console.log(`error response while creating app folder`, response)
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to create app folder.',
            ...response,
        }
    }
}

/**
 *
 * @param {String} accessToken
 * @param {String} driveFolderId
 * @returns an array of {id,name} - of existing scribbles
 */
export async function fetchScribbles(driveFolderId) {
    const log = logger(`fetchScribbles`)
    try {
        const response = await axios({
            url: `${API_HOST}/${endpoints.scribbles}?driveFolderId=${driveFolderId}`,
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

/**
 *
 * @param {String} accessToken
 * @param {String} scribbleId
 * @returns an array of {mimeType,id,data} - of each css, js and html file
 */
export async function fetchScribble(scribbleId) {
    try {
        const response = await axios({
            url: `${API_HOST}/${endpoints.scribbles}/${scribbleId}`,
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
    driveFolderId,
    { name = '', js = '', css = '', html = '' }
) {
    const response = await axios({
        url: `${API_HOST}/${endpoints.scribbles}`,
        method: 'POST',
        withCredentials: true,
        data: {
            driveFolderId,
            name,
            js,
            css,
            html,
        },
    })

    return response
}

export async function updateScribble({ id: scribbleId, js, css, html }) {
    const log = logger(`updateScribble`)
    try {
        const response = await axios({
            url: `${API_HOST}/${endpoints.scribbles}/${scribbleId}`,
            method: 'PUT',
            withCredentials: true,
            data: {
                scribbleId,
                js,
                css,
                html,
            },
        })
        log(`response`, response)

        return response
    } catch ({ response }) {
        return {
            message:
                response?.data?.message ||
                response?.data ||
                `unable to update scribble with id ${scribbleId}`,
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
