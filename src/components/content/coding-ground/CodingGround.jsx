import { useCallback, useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import ScribblesExplorer from '../../../core-components/file-explorer/ScribblesExplorer'
import { saveScribble } from '../../../indexedDB.util'
import { debounce, getLogger } from '../../../util'
import EditorCSS from '../../editor/CSS/Editor-CSS'
import EditorHTML from '../../editor/HTML/Editor-HTML'
import EditorJS from '../../editor/JS/Editor-JS'
import Preview from '../../preview/Preview'
import './CodingGround.css'
import { useLoadWorker } from '../../../hooks/useLoadWorker'
import { useSyncWorker } from '../../../hooks/useSyncWorker'
import { useAuth } from '../../../auth/AuthProvider'

const logger = getLogger(`CodingGround`)
export default function CodingGround({
    isRun,
    setIsRun,
    setLoading,
    setAutoSaving,
    // autoSaving,
}) {
    const [scribbles, setScribbles] = useState([])

    const [currentScribble, setCurrentScribble] = useState(null)
    // by default a js file should be selected
    const [selectedCode, setSelectedCode] = useState('js')

    const [focusEditor, setFocusEditor] = useState(true)

    // when set should be an instance of error
    const [jsRuntimeError, setJSRuntimeError] = useState(null)
    const [isHtmlError, setIsHtmlError] = useState(false)

    const [hideExplorer, setHideExplorer] = useState(true)
    const [isCreateMode, setIsCreateMode] = useState(false)
    const { isLoggedIn } = useAuth()
    const { loadedScribbles, driveId } = useLoadWorker(isLoggedIn)
    const { syncToDrive,currentScribbleId: syncedScribbleId } = useSyncWorker(isLoggedIn)

    useEffect(() => {
       if(currentScribble)
        setHideExplorer(false)
    }, [currentScribble])

    useEffect(() => {
        if(currentScribble?.id !== syncedScribbleId){
            setCurrentScribble({...currentScribble,id: syncedScribbleId})
        }
    },[syncedScribbleId])

    // only when a new scribble is created focus is stolen
    // from the editor
    const doUnfocus = () => setFocusEditor(false)

    const onCodeChange = useCallback(
        async (newScribble) => {
            setIsRun(false)
            setCurrentScribble(newScribble)
            setAutoSaving(true)
            await saveScribble(newScribble)
            setAutoSaving(false)
            driveId && debounce(syncToDrive(newScribble, driveId),500)
        },
        [driveId, setAutoSaving, setIsRun, syncToDrive]
    )

    const onHtmlError = (errors) => {
        // use this cb to not add the html to preview
        setIsHtmlError(Boolean(errors.length))
    }
    useEffect(() => {
        const messageInterceptorHandler = function (event) {
            const log = logger(`messageInterceptorHandler`)
            if (
                event.data.type === 'error'
                // event.origin === 'http://localhost:3001/console'
            ) {
                log(event)
                setJSRuntimeError(() => event.data.message)
            }
        }
        window.addEventListener('message', messageInterceptorHandler)
        return () =>
            window.removeEventListener('message', messageInterceptorHandler)
    }, [])

    useEffect(() => {
        const newScribbles = [...loadedScribbles]
        setScribbles(newScribbles)
    }, [loadedScribbles])

    useEffect(() => {
        if (scribbles.length && !currentScribble) setCurrentScribble(scribbles[0])
    }, [currentScribble, scribbles])

    const onCreate = async ({ name }, cb) => {
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

    return (
        <div className="scribbler-js-tab-container">
            {!hideExplorer && (
                <div className="scribbler-js-tab-container__file-explorer">
                    <ScribblesExplorer
                        {...{
                            currentScribble,
                            onCreate,
                            onDelete,
                            onRename,
                            onSelect,
                            label: 'Scribbles',
                            scribbles,
                            isCreateMode,
                            setIsCreateMode,
                        }}
                    />
                </div>
            )}

            {selectedCode === 'js' && currentScribble && (
                <EditorJS
                    {...{
                        focus: focusEditor,
                        doUnfocus,
                        onChange: (js) => {
                            setJSRuntimeError(null)
                            onCodeChange({ ...currentScribble, js })
                        },
                        code: currentScribble.js,
                        runtimeError: jsRuntimeError,
                    }}
                />
            )}

            {selectedCode === 'css' && currentScribble && (
                <EditorCSS
                    {...{
                        focus: focusEditor,
                        doUnfocus,
                        onChange: (css) =>
                            onCodeChange({ ...currentScribble, css }),
                        code: currentScribble.css,
                        runtimeError: null,
                    }}
                />
            )}

            {selectedCode === 'html' && currentScribble && (
                <EditorHTML
                    {...{
                        focus: focusEditor,
                        doUnfocus,
                        onChange: (html) =>
                            onCodeChange({ ...currentScribble, html }),
                        runtimeError: null,
                        code: currentScribble.html,
                        onHtmlError,
                    }}
                />
            )}

            {/*TODO:  Add a preview  */}

            {currentScribble && (
                <Preview
                    htmlContent={currentScribble.html}
                    css={currentScribble.css}
                    js={currentScribble.js}
                    isRun={isRun}
                    isHtmlError={isHtmlError}
                />
            )}

            {/* Show default screen */}
            {!currentScribble && hideExplorer && (
                <div className="scribbler-initial-screen-container">
                    <div
                        className="scribbler-initial-create-scribbler-button"
                        onClick={() => {
                            setHideExplorer(false)
                            setIsCreateMode(true)
                        }}
                    >
                        <FaPlus size={25} color="#3c3c3c" />
                        <span>Create a scribble</span>
                    </div>
                </div>
            )}
        </div>
    )
}
