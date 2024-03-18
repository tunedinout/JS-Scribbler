import React, {  useEffect, useRef, useState } from 'react'
import { ContentEditableFileName } from './styles'
import { CustomListItem, CustomListItemIcon } from './CustomListItemWrapper'
import { FaRegFile } from 'react-icons/fa'
import { useCustomCursorSelection, useOutsideClick } from './hooks'

export default function CustomListItemInput({ handler }) {
    console.log('CustomListItemInput')
    const { onFileNameInput, value: newFilename, ref } = useCustomListItemInput({handler});
    return (
        <CustomListItem>
            <CustomListItemIcon>
                <FaRegFile size={20} />
            </CustomListItemIcon>
            <ContentEditableFileName
                {...{
                    ref,
                    value: newFilename,
                    contentEditable: true,
                    onInput: onFileNameInput,
                }}
            >
                {newFilename}
            </ContentEditableFileName>
        </CustomListItem>
    )
}

function useCustomListItemInput({handler}) {
    const ref = useRef(null)
    const [value, setValue] = useState('untitled-file')
    const { updateCursor } = useCustomCursorSelection({inputRef: ref});
    const onFileNameInput = (e) => {
        setValue(e.target.textContent)
        // sends cursor to where the change has been made
        updateCursor();
    }
    const handleOutSideClick = (e) => {
        
            // TODO : check if a module can be created to handle
            // all the cases to allow
            // or perhaps validation

            // call the create file handler
            // with last value
            console.log(document.activeElement)
            if(!(document.activeElement === ref?.current)){
                handler(ref.current.textContent)
            }
            
    }
   

   useOutsideClick({handler: handleOutSideClick, ref})

   useEffect(() => {
    // focus on mount of ref
    if(ref.current){
        ref.current.focus()
        // const range = document.getSelection().getRangeAt(0)
        // setCursorPosition(range.endOffset)
    }
   },[ref])

    return {
        onFileNameInput,
        value,
        ref,
    }
} 
