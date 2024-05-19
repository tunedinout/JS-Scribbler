import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'

function useCustomListItemWrapper({ session, renameSessionHandler }) {
    const [isHover, setIsHover] = useState(false)
    const [isInputMode, setIsInputMode] = useState(false)
    const [newSessionName, setNewSessionName] = useState(session.name)
    const [isCollapsed, setIsCollapsed] = useState(true);
    const sessionRef = useRef()
    const {  updateCursor } = useCustomCursorSelection({
        inputRef: sessionRef,
    })

    useEffect(() => {
        console.log(`checking is rename in hook`, isInputMode)
    }, [isInputMode])

    function onInputHandler(e) {
        setNewSessionName(e.target.textContent)
        updateCursor()
    }

    const outsideClickHandler = useCallback(
        () => {

            if(isInputMode){
                const oldSessionName = session.name;
                const newSessionName = sessionRef.current.textContent
                console.log(
                    `The old session name = ${oldSessionName}, new = ${newSessionName} `
                )
                renameSessionHandler(session, newSessionName)
                setIsInputMode(false);
            }
            
        },
        [ session, isInputMode, sessionRef]
    )
    useOutsideClick({ handler: outsideClickHandler, ref: sessionRef })

    return {
        isHover,
        setIsHover,
        isInputMode,
        setIsInputMode,
        newSessionName,
        setNewSessionName,
        sessionRef,
        onInputHandler,
        isCollapsed,
        setIsCollapsed
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
            if(!inputRef.current.childNodes[0]?.length){
                const textNode = document.createTextNode('');
                inputRef.current.appendChild(textNode);
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
    }, [cursorPosition])

    return {
       updateCursor: () => {
        const range = document.getSelection().getRangeAt(0)
        setCursorPosition(range.startOffset)
       }
    }
}

function useOutsideClick({ handler, ref }) {
    useEffect(() => {
        // add event listener on document
        // when target not equal to session ref
        const handleOutsideClick = (e) => {
            console.log('useOutsideClick')
            // ref.current.blur()
            if(ref?.current && !ref.current.contains(e.target)){
                handler(e);
            }
        }

        const onKeyDown = (e) => {
            if(e.keyCode === 13){
                console.log(e.key)
                e.preventDefault()
                ref.current.blur();
                handler(e)
            }
        }
        if(ref.current){
            ref.current.addEventListener('keydown', onKeyDown);
        }

        console.log(`running outside click effect.....`)

        document.addEventListener('click', handleOutsideClick)

        return () => {
            ref?.current?.removeEventListener('keydown', onKeyDown)
            document.removeEventListener('click', handleOutsideClick)}
    }, [handler, ref])
}
export { useCustomListItemWrapper, useCustomCursorSelection, useOutsideClick }
