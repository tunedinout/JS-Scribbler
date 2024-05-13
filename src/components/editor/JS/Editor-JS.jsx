import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import './Editor-JS.css'
import AceEditor from 'react-ace'
import { compileJavaScript } from '../../../indexedDB.util'
import { TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEditor } from '../hooks'
import { getLogger } from '../../../util'

// REMOVE This
const CustomTextfield = styled(TextField)(({}) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            border: 'none',
            borderBottom: '1px solid chocolate',
            borderRadius: '0',
        },
        '& input': {
            padding: '2px 2px',
            fontSize: '12px',
            color: 'white',
            '&:disabled': {
                color: 'white', // Change to your desired disabled font color
                '-webkit-text-fill-color': 'burlywood',
                borderBottom: '1px solid chocolate',
            },
        },
    },
}))
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
const logger = getLogger( `EditorJS`);
function EditorJS({
    onChange,
    // APP.js maintains code for execution and other things
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
        code: codeString,
        focus,
        doUnfocus,
        runtimeError,
        onChange,
    })

    useEffect(() => {
        logger(`annotations`)(annotations);
    },[annotations])

    // handler that updates renamed file in db

    return (
        <div className="esfiddle-editor-container">
            <AceEditor
                ref={editorRef}
                // error annotations
                style={{width: 'inherit', height: 'inherit'}}
                annotations={[...annotations]}
                value={code}
                mode={'javascript'}
                theme="github_dark"
                onChange={handleChange}
                // width="inherit"
                // height="inherit"
                fontSize={fontSize}
                showPrintMargin={false}
                highlightActiveLine={highlightActiveLine}
                wrapEnabled={true}
                setOptions={{
                    scrollPastEnd: true,
                    useWorker: !runtimeError,
                    fontSize: '12px',
                    fontFamily: "'Source Code Pro'",
                }}
                className="esfiddle-js-editor"
            />
        </div>
    )
}
EditorJS.propTypes = {
    onChange: PropTypes.func.isRequired,
    code: PropTypes.string.isRequired,
}
export default EditorJS;
