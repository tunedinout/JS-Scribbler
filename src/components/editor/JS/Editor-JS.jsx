import PropTypes from 'prop-types'
import { useEffect } from 'react'
import AceEditor from 'react-ace'
import { getLogger } from '../../../util'
import { useEditor } from '../hooks'
import { EditorContainer } from '../styles'

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
 * @param {String} runtimeError - any error that is thrown when code is executed
 * @returns {JSX.Element}
 */
const logger = getLogger(`EditorJS`)
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
    showGutter,
    showLineNumbers,
  } = useEditor({
    code: codeString,
    focus,
    doUnfocus,
    runtimeError,
    onChange,
  })

  useEffect(() => {
    logger(`annotations`)(annotations)
  }, [annotations])

  // handler that updates renamed file in db

  return (
    <EditorContainer>
      <AceEditor
        ref={editorRef}
        // error annotations
        annotations={[...annotations]}
        value={codeString}
        mode={'javascript'}
        theme="github_dark"
        onChange={handleChange}
        width="inherit"
        height="inherit"
        fontSize={fontSize}
        showPrintMargin={false}
        highlightActiveLine={highlightActiveLine}
        wrapEnabled={true}
        setOptions={{
          // scrollPastEnd: true,
          useWorker: !runtimeError,
          fontSize: '12px',
          fontFamily: "'Source Code Pro'",
          showGutter: showGutter,
          showLineNumbers: showLineNumbers,
        }}
      />
    </EditorContainer>
  )
}
EditorJS.propTypes = {
  onChange: PropTypes.func,
  code: PropTypes.string,
  focus: PropTypes.bool,
  doUnfocus: PropTypes.func,
  runtimeError: PropTypes.string,
}
export default EditorJS
