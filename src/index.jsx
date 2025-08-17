import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
// NOTE: below builds are needed for supporting html and CSS
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-javascript.js'
import 'ace-builds/src-noconflict/theme-github_dark.js'
import 'ace-builds/src-noconflict/ext-language_tools.js'
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/ext-error_marker'
import 'ace-diff/dist/ace-diff-dark.min.css'

// worker html works with htmlhint
import 'ace-builds/src-min-noconflict/worker-html'
// below does not work for css and js
// TODO: find a better solution
import 'ace-builds/src-noconflict/worker-javascript'
ace.config.setModuleUrl('ace/mode/css_worker', `./src/workers/worker-css.js`)
ace.config.setModuleUrl(
  'ace/mode/javascript_worker',
  `./src/workers/worker-javascript.js`,
)
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
