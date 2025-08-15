import { useEffect, useRef, useState } from 'react'

import PropTypes from 'prop-types'
import { saveScribble } from '@src/indexedDB.util'
import {
  ScribblesContainer,
  ScribblesHeadingWrapper,
  ScribblesListWrapper,
  StyledPlusIcon,
} from './Explorer.styles'
import CustomListItemWrapper from './CustomListItemWrapper'
import CustomListItemInput from './CustomListItemInput'
import { getLogger } from '@src/util'
import { Tooltip } from '../tooltip'

const logger = getLogger('ScribblesExplorer')
export default function ScribblesExplorer({
  currentEditDetails,
  setCurrentEditDetails,
  scribbles,
  setScribbles,
}) {
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const channelRef = useRef(null)

  useEffect(() => {
    channelRef.current = new BroadcastChannel('scribbles')
    channelRef.current.onmessage = (event) => {
      const log = logger(`Channel onmessage`)
      log(event)
      const { type, payload } = event.data
      if (type === 'save') {
        const { scribble: savedScribble } = payload
        setScribbles((scribbles) =>
          scribbles.map((scribble) =>
            scribble.name === savedScribble?.name ? savedScribble : scribble,
          ),
        )
      } else if (type === 'sync') {
        const { scribbles } = payload
        setScribbles(scribbles)
        setCurrentEditDetails({ name: scribbles[0]?.name, type: 'js' })
      }
    }
    return () => channelRef.current?.close()
  }, [setScribbles, setCurrentEditDetails, channelRef])

  const onRename = () => {
    console.log(`Rename not implemented`)
  }
  const onDelete = () => {
    console.log(`delete not implemented`)
  }
  const onCreate = async (name) => {
    const newScribble = { name, js: '', css: '', html: '' }
    await saveScribble(newScribble)
    setCurrentEditDetails({ name, type: 'js' })
  }
  const onSelect = (scribble, type) => {
    const log = logger(`onSelect`)
    log(`type`, type)
    setCurrentEditDetails({ name: scribble.name, type })
  }
  return (
    <ScribblesContainer>
      <ScribblesHeadingWrapper>
        <div style={{ color: 'white' }}>{'Explorer'}</div>
        <Tooltip title={'Create a new scribble'}>
          <StyledPlusIcon size={16} onClick={() => setIsCreateMode(true)} />
        </Tooltip>
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
                  selectedFile: currentEditDetails?.type || 'js',
                  isSelected: currentEditDetails?.name === scribble?.name,
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
  currentEditDetails:
    PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
    }) || null,
  setCurrentEditDetails: PropTypes.func,
}
