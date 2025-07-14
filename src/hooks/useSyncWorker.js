import { useEffect, useState } from 'react'

export const useSyncWorker = (isLoggedIn) => {
    const [worker, setWorker] = useState(null)
    const syncToDrive = (scribble, driveId) => {
        worker?.postMessage({ type: 'sync', scribble, driveId })
    }
    useEffect(() => {
        let worker
        if (isLoggedIn) {
            worker = new Worker(
                new URL('../workers/syncWorker.js', import.meta.url)
            )
            setWorker(worker)

            worker.onmessage = (event) => {
                console.log(`worker is done saving`, event)
            }
        }

        return () => worker?.terminate()
    }, [isLoggedIn])

    return {
        syncToDrive,
    }
}
