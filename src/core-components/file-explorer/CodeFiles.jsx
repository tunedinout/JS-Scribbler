import React, { useEffect, useState } from 'react'
import { CustomListItem, CustomListItemIcon } from './CustomListItemWrapper'
import { SessionsListWrapper } from './styles'
import { RiJavascriptFill } from 'react-icons/ri'
import { MdCss, MdHtml, MdJavascript } from 'react-icons/md'

export default function CodeFiles({
    sessionId,
    js = '',
    html = '',
    css = '',
    isParentSelected,
    onFileSelectionChange,
}) {
    const [selectedFile, setSelectedFile] = useState('js')

    useEffect(() => {
        onFileSelectionChange(selectedFile);
    }, [selectedFile])
    return (
        <>
            <SessionsListWrapper
                style={{
                    marginLeft: '32px',
                    width: '90%',
                    height: 'fit-content',
                }}
            >
                <CustomListItem
                    {...{
                        isSelected: isParentSelected && selectedFile === 'js',
                        onClick: () => setSelectedFile('js'),
                    }}
                >
                    {/* The JS File */}
                    <CustomListItemIcon>
                        <MdJavascript size={20} fill="orange" />
                    </CustomListItemIcon>
                    <div>{'index.js'}</div>
                </CustomListItem>
                <CustomListItem
                    {...{
                        isSelected: isParentSelected && selectedFile === 'css',
                        onClick: () => setSelectedFile('css'),
                    }}
                >
                    {/* The JS File */}
                    <CustomListItemIcon>
                        <MdCss size={20} fill="orange" />
                    </CustomListItemIcon>
                    <div>{'index.css'}</div>
                </CustomListItem>
                <CustomListItem
                    {...{
                        isSelected: isParentSelected && selectedFile === 'html',
                        onClick: () => setSelectedFile('html'),
                    }}
                >
                    {/* The JS File */}
                    <CustomListItemIcon>
                        <MdHtml size={20} fill="orange" />
                    </CustomListItemIcon>
                    <div>{'index.html'}</div>
                </CustomListItem>
            </SessionsListWrapper>
        </>
    )
}
