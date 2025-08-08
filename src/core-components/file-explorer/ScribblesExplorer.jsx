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
import PropTypes from 'prop-types'

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
                                key={scribble.name}
                                {...{
                                    scribble,
                                    onRename,
                                    onDelete,
                                    onSelect,
                                    index,

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

ScribblesExplorer.propTypes = {
    scribbles: PropTypes.arrayOf(
        PropTypes.shape({
            sid: PropTypes.string,
            name: PropTypes.string,
            css: PropTypes.string,
            js: PropTypes.string,
            html: PropTypes.string,
        })
    ),
    label: PropTypes.string,
    onRename: PropTypes.func,
    onDelete: PropTypes.func,
    onCreate: PropTypes.func,
    onSelect: PropTypes.func,
    currentScribble:
        PropTypes.shape({
            sid: PropTypes.string,
            name: PropTypes.string,
            css: PropTypes.string,
            js: PropTypes.string,
            html: PropTypes.string,
        }) || null,
    isCreateMode: PropTypes.bool,
    setIsCreateMode: PropTypes.func,
}
