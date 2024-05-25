import React, { useEffect, useRef, useState } from 'react';
import {HTMLHint} from 'htmlhint';

export function useEditor({
    type,
    onChange,
    code: codeString,
    focus: isFocus,
    doUnfocus,
    runtimeError,
}) {
    // applied settings state
    const [tabWidth, setTabWidth] = useState(2)
    const [highlightActiveLine, setHighlightActiveLine] = useState(false)
    const [showLineNumbers, setShowLineNumbers] = useState(true)
    const [showGutter, setShowGutter] = useState(true)
    const [fontSize, setFontSize] = useState(10);

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

    // receive code changes from APP
    // useEffect(() => {
    //     setCode(codeString)
    // }, [codeString])

    // compiles user code
    // TODO: remove since we are using workers
    // useEffect(() => {
    //     //console.log('code is changing', code)
    //     if (code && type === 'js') {
    //         const err = compileJavaScript(code)
    //         //console.log(`error after compilation - ${err}`)
    //         if (err) {
    //             if (err?.loc) {
    //                 const { line, column } = err.loc
    //                 // check if it already exists or not
    //                 if (
    //                     !annotations.find(
    //                         ({ row, column: col, text, type }) =>
    //                             row == line - 1 &&
    //                             col == column &&
    //                             (text === err?.message ||
    //                                 (`Error occurred at (${line}:${column})` &&
    //                                     type == 'error'))
    //                     )
    //                 )
    //                     setAnnotations([
    //                         ...annotations,
    //                         {
    //                             row: line - 1,
    //                             column,
    //                             text:
    //                                 err?.message ||
    //                                 `Error occurred at (${line}:${column})`,
    //                             type: 'error',
    //                         },
    //                     ])
    //             }
    //         } else {
    //             setAnnotations([])
    //         }
    //     }
    // }, [code,type])

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
                    // runtime error is only received as the error string 
                    // via postmessage from the iframe
                        runtimeError ||
                        `Error occurred at (${1}:${1})`,
                    type: 'error',
                    isRuntime: true,
                },
            ])
        } else {
            // remove all marked run time
            // errors
            const newAnnotations = annotations.filter(
                ({ isRuntime }) => !Boolean(isRuntime)
            )
            setAnnotations([...newAnnotations])
        }
    }, [runtimeError])

    // useEffect(() => {
    //     if (editorRef?.current) console.log(editorRef?.current)
    // }, [editorRef])

    // lift state for this
    const handleChange = (newCode) => {
        // const newCode = e.target.value;
        onChange(newCode, Boolean(annotations.length))
    }

    return {
        fontSize,
        highlightActiveLine,
        editorRef,
        annotations,
        handleChange,
    }
}

const customHTMLRules = {
    ...HTMLHint.defaultRuleset,
    'doctype-first': false,
}


export function useHtmlLint(code) {
    // collect html errors
    const [annotations, setAnnotations] = useState([]);

    useEffect(() => {
        const errors = HTMLHint.verify(code, customHTMLRules );
        const mappedErrors = errors.map(error => ({
            row: error.line - 1,
            column: error.col,
            text: error.message,
            type: 'error'
        }));

        setAnnotations(mappedErrors);
    }, [code])

    return annotations;
}
