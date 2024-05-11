import React, { useState } from 'react'
import ButtonBar from '../components/button-bar/ButtonBar'
import GoogleLoginWidget from '../components/login/GoogleLoginWidget'
import CodingGround from '../components/content/coding-ground/CodingGround'

// create session management component that works at app level

export default function HomePage({
    code,
    driveFolderId,
    accessToken,
}) {
    const [isRun, setIsRun] = useState(false);
    const [disableRun, setDisableRun ] = useState(false);

    return (
        <div className="App">
            <ButtonBar
                {...{
                    disableRun,
                    onRunButton: () => setIsRun(true) ,
                }}
            />
            <GoogleLoginWidget />
            <CodingGround
                {...{
                    // TODO: lets this component be responsible saving the said file

                    isRun,
                    setIsRun,
                    setDisableRun,
                    code,
                    driveFolderId,
                    accessToken,
                }}
            />
        </div>
    )
}
