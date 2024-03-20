import React, { useEffect, useState } from 'react'
import {
    CollapseExpandIconContainer,
    CollapseIcon,
    ExpandIcon,
    FilesContainer,
    FilesHeadingWrapper,
    FilesListWrapper,
    StyledPlusIcon,
} from './styles'
import CustomListItemWrapper from './CustomListItemWrapper'
import CustomListItemInput from './CustomListItemInput'

export default function FileExplorer({
    files,
    label,
    renameHandler,
    deleteHandler,
    createFileHandler,
    selectFileHandler,
    currentFile,
}) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isCreateMode, setIsCreateMode] = useState(false)

    // useEffect(() => console.log(`isCreateMode = ${isCreateMode}`), [isCreateMode])

    return (
        <FilesContainer>
            <FilesHeadingWrapper>
                <div>{label}</div>
                <StyledPlusIcon
                    size={16}
                    onClick={() => setIsCreateMode(true)}
                />

                <CollapseExpandIconContainer
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {!isCollapsed && (
                        <CollapseIcon size={16} title="Collapse" />
                    )}
                    {isCollapsed && <ExpandIcon size={16} title="Expand" />}
                </CollapseExpandIconContainer>
            </FilesHeadingWrapper>

            {!isCollapsed && (
                <FilesListWrapper>
                    {files.map((file, index) => {

                        return (
                            <CustomListItemWrapper
                                {...{
                                    file,
                                    renameHandler,
                                    deleteHandler,
                                    selectFileHandler,
                                    index,
                                    key: file.id,
                                    isSelected: currentFile.id === file.id,
                                }}
                            />
                        )
                    })}
                    {isCreateMode && (
                        <CustomListItemInput
                            handler={(name) => {
                                createFileHandler({ name }, () =>
                                    setIsCreateMode(false)
                                )
                            }}
                        />
                    )}
                </FilesListWrapper>
            )}
        </FilesContainer>
    )
}
