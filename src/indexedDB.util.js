import { getLogger } from './util'

const logger = getLogger(`indexedDB.util.js`)
export function runCode(code) {
    code = `
   function __esFiddle__wrapper(){
    ${code}
   }
   __esFiddle__wrapper();
   `

    try {
        let evalFn = new Function(code)
        evalFn()
    } catch (error) {
        throw error
    }
}
export function compileJavaScript(code) {
    if (!window.Babel) return
    try {
        // Compile JavaScript code
        const compiledCode = window.Babel.transform(code, {
            presets: ['es2017'],
        }).code
        return null
    } catch (error) {
        // Handle compilation errors
        console.log(error)
        return error
    }
}
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

export async function deleteSessionStore() {
    
}

export async function storeSessionObject({
    accessToken,
    email,
    name,
    refreshToken,
    expiryDate,
}) {
    const log = logger(`storeSessionObject func`);
    const sessionObject = { accessToken, email, name, refreshToken, expiryDate }
    log('StoreSessionObject', sessionObject)
    return new Promise(async (resolve, reject) => {
        try {
            // cclear session data
            await clearExistingSessionObject();
            await saveSessionObject(sessionObject);
            resolve(sessionObject);
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
    expiryDate,
    refreshToken,
    email
) {
    const log = logger(`updateSessionObject`);
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
                expiryDate,
                refreshToken,
                type: 'Bearer',
            })

            addRequest.onsuccess = () => resolve(addRequest.result)
            addRequest.onerror = (err) => reject(err)
        }
    })
}
async function saveSessionObject(obj) {
    const log = logger(`saveSessionObject`);
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
async function clearExistingSessionObject() {
    return new Promise(async (resolve, request) => {
        const db = await openIndexedDBForSessionIO();
        const transaction = db.transaction(['session'], 'readwrite');
        const sessionObjectStore = transaction.objectStore('session')
        const sessionRequest = sessionObjectStore.clear();
        sessionRequest.onsuccess = () => {
            resolve();
        }
       
    })
}
export async function getExistingSesionObjects() {
    const log = logger(`getExistingSesionObjects`);
    return new Promise(async (resolve, reject) => {
        try {
            const db = await openIndexedDBForSessionIO()
            const transaction = db.transaction(['session'], 'readwrite')

            const sessionObjectStore = transaction.objectStore('session')

            // check if existing session object
            const request = sessionObjectStore.getAll()

            request.onerror = (e) => reject(e)
            request.onsuccess = () => {
               log('getExistingSesionObjects', request.result)
                resolve(request.result)
            }
        } catch (error) {
            console.error(`error fetching sesion object`)
            reject(error)
        }
    })
}

export function openIndexedDBForFileIO() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('FileDatabase', 1)
        request.onerror = () => reject('Error opening file db')
        request.onsuccess = () => {
            // // console.log(`openIndexedDBForFileIO - success`, request.result);
            resolve(request.result)
        }

        request.onupgradeneeded = (event) => {
            // console.log('onupgraded called')
            const db = event.target.result
            const filesObjectStore = db.createObjectStore('files', {
                keyPath: 'id',
            })
            filesObjectStore.createIndex('timestamp', 'timestamp', {
                unique: false,
            })
        }
    })
}

/**
 * Updates and/Or creates a file object
 * in the indexedDB
 *
 * @param {File} file = {id, name, data, timestamp}, file should have a timestamp
 * @param {string} file.id
 * @param {File} params.data
 */
export async function storeFile(file) {
    const log = logger(`storeFile`);
    log(`storing file with id`, file.id)
    try {
        const {
            id: fileId,
            name: fileName,
            data: fileStringdata,
            timestamp,
        } = file
        const db = await openIndexedDBForFileIO()
        const blob = await fileToDataURL(file)

        const transaction = db.transaction(['files'], 'readwrite')
        const filesObjectStore = transaction.objectStore('files')

        const request = filesObjectStore.get(fileId)
        // always use the request handlers
        // instead of directly using request object

        return new Promise((resolve, reject) => {
            request.onsuccess = async (event) => {
                const existingFile = event.target.result
                // console.log('storeFile - existingFile', existingFile);
                if (request?.result) {
                    // data changed
                    existingFile.data = blob
                    // name changed
                    existingFile.name = fileName
                    // timestamp changed
                    existingFile.timestamp =
                        existingFile.timestamp || new Date().getTime()
                    await filesObjectStore.put(existingFile)
                    resolve({ ...existingFile, data: dataURLToString(blob) })
                } else {
                    // add time stamp
                    const newFileObj = {
                        id: generateUUID(),
                        name: file.name,
                        data: blob,
                        timestamp: file.timestamp || new Date().getTime(),
                    }
                    await filesObjectStore.add(newFileObj)
                    resolve({ ...newFileObj, data: dataURLToString(blob) })
                }
            }
            request.onerror = (event) => {
                console.error('Error retrieving file:', event.target.error)
                reject(null)
            }
        })
    } catch (error) {
        console.error(`Error storing file: `, error)
    }
}

export async function getFileById(id) {
    // const log = logger(`getFileById`);
    try {
        const db = await openIndexedDBForFileIO()
        const transaction = db.transaction(['files'], 'readonly')
        const filesObjectStore = transaction.objectStore('files')
        const request = filesObjectStore.get(id)

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                if (request.result) {
                    // console.log("getFileById - success", request.result);
                    resolve(request.result.data)
                } else {
                    resolve(null)
                }
            }
            request.onerror = (error) => reject(error)
        })
    } catch (error) {
        console.error(`error reading file:`, error)
        return null
    }
}

export async function getAllFiles() {
    try {
        const db = await openIndexedDBForFileIO()
        const transaction = db.transaction(['files'], 'readonly')
        const filesObjectStore = transaction.objectStore('files')
        const request = filesObjectStore.getAll()

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                // console.log("getAllFiles - success", request.result);
                const files = request.result
                resolve(transformFiles(files))
            }
            request.onerror = (error) => reject(error)
        })
    } catch (error) {
        console.error(`error during getting all files: `, error)
        return []
    }
}
/**
 *
 * @returns {File} - with file.data as string
 */
export async function loadLastUsedFile() {
    try {
        const db = await openIndexedDBForFileIO()
        // create a new transaction for
        // readonly access on files
        const transaction = db.transaction(['files'], 'readwrite')

        // use transaction to get the object store
        // for how lond a transaction is valid

        const filesObjectStore = transaction.objectStore('files')
        // console.log(filesObjectStore.index('timestamp'))

        const request = filesObjectStore
            .index('timestamp')
            .openCursor(null, 'prev')
        // return a promise which resolves to the file contents
        return new Promise((resolve, reject) => {
            request.onsuccess = function (event) {
                // console.log(`file has been loaded`);
                const cursor = event.target.result
                // console.log(`cursor in loadLastUsedFile`,cursor )
                if (cursor) {
                    const lastFile = cursor.value
                    // console.log("lastFile", lastFile);
                    // since we are storing name in the id
                    resolve(transformFiles([lastFile][0]))
                } else {
                    // no files were found
                    resolve(null)
                }
            }

            request.onupgradeneeded = (event) => {
                const db = event.target.result
                const filesObjectStore = db.createObjectStore('files', {
                    keyPath: 'id',
                })
                filesObjectStore.createIndex('timestamp', 'timestamp', {
                    unique: false,
                })
            }
        })
    } catch (error) {
        console.error(error)
        return null
    }
}

/**
 *
 * @param {string} id of the file to be deleted
 * @returns deleted file id
 */
export async function removeFile(id) {
    try {
        const db = await openIndexedDBForFileIO()
        const transaction = db.transaction(['files'], 'readwrite')
        const storeObject = transaction.objectStore('files')
        const request = storeObject.delete(id)

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve(id)
            }
            request.onerror = () => {
                reject(null)
            }
        })
    } catch (error) {
        console.error(`Error while deleting file id =  ${id}`, error)
        return null
    }
}

// helper function for util fn
export const dataURLToString = (fileDataAsDataURL) => {
    if (!fileDataAsDataURL) return ''
    const [, base64Data] = fileDataAsDataURL.split(',')
    return atob(base64Data)
}

export function generateUUID() {
    /// 4 on the third section
    // indicates its UUID version 4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        // generate a random number in range 0 - 16
        // Bitwise OR to get the integer part
        const r = (Math.random() * 16) | 0
        // r & ox3 binds r to be 0 - 3 in binary
        // | ox8 - generated num in the range 8 - 11
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

/**
 *
 * @param {File} files : list of file objects {id,name,data,timestamp}
 */
export const getLastUsedFile = (files) =>
    files.reduce((lastFile, currentFile) => {
        const lastFileTimestamp = lastFile.timestamp
        const currentFileTimestamp = lastFile.timestamp
        return lastFileTimestamp > currentFileTimestamp ? lastFile : currentFile
    })

/**
 *
 * @param {File[]} files - An array of file objects
 *                          with data as base64
 */
function transformFiles(files = []) {
    return files.map((file) => {
        // when fetched from db it should be an object containing
        // the data property for all files
        file.data = dataURLToString(file.data)
        return file
    })
}
