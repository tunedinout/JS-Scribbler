import { CustomListItem, CustomListItemIcon } from './CustomListItemWrapper'
import { ScribblesListWrapper } from './Explorer.styles'
import { MdCss, MdHtml, MdJavascript } from 'react-icons/md'
import PropTypes from 'prop-types'

export default function CodeFiles({
  isParentSelected,
  selectedFile,
  onFileSelectionChange,
}) {
  // useEffect(() => {
  //   onFileSelectionChange(selectedFile)
  // }, [onFileSelectionChange, selectedFile])
  return (
    <>
      <ScribblesListWrapper
        style={{
          marginLeft: '1rem',
          width: '90%',
          height: 'fit-content',
        }}
      >
        <CustomListItem
          {...{
            isSelected: isParentSelected && selectedFile === 'js',
            onClick: () => onFileSelectionChange('js'),
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
            onClick: () => onFileSelectionChange('css'),
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
            onClick: () => onFileSelectionChange('html'),
          }}
        >
          {/* The JS File */}
          <CustomListItemIcon>
            <MdHtml size={20} fill="orange" />
          </CustomListItemIcon>
          <div>{'index.html'}</div>
        </CustomListItem>
      </ScribblesListWrapper>
    </>
  )
}

CodeFiles.propTypes = {
  isParentSelected: PropTypes.bool,
  onFileSelectionChange: PropTypes.func,
}
