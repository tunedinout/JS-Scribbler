import './CodingGround.css'
import SessionExplorer from '../../../core-components/file-explorer/SessionExplorer'
import EditorJS from '../../editor/JS/Editor-JS'
import { useEditor } from '../../editor/hooks'
import { debounce, getCodStrings, getLogger } from '../../../util'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
    createDriveAppFolder,
    createScribblerSession,
    fetchExistingScribblerSession,
    fetchExistingScribblerSessions,
    udpateScribblerSession,
    updateScribblerSession,
} from '../../../api'
import EditorCSS from '../../editor/CSS/Editor-CSS'
import EditorHTML from '../../editor/HTML/Editor-HTML'
import Preview from '../../preview/Preview'
import { RiJavascriptFill } from 'react-icons/ri'
import { FaPlus } from 'react-icons/fa'
import {
    clearAllScribblerSessions,
    loadAllScribblerSessions,
    loadScribblerSession,
    storeCurrentScribblerSesion,
} from '../../../indexedDB.util'
import { useAuth } from '../../../auth/AuthProvider'

/**
 * @component
 * loads all the coding files, is responsible for loading existing session and executing the code
 * must have
 *
 * local state:
 *      1. list of existing files from the user indexedDB
 *      2. Current selected file
 *      2. show/hide file
 * effects:
 *       1. onMount effect to load all existing files
 * handlers:
 *      1. file name change handler
 *      2. selected file change handler
 *
 * @param {object} props - component props
 * @param {Function} props.onCodeChange
 * @param {Function} props.onFileChange
 * @param {String} props.code
 * @param {Error} Props.runtimeError
 * @param {String} props.driveFolderId
 * @returns {JSX.Element}
 */
const logger = getLogger(`CodingGround`)
export default function CodingGround({
    isRun,
    setIsRun,
    setLoading,
    setAutoSaving,
    autoSaving,
}) {
    const [driveFolderId, setDriveFolderId] = useState(null)
    const [disableCreateSession, setDisableCreateSession] = useState(false)
    const [sessions, setSessions] = useState([])
    const initRef = useRef(null)
    const {isLoggedIn} = useAuth()

    const [currentSession, setCurrentSession] = useState(null)

    const [currentJSCode, setCurrentJSCode] = useState('')
    const [currentHTMLCode, setCurrentHTMLCode] = useState('')
    const [currentCSSCode, setCurrentCSSCode] = useState('')

    // by default a js file should be selected
    const [selectedCode, setSelectedCode] = useState('js')

    const [focusEditor, setFocusEditor] = useState(true)

    // when set should be an instance of error
    const [jsRuntimeError, setJSRuntimeError] = useState(null)
    const [isHtmlError, setIsHtmlError] = useState(false)

    const [hideExplorer, setHideExplorer] = useState(true)
    const [isCreateMode, setIsCreateMode] = useState(false)

    const [ifOfflineScribblersSaved, setIfOfflineScribblersSaved] = useState(false)

    // only when a new session is created focus is stolen
    // from the editor
    const doUnfocus = () => setFocusEditor(false)

    const onJSCodeChange = (newJSCode) => {
        if (newJSCode === currentJSCode) return
        // let user proceed and remove all runtime error
        setJSRuntimeError(null)
        setIsRun(false)
        // const log = logger(`onJSCodeChange`)
        // log(`newJSCode`, newJSCode)
        setCurrentJSCode(newJSCode)
        setCurrentSession({ ...currentSession, js: newJSCode })
    }
    const onCSSCodeChange = (newCSSCode) => {
        // const log = logger(`onCSSCodeChange`)
        // log(`newCSSCode`, newCSSCode)
        setIsRun(false)
        setCurrentCSSCode(newCSSCode)
        setCurrentSession({ ...currentSession, css: newCSSCode })
    }
    const onHTMLCodeChange = (newHTMLCode) => {
        // const log = logger(`onHTMLCodeChange`)
        // log(`newHTMLCode`, newHTMLCode)
        setCurrentHTMLCode(newHTMLCode)
        setIsRun(false)
        setCurrentSession({ ...currentSession, html: newHTMLCode })
    }

    const onHtmlError = (errors) => {
        // use this cb to not add the html to preview
        setIsHtmlError(Boolean(errors.length))
    }

    useEffect(() => {
        // this should only run once i.e the first time accessToken is set
        if (!driveFolderId && isLoggedIn ) {
            createDriveAppFolder()
            .then(({data}) => setDriveFolderId(data?.id))
        }
    }, [driveFolderId,isLoggedIn])

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
    }, [driveFolderId])

    useEffect(() => {
        const log = logger(`effect load scribbler`)
        if ( driveFolderId && ifOfflineScribblersSaved) {
            fetchExistingScribblerSessions(driveFolderId)
                .then(({ data: scribbles }) =>
                    Promise.all(
                        scribbles?.map(({ id, name }) =>
                            fetchExistingScribblerSession(id).then(
                                ({data: fileData}) => ({
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
                    setCurrentJSCode(newCurrenSession.js)
                    setCurrentHTMLCode(newCurrenSession.html)
                    setCurrentCSSCode(newCurrenSession.css)

                    setHideExplorer(false)
                    // TODO: set first one as the current session
                    setLoading(false)
                    setIfOfflineScribblersSaved(false)
                })
            
        }
    }, [ driveFolderId, ifOfflineScribblersSaved])

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
            setCurrentJSCode(newSession.js)
            setCurrentHTMLCode(newSession.html)
            setCurrentCSSCode(newSession.css)
            log(`offlineScribblerSessions`, offlineScribblerSessions)
        }
        if (!isLoggedIn) {
            // user is in offline mode
            loadFromIndexedDB()
        }
        // else case handled by a seperate effect
    }, [isLoggedIn])

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
        if (currentSession) {
            setAutoSaving(true)
            if (!isLoggedIn) {
                storeCurrentScribblerSesion(currentSession).then(() =>
                    setAutoSaving(false)
                )
            } else {
                debounce(
                    updateScribblerSession(currentSession).then(() =>
                        setAutoSaving(false)
                    ),
                    1000
                )
            }
        }
    }, [currentSession, isLoggedIn])

    const createSessionHandler = async ({ name }, cb) => {
        const log = logger(`createSessionHandler`)
        log('called with new session', name)

        if (!isLoggedIn) {
            // offline mode
            const newSessionObj = {
                name,
                js: '',
                css: '',
                html: '',
            }

            setSessions([...sessions, newSessionObj])
            setCurrentSession(newSessionObj)

            setCurrentJSCode(newSessionObj.js)
            setCurrentHTMLCode(newSessionObj.html)
            setCurrentCSSCode(newSessionObj.css)
        } else {
            // online mode
            try {
                const newScribbler = await createScribblerSession(
                    driveFolderId,
                  {name, css: '',js: '',html: ''}
                )
                setSessions([...sessions, newScribbler])
                setCurrentSession(newScribbler)
                setCurrentJSCode(newScribbler.js)
                setCurrentHTMLCode(newScribbler.html)
                setCurrentCSSCode(newScribbler.css)
            } catch (error) {
                console.error(`failed while creating scribbler -> `, error)
                const { response = {} } = error
            }
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
            if (!isLoggedIn) {
                const scribblerSession = await loadScribblerSession(session.name)
                log(`scribblerSessionLoaded`, scribblerSession)
                setSessions(
                    sessions.map((existingScribblerSession) => {
                        if (existingScribblerSession.name === session.name) {
                            return scribblerSession
                        } else {
                            return existingScribblerSession
                        }
                    })
                )
                setCurrentSession(scribblerSession)
                setSelectedCode(selectedFile)
                setCurrentCSSCode(scribblerSession.css)
                setCurrentHTMLCode(scribblerSession.html)
                setCurrentJSCode(scribblerSession.js)
            } else {
                // user has signed in with google
                // the scribblers obj will have id assigned to them
                log(`loading scribbler session`, session)
                let abort = false
                setLoading(true)
                await fetchExistingScribblerSession(session.id)
                    .then(({data: arrayOfFileData}) => {
                        const codeObj = getCodStrings(arrayOfFileData)
                        return { ...session, ...codeObj }
                    })
                    .then((scribblerSessionResponse) => {
                        log(`scribblerSessionResponse`, scribblerSessionResponse)
                        setCurrentSession(scribblerSessionResponse)
                        setSelectedCode(selectedFile)
                        setCurrentHTMLCode(scribblerSessionResponse.html)
                        setCurrentCSSCode(scribblerSessionResponse.css)
                        setCurrentJSCode(scribblerSessionResponse.js)
                        setLoading(false)
                    })
                    .catch((error) => {
                        const { response = {} } = error
                    })
            }
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
                        onChange: onJSCodeChange,
                        code: currentJSCode,
                        runtimeError: jsRuntimeError,
                    }}
                />
            )}

            {selectedCode === 'css' && currentSession && (
                <EditorCSS
                    {...{
                        focus: focusEditor,
                        doUnfocus,
                        onChange: onCSSCodeChange,
                        code: currentCSSCode,
                        runtimeError: null,
                    }}
                />
            )}

            {selectedCode === 'html' && currentSession && (
                <EditorHTML
                    {...{
                        focus: focusEditor,
                        doUnfocus,
                        onChange: onHTMLCodeChange,
                        code: currentHTMLCode,
                        runtimeError: null,
                        onHtmlError,
                    }}
                />
            )}

            {/*TODO:  Add a preview  */}

            {currentSession && (
                <Preview
                    htmlContent={currentHTMLCode}
                    css={currentCSSCode}
                    js={currentJSCode}
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
