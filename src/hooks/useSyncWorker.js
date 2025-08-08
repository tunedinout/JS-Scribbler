import { useCallback, useEffect, useState } from 'react'
import { getLogger } from '../util'
import { saveScribble } from '@src/indexedDB.util'
const logger = getLogger(`useSyncWorker.js`)
export const useSyncWorker = (isLoggedIn,setCurrentScribble) => {
    const [worker, setWorker] = useState(null)
    const syncToDrive = useCallback((scribble) => {
        const log = logger(`syncToDrive`)
        log(`called`)
        worker?.postMessage({ type: 'sync', scribble })
    },[worker])
    useEffect(() => {
        const log = logger(`useSyncWorker - effect`)
        let worker
        if (isLoggedIn) {
            worker = new Worker(
                new URL('../workers/syncWorker.js', import.meta.url), {type: "module"}
            )
            setWorker(worker)

            worker.onmessage = async (event) => {
                log(`worker is done saving`, event)
                const {scribble} = event.data
                // save change to indexedDB
                await saveScribble(scribble)
                setCurrentScribble(scribble)
            }
        }

        return () => {
            worker?.terminate()
            setWorker(null)
        }
    }, [isLoggedIn, setCurrentScribble])

    return {
        syncToDrive
    }
}
