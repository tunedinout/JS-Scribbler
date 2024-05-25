import './CodingGround.css'
import SessionExplorer from '../../../core-components/file-explorer/SessionExplorer'
import EditorJS from '../../editor/JS/Editor-JS'
import { useEditor } from '../../editor/hooks'
import { debounce, getCodStrings, getLogger } from '../../../util'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
    createFiddleSession,
    fetchExistingFiddleSession,
    fetchExistingFiddleSessions,
    udpateFiddleSession,
    updateFiddleSession,
} from '../../../api'
import EditorCSS from '../../editor/CSS/Editor-CSS'
import EditorHTML from '../../editor/HTML/Editor-HTML'
import Preview from '../../preview/Preview'
import { RiJavascriptFill } from 'react-icons/ri'
import { FaPlus } from 'react-icons/fa'
import {
    clearAllFiddleSessions,
    loadAllFiddleSessions,
    loadFiddleSession,
    storeCurrentFiddleSesion,
} from '../../../indexedDB.util'

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
    driveFolderId,
    accessToken,
    setLoading,
    setAutoSaving,
    autoSaving,
}) {
    const [disableCreateSession, setDisableCreateSession] = useState(false)
    const [sessions, setSessions] = useState([])
    const initRef = useRef(null)

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

    const [ifOfflineFiddlesSaved, setIfOfflineFiddlesSaved] = useState(false)

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
        const commitOfflineFiddlesToDrive = async () => {
            setLoading(true)
            const log = logger(`commitOfflineFiddlesToDrive`)
            let offlineFiddleSessions = await loadAllFiddleSessions()
            if (!offlineFiddleSessions.length) {
                setLoading(false)
                setIfOfflineFiddlesSaved(true)
                return
            }

            log(`offlineFiddleSessions`, offlineFiddleSessions)

            try {
                const saveFiddlesResponse = await Promise.all(
                    offlineFiddleSessions.map(({ name, js, css, html }) => {
                        return createFiddleSession(
                            accessToken,
                            driveFolderId,
                            name,
                            js,
                            css,
                            html
                        )
                    })
                )
                await clearAllFiddleSessions()
            } catch (error) {
                console.error(`error occurred while saving fiddles in drive`)
            }
            setLoading(false)
            setIfOfflineFiddlesSaved(true)
        }
        if (accessToken && driveFolderId) {
            commitOfflineFiddlesToDrive()
        }
    }, [accessToken, driveFolderId])

    useEffect(() => {
        const loadAllFiddleSessions = async () => {
            const log = logger(`loadAllFiddleSessions`)
            setLoading(true)
            let fiddlesResponse = await fetchExistingFiddleSessions(
                accessToken,
                driveFolderId
            )
            if (fiddlesResponse?.message) {
                log(`failed while fetching fiddles from drive`)
                setLoading(false)
            }
            log(`fiddlesResponse`, fiddlesResponse)

            const allFiddlesInDrive = await Promise.all(
                fiddlesResponse?.map(({ id, name }) => {
                    // each is an array of 3 files
                    return fetchExistingFiddleSession(accessToken, id).then(
                        (arrayOfFileData) => {
                            log(`allFiddlesInDrive element `, arrayOfFileData)
                            const codeObj = getCodStrings(arrayOfFileData)
                            return { id, name, ...codeObj }
                        }
                    )
                })
            )

            log(`allFiddlesInDrive`, allFiddlesInDrive)
            setSessions(allFiddlesInDrive)

            const newCurrenSession = allFiddlesInDrive[0]
            setCurrentSession(newCurrenSession)
            setCurrentJSCode(newCurrenSession.js)
            setCurrentHTMLCode(newCurrenSession.html)
            setCurrentCSSCode(newCurrenSession.css)

            setHideExplorer(false)
            // TODO: set first one as the current session
            setLoading(false)
        }
        logger(`effect load fiddle`)(ifOfflineFiddlesSaved)
        if (accessToken && driveFolderId && ifOfflineFiddlesSaved) {
            loadAllFiddleSessions()
            setIfOfflineFiddlesSaved(false)
        }
    }, [accessToken, driveFolderId, ifOfflineFiddlesSaved])

    useEffect(() => {
        const loadFromIndexedDB = async () => {
            const log = logger(`loadFromIndexedDB Offline fiddles`)
            const offlineFiddleSessions = await loadAllFiddleSessions()
            if (!offlineFiddleSessions.length) return
            setSessions(offlineFiddleSessions)
            // set the first of all the sessions as the currrent one
            setHideExplorer(false)
            const newSession = offlineFiddleSessions[0]
            setCurrentSession(newSession)
            setCurrentJSCode(newSession.js)
            setCurrentHTMLCode(newSession.html)
            setCurrentCSSCode(newSession.css)
            log(`offlineFiddleSessions`, offlineFiddleSessions)
        }
        if (!accessToken) {
            // user is in offline mode
            loadFromIndexedDB()
        }
        // else case handled by a seperate effect
    }, [accessToken])

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

    // useEffect(() => {
    //     // should be defined
    //     if (currentSession) {
    //         // let the user click the button ele
    //         // setIsRun(false)
    //         const log = logger(`currentSession - Use Effect`)
    //         log(`currentSession`, currentSession)
    //         // this handles the selection of the file
    //         switch (selectedCode) {
    //             case 'js':
    //                 setCurrentJSCode(currentSession.js)
    //                 break
    //             case 'css':
    //                 setCurrentCSSCode(currentSession.css)
    //                 break
    //             case 'html':
    //                 setCurrentHTMLCode(currentSession.html)
    //                 break
    //         }
    //     }
    // }, [currentSession, selectedCode])

    useEffect(() => {
        const saveCurrentSessionToIndexDB = async () => {
            await storeCurrentFiddleSesion(currentSession)
        }

        const saveCurrentSessionToDrive = async ({ id, js, css, html }) => {
            if (!autoSaving) {
                setAutoSaving(true)
                // above object could contain name if we want to support renaming
                const log = logger(`saveCurrentSessionToDrive`)
                const response = await updateFiddleSession(
                    accessToken,
                    id,
                    js,
                    css,
                    html
                )
                log(`response`, response)
                setAutoSaving(false)
            }
        }
        // access token is not there
        // user in offline mode
        if (currentSession) {
            if (!accessToken) {
                // offline mode
                setAutoSaving(true)
                saveCurrentSessionToIndexDB(currentSession)
                setAutoSaving(false)
            } else {
                // signed in user
                debounce(saveCurrentSessionToDrive(currentSession), 1000)
            }
        }
    }, [currentSession, accessToken])

    const createSessionHandler = async ({ name }, cb) => {
        const log = logger(`createSessionHandler`)
        log('called with new session', name)

        if (!accessToken) {
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
                const newFiddle = await createFiddleSession(
                    accessToken,
                    driveFolderId,
                    name,
                    '',
                    '',
                    ''
                )
                setSessions([...sessions, newFiddle])
                setCurrentSession(newFiddle)
                setCurrentJSCode(newFiddle.js)
                setCurrentHTMLCode(newFiddle.html)
                setCurrentCSSCode(newFiddle.css)
            } catch (error) {
                console.error(`failed while creating fiddle -> `, error)
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
            if (!accessToken) {
                const fiddleSession = await loadFiddleSession(session.name)
                log(`fiddleSessionLoaded`, fiddleSession)
                setSessions(
                    sessions.map((existingFiddleSession) => {
                        if (existingFiddleSession.name === session.name) {
                            return fiddleSession
                        } else {
                            return existingFiddleSession
                        }
                    })
                )
                setCurrentSession(fiddleSession)
                setSelectedCode(selectedFile)
                setCurrentCSSCode(fiddleSession.css)
                setCurrentHTMLCode(fiddleSession.html)
                setCurrentJSCode(fiddleSession.js)
            } else {
                // user has signed in with google
                // the fiddles obj will have id assigned to them
                log(`loading fiddle session`, session)
                setLoading(true)
                const fiddleSessionResponse = await fetchExistingFiddleSession(
                    accessToken,
                    session.id
                ).then((arrayOfFileData) => {
                    const codeObj = getCodStrings(arrayOfFileData)
                    return { ...session, ...codeObj }
                })
                log(`fiddleSessionResponse`, fiddleSessionResponse)

                setCurrentSession(fiddleSessionResponse)
                setSelectedCode(selectedFile)
                setCurrentHTMLCode(fiddleSessionResponse.html)
                setCurrentCSSCode(fiddleSessionResponse.css)
                setCurrentJSCode(fiddleSessionResponse.js)
                setLoading(false)
            }
        }
    }

    return (
        <div className="esfiddle-js-tab-container">
            {/* 
                At this level having a flex-box space between the session explorer and Editors space 
            */}
            {/* TODO: Change this to fiddle session explore */}
            {!hideExplorer && (
                <div className="esfiddle-js-tab-container__file-explorer">
                    <SessionExplorer
                        {...{
                            currentSession,
                            createSessionHandler,
                            deleteSessionHandler,
                            renameSessionHandler,
                            selectSessionHandler,
                            label: 'Fiddles',
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
                <div className="esfiddle-initial-screen-container">
                    <div
                        className="esfiddle-initial-create-fiddle-button"
                        onClick={() => {
                            setHideExplorer(false)
                            setIsCreateMode(true)
                        }}
                    >
                        <FaPlus size={25} color="#3c3c3c" />
                        <span>Create a fiddle</span>
                    </div>
                </div>
            )}
        </div>
    )
}
