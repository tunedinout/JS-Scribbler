import { useEffect, useRef, useState } from 'react'
import EditorCSS from '@components/editor/CSS/Editor-CSS'
import EditorHTML from '@components/editor/HTML/Editor-HTML'
import EditorJS from '@components/editor/JS/Editor-JS'
// import './CodingPad.css'
import useCodingPad from './useCodingPad'
import { getLogger } from '@src/util'
import PropTypes from 'prop-types'
import { CodingPadContainer } from './styles'
import Preview from '../preview/Preview'
import { ConflictResolver } from '@src/core-components/conflict-resolver-cm'

const logger = getLogger(`CodingPad`)
export default function CodingPad({ isRun, currentEditDetails }) {
  const log = logger(`inline logger`)
  const { type: selectedCode, name } = currentEditDetails
  log(currentEditDetails)
  const { currentScribble, onCodeChange } = useCodingPad(currentEditDetails)
  const isConflicted = currentScribble?.conflict || false

  const [focusEditor, setFocusEditor] = useState(true)
  const [jsRuntimeError, setJSRuntimeError] = useState(null)
  const [isHtmlError, setIsHtmlError] = useState(false)
  const iframeRef = useRef(null)

  // only when a new scribble is created focus is stolen
  // from the editor
  useEffect(() => {
    setJSRuntimeError(null)
  }, [name])
  const doUnfocus = () => setFocusEditor(false)
  const onHtmlError = (errors) => {
    // use this cb to not add the html to preview
    setIsHtmlError(Boolean(errors.length))
  }
  useEffect(() => {
    const messageInterceptorHandler = function (event) {
      const log = logger(`messageInterceptorHandler`)
      if (
        event.data.type === 'error' &&
        iframeRef.current
        // event.origin === 'http://localhost:3001/console'
      ) {
        const srcDocStr = iframeRef.current.getAttribute('srcDoc')
        const lines = srcDocStr.replace(/\r\n/g, '\n').split('\n')
        const startLineOffset =
          lines.findIndex((line) => line.includes('user-script')) + 1
        console.log(`123`)
        log(event)
        setJSRuntimeError(() => ({
          ...event.data,
          offsetLineNo: startLineOffset,
        }))
      }
    }
    window.addEventListener('message', messageInterceptorHandler)
    return () =>
      window.removeEventListener('message', messageInterceptorHandler)
  }, [iframeRef])

  return (
    <CodingPadContainer isCodeConflicted={isConflicted}>
      {!isConflicted && (
        <>
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
                onChange: (css) => onCodeChange({ ...currentScribble, css }),
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
                onChange: (html) => onCodeChange({ ...currentScribble, html }),
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
              iframeRef={iframeRef}
            />
          )}
        </>
      )}
      {isConflicted && <ConflictResolver scribble={currentScribble} />}
      {/* Show default screen */}
      {/* {!currentScribble && (
        <div className="scribbler-initial-screen-container">
          <div
            className="scribbler-initial-create-scribbler-button"
            onClick={() => {
              // TODO
              // setHideExplorer(false)
              // setIsCreateMode(true)
            }}
          >
            <FaPlus size={25} color="#3c3c3c" />
            <span>Create a scribble</span>
          </div>
        </div>
      )} */}
    </CodingPadContainer>
  )
}

CodingPad.propTypes = {
  isRun: PropTypes.bool,
  // setIsRun: PropTypes.func,
  setLoading: PropTypes.func,
  setAutoSaving: PropTypes.func,
  currentEditDetails: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.func,
  }),
}
