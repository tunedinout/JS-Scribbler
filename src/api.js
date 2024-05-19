// NOTE: GENERAL format of error response handling
// will help us by checking the res.message for errors

import { getLogger } from "./util"

// and handle that directly in the calling code
const logger = getLogger(`API.JS`)
export async function sendAuthCode(authCode) {
    try {
        const response = await fetch('http://localhost:3000/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ authCode }),
        })
        const res = await response.json()
        console.log(res)
        return res
    } catch ({ response }) {
        // TODO: carefully evaluate why we do this
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to send access token',
        }
    }
}

export async function getAuthURL() {
    try {
        const response = await fetch('http://localhost:3000/auth/google', {
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
        }
    }
}

export async function refreshAccessToken(existingRefreshToken) {
    try {
        const response = await fetch(
            `http://localhost:3000/auth/google/refresh`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: existingRefreshToken,
                }),
            }
        )
        const jsonResponse = await response.json()
        const { accessToken, refreshToken, expiryDate, name, email } =
            jsonResponse
        return {
            accessToken,
            refreshToken,
            expiryDate,
            name,
            email,
        }
    } catch ({ response }) {
        // TODO: carefully evaluate why we do this
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to refresh accessToken',
        }
    }
}

/**
 *
 * @param {String} accessToken
 * @returns {id} OR {message} - if error response received
 */
export async function createDriveAppFolder(accessToken) {
    try {
        const response = await fetch(
            `http://localhost:3000/drive/create/folder`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        ).then((res) => res.json())
        return response
    } catch ({ response }) {
        // TODO: carefully evaluate why we do this
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to create app folder.',
        }
    }
}

/**
 *
 * @param {String} accessToken
 * @param {String} esfiddleFolderId
 * @returns an array of {id,name} - of existing fiddle sessions
 */
export async function fetchExistingFiddleSessions(
    accessToken,
    esfiddleFolderId
) {
    try {
        const response = await fetch(
            `http://localhost:3000/drive/folder/sessions?esfiddleFolderId=${esfiddleFolderId}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        ).then((res) => res.json())
        return response
    } catch ({ response }) {
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to get existing fiddle sessions.',
        }
    }
}

/**
 *
 * @param {String} accessToken
 * @param {String} esfiddleFolderId
 * @returns an array of {mimeType,id,data} - of each css, js and html file
 */
export async function fetchExistingFiddleSession(accessToken, fiddleSessionId) {
    try {
        const response = await fetch(
            `http://localhost:3000/drive/folder/sessions/${fiddleSessionId}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        ).then((res) => res.json())
        return response
    } catch ({ response }) {
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to get existing fiddle sessions.',
        }
    }
}

/**
 *
 * @param {String} accessToken
 * @param {String} esfiddleFolderId
 * @returns response
 */
export async function createFiddleSession(
    accessToken,
    esfiddleFolderId,
    fiddleSessionName,
    js = '',
    css = '',
    html = ''
) {
    try {
        const response = await fetch(
            `http://localhost:3000/drive/folder/session`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    fiddleSessionName,
                    esfiddleFolderId,
                    js,
                    css,
                    html,
                }),
            }
        ).then(res => res.json());

        return response;
    } catch (error) {
        // always do it like this
        // because it can report other runtime errors to the dev as well
        console.error(error);
        throw error;
    }
}

/**
 *
 * @param {String} accessToken
 * @param {String} fiddleSessionName - name of current fiddle session
 * @param {String} js - new contents of the index.js file
 * @param {*} css  - new contents of the index.css file
 * @param {*} html  - new contents of the index.html file
 * @returns
 */
export async function updateFiddleSession(
    accessToken,
    fiddleSessionId,
    js = '',
    css = '',
    html = ''
) {
    const log = logger(`updateFiddleSession`);
    try {
        const response = await fetch(
            `http://localhost:3000/drive/folder/session/${fiddleSessionId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    fiddleSessionId,
                    js,
                    css,
                    html,
                }),
            }
        );
        log(`response`, response);

        return response
    } catch ({ response }) {
        return {
            message:
                response?.data?.message ||
                response?.data ||
                `unable to update fiddle session with id ${fiddleSessionId}`,
        }
    }
}
