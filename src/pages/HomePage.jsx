import React from 'react'
import ButtonBar from '../components/button-bar/ButtonBar'
import GoogleLoginWidget from '../components/login/GoogleLoginWidget'
import TabJavascript from '../components/tabs/javascript/TabJavascript'

// create session management component that works at app level

export default function HomePage({
    isCompilationError,
    runtimeError,
    code,
    onFileChange,
    onCodeChange,
    handleRunClick,
    driveFolderId
}) {
    return (
        <div className="App">
            <ButtonBar
                {...{
                    disableRun: isCompilationError,
                    onRunButton: handleRunClick,
                }}
            />
            <GoogleLoginWidget />

            <TabJavascript
                {...{ onCodeChange, onFileChange, code, runtimeError, driveFolderId }}
            />
        </div>
    )
}
