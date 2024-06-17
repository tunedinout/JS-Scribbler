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



export async function openIndexedDBForFiddleSessions() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('FiddleSessions', 1)

        request.onerror = () => reject('Error opening file db')
        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {
            // get the prev version of the db
            const db = event.target.result

            // structural change - create object store
            db.createObjectStore('fiddles', {
                keyPath: 'name',
            })
        }
    })
}

// TODO: Tech debt 
// 1. handle transaction complete states 
// 2. alos try to catch error overall ass well 

export async function storeCurrentFiddleSesion(currentSession){
    const log = logger(`storeFile`)
    log(`storing fiddle session with name`, currentSession.name);
    const db = await openIndexedDBForFiddleSessions();
    const transaction = db.transaction(['fiddles'], 'readwrite');
    const fiddlesObjectStore =  transaction.objectStore('fiddles');

    const request = fiddlesObjectStore.get(currentSession.name);

    return new Promise( (resolve, reject) => {
        request.onsuccess = async (event) => {
            const existingFiddleSession = event.target.result;
            if(existingFiddleSession) {
                try {
                    await fiddlesObjectStore.put(currentSession);
                    resolve({fiddle: currentSession});
                } catch (error) {
                    reject(error);
                }
               
            }else{
                try {
                    await fiddlesObjectStore.add(currentSession);
                    resolve({fiddle: currentSession});
                } catch (error) {
                    reject(error);
                }
            }
        };
        request.onerror = (err) => reject(err);
    }) 
}

export async function loadFiddleSession(fiddleName) {
    const db = await openIndexedDBForFiddleSessions();
    const transaction = db.transaction(['fiddles'], 'readonly');
    const fiddlesObjectStore = transaction.objectStore('fiddles');
    const request = fiddlesObjectStore.get(fiddleName);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result);
            } else {
                reject('No session found with the name: ' + fiddleName);
            }
        };
        request.onerror = () => {
            reject('Error retrieving the fiddle session: ' + request.error);
        };
    });
}

export async function loadAllFiddleSessions() {
    const db = await openIndexedDBForFiddleSessions();
    const transaction = db.transaction(['fiddles'], 'readonly');
    const fiddlesObjectStore = transaction.objectStore('fiddles');
    const request = fiddlesObjectStore.getAll(); // Retrieve all records from the store

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(request.result); // Returns an array of all fiddle sessions
        };
        request.onerror = () => {
            reject('Error retrieving all fiddle sessions: ' + request.error);
        };
    });
}

// Function to clear all fiddle sessions
export async function clearAllFiddleSessions() {
    const db = await openIndexedDBForFiddleSessions();
    const transaction = db.transaction(['fiddles'], 'readwrite');
    const fiddlesObjectStore = transaction.objectStore('fiddles');

    return new Promise((resolve, reject) => {
        const request = fiddlesObjectStore.clear();

        request.onsuccess = () => {
            console.log('All fiddle sessions cleared successfully.');
            resolve('All fiddle sessions cleared successfully.');
        };

        request.onerror = (err) => {
            console.error('Error clearing fiddle sessions:', err);
            reject('Error clearing fiddle sessions: ' + err);
        };
    });
}



