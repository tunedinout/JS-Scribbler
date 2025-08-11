import { useEffect, useRef, useState } from 'react'
import { HTMLHint } from 'htmlhint'
import { getLogger } from '@src/util'
const logger = getLogger(`editor/hooks`)
export function useEditor({
  onChange,
  focus: isFocus,
  doUnfocus,
  runtimeError,
}) {
  // applied settings state

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [tabWidth, setTabWidth] = useState(2)
  const [highlightActiveLine, setHighlightActiveLine] = useState(false)

  const [showLineNumbers, setShowLineNumbers] = useState(true)

  const [showGutter, setShowGutter] = useState(false)
  const [fontSize, setFontSize] = useState(10)

  // annotations for errors
  const [annotations, setAnnotations] = useState([])

  // editor ref
  const editorRef = useRef(null)

  useEffect(() => {
    const log = logger(`useEditor - effect - 1`)
    if (isFocus && editorRef?.current) {
      log(editorRef.current)
      editorRef?.current?.editor?.focus()
      doUnfocus()
    }
  }, [isFocus, editorRef, doUnfocus])

  // fetch settings.json`
  useEffect(() => {
    const log = logger(`useEditor - effect - 2`)
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
        },
      )
      .catch((err) => {
        log('Error fetching tab setting...', err)
        setTabWidth(2)
        setShowLineNumbers(true)
        setShowGutter(true)
        setFontSize(12)
        setHighlightActiveLine(false)
      })
  }, [])

  // captures run time error
  useEffect(() => {
    const log = logger(`useEditor - effect - 3`)
    log('runtimeError', runtimeError)
    if (runtimeError) {
      const { message, columnNo, lineNo } = runtimeError
      setAnnotations([
        ...annotations,
        {
          row: lineNo - 11,
          column: columnNo,
          text:
            // runtime error is only received as the error string
            // via postmessage from the iframe
            message || `Error occurred at (${1}:${1})`,
          type: 'error',
          isRuntime: true,
        },
      ])
    } else {
      // remove all marked run time
      // errors
      const newAnnotations = annotations.filter(({ isRuntime }) => !isRuntime)
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
    showGutter,
    showLineNumbers,
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
