import { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import ScribblesExplorer from '@core-components/file-explorer/ScribblesExplorer'
import EditorCSS from '@components/editor/CSS/Editor-CSS'
import EditorHTML from '@components/editor/HTML/Editor-HTML'
import EditorJS from '@components/editor/JS/Editor-JS'
import Preview from '@components/preview/Preview'
import './CodingPad.css'
import useCodingPad from './useCodingPad'
import { getLogger } from '@src/util'
import PropTypes from 'prop-types'

const logger = getLogger(`CodingPad`)
export default function CodingPad({
    isRun,
    setIsRun,
    setLoading,
    setAutoSaving,
    // autoSaving,
}) {

   const {
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
    } = useCodingPad(isRun,setIsRun,setLoading,setAutoSaving)

    const [focusEditor, setFocusEditor] = useState(true)
    const [jsRuntimeError, setJSRuntimeError] = useState(null)
    const [isHtmlError, setIsHtmlError] = useState(false)





    // only when a new scribble is created focus is stolen
    // from the editor
    const doUnfocus = () => setFocusEditor(false)
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


CodingPad.propTypes = {
     isRun: PropTypes.bool,
    setIsRun: PropTypes.func,
    setLoading: PropTypes.func,
    setAutoSaving: PropTypes.func,
}