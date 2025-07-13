import {
    createScribblerSession,
    updateScribblerSession,
} from '../api'
import { getLogger } from '../util'

const logger = getLogger(`syncWorker.js`)
onmessage = async function (event) {
    const log = logger(`onmessage`)
    log(`received event: `, event)
    const { scribble, driveId } = event.data

    try {
         if(scribble.id){
        await updateScribblerSession(scribble)
    }else{
        await createScribblerSession(driveId,scribble)
    }
    } catch (error) {
        // EAT
        log(`error occurred`, error)
    }
}
