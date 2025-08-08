import { ListItem, styled } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { RiFolder2Fill } from 'react-icons/ri'
import { getLogger } from '../../util'
import CodeFiles from './CodeFiles'
import { useCustomListItemWrapper } from './hooks'
import {
    CollapseExpandIconContainer,
    CollapseIcon,
    ContentEditableScribbleName,
    DeleteButtonContainer,
    ExpandIcon,
} from './styles'
const logger = getLogger(`CustomListItemWrapper`)
export default function CustomListItemWrapper({
    scribble,
    onRename,
    onDelete,
    onSelect,
    isSelected,
}) {
    // can be either css, html and JS
    const [selectedFile, setSelectedFile] = useState('js')
    const {
        isHover,
        setIsHover,
        isInputMode,
        setIsInputMode,
        newScribbleName,
        scribbleRef,
        onInputHandler,
        setIsCollapsed,
        isCollapsed,
    } = useCustomListItemWrapper({ scribble, onRename })

    useEffect(() => {
        logger(`selectedFile effect`)(`selectedFile ${isSelected}`, selectedFile, scribble)
        if (isSelected) {
            onSelect(scribble, selectedFile)
        }
    }, [selectedFile, isSelected, scribble, onSelect])

    return (
        <>
            <CustomListItem
                {...{
                    disableRipple: true,
                    key: scribble.sid,
                    button: true,
                    onClick: () => onSelect(scribble, selectedFile),
                    onMouseMove: () => setIsHover(true),
                    onMouseLeave: () => setIsHover(false),
                    // for css
                    isSelected,
                }}
            >
                <CollapseExpandIconContainer
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {!isCollapsed && (
                        <CollapseIcon size={16} title="Collapse" />
                    )}
                    {isCollapsed && <ExpandIcon size={16} title="Expand" />}
                </CollapseExpandIconContainer>
                <CustomListItemIcon>
                    <RiFolder2Fill size={20} fill="#F9F871" />
                </CustomListItemIcon>

                <ContentEditableScribbleName
                    {...{
                        ref: scribbleRef,
                        contentEditable: isInputMode,
                        onClick: (e) => {
                            e.stopPropagation()
                            setIsInputMode(true)
                        },
                        onInput: onInputHandler,
                    }}
                >
                    {newScribbleName}
                </ContentEditableScribbleName>

                {isHover && (
                    <DeleteButtonContainer
                        {...{ onClick: () => onDelete(scribble) }}
                    >
                        <MdDelete
                            {...{
                                size: 12,
                                title: 'Delete scribble',
                            }}
                        />
                    </DeleteButtonContainer>
                )}
            </CustomListItem>
            {!isCollapsed && (
                <CodeFiles
                    onFileSelectionChange={(file) => setSelectedFile(file)}
                    isParentSelected={isSelected}
                />
            )}
        </>
    )
}

export const CustomListItemIcon = styled('div')({
    marginRight: '8px',
    display: 'flex',
})

export const CustomListItem = styled(ListItem, {
    shouldForwardProp: (prop) => prop!== 'isSelected'
})(({ isSelected }) => ({
    fontFamily: 'Noto Sans',
    fontSize: '12px',
    minWidth: '200px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    paddingTop: '8px',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '8px',
    borderRadius: '4px',
    backgroundColor: isSelected ? '#3c3c3c' : 'transparent',
    '&:hover': {
        backgroundColor: '#3c3c3c',
    },
    '&:active': {
        backgroundColor: 'none',
    },
}))
CustomListItemWrapper.propTypes = {
    scribble: PropTypes.shape({
        sid: PropTypes.string,
        name: PropTypes.string,
        css: PropTypes.string,
        js: PropTypes.string,
        html: PropTypes.string,
    }),
    onRename: PropTypes.func,
    onDelete: PropTypes.func,
    onSelect: PropTypes.func,
    isSelected: PropTypes.bool,
}
