import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import './Editor-JS.css'
import AceEditor from 'react-ace'
import { compileJavaScript } from '../../../util'
import { TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

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
function Editor({
    onChange,
    code: codeString,
    focus: isFocus,
    doUnfocus,
    runtimeError,
}) {
    const [code, setCode] = useState('')
    // applied settings state
    const [tabWidth, setTabWidth] = useState(2)
    const [highlightActiveLine, setHighlightActiveLine] = useState(false)
    const [showLineNumbers, setShowLineNumbers] = useState(true)
    const [showGutter, setShowGutter] = useState(true)
    const [fontSize, setFontSize] = useState(12)

    // annotations for errors
    const [annotations, setAnnotations] = useState([])

    // editor ref
    const editorRef = useRef(null)

    useEffect(() => {
        if (isFocus && editorRef?.current) {
            console.log(editorRef.current)
            editorRef?.current?.editor?.focus()
            doUnfocus()
        }
    }, [isFocus, editorRef])

    // fetch settings.json`
    useEffect(() => {
        fetch('settings.json')
            .then((response) => response.json())
            .then(
                ({
                    tabWidth,
                    showLineNumbers,
                    showGutter,
                    fontSize,
                    highlightActiveLine,
                }) => {
                    setTabWidth(tabWidth)
                    setShowLineNumbers(showLineNumbers)
                    setShowGutter(showGutter)
                    setFontSize(fontSize)
                    setHighlightActiveLine(highlightActiveLine)
                }
            )
            .catch((err) => {
                console.error('Error fetching tab setting...', err)
                setTabWidth(2)
                setShowLineNumbers(true)
                setShowGutter(true)
                setFontSize(12)
                setHighlightActiveLine(false)
            })
    }, [])

    useEffect(() => {
        setCode(codeString)
    }, [codeString])

    useEffect(
        () => console.log(`annotations = ${annotations.length}`),
        [annotations]
    )

    // compiles user code
    useEffect(() => {
        console.log('code is changing', code)
        if (code) {
            const err = compileJavaScript(code)
            console.log(`error after compilation - ${err}`)
            if (err) {
                if (err?.loc) {
                    const { line, column } = err.loc
                    // check if it already exists or not
                    if (
                        !annotations.find(
                            ({ row, column: col, text, type }) =>
                                row == line - 1 &&
                                col == column &&
                                (text === err?.message ||
                                    (`Error occurred at (${line}:${column})` &&
                                        type == 'error'))
                        )
                    )
                        setAnnotations([
                            ...annotations,
                            {
                                row: line - 1,
                                column,
                                text:
                                    err?.message ||
                                    `Error occurred at (${line}:${column})`,
                                type: 'error',
                            },
                        ])
                }
            } else {
                setAnnotations([])
            }
        }
    }, [code])

    // captures run time error
    useEffect(() => {
        console.log('runtimeError', runtimeError)
        if (runtimeError) {
            console.log(`in here`)
            setAnnotations([
                ...annotations,
                {
                    row: 0,
                    column: 0,
                    text:
                        runtimeError?.message ||
                        `Error occurred at (${1}:${1})`,
                    type: 'error',
                    isRuntime: true,
                },
            ])
        }else {
            // remove all marked run time 
            // errors
            const newAnnotations = annotations.filter(({isRuntime}) => !Boolean(isRuntime));
            setAnnotations([...newAnnotations]);
        }
    }, [runtimeError])

    useEffect(() => {
        if (editorRef?.current) console.log(editorRef?.current)
    }, [editorRef])

    // lift state for this
    const handleChange = (newCode) => {
        // const newCode = e.target.value;
        onChange(newCode, Boolean(annotations.length))
        setCode(newCode)
    }

    // handler that updates renamed file in db

    return (
        <div className="esfiddle-js-editor-container">
            <AceEditor
                ref={editorRef}
                annotations={annotations}
                value={code}
                mode={'javascript'}
                theme="github_dark"
                onChange={handleChange}
                width="800px"
                height="90vh"
                fontSize={fontSize}
                showPrintMargin={false}
                highlightActiveLine={highlightActiveLine}
                wrapEnabled={true}
                setOptions={{
                    useWorker: false,
                    fontSize: '12px',
                    fontFamily: "'Source Code Pro'",
                }}
                className="esfiddle-js-editor"
            />
        </div>
    )
}
Editor.propTypes = {
    onChange: PropTypes.func.isRequired,
    code: PropTypes.string.isRequired,
}
export default Editor
