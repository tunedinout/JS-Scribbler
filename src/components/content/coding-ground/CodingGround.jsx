import { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import {
    createDriveAppFolder,
    createScribblerSession,
    fetchExistingScribblerSession,
    fetchExistingScribblerSessions,
    updateScribblerSession,
} from '../../../api'
import { useAuth } from '../../../auth/AuthProvider'
import SessionExplorer from '../../../core-components/file-explorer/SessionExplorer'
import {
    loadAllScribblerSessions,
    storeCurrentScribblerSesion,
} from '../../../indexedDB.util'
import { debounce, getCodStrings, getLogger } from '../../../util'
import EditorCSS from '../../editor/CSS/Editor-CSS'
import EditorHTML from '../../editor/HTML/Editor-HTML'
import EditorJS from '../../editor/JS/Editor-JS'
import Preview from '../../preview/Preview'
import './CodingGround.css'

const logger = getLogger(`CodingGround`)
export default function CodingGround({
    isRun,
    setIsRun,
    setLoading,
    setAutoSaving,
    // autoSaving,
}) {
    const [driveFolderId, setDriveFolderId] = useState(null)
    const [disableCreateSession] = useState(false)
    const [sessions, setSessions] = useState([])
    const { isLoggedIn } = useAuth()

    const [currentSession, setCurrentSession] = useState(null)
    // by default a js file should be selected
    const [selectedCode, setSelectedCode] = useState('js')

    const [focusEditor, setFocusEditor] = useState(true)

    // when set should be an instance of error
    const [jsRuntimeError, setJSRuntimeError] = useState(null)
    const [isHtmlError, setIsHtmlError] = useState(false)

    const [hideExplorer, setHideExplorer] = useState(true)
    const [isCreateMode, setIsCreateMode] = useState(false)

    const [ifOfflineScribblersSaved, setIfOfflineScribblersSaved] =
        useState(false)

    // only when a new session is created focus is stolen
    // from the editor
    const doUnfocus = () => setFocusEditor(false)

    const onCodeChange = (newSessionObj) => {
        setIsRun(false)
        setCurrentSession(newSessionObj)
        setAutoSaving(true)
        if (!isLoggedIn) {
            storeCurrentScribblerSesion(newSessionObj).then(() =>
                setAutoSaving(false)
            )
        } else {
            debounce(
                updateScribblerSession(newSessionObj).then(() =>
                    setAutoSaving(false)
                ),
                1000
            )
        }
    }

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
        // this should only run once i.e the first time accessToken is set
        if (!driveFolderId && isLoggedIn) {
            createDriveAppFolder().then(({ data }) =>
                setDriveFolderId(data?.id)
            )
        }
    }, [driveFolderId, isLoggedIn])

    useEffect(() => {
        if (driveFolderId) {
            loadAllScribblerSessions()
                .then((offlineScribbles) => {
                    if (!offlineScribbles.length) {
                        setLoading(false)
                        setIfOfflineScribblersSaved(true)
                    } else {
                        return Promise.all(
                            offlineScribbles.map((scribble) =>
                                createScribblerSession(driveFolderId, scribble)
                            )
                        )
                    }
                })
                .then(() => {
                    setLoading(false)
                    setIfOfflineScribblersSaved(true)
                })
                .catch(() => {
                    // EAT
                })
        }
    }, [driveFolderId, setLoading])

    useEffect(() => {
        const log = logger(`effect load scribbler`)
        if (driveFolderId && ifOfflineScribblersSaved) {
            fetchExistingScribblerSessions(driveFolderId)
                .then(({ data: scribbles }) =>
                    Promise.all(
                        scribbles?.map(({ id, name }) =>
                            fetchExistingScribblerSession(id).then(
                                ({ data: fileData }) => ({
                                    id,
                                    name,
                                    ...getCodStrings(fileData),
                                })
                            )
                        )
                    )
                )
                .then((allScribbles) => {
                    log(`allScribbles`, allScribbles)
                    setSessions(allScribbles)

                    const newCurrenSession = allScribbles[0]
                    setCurrentSession(newCurrenSession)

                    setHideExplorer(false)
                    // TODO: set first one as the current session
                    setLoading(false)
                    setIfOfflineScribblersSaved(false)
                })
        }
    }, [driveFolderId, ifOfflineScribblersSaved, setLoading])

    useEffect(() => {
        const loadFromIndexedDB = async () => {
            const log = logger(`loadFromIndexedDB Offline scribblers`)
            const offlineScribblerSessions = await loadAllScribblerSessions()
            if (!offlineScribblerSessions.length) return
            setSessions(offlineScribblerSessions)
            // set the first of all the sessions as the currrent one
            setHideExplorer(false)
            const newSession = offlineScribblerSessions[0]
            setCurrentSession(newSession)
            log(`offlineScribblerSessions`, offlineScribblerSessions)
        }
        if (!isLoggedIn) {
            // user is in offline mode
            loadFromIndexedDB()
        }
        // else case handled by a seperate effect
    }, [isLoggedIn])

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

        if (!isLoggedIn) {
            // offline mode
            storeCurrentScribblerSesion(newSessionObj)
        } else {
            // online mode
            createScribblerSession(driveFolderId, newSessionObj).catch(
                (error) => {
                    log(`failed while creating scribbler -> `, error)
                    // EAT
                }
            )
        }

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
            {/* 
                At this level having a flex-box space between the session explorer and Editors space 
            */}
            {/* TODO: Change this to scribbler session explore */}
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
