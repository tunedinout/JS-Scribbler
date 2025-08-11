const loadWorker = new Worker(new URL('./loadWorker.js', import.meta.url), {
  type: 'module',
})
export const postMessageLoadWorker = (message) =>
  loadWorker.postMessage(message)

const syncWorker = new Worker(new URL('./syncWorker.js', import.meta.url), {
  type: 'module',
})

export const postMessageSyncWorker = (message) =>
  syncWorker.postMessage(message)
