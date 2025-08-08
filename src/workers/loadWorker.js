import {
    createScribble,
    fetchScribbles,
    updateScribble,
} from '../api'
import { getLogger } from '../util'

const logger = getLogger(`loaderWorker.js`)
onmessage = async function (event) {
    const log = logger(`onmessage`)
    log(`received event: `, event)
    const { scribbles: userScribbles } = event.data
    await Promise.all(
        userScribbles?.map((scribbleObj) =>
            scribbleObj?.sid
                ? updateScribble(scribbleObj)
                : createScribble(scribbleObj)
        )
    )

    const fetchResponse =
        await fetchScribbles()
    const {scribbles} = fetchResponse.data
    log(`fetched scribbles`, scribbles)
    this.postMessage({ event: 'load', scribbles })
}
