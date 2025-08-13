import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getLogger } from '@src/util'
import DOMPurify from 'dompurify'
import { IFrame, IFrameContainer } from './styles'
// initially just run html and css
const origContentSrcDoc = `<!DOCTYPE html>
<html>
  <head>
    <title>Preview</title>
  </head>
  <body>
  </body>
</html>`
const errorTracker = `window.onerror = function(message, url, lineNo, columnNo, error) {
  parent.postMessage({type: 'error', message, error: error.toString(), lineNo, columnNo}, '*');
  // prevent firing of default event handler
  return true;}`

const logger = getLogger(`Preview`)
function Preview({ htmlContent, css, js, isRun, iframeRef }) {
  const [srcDoc, setSrcDoc] = useState(origContentSrcDoc)

  useEffect(() => {
    logger(`htmlContent`)(htmlContent)
  }, [htmlContent])

  useEffect(() => {
    if (isRun)
      setSrcDoc(`<!DOCTYPE html>
      <html>
        <head>
          <title>Preview</title>
          <style> ${css} </style>
          <script>
            ${errorTracker}
          </script>
        </head>
        <body>  
        <div id="user-html" style="background: content-box ${'white'};">     
          ${DOMPurify.sanitize(htmlContent)}
        </div>
        <script id="user-script">
          ${js}
        </script>
        </body>
      </html>`)
    else {
      setSrcDoc(origContentSrcDoc)
    }
  }, [isRun, htmlContent, css, js])

  return (
    <IFrameContainer>
      <IFrame
        ref={iframeRef}
        // onError={(error) => console.error(error)}
        srcDoc={srcDoc}
        id="preview"
      />
    </IFrameContainer>

    // </div>
  )
}

Preview.propTypes = {
  htmlContent: PropTypes.string,
  css: PropTypes.string,
  js: PropTypes.string,
  isRun: PropTypes.bool,
}
export default Preview
