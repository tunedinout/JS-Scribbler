import {
    createDriveAppFolder,
    createScribblerSession,
    fetchExistingScribblerSession,
    fetchExistingScribblerSessions,
    updateScribblerSession,
} from '../api'
import { getCodStrings, getLogger } from '../util'

const logger = getLogger(`loaderWorker.js`)
onmessage = async function (event) {
    const log = logger(`onmessage`)
    log(`received event: `, event)
    const { scribbles: userScribbles } = event.data
    const { data } = await createDriveAppFolder()
    const { id: driveId } = data
    log(`driveId`, driveId)
    await Promise.all(
        userScribbles?.map((scribbleObj) =>
            scribbleObj?.id
                ? updateScribblerSession(scribbleObj)
                : createScribblerSession(driveId, scribbleObj)
        )
    )

    const { data: driveScribblesMetadata } =
        await fetchExistingScribblerSessions(driveId)
    log(`driveScribblesMetadata`, driveScribblesMetadata)

    const driveScribbles = await Promise.all(
        driveScribblesMetadata?.map(async ({ id, name }) => {
            try {
                const response = await fetchExistingScribblerSession(id)
                log(`fetchExistingScribblerSession`, response)
                const { data: fileData } = response
                return { id, name, ...getCodStrings(fileData) }
            } catch (error) {
                // EAT
                return null
            }
        })
    )
    log(`driveScribbles`, driveScribbles)

    this.postMessage({ event: 'load', driveScribbles, driveId })
}
