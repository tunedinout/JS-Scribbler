import { createScribble, updateScribble } from '../api'
import { getLogger } from '../util'
import { Events } from '@src/constants'

const logger = getLogger(`syncWorker.js`)
const channel = new BroadcastChannel('scribbles')
onmessage = async function (event) {
  const log = logger(`onmessage`)
  log(`received event: `, event)
  const { scribble } = event.data

  try {
    let updatedScribble
    if (scribble.sid) {
      const response = await updateScribble(scribble)
      log(`updateResponse`, response)
      updatedScribble = response.data.scribble
    } else {
      const response = await createScribble(scribble)
      log(`createResponse`, response)
      updatedScribble = response.data.scribble
    }
    channel.postMessage({
      type: Events.save,
      payload: { scribble: updatedScribble },
    })
  } catch (error) {
    // EAT
    console.error(`error occurred`, error)
  }
}
