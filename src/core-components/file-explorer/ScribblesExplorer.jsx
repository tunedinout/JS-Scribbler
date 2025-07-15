import { useState } from 'react'
import {
    CollapseExpandIconContainer,
    CollapseIcon,
    ExpandIcon,
    ScribblesContainer,
    ScribblesHeadingWrapper,
    ScribblesListWrapper,
    StyledPlusIcon,
} from './styles'
import CustomListItemWrapper from './CustomListItemWrapper'
import CustomListItemInput from './CustomListItemInput'

export default function ScribblesExplorer({
    scribbles,
    label,
    onRename,
    onDelete,
    onCreate,
    onSelect,
    currentScribble,
    isCreateMode,
    setIsCreateMode,
}) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <ScribblesContainer>
            <ScribblesHeadingWrapper>
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
            </ScribblesHeadingWrapper>

            {!isCollapsed && (
                <ScribblesListWrapper>
                    {scribbles.map((scribble, index) => {
                        return (
                            <CustomListItemWrapper
                                {...{
                                    scribble,
                                    onRename,
                                    onDelete,
                                    onSelect,
                                    index,
                                    key: scribble.name,
                                    isSelected:
                                        currentScribble?.name ===
                                        scribble?.name,
                                }}
                            />
                        )
                    })}
                    {isCreateMode && (
                        <CustomListItemInput
                            handler={(name) => {
                                onCreate({ name })
                            }}
                        />
                    )}
                </ScribblesListWrapper>
            )}
        </ScribblesContainer>
    )
}
