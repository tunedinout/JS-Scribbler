import { getLogger } from './util'

const logger = getLogger(`indexedDB.util.js`)

export function createJSFileObject({ name: filename, data: code, id }) {
    const blob = new Blob([code], { type: 'text/javascript' })
    // why use an array containing the blob ?
    const fileWithId = new File([blob], filename, { type: 'text/javascript' })
    fileWithId.id = id
    return fileWithId
}
export function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
        reader.readAsDataURL(file)
    })
}

export function openIndexedDBForSessionIO() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('SessionDB', 1)
        request.onerror = () => reject(`error opening sesion db`)
        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {
            const db = event.target.result
            db.createObjectStore('session', {
                keyPath: 'email',
            })
        }
    })
}

export async function deleteSessionStore() {}

export async function storeSessionObject({
    accessToken,
    email,
    name,
    refreshToken
}) {
    // const log = logger(`storeSessionObject func`)
    const sessionObject = { accessToken, email, name, refreshToken }
    // log('StoreSessionObject', sessionObject)
    return new Promise(async (resolve, reject) => {
        try {
            // cclear session data
            await clearExistingSessionObject()
            await saveSessionObject(sessionObject)
            resolve(sessionObject)
        } catch (error) {
            reject(error)
        }
    })
}
/**
 *
 * @param {Object} obj a sesion object {access_token, id_token, expiry_date,refresh_token}
 * @returns {Promise<void>}
 */
export async function updateSessionObject(
    accessToken,
    idToken,
    refreshToken,
    email
) {
    const log = logger(`updateSessionObject`)
    return new Promise(async (resolve, reject) => {
        const db = await openIndexedDBForSessionIO()
        const transaction = db.transaction(['session'], 'readwrite')
        const sessionObjectStore = transaction.objectStore('session')
        const sessionRequest = sessionObjectStore.clear()

        sessionRequest.onerror = (e) => reject(e)
        sessionRequest.onsuccess = () => {
            const res = sessionRequest.result
            log(`Session object saved`, res)
            // resolve(res)
            // do not resolve add the new object
            const transaction = db.transaction(['session'], 'readwrite')
            const sessionObjectStore = transaction.objectStore('session')
            const addRequest = sessionObjectStore.add({
                email,
                accessToken,
                idToken,
                refreshToken,
            })

            addRequest.onsuccess = () => resolve(addRequest.result)
            addRequest.onerror = (err) => reject(err)
        }
    })
}
async function saveSessionObject(obj) {
    const log = logger(`saveSessionObject`)
    return new Promise(async (resolve, reject) => {
        const db = await openIndexedDBForSessionIO()
        const transaction = db.transaction(['session'], 'readwrite')
        const sessionObjectStore = transaction.objectStore('session')
        const sessionRequest = sessionObjectStore.add(obj)

        sessionRequest.onerror = (e) => reject(e)
        sessionRequest.onsuccess = () => {
            const res = sessionRequest.result
            log(`Session object saved`, res)
            resolve(res)
        }
    })
}
export async function clearExistingSessionObject() {
    const log = logger(`clearExistingSessionObject`);
    return new Promise(async (resolve, reject) => {
        const db = await openIndexedDBForSessionIO()
        const transaction = db.transaction(['session'], 'readwrite')
        const sessionObjectStore = transaction.objectStore('session')
        const sessionRequest = sessionObjectStore.clear()
        sessionRequest.onsuccess = () => {
            log(`Existing Session object Delete Success.`)
            resolve()
        };
        sessionRequest.onerror = () => {
            log(`unable to clear existing session object`)
            reject(`unable to clear existing session object.`);
        }
    })
}
export async function getExistingSesionObjects() {
    // const log = logger(`getExistingSesionObjects`)
    return new Promise(async (resolve, reject) => {
        try {
            const db = await openIndexedDBForSessionIO()
            const transaction = db.transaction(['session'], 'readwrite')

            const sessionObjectStore = transaction.objectStore('session')

            // check if existing session object
            const request = sessionObjectStore.getAll()

            request.onerror = (e) => reject(e)
            request.onsuccess = () => {
                // log('getExistingSesionObjects', request.result)
                resolve(request.result)
            }
        } catch (error) {
            console.error(`error fetching sesion object`)
            reject(error)
        }
    })
}



export async function openIndexedDBForScribblerSessions() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('ScribblerSessions', 1)

        request.onerror = () => reject('Error opening file db')
        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {
            // get the prev version of the db
            const db = event.target.result

            // structural change - create object store
            db.createObjectStore('scribblers', {
                keyPath: 'name',
            })
        }
    })
}

// TODO: Tech debt 
// 1. handle transaction complete states 
// 2. alos try to catch error overall ass well 

export async function storeCurrentScribblerSesion(currentSession){
    const log = logger(`storeFile`)
    log(`storing scribbler session with name`, currentSession.name);
    const db = await openIndexedDBForScribblerSessions();
    const transaction = db.transaction(['scribblers'], 'readwrite');
    const scribblersObjectStore =  transaction.objectStore('scribblers');

    const request = scribblersObjectStore.get(currentSession.name);

    return new Promise( (resolve, reject) => {
        request.onsuccess = async (event) => {
            const existingScribblerSession = event.target.result;
            if(existingScribblerSession) {
                try {
                    await scribblersObjectStore.put(currentSession);
                    resolve({scribbler: currentSession});
                } catch (error) {
                    reject(error);
                }
               
            }else{
                try {
                    await scribblersObjectStore.add(currentSession);
                    resolve({scribbler: currentSession});
                } catch (error) {
                    reject(error);
                }
            }
        };
        request.onerror = (err) => reject(err);
    }) 
}

export async function loadScribblerSession(scribblerName) {
    const db = await openIndexedDBForScribblerSessions();
    const transaction = db.transaction(['scribblers'], 'readonly');
    const scribblersObjectStore = transaction.objectStore('scribblers');
    const request = scribblersObjectStore.get(scribblerName);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result);
            } else {
                reject('No session found with the name: ' + scribblerName);
            }
        };
        request.onerror = () => {
            reject('Error retrieving the scribbler session: ' + request.error);
        };
    });
}

export async function loadAllScribblerSessions() {
    const db = await openIndexedDBForScribblerSessions();
    const transaction = db.transaction(['scribblers'], 'readonly');
    const scribblersObjectStore = transaction.objectStore('scribblers');
    const request = scribblersObjectStore.getAll(); // Retrieve all records from the store

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(request.result); // Returns an array of all scribbler sessions
        };
        request.onerror = () => {
            reject('Error retrieving all scribbler sessions: ' + request.error);
        };
    });
}

// Function to clear all scribbler sessions
export async function clearAllScribblerSessions() {
    const db = await openIndexedDBForScribblerSessions();
    const transaction = db.transaction(['scribblers'], 'readwrite');
    const scribblersObjectStore = transaction.objectStore('scribblers');

    return new Promise((resolve, reject) => {
        const request = scribblersObjectStore.clear();

        request.onsuccess = () => {
            console.log('All scribbler sessions cleared successfully.');
            resolve('All scribbler sessions cleared successfully.');
        };

        request.onerror = (err) => {
            console.error('Error clearing scribbler sessions:', err);
            reject('Error clearing scribbler sessions: ' + err);
        };
    });
}



