import { useEffect, useState } from 'react'
import {
    loadAllScribblerSessions,
    storeCurrentScribblerSesion,
} from '../indexedDB.util'
import { getLogger } from '../util'
const logger = getLogger(`useLoadWorker`)
export const useLoadWorker = (isLoggedIn) => {
    const [loadedScribbles, setLoadedScribbles] = useState([])
    const [driveId, setDriveId] = useState(null)

    useEffect(() => {
        const log = logger(`effect`)
        const worker = new Worker(
            new URL('../workers/loadWorker.js', import.meta.url)
        )
        loadAllScribblerSessions().then((scribbles) => {
            if(isLoggedIn){
                worker.postMessage({ type: 'load', scribbles })
            }else{
                setLoadedScribbles(scribbles)
            }
            
        })

        worker.onmessage = async (event) => {
            console.log(`worker is talking back`, event)
            const { driveScribbles, driveId } = event.data

            log(`received driveId`, driveId)
            setDriveId(driveId)
            if (isLoggedIn) {
                await Promise.all(
                    driveScribbles?.map((scribble) =>
                        storeCurrentScribblerSesion(scribble)
                    )
                )
            }

            const scribbles = await loadAllScribblerSessions()
            log(`loading from indexed db..`, scribbles)

            setLoadedScribbles(scribbles)
        }
        return () => worker.terminate()
    }, [isLoggedIn])

    return {
        loadedScribbles,
        driveId,
    }
}
