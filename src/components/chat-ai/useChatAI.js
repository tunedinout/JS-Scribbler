import { useEffect, useRef, useState } from 'react'
import { getLLMOpinion } from '../../api'
import { getLogger } from '../../util'

const logger = getLogger(`useChatAI`)
function useChatAI(inputCode, ref) {
    const [inputText, setInputText] = useState('')
    const [history, setHistory] = useState([])

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight
        }
    }, [history, ref])
    const handlePromptSubmit = async () => {
        // const log = logger(`handlePromptSubmit`);
        const text = inputText
        setInputText('')
        setHistory((prev) => [...prev, { text, src: 'user' }])
        getLLMOpinion(text)
            .then((response) => {
                const text = response.data?.choices[0]?.message?.content
                setHistory((prev) => [...prev, { text: text, src: 'ai' }])
            })
            .catch((err) => logger(`error`)(err))
        // const aiMesg = await getLLMOpinion(text)
    }
    const handleUserInput = (e) => {
        const log = logger(`handleUserInput`)
        e.preventDefault()
        const text = e.target.innerText
        log(text)
        setInputText(text)
        // if (ref.current) {
        //     ref.current.scrollTop = ref.current.scrollHeight
        // }
    }
    return {
        history,
        handlePromptSubmit,
        handleUserInput,
        inputText,
    }
}

export { useChatAI }
