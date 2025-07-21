import { useEffect, useState } from 'react'
import { getLogger } from '../util'
const logger = getLogger(`useSyncWorker.js`)
export const useSyncWorker = (isLoggedIn) => {
    const [worker, setWorker] = useState(null)
    const [currentScribbleId, setCurrentScribbleId] = useState(null)
    const syncToDrive = (scribble, driveId) => {
        const log = logger(`syncToDrive`)
        log(`called`)
        worker?.postMessage({ type: 'sync', scribble, driveId })
    }
    useEffect(() => {
        console.log(`import.meta.url`,import.meta.url)
        let worker
        if (isLoggedIn) {
            worker = new Worker(
                new URL('../workers/syncWorker.js', import.meta.url), {type: "module"}
            )
            setWorker(worker)

            worker.onmessage = (event) => {
                console.log(`worker is done saving`, event)
                const {scribble} = event.data
                const {id = null} = scribble
                setCurrentScribbleId(id)
            }
        }

        return () => {
            worker?.terminate()
            setWorker(null)
        }
    }, [isLoggedIn])

    return {
        syncToDrive,
        currentScribbleId,
    }
}
