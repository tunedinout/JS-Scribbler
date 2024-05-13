import './CodingGround.css'
import SessionExplorer from '../../../core-components/file-explorer/SessionExplorer'
import EditorJS from '../../editor/JS/Editor-JS'
import { useEditor } from '../../editor/hooks'
import {
    debounce,
    getLogger,
    getLoginDetails,
    redirectToAuth,
    runCode,
} from '../../../util'
import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchExistingFiddleSessions } from '../../../api'
import EditorCSS from '../../editor/CSS/Editor-CSS'
import EditorHTML from '../../editor/HTML/Editor-HTML'
import Preview from '../../preview/Preview'
import { RiJavascriptFill } from 'react-icons/ri'
import { FaPlus } from 'react-icons/fa'
import { storeCurrentFiddleSesion } from '../../../indexedDB.util'

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

    // only when a new session is created focus is stolen
    // from the editor
    const doUnfocus = () => setFocusEditor(false)

    const onJSCodeChange = debounce((newJSCode) => {
        if (newJSCode === currentJSCode) return
        // let user proceed and remove all runtime error
        setJSRuntimeError(null)
        const log = logger(`onJSCodeChange`)
        log(`newJSCode`, newJSCode)
        setCurrentSession({ ...currentSession, js: newJSCode })
    }, 300)
    const onCSSCodeChange = debounce((newCSSCode) => {
        // const log = logger(`onCSSCodeChange`)
        // log(`newCSSCode`, newCSSCode)
        setCurrentSession({ ...currentSession, css: newCSSCode })
    }, 300)
    const onHTMLCodeChange = debounce((newHTMLCode) => {
        // const log = logger(`onHTMLCodeChange`)
        // log(`newHTMLCode`, newHTMLCode)
        setCurrentSession({ ...currentSession, html: newHTMLCode })
    }, 300)

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

    // useEffect(() => {
    //     if(!isRun){
    //         setJSRuntimeError(null);
    //     }
    // },[isRun])

    // useEffect(() => {
    //     if (accessToken) {
    //         setIsOffline(false);
    //     }
    // }, [accessToken])

    // useEffect(() => {
    //     onModeChange(isOffline);
    // },[isOffline])

    useEffect(() => {
        // should be defined
        if (currentSession) {
            // let the user click the button ele
            setIsRun(false)
            const log = logger(`currentSession - Use Effect`)
            log(`called`)
            switch (selectedCode) {
                case 'js':
                    setCurrentJSCode(currentSession.js)
                    break
                case 'css':
                    setCurrentCSSCode(currentSession.css)
                    break
                case 'html':
                    setCurrentHTMLCode(currentSession.html)
                    break
            }
        }
    }, [currentSession, selectedCode])

    // const loadFiddleSessions = useCallback(async () => {
    //     const log = logger(`loadFiddleSessions`)
    //     if (!initRef.current) {
    //         initRef.current = 'init'
    //     } else {
    //         if (!driveFolderId) return

    //         log(`received accessToken`, accessToken)
    //         const response = await fetchExistingFiddleSessions(
    //             accessToken,
    //             driveFolderId
    //         )

    //         if (!response.message)
    //             log(`fetchExistingFiddleSessions -> `, response)
    //         else {
    //             // even if we get 401 APP will update it for us and then
    //             // below effect will run it
    //             //  show the error to the user
    //             return
    //         }
    //     }
    // }, [driveFolderId, initRef, accessToken])

    // useEffect(() => {
    //     loadFiddleSessions()
    // }, [loadFiddleSessions])

    useEffect(() => {
        const saveCurrentSessionToIndexDB = async () => {
            await storeCurrentFiddleSesion(currentSession)
        }
        // access token is not there
        // user in offline mode
        if (currentSession && !accessToken) {
            saveCurrentSessionToIndexDB(currentSession)
        }
    }, [currentSession, accessToken])

    const createSessionHandler = ({ name }, cb) => {
        const log = logger(`createSessionHandler`)
        log('called with new session', name)

        const newSessionObj = {
            name,
            js: '',
            css: '',
            html: '',
        }
        setSessions([newSessionObj])
        setCurrentSession(newSessionObj)

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

    const selectSessionHandler = (session, selectedFile = 'js') => {
        const log = logger(`selectSessionHandler`)
        log('called', session, selectedFile)
        if (session.name === currentSession.name) {
            log(`current session was equal to the selected session`)
            // only file has change
            setSelectedCode(selectedFile)
        } else {
            // fiddle session selected has also changed
            setCurrentSession(session)
            setSelectedCode(selectedFile)
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
                            label: 'Sessions',
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
