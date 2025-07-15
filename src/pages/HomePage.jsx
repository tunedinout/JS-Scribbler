import { useState } from 'react'
import ButtonBar from '../components/button-bar/ButtonBar'
import CodingGround from '../components/content/coding-ground/CodingGround'
import { CircularProgress, LinearProgress } from '@mui/material'

export default function HomePage() {
    const [isRun, setIsRun] = useState(false)
    const [disableRun, setDisableRun] = useState(false)
    const [loading, setLoading] = useState(false)
    const [autoSaving, setAutoSaving] = useState(false)

    return (
        <>
            <div style={{ width: '100%', height: '12px' }}>
                {autoSaving && (
                    <LinearProgress style={{ backgroundColor: 'none' }} />
                )}
            </div>

            {loading && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'fixed',
                        width: '100%',
                        height: '100%',
                        zIndex: 10,
                        top: 0,
                        left: 0,
                        background: '#fcfcfc',
                        opacity: '0.4',
                    }}
                >
                    <CircularProgress about="fsdfsdfs" />
                    <div>Please wait loading scribblers....</div>
                </div>
            )}

            <div className="App">
                <ButtonBar
                    {...{
                        disableRun,
                        onRunButton: () => setIsRun(true),
                    }}
                />
                {
                    <CodingGround
                        {...{
                            isRun,
                            setIsRun,
                            setDisableRun,
                            setLoading,
                            setAutoSaving,
                            autoSaving,
                        }}
                    />
                }
            </div>
        </>
    )
}
