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

export async function redirectToAuth() {
    try {
        const response = await fetch('http://localhost:3000/auth/google', {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        })
        const authObj = await response.json()
        console.log(authObj)
        // get authed
        // navigate(authObj.authUrl);
        window.location.href = authObj.authURL
    } catch (error) {
        console.error(error)
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
