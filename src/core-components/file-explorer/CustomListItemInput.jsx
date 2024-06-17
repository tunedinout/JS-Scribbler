import React, {  useEffect, useRef, useState } from 'react'
import { ContentEditableSessionName } from './styles'
import { CustomListItem, CustomListItemIcon } from './CustomListItemWrapper'
import { RiFolder2Fill } from 'react-icons/ri'
import { useCustomCursorSelection, useOutsideClick } from './hooks'

export default function CustomListItemInput({ handler }) {
    console.log('CustomListItemInput')
    const { onSessionNameInput, value: newSessionName, ref } = useNewSessionInput({handler});
    return (
        <CustomListItem>
            <CustomListItemIcon>
                <RiFolder2Fill size={20} color='yellow' />
            </CustomListItemIcon>
            <ContentEditableSessionName
                {...{
                    ref,
                    value: newSessionName,
                    contentEditable: true,
                    onInput: onSessionNameInput,
                }}
            >
                {newSessionName}
            </ContentEditableSessionName>
        </CustomListItem>
    )
}

function useNewSessionInput({handler}) {
    const ref = useRef(null)
    const [value, setValue] = useState('untitled-file')
    const { updateCursor } = useCustomCursorSelection({inputRef: ref});
    const onSessionNameInput = (e) => {
        setValue(e.target.textContent)
        // sends cursor to where the change has been made
        updateCursor();
    }
    const handleOutSideClick = (e) => {
        
           
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
        onSessionNameInput,
        value,
        ref,
    }
} 
