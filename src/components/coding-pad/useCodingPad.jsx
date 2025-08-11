import { loadScribble, saveScribble } from '@src/indexedDB.util'
import { debounce } from '@src/util'
import { postMessageSyncWorker } from '@src/workers/api-workers'
import { useCallback, useEffect, useState } from 'react'
// import { getLogger } from "@src/util"

// const logger = getLogger(`useCodingPad`)
function useCodingPad(currentEditDetails) {
  const { name } = currentEditDetails
  const [currentScribble, setCurrentScribble] = useState(null)

  useEffect(() => {
    loadScribble(name).then((scrible) => setCurrentScribble(scrible))
  }, [name])
  const debouncedUpdate = useCallback(
    (scribble) => debounce(postMessageSyncWorker({ scribble })),

    [],
  )
  const onCodeChange = async (currentScribble) => {
    setCurrentScribble(currentScribble)
    const resp = await saveScribble(currentScribble)
    if (resp.sucess) {
      debouncedUpdate(currentScribble)
    } else {
      // error occurred
    }
  }
  return {
    currentScribble,
    onCodeChange,
  }
}

export default useCodingPad
