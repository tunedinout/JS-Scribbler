import { useCallback, useEffect, useRef, useState } from 'react'

function useCustomListItemWrapper({ scribble, onRename }) {
    const [isHover, setIsHover] = useState(false)
    const [isInputMode, setIsInputMode] = useState(false)
    const [newScribbleName, setNewScribbleName] = useState(scribble.name)
    const [isCollapsed, setIsCollapsed] = useState(true)
    const scribbleRef = useRef()
    const { updateCursor } = useCustomCursorSelection({
        inputRef: scribbleRef,
    })
    function onInputHandler(e) {
        setNewScribbleName(e.target.textContent)
        updateCursor()
    }

    const outsideClickHandler = useCallback(() => {
        if (isInputMode) {
            const oldScribleName = scribble.name
            const newScribbleName = scribbleRef.current.textContent
            console.log(
                `The old scribble name = ${oldScribleName}, new = ${newScribbleName} `
            )
            onRename(scribble, newScribbleName)
            setIsInputMode(false)
        }
    }, [scribble, isInputMode, scribbleRef, onRename])
    useOutsideClick({ handler: outsideClickHandler, ref: scribbleRef })

    return {
        isHover,
        setIsHover,
        isInputMode,
        setIsInputMode,
        newScribbleName,
        setNewScribbleName,
        scribbleRef,
        onInputHandler,
        isCollapsed,
        setIsCollapsed,
    }
}
/**
 *
 *
 */
function useCustomCursorSelection({ inputRef }) {
    const [cursorPosition, setCursorPosition] = useState(null)
    function handleCursor() {
        if (inputRef.current && cursorPosition !== null) {
            // create a range object
            // this is what we need to change and
            // give to some document API
            const range = document.createRange()
            const sel = document.getSelection()

            // if the text is empty string
            if (!inputRef.current.childNodes[0]?.length) {
                const textNode = document.createTextNode('')
                inputRef.current.appendChild(textNode)
            }
            // give the node on which cursor
            // position needs to set and give
            // the cursor position
            range.setStart(inputRef.current.childNodes[0], cursorPosition)
            range.collapse(true)
            // remove existing range object
            sel.removeAllRanges()
            // set it to newly set range
            sel.addRange(range)
        }
    }
    useEffect(() => {
        handleCursor()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cursorPosition])

    return {
        updateCursor: () => {
            const range = document.getSelection().getRangeAt(0)
            setCursorPosition(range.startOffset)
        },
    }
}

function useOutsideClick({ handler, ref }) {
    useEffect(() => {
        const curentRef = ref.curent
        // add event listener on document
        // when target not equal to scribble ref
        const handleOutsideClick = (e) => {
            console.log('useOutsideClick')
            // ref.current.blur()
            if (ref?.current && !ref.current.contains(e.target)) {
                handler(e)
            }
        }

        const onKeyDown = (e) => {
            if (e.keyCode === 13) {
                console.log(e.key)
                e.preventDefault()
                ref.current.blur()
                handler(e)
            }
        }
        if (ref.current) {
            ref.current.addEventListener('keydown', onKeyDown)
        }

        console.log(`running outside click effect.....`)

        document.addEventListener('click', handleOutsideClick)

        return () => {
            curentRef?.removeEventListener('keydown', onKeyDown)
            document.removeEventListener('click', handleOutsideClick)
        }
    }, [handler, ref])
}
export { useCustomCursorSelection, useCustomListItemWrapper, useOutsideClick }

