import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@auth/AuthProvider"
import { useLoadWorker } from "@hooks/useLoadWorker"
import { useSyncWorker } from "@hooks/useSyncWorker"
import { saveScribble } from "@src/indexedDB.util"
import { debounce, getLogger } from "@src/util"

const logger = getLogger(`useCodingPad`)
function useCodingPad(isRun, setIsRun, setLoading, setAutoSaving) {
    const { isLoggedIn } = useAuth()
    const { loadedScribbles } = useLoadWorker(isLoggedIn)
    const [scribbles, setScribbles] = useState([])

    const [currentScribble, setCurrentScribble] = useState(null)

    const [isCreateMode, setIsCreateMode] = useState(false)
    const [selectedCode, setSelectedCode] = useState('js')
    const [hideExplorer, setHideExplorer] = useState(true)

    const { syncToDrive, currentScribbleSid: syncedScribbleSid } =
        useSyncWorker(isLoggedIn, setCurrentScribble)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSyncToDrive = useCallback(debounce(syncToDrive, 500),[syncToDrive])

    useEffect(() => {
        const log = logger(`currentScribble`)
        log(currentScribble)
        if (currentScribble) setHideExplorer(false)
    }, [currentScribble])

    useEffect(() => {
        if (currentScribble?.sid !== syncedScribbleSid && currentScribble && syncedScribbleSid) {
            setCurrentScribble({ ...currentScribble, sid: syncedScribbleSid })
            saveScribble({ ...currentScribble, sid: syncedScribbleSid })
        }
    }, [currentScribble, syncedScribbleSid])

    useEffect(() => {
        const newScribbles = [...loadedScribbles]
        setScribbles(newScribbles)
    }, [loadedScribbles])

    useEffect(() => {
        if (scribbles.length && !currentScribble)
            setCurrentScribble(scribbles[0])
    }, [currentScribble, scribbles])

    const onCodeChange = useCallback(
        async (newScribble) => {
            const log = logger(`onCodeChange`)
            log(`newScribble`, newScribble)
            setIsRun(false)
            setCurrentScribble(newScribble)
            setAutoSaving(true)
            await saveScribble(newScribble)
            setAutoSaving(false)
            debouncedSyncToDrive(newScribble)
        },
        [debouncedSyncToDrive, setAutoSaving, setIsRun]
    )
    const onCreate = async ({ name }) => {
        const log = logger(`onCreate`)
        log('called with new scribble', name)
        const newScribble = {
            name,
            js: '',
            css: '',
            html: '',
        }
        setScribbles([...scribbles, newScribble])
        setCurrentScribble(newScribble)
        await saveScribble(newScribble)
        debouncedSyncToDrive(newScribble)
        setIsCreateMode(false)
    }

    const onDelete = () => {
        const log = logger(`onDelete`)
        log('called')
    }

    const onRename = () => {
        const log = logger(`onRename`)
        log('called')
    }

    const onSelect = async (scribble, selectedFile = 'js') => {
        const log = logger(`onSelect`)
        log('called', scribble, selectedFile)
        if (scribble.name === currentScribble.name) {
            log(`current scribble was equal to the selected scribble`)
            // only file has change
            setSelectedCode(selectedFile)
        } else {
            setCurrentScribble(scribble)
            setSelectedCode(selectedFile)
        }
    }
    return {
        hideExplorer,
        setHideExplorer,
        selectedCode,
        currentScribble,
        scribbles,
        isCreateMode,
        setIsCreateMode,
        onCodeChange,
        onCreate,
        onDelete,
        onRename,
        onSelect,
    }
}

export default useCodingPad;