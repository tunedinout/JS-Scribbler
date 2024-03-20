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
                    {files.map(({ name, id }, index) => {
                        return (
                            <CustomListItemWrapper
                                {...{
                                    file: { name, id },
                                    renameHandler,
                                    createFileHandler,
                                    deleteHandler,
                                    index,
                                    key: id,
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
