import React from 'react'
import PropTypes from 'prop-types'
import './Editor-CSS.css'
import AceEditor from 'react-ace'
import { useEditor } from '../hooks'

// REMOVE This
// const CustomTextfield = styled(TextField)(({}) => ({
//     '& .MuiOutlinedInput-root': {
//         '& fieldset': {
//             border: 'none',
//             borderBottom: '1px solid chocolate',
//             borderRadius: '0',
//         },
//         '& input': {
//             padding: '2px 2px',
//             fontSize: '12px',
//             color: 'white',
//             '&:disabled': {
//                 color: 'white', // Change to your desired disabled font color
//                 '-webkit-text-fill-color': 'burlywood',
//                 borderBottom: '1px solid chocolate',
//             },
//         },
//     },
// }))
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
    // APP.js maintains code for execution and other things
    // init code string from upstream comp
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
        code
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
                value={code}
                mode={'css'}
                theme="github_dark"
                onChange={handleChange}
                fontSize={fontSize}
                showPrintMargin={false}
                highlightActiveLine={highlightActiveLine}
                wrapEnabled={true}
                setOptions={{
                    scrollPastEnd: true,
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
