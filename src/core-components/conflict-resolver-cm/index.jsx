import CodeMirrorMerge from 'react-codemirror-merge'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { javascript } from '@codemirror/lang-javascript'
import { githubDark } from '@uiw/codemirror-theme-github'
import {
  DifferContainer,
  LeftArrow,
  RejectCurrent,
  SaveUpstream,
} from './styles'
import { useEffect, useRef, useState } from 'react'
import { getLogger } from '@src/util'
import { Theme } from '@src/constants'
import { Tooltip } from '../tooltip'
const { Original, Modified } = CodeMirrorMerge

const logger = getLogger(`ConflictResolver`)
export function ConflictResolver({ scribble }) {
  const log = logger(`inline`)
  const [height, setHeight] = useState(window.innerHeight - 80)
  const { js, css, html } = scribble
  const ref = useRef(null)
  useEffect(() => {
    const log = logger(`effect`)
    let timeout
    function eventListener() {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        log(`window.innerHeight`, window.innerHeight)
        const top = ref.current?.getBoundingClientRect().top || 80
        setHeight(window.innerHeight - top)
        log(`ref.currnet.offsetY`, top)
      }, 300)
    }
    window.addEventListener('resize', eventListener)
    return () => window.removeEventListener('resize', eventListener)
  }, [])
  const {
    js: conflictedJS,
    css: conflictedCSS,
    html: conflictedHTML,
  } = scribble.conflict

  return (
    <>
      <DifferContainer ref={ref} height={height}>
        {conflictedJS && (
          <CodeMirrorMerge
            theme={githubDark}
            highlightChanges
            style={{
              width: '100%',
              height: '100%',
            }}
            revertControls="b-to-a"
            renderRevertControl={(side, apply) => (
              // <Tooltip title="Accept this change">
              <LeftArrow onClick={apply} size={12} fill="white" color="white" />
              // </Tooltip>
            )}
            gutter
          >
            <div
              style={{
                position: 'sticky',
                top: 0,
                left: 0,
                zIndex: '9999',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                columnGap: '16px',
                gridTemplateRows: 'auto',
                // justifyContent: 'space-between',
                // alignItems: 'center',
                color: Theme.fontColor,
                fontFamily: Theme.fontFamily,
                height: '4rem',
                width: '100%',
                background: Theme.primaryColor,
              }}
            >
              <div
                style={{
                  // width: '49%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  // border: `1px dotted ${Theme.fontColor}`,
                  backgroundColor: Theme.codeEditor.editorBgColor,
                  // marginRight: '18px',
                  paddingRight: '2rem',
                }}
              >
                <div
                  style={{
                    height: '4rem',
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '3rem',
                    fontSize: '1rem',
                  }}
                >
                  {`>>>>>>> Current Changes >>>>>>>>>`}
                </div>
                <div style={{ display: 'flex' }}>
                  <Tooltip title="Save this file to server and resolve this conflict by overriding incoming changes.">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.5rem',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '.75rem',
                      }}
                      onClick={() => log('conflict resolved')}
                    >
                      <SaveUpstream size={16} />
                      <span>Accept all current</span>
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div
                style={{
                  // width: '49%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  // border: `1px dotted ${Theme.fontColor}`,
                  backgroundColor: Theme.codeEditor.editorBgColor,
                  // marginRight: '18px',
                  paddingRight: '2rem',
                }}
              >
                <div
                  style={{
                    height: '4rem',
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '3rem',
                    fontSize: '1rem',
                  }}
                >
                  {`<<<<<<<<< Incoming Changes <<<<<<<<<`}
                </div>
                <div style={{ display: 'flex' }}>
                  <Tooltip title="Reject your changes and resolve this conflict by accepting incoming changes.">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.5rem',
                        gap: '0.5rem',
                        fontSize: '.75rem',
                        cursor: 'pointer',
                      }}
                      onClick={() => log('conflict resolved')}
                    >
                      <RejectCurrent size={16} />
                      <span>Accept all incoming</span>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
            <Original
              value={js}
              extensions={[javascript(), EditorView.lineWrapping]}
            />
            <Modified
              value={conflictedJS}
              extensions={[
                javascript(),
                EditorView.lineWrapping,
                EditorState.readOnly.of(true),
              ]}
              editable={false}
            />
          </CodeMirrorMerge>
        )}
      </DifferContainer>
    </>
  )
}
