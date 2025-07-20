import { useEffect, useRef, useState } from 'react'
import { HTMLHint } from 'htmlhint'
export function useEditor({
    onChange,
    focus: isFocus,
    doUnfocus,
    runtimeError,
}) {
    // applied settings state
    // eslint-disable-next-line no-unused-vars
    const [tabWidth, setTabWidth] = useState(2)
    const [highlightActiveLine, setHighlightActiveLine] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [showLineNumbers, setShowLineNumbers] = useState(true)
    // eslint-disable-next-line no-unused-vars
    const [showGutter, setShowGutter] = useState(true)
    const [fontSize, setFontSize] = useState(10)

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
    }, [isFocus, editorRef, doUnfocus])

    // fetch settings.json`
    useEffect(() => {
        fetch(`/JS-Scribbler/scribbler-settings.json`)
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
                        runtimeError || `Error occurred at (${1}:${1})`,
                    type: 'error',
                    isRuntime: true,
                },
            ])
        } else {
            // remove all marked run time
            // errors
            const newAnnotations = annotations.filter(
                ({ isRuntime }) => !isRuntime
            )
            setAnnotations([...newAnnotations])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [runtimeError])

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
    const [annotations, setAnnotations] = useState([])

    useEffect(() => {
        const errors = HTMLHint.verify(code, customHTMLRules)
        const mappedErrors = errors.map((error) => ({
            row: error.line - 1,
            column: error.col,
            text: error.message,
            type: 'error',
        }))

        setAnnotations(mappedErrors)
    }, [code])

    return annotations
}
