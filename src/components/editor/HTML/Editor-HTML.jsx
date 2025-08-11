import { useEffect } from 'react'
import PropTypes from 'prop-types'
import AceEditor from 'react-ace'
import { useEditor, useHtmlLint } from '../hooks'
import { EditorContainer } from '../styles'

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
function EditorHTML({
  onChange,
  // APP.js maintains code for execution and other things
  code: codeString,
  focus,
  doUnfocus,
  runtimeError,
  onHtmlError,
}) {
  const {
    editorRef,
    annotations,
    handleChange,
    fontSize,
    highlightActiveLine,
  } = useEditor({
    type: 'html',
    code: codeString,
    focus,
    doUnfocus,
    runtimeError,
    onChange,
  })

  const errors = useHtmlLint(codeString)

  useEffect(() => {
    onHtmlError(errors)
  }, [errors, onHtmlError])

  // handler that updates renamed file in db

  return (
    <EditorContainer>
      <AceEditor
        ref={editorRef}
        width="inherit"
        height="inherit"
        annotations={[...annotations, ...errors]}
        value={codeString}
        mode={'html'}
        theme="github_dark"
        onChange={handleChange}
        fontSize={fontSize}
        showPrintMargin={false}
        highlightActiveLine={highlightActiveLine}
        wrapEnabled={true}
        setOptions={{
          // scrollPastEnd: true,
          useWorker: false,
          fontSize: '12px',
          fontFamily: "'Source Code Pro'",
          // enableSnippets: true
        }}
      />
    </EditorContainer>
  )
}
EditorHTML.propTypes = {
  onChange: PropTypes.func,
  code: PropTypes.string,
  focus: PropTypes.func,
  doUnfocus: PropTypes.func,
  runtimeError: PropTypes.string,
  onHtmlError: PropTypes.object,
}
export default EditorHTML
