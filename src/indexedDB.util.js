import { IndexedDbName, IndexedDbScribbleStore } from './constants'
import { getLogger } from './util'

const logger = getLogger(`indexedDB.util.js`)

export async function openIndexedDBForScribbles() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(IndexedDbName, 1)

        request.onerror = () => reject('Error opening file db')
        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {
            // get the prev version of the db
            const db = event.target.result

            // structural change - create object store
            db.createObjectStore(IndexedDbScribbleStore, {
                keyPath: 'name',
            })
        }
    })
}

export async function saveScribble(scribble){
    const log = logger(`storeFile`)
    log(`storing scribble with name`, scribble.name);
    const db = await openIndexedDBForScribbles();
    const transaction = db.transaction([IndexedDbScribbleStore], 'readwrite');
    const scribblersObjectStore =  transaction.objectStore(IndexedDbScribbleStore);

    const request = scribblersObjectStore.get(scribble.name);

    return new Promise( (resolve, reject) => {
        request.onsuccess = async (event) => {
            const existingScribblerSession = event.target.result;
            if(existingScribblerSession) {
                try {
                    await scribblersObjectStore.put(scribble);
                    resolve({scribble});
                } catch (error) {
                    reject(error);
                }
               
            }else{
                try {
                    await scribblersObjectStore.add(scribble);
                    resolve({scribble});
                } catch (error) {
                    reject(error);
                }
            }
        };
        request.onerror = (err) => reject(err);
    }) 
}

export async function loadScribble(scribbleName) {
    const db = await openIndexedDBForScribbles();
    const transaction = db.transaction([IndexedDbScribbleStore], 'readonly');
    const scribblersObjectStore = transaction.objectStore(IndexedDbScribbleStore);
    const request = scribblersObjectStore.get(scribbleName);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result);
            } else {
                reject('No scribble found with the name: ' + scribbleName);
            }
        };
        request.onerror = () => {
            reject('Error retrieving the scribble: ' + request.error);
        };
    });
}

export async function loadScribbles() {
    const db = await openIndexedDBForScribbles();
    const transaction = db.transaction([IndexedDbScribbleStore], 'readonly');
    const scribblersObjectStore = transaction.objectStore(IndexedDbScribbleStore);
    const request = scribblersObjectStore.getAll()

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onerror = () => {
            reject('Error retrieving all scribbles: ' + request.error);
        };
    });
}

// Function to clear all scribbles
export async function clearAllScribbles() {
    const log = logger(`clearAllScribbles`)
    const db = await openIndexedDBForScribbles();
    const transaction = db.transaction([IndexedDbScribbleStore], 'readwrite');
    const scribblersObjectStore = transaction.objectStore(IndexedDbScribbleStore);

    return new Promise((resolve, reject) => {
        const request = scribblersObjectStore.clear();

        request.onsuccess = () => {
            log('All scribbles cleared successfully.');
            resolve('All scribbles cleared successfully.');
        };

        request.onerror = (err) => {
            log('Error clearing scribbles:', err);
            reject('Error clearing scribbles: ' + err);
        };
    });
}



