import React from 'react'
import PropTypes from 'prop-types'
import './Editor-CSS.css'
import AceEditor from 'react-ace'
import { useEditor } from '../hooks'

/** An Ace Editor intergrated component
 * updates calling component by calling onChange.
 *
 * Holds local state related to :
 *                              1. the current code
 *                              2. compilation errors - compiles current code
 *                                  via fn that return list of errors
 *                              3. settings from settings.json in public directory
 * @component
 * @param {object} props - component props
 * @param {function} onChange -  calls this function on change
 * @param {String} code -  code in the editor
 * @param {Boolean} focus -  triggers focus in editor
 * @param {Function} doUnfocus - call back to setting parent focus state
 * @param {Error} runtimeError - any error that is thrown when code is executed
 * @returns {JSX.Element}
 */
function EditorCSS({
    onChange,
    code: codeString,
    focus,
    doUnfocus,
    runtimeError,
}) {
    const {
        editorRef,
        annotations,
        handleChange,
        fontSize,
        highlightActiveLine,
    } = useEditor({
        type: 'css',
        code: codeString,
        focus,
        doUnfocus,
        runtimeError,
        onChange,
    })

    // handler that updates renamed file in db

    return (
        <div className="esfiddle-editor-container">
            <AceEditor
                ref={editorRef}
                // error annotations
                style={{width: 'inherit', height: 'inherit'}}
                annotations={annotations}
                value={codeString}
                mode={'css'}
                theme="github_dark"
                onChange={handleChange}
                fontSize={fontSize}
                showPrintMargin={false}
                highlightActiveLine={highlightActiveLine}
                wrapEnabled={true}
                setOptions={{
                    // scrollPastEnd: true,
                    useWorker: true,
                    fontSize: '12px',
                    fontFamily: "'Source Code Pro'",
                }}
                className="esfiddle-css-editor"
            />
        </div>
    )
}
EditorCSS.propTypes = {
    onChange: PropTypes.func.isRequired,
    code: PropTypes.string.isRequired,
}
export default EditorCSS
