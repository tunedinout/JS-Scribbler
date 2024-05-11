import React, { useEffect, useState } from 'react'
import {
    CollapseExpandIconContainer,
    CollapseIcon,
    ExpandIcon,
   SessionsContainer,
   SessionsHeadingWrapper,
    SessionsListWrapper,
    StyledPlusIcon,
} from './styles'
import CustomListItemWrapper from './CustomListItemWrapper'
import CustomListItemInput from './CustomListItemInput'

export default function SessionExplorer({
    sessions,
    label,
    renameSessionHandler,
    deleteSessionHandler,
    // TODO: file creation not in users hand, remove
    createSessionHandler,
    selectSessionHandler,
    currentSession,
    disableCreateSession
}) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isCreateMode, setIsCreateMode] = useState(false)

    // useEffect(() => console.log(`isCreateMode = ${isCreateMode}`), [isCreateMode])

    return (
        // TODO: call this session container
        <SessionsContainer>
            <SessionsHeadingWrapper>
                <div>{label}</div>
                <StyledPlusIcon
                    size={16}
                    onClick={() => !disableCreateSession && setIsCreateMode(true)}
                    disabled={disableCreateSession}
                />

                <CollapseExpandIconContainer
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {!isCollapsed && (
                        <CollapseIcon size={16} title="Collapse" />
                    )}
                    {isCollapsed && <ExpandIcon size={16} title="Expand" />}
                </CollapseExpandIconContainer>
            </SessionsHeadingWrapper>

            {!isCollapsed && (
                <SessionsListWrapper>
                    {sessions.map((session, index) => {

                        return (
                            <CustomListItemWrapper
                                {...{
                                    session,
                                    // TODO: renaming not allowed by user
                                    //  BUT we can use this to rename a session
                                    renameSessionHandler,
                                     // TODO: deleting not allowed by user
                                    deleteSessionHandler,
                                    // TODO: no selection is needed
                                    // the default js , css and html is already selected
                                    selectSessionHandler,
                                    index,
                                    key: session.id,
                                    // TODO: remove all file selection 
                                    isSelected: currentSession.id === session.id,
                                }}
                            />
                        )
                    })}
                    {/* TODO: create fiddle session logic goes here */}
                    {isCreateMode && (
                        <CustomListItemInput
                            handler={(name) => {
                                createSessionHandler({ name }, () =>
                                    setIsCreateMode(false)
                                )
                            }}
                        />
                    )}
                </SessionsListWrapper>
            )}
        </SessionsContainer>
    )
}
