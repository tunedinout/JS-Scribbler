import { createScribble, updateScribble } from '../src/api'
import { getLogger } from '../src/util'

const logger = getLogger(`syncWorker.js`)
onmessage = async function (event) {
    const log = logger(`onmessage`)
    log(`received event: `, event)
    const { scribble, driveId } = event.data

    try {
        if (scribble.id) {
            await updateScribble(scribble)
        } else {
            const response= await createScribble(driveId, scribble)
            log(`createResponse`, response)
            const {data: createdScribble} = response
            this.postMessage({ event: 'sync', scribble: createdScribble })
        }
    } catch (error) {
        // EAT
        console.error(`error occurred`, error)
    }
}
