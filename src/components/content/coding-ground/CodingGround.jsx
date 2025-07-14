import { useCallback, useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import SessionExplorer from '../../../core-components/file-explorer/SessionExplorer'
import { storeCurrentScribblerSesion } from '../../../indexedDB.util'
import { getLogger } from '../../../util'
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
    const [disableCreateSession] = useState(false)
    const [sessions, setSessions] = useState([])

    const [currentSession, setCurrentSession] = useState(null)
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
    const { syncToDrive } = useSyncWorker(isLoggedIn)

    useEffect(() => {
       if(currentSession)
        setHideExplorer(false)
    }, [currentSession])

    // only when a new session is created focus is stolen
    // from the editor
    const doUnfocus = () => setFocusEditor(false)

    const onCodeChange = useCallback(
        async (newSessionObj) => {
            setIsRun(false)
            setCurrentSession(newSessionObj)
            setAutoSaving(true)
            await storeCurrentScribblerSesion(newSessionObj)
            setAutoSaving(false)
            driveId && syncToDrive(newSessionObj, driveId)
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
        setSessions(newScribbles)
    }, [loadedScribbles])

    useEffect(() => {
        if (sessions.length && !currentSession) setCurrentSession(sessions[0])
    }, [currentSession, sessions])

    const createSessionHandler = async ({ name }, cb) => {
        const log = logger(`createSessionHandler`)
        log('called with new session', name)
        const newSessionObj = {
            name,
            js: '',
            css: '',
            html: '',
        }
        setSessions([...sessions, newSessionObj])
        setCurrentSession(newSessionObj)
        storeCurrentScribblerSesion(newSessionObj)
        cb()
    }

    const deleteSessionHandler = () => {
        const log = logger(`deleteSessionHandler`)
        log('called')
    }

    const renameSessionHandler = () => {
        const log = logger(`renameSessionHandler`)
        log('called')
    }

    const selectSessionHandler = async (session, selectedFile = 'js') => {
        const log = logger(`selectSessionHandler`)
        log('called', session, selectedFile)
        if (session.name === currentSession.name) {
            log(`current session was equal to the selected session`)
            // only file has change
            setSelectedCode(selectedFile)
        } else {
            setCurrentSession(session)
            setSelectedCode(selectedFile)
        }
    }

    return (
        <div className="scribbler-js-tab-container">
            {!hideExplorer && (
                <div className="scribbler-js-tab-container__file-explorer">
                    <SessionExplorer
                        {...{
                            currentSession,
                            createSessionHandler,
                            deleteSessionHandler,
                            renameSessionHandler,
                            selectSessionHandler,
                            label: 'Scribblers',
                            sessions,
                            disableCreateSession,
                            isCreateMode,
                            setIsCreateMode,
                        }}
                    />
                </div>
            )}

            {selectedCode === 'js' && currentSession && (
                <EditorJS
                    {...{
                        focus: focusEditor,
                        doUnfocus,
                        onChange: (js) => {
                            setJSRuntimeError(null)
                            onCodeChange({ ...currentSession, js })
                        },
                        code: currentSession.js,
                        runtimeError: jsRuntimeError,
                    }}
                />
            )}

            {selectedCode === 'css' && currentSession && (
                <EditorCSS
                    {...{
                        focus: focusEditor,
                        doUnfocus,
                        onChange: (css) =>
                            onCodeChange({ ...currentSession, css }),
                        code: currentSession.css,
                        runtimeError: null,
                    }}
                />
            )}

            {selectedCode === 'html' && currentSession && (
                <EditorHTML
                    {...{
                        focus: focusEditor,
                        doUnfocus,
                        onChange: (html) =>
                            onCodeChange({ ...currentSession, html }),
                        runtimeError: null,
                        code: currentSession.html,
                        onHtmlError,
                    }}
                />
            )}

            {/*TODO:  Add a preview  */}

            {currentSession && (
                <Preview
                    htmlContent={currentSession.html}
                    css={currentSession.css}
                    js={currentSession.js}
                    isRun={isRun}
                    isHtmlError={isHtmlError}
                />
            )}

            {/* Show default screen */}
            {!currentSession && hideExplorer && (
                <div className="scribbler-initial-screen-container">
                    <div
                        className="scribbler-initial-create-scribbler-button"
                        onClick={() => {
                            setHideExplorer(false)
                            setIsCreateMode(true)
                        }}
                    >
                        <FaPlus size={25} color="#3c3c3c" />
                        <span>Create a scribbler</span>
                    </div>
                </div>
            )}
        </div>
    )
}
