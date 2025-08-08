import { useEffect, useState } from 'react'
import {
    loadScribbles,
    saveScribble,
} from '@src/indexedDB.util'
import { getLogger } from '@src/util'
const logger = getLogger(`useLoadWorker`)
export const useLoadWorker = (isLoggedIn) => {
    const [loadedScribbles, setLoadedScribbles] = useState([])

    useEffect(() => {
        const log = logger(`effect`, import.meta.url)
        const worker = new Worker(
            new URL('../workers/loadWorker.js', import.meta.url), {type: "module"}
        )
        loadScribbles().then((scribbles) => {
            if(isLoggedIn){
                log(`worker shoud post message`)
                worker.postMessage({ type: 'load', scribbles })
            }else{
                setLoadedScribbles(scribbles)
            }
            
        })

        worker.onmessage = async (event) => {
            log(`worker is talking back`, event)
            const { scribbles } = event.data
            if (isLoggedIn) {
                await Promise.all(
                    scribbles?.map((scribble) =>
                        saveScribble(scribble)
                    )
                )
            }

            const scribblesOffline = await loadScribbles()
            log(`loading from indexed db..`, scribblesOffline)

            setLoadedScribbles(scribblesOffline)
            
        }
        return () => worker.terminate()
    }, [isLoggedIn])

    return {
        loadedScribbles,
    }
}
