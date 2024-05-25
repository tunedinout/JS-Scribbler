import DOMPurify from 'dompurify'
import { getAuthURL } from './api'
import { getExistingSesionObjects } from './indexedDB.util'
const logger = getLogger(`util.js`)
export function getLogger() {
    // ideally excul
    let excludedPrefixes = []
    let globalPrefixes
    if (Array.isArray(arguments[0])) {
        excludedPrefixes = arguments.splice(1)
        globalPrefixes = [...arguments]
    } else {
        globalPrefixes = [...arguments]
    }

    return function (...localPrefixes) {
        let allprefixes = [...globalPrefixes, ...localPrefixes].filter(
            (prefix) => !excludedPrefixes.includes(prefix)
        )
        allprefixes = allprefixes.filter((prefix) => Boolean(prefix))
        return function (...args) {
            console.log(
                '\x1b[36m',
                `${[...allprefixes].map((pref) => `[ ${pref} ]`).join(' ')}`,
                '\x1b[0m',
                ...args
            )
        }
    }
}

export function debounce(func = () => {}, wait = 0, isImmediate = false) {
    let timeout // captures ID of the timeout fn
    const debouncedFunction = function () {
        const context = this,
            args = arguments
        const later = function () {
            // when the later executes
            // empty timeout function

            // clear timeout so a new timeout fn can be set
            timeout = null
            if (!isImmediate)
                // execute this function
                func.apply(context, args)
        }

        // if timeout has not expired
        // and isImmediate is true
        // call it now
        const callNow = isImmediate && !timeout
        // clear the previous timeout
        clearTimeout(timeout)

        // set to exectue later
        // setTimout id to clear
        timeout = setTimeout(later, wait)
        // either the function executes at the head end of timeout i.e immediate
        // or it runs at the tail end of the timeout i.e later

        if (callNow)
            // execute now
            func.apply(context, args)
    }

    // give clean up function for react effects
    // without this whenever dependencies
    // of the given callback (func) changes or mount/unmout happens
    // the stale debounced function will
    // also be called
    debouncedFunction.cleanUp = function () {
        clearTimeout(timeout)
        timeout = null
    }
    return debouncedFunction
}

export function sanitizeHTML(inputHTML = '') {
    const log = logger(`sanitizeHTML`)
    if (!inputHTML) return ''

    const sanitizedHTML = DOMPurify.sanitize(inputHTML)
    log(`Sanitized HTML`, sanitizeHTML)
    return sanitizedHTML
}

const isExpired = (expiryDate) => {
    const log = logger(`isExpired`)
    const expiryDateTime = new Date(expiryDate).getTime()
    log(`expiryDateTime`, expiryDateTime)
    const currentTime = Date.now()
    log(`currentTime`, currentTime)
    log(`result of compare`, expiryDateTime < currentTime)
    return expiryDateTime < currentTime
}
/**
 *  if the accessToken is expired it is refreshed, if accessToken or refreshtoken
 *  is not defined user is redirect for authentication via oauth2.0
 * @returns {
 *              accessToken,
 *              expiryDate,
 *              refreshToken,
 *              email,
 *              name
 *           }
 */
export async function getLoginDetails() {
    const log = logger(`getLoginDetails`)
    const result = await getExistingSesionObjects()
    if (result.length) {
        log('handleSession - result', result)
        // session obj at 0
        const {
            accessToken,
            refreshToken: existingRefreshToken,
            expiryDate: existingTokenExpiration,
        } = result[0]

        if (!(accessToken || existingRefreshToken)) {
            log(`access token / refresh token not found`)
            // await redirectToAuth()
            return null
        }
        return result[0]
    } else {
        return null
    }
}

export async function redirectToAuth() {
    const { authURL } = await getAuthURL()
    window.location.href = authURL
}

/**
 * 
 * @param {Array} arrayOfFileData - [{ id, mimeType, data}] - contains 
 * 3 such object one for javscript, one for css and one for html
 */
export function getCodStrings(arrayOfFileData) {
    const codeObj = arrayOfFileData?.reduce(
        (acc, current) => {
            const { mimeType = '', data = '' } = current
            if (mimeType.includes('css')) {
                acc.css = data
            } else if (
                mimeType.includes('javascript')
            ) {
                acc.js = data
            } else if (mimeType.includes('html')) {
                acc.html = data
            }
            return acc
        },
        {}
    )
    return codeObj;
}
