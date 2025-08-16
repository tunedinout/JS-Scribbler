import { loadScribbles, saveScribble } from '@src/indexedDB.util'
import { load } from '../api'
import { getLogger } from '../util'
import { Events } from '@src/constants'
const channel = new BroadcastChannel('scribbles')
const logger = getLogger(`loaderWorker.js`)
onmessage = async function (event) {
  const log = logger(`onmessage`)
  log(`received event: `, event)
  const { type, isLoggedIn } = event.data
  const userScribbles = await loadScribbles()
  log(`scribbles from idb`, userScribbles)
  if (type === Events.load) {
    if (isLoggedIn) {
      // bulk sync scribbles with server in a single api call
      const initLoadResponse = await load(userScribbles)
      const { scribbles: syncedScribbles } = initLoadResponse.data
      for (const syncedScribble of syncedScribbles) {
        await saveScribble(syncedScribble)
      }
      const orderedScribbles = await loadScribbles()
      // consumer of this message must load all the scribbles from IDB
      channel.postMessage({
        type: Events.sync,
        payload: { scribbles: orderedScribbles },
      })
    } else {
      channel.postMessage({
        type: Events.sync,
        payload: { scribbles: userScribbles },
      })
    }
  }
}
