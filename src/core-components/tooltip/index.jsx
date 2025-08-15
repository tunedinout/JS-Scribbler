import { useLayoutEffect, useRef, useState } from 'react'
import { TooltipChildrenContainer, TooltipElement } from './Tooltip.styled'
import { getLogger } from '@src/util'
const logger = getLogger(`Tooltip`)
export const Tooltip = ({ children, title }) => {
  const containerRef = useRef(null)
  const childrenContainerRef = useRef(null)
  const [isHover, setIsHover] = useState(false)
  const [location, setLocation] = useState({ top: 0, left: 0 })

  useLayoutEffect(() => {
    const log = logger(`positionEffect`)
    if (isHover && childrenContainerRef.current && containerRef.current) {
      // set the tooltip position
      const tooltipRect = containerRef.current.getBoundingClientRect()
      const { width: tooltipWidth, height: tooltipHeight } = tooltipRect
      const childrenRect = childrenContainerRef.current.getBoundingClientRect()

      log(`tooltipWidth`, tooltipWidth)
      log(`tooltipHeight`, tooltipHeight)
      log(`childrenRect`, childrenRect)

      const bestPosition = getTooltipBestPosition({
        childrenRect,
        tooltipWidth,
        tooltipHeight,
      })
      const { top, left } = bestPosition
      log(`bestPosition`, { top, left })
      setLocation({ top: top, left: left })
    }
  }, [isHover])
  return (
    <>
      {
        <TooltipElement
          ref={containerRef}
          isHover={isHover}
          location={location}
        >
          {isHover ? title : ''}
        </TooltipElement>
      }
      <TooltipChildrenContainer
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        ref={childrenContainerRef}
        dataX={'something'}
      >
        {children}
      </TooltipChildrenContainer>
    </>
  )
}

function getTooltipBestPosition({ childrenRect, tooltipWidth, tooltipHeight }) {
  const log = logger(`getTooltipBestPosition`)
  const { top, right, bottom, left } = childrenRect
  // assume 4 mid points of the rect on which the midpoint of the tooltip will be aligned
  // with the midpoint of the rectangale the contains the elements over which
  // the tooltip will show on hover
  const topMiddle = { x: left + (right - left) / 2, y: top }
  const bottomMiddle = { x: left + (right - left) / 2, y: bottom }
  const leftMiddle = { x: left, y: top + (bottom - top) / 2 }
  const rightMiddle = { x: right, y: top + (bottom - top) / 2 }

  log(`topMiddle`, topMiddle)
  log(`bottomMiddle`, bottomMiddle)
  log(`leftMiddle`, leftMiddle)
  log(`rightMiddle`, rightMiddle)
  // top,left of the screen is 0,0
  const viewPortHeight = window.innerHeight
  const viewPortWidth = window.innerWidth
  // topMiddle
  if (topMiddle) {
    const { x, y } = topMiddle
    if (
      y - tooltipHeight >= 0 &&
      x > tooltipWidth / 2 &&
      x + tooltipWidth / 2 <= viewPortWidth
    )
      return { top: y - tooltipHeight, left: x - tooltipWidth / 2 }
  }

  if (bottomMiddle) {
    const { x, y } = bottomMiddle
    if (
      y + tooltipHeight <= viewPortHeight &&
      x > tooltipWidth / 2 &&
      x + tooltipWidth / 2 <= viewPortWidth
    )
      return { top: y, left: x - tooltipWidth / 2 }
  }
  if (leftMiddle) {
    const { x, y } = topMiddle
    if (
      y - tooltipHeight / 2 >= 0 &&
      y + tooltipHeight / 2 <= viewPortHeight &&
      x - tooltipWidth >= 0
    )
      return { top: y - tooltipHeight / 2, left: x - tooltipWidth }
  }
  if (rightMiddle) {
    const { x, y } = topMiddle
    if (
      y - tooltipHeight / 2 >= 0 &&
      y + tooltipHeight / 2 <= viewPortHeight &&
      x + tooltipWidth >= viewPortHeight
    )
      return { top: y - tooltipHeight / 2, left: x }
  }
  // top middle as the default
  const { x, y } = topMiddle

  return { top: y - tooltipHeight, left: x - tooltipWidth / 2 }
}
