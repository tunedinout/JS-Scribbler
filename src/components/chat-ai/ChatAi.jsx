import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Modal,
    Typography,
} from '@mui/material'
import { useChatAI } from './useChatAI'
import { useRef } from 'react'

const style = {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '650px',
    height: '800px',
    bgcolor: 'rgba(48, 47, 47, 1)',
    borderRadius: '1rem',
    boxShadow: 24,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    outline: 'none',
    overflow: 'auto',
}

const inputAreaStyle = {
    height: 'fit-content',
    position: 'absolute',
    bottom: 0,
    padding: '8px',
    width: '100%',
    boxShadow: 24,
    bgcolor: 'rgba(81, 79, 79, 1)',
    backgroundClip: 'padding-box',
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
    borderRadius: '0.5rem',
}

const ChatAI = ({ inputCode, isOpen, onClose }) => {
    const ref = useRef(null)
    const { history, handlePromptSubmit, handleUserInput, inputText } =
        useChatAI(inputCode,ref)

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box
                sx={style}
            >
                <h2>Chat</h2>
                <Box
                    sx={{
                        height: '600px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        padding: '1rem',
                        boxSizing: 'border-box',
                        overflowY: 'auto',
                        width: '100%'
                    }}
                    ref={ref}
                >
                    {history?.map(({ text, src }) => {

                        return (
                            <div
                                style={{
                                    color: 'white',
                                    height: 'fit-content',
                                    width: src === 'ai' ? '100%' : '60%',
                                    backgroundColor:
                                        src === 'ai'
                                            ? 'rgba(48, 47, 47, 1)'
                                            : 'rgba(81, 79, 79, 1)',
                                    alignSelf:
                                        src === 'ai'
                                            ? 'flex-start'
                                            : 'flex-end',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    boxShadow: 'none',
                                    padding: '0.5rem'
                                }}
                            >
                               {src === 'ai' ? <div dangerouslySetInnerHTML={{ __html: text }} /> : text}
                            </div>
                        )
                    })}
                </Box>
                {/* <div>{userPrompt}</div> */}

                {/* <div dangerouslySetInnerHTML={{ __html: '' }} /> */}
                <Box sx={inputAreaStyle}>
                    <div
                        style={{
                            width: '100%',
                            height: '5rem',
                            outline: 'none',
                            padding: '8px',
                            overflow: 'auto',
                            fontSize: '14px',
                            // border: '1px solid white',
                            borderRadius: 'inherit',
                            boxSizing: 'border-box',
                        }}
                        contentEditable={true}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.target.innerText = ''
                                handlePromptSubmit()
                            }
                        }}
                        onInput={handleUserInput}
                    />
                    {/* {inputText} */}
                    {/* </div> */}
                </Box>
            </Box>
        </Modal>
    )
}

export { ChatAI }
