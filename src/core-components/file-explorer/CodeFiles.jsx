import { CustomListItem, CustomListItemIcon } from './CustomListItemWrapper'
import { CodeFilesWrapper } from './Explorer.styles'
import { MdCss, MdHtml, MdJavascript } from 'react-icons/md'
import PropTypes from 'prop-types'
import { Theme } from '@src/constants'

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
      <CodeFilesWrapper
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
            <MdJavascript size={24} fill={Theme.fontColor} />
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
            <MdCss size={24} fill={Theme.fontColor} />
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
            <MdHtml size={24} fill={Theme.fontColor} />
          </CustomListItemIcon>
          <div>{'index.html'}</div>
        </CustomListItem>
      </CodeFilesWrapper>
    </>
  )
}

CodeFiles.propTypes = {
  isParentSelected: PropTypes.bool,
  onFileSelectionChange: PropTypes.func,
}
