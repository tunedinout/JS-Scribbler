import { useState } from 'react'
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
    createSessionHandler,
    selectSessionHandler,
    currentSession,
    disableCreateSession,
    isCreateMode,
    setIsCreateMode,
}) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <SessionsContainer>
            <SessionsHeadingWrapper>
                <div>{label}</div>
                <StyledPlusIcon
                    size={16}
                    onClick={() =>
                        !disableCreateSession && setIsCreateMode(true)
                    }
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
                                    renameSessionHandler,
                                    deleteSessionHandler,
                                    selectSessionHandler,
                                    index,
                                    key: session.name,
                                    isSelected:
                                        currentSession?.name === session?.name,
                                }}
                            />
                        )
                    })}
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
