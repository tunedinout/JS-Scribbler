import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'

function useCustomListItemWrapper({ file, renameHandler }) {
    const [isHover, setIsHover] = useState(false)
    const [isInputMode, setIsInputMode] = useState(false)
    const [newFileName, setNewFileName] = useState(file.name)
    const fileRef = useRef()
    const {  updateCursor } = useCustomCursorSelection({
        inputRef: fileRef,
    })

    useEffect(() => {
        console.log(`checking is rename in hook`, isInputMode)
    }, [isInputMode])

    function onInputHandler(e) {
        setNewFileName(e.target.textContent)
        updateCursor()
    }

    const outsideClickHandler = useCallback(
        () => {

            if(isInputMode){
                const oldFileName = file.name;
                const newFileName = fileRef.current.textContent
                console.log(
                    `The old file name = ${oldFileName}, new = ${newFileName} `
                )
                renameHandler(oldFileName, newFileName)
                setIsInputMode(false);
            }
            
        },
        [ file, isInputMode, fileRef]
    )
    useOutsideClick({ handler: outsideClickHandler, ref: fileRef })

    return {
        isHover,
        setIsHover,
        isInputMode,
        setIsInputMode,
        newFileName,
        setNewFileName,
        fileRef,
        onInputHandler,
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
        // when target not equal to file ref
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
