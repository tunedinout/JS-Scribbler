import { ListItem, styled } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { MdDelete } from 'react-icons/md'
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowDown,
} from 'react-icons/md'
import { getLogger } from '../../util'
import CodeFiles from './CodeFiles'
import { useCustomListItemWrapper } from './hooks'
import {
  ContentEditableScribbleName,
  DeleteButtonContainer,
} from './Explorer.styles'
import { Theme } from '@src/constants'
const logger = getLogger(`CustomListItemWrapper`)
export default function CustomListItemWrapper({
  scribble,
  onRename,
  onDelete,
  onSelect,
  isSelected,
  selectedFile,
}) {
  // can be either css, html and JS
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
    logger(`selectedFile effect`)(
      `selectedFile ${isSelected}`,
      selectedFile,
      scribble,
    )
    // if (isSelected) {
    //   onSelect(scribble, selectedFile)
    // }
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
        <CustomListItemIcon onClick={() => setIsCollapsed(!isCollapsed)}>
          {!isCollapsed && (
            <MdOutlineKeyboardArrowDown size={20} color={Theme.fontColor} />
          )}
          {isCollapsed && (
            <MdOutlineKeyboardArrowRight size={20} color={Theme.fontColor} />
          )}
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
          <DeleteButtonContainer {...{ onClick: () => onDelete(scribble) }}>
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
          selectedFile={selectedFile}
          onFileSelectionChange={(file) => onSelect(scribble, file)}
          isParentSelected={isSelected}
        />
      )}
    </>
  )
}

export const CustomListItemIcon = styled('div')({
  padding: '0.5rem',
  marginRight: '8px',
  display: 'flex',
})

export const CustomListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})(({ isSelected }) => ({
  fontSize: '14px',
  minWidth: '200px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: '8px',
  // paddingTop: '8px',
  boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
  marginBottom: '8px',
  borderRadius: '4px',
  backgroundColor: isSelected ? Theme.HighlightColor : 'transparent',
  '&:hover': {
    backgroundColor: Theme.hoverColor,
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
