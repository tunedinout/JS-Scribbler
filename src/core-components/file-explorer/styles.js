import { FaPlus } from 'react-icons/fa'
import styled, { css } from 'styled-components'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { CommonButtonStyles } from '../../components/styled.global'
import { List } from '@mui/material'
import { MdDelete } from 'react-icons/md'

const ScribblesContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 16px;
    height: 88%;
    width: 220px;
    position: relative;
`

const ScribblesHeadingWrapper = styled.div`
    margin-bottom: 4px;
    width: 100%;
    font-size: 12px;
    font-family: 'Noto Sans', sans-serif;
    text-align: left;
    padding-left: 8px;
    box-sizing: border-box;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 4px;
`

const ScribblesListWrapper = styled(List)`
    height: 100%;
    overflow: auto;
    border-radius: 4px;
    width: 100%;
`

const ListItemNameHover = styled.div`
    display: inline-block;
    width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const ContentEditableScribbleName = styled.div`
    border: none;
    outline: none;
    cursor: pointer;

    &:hover {
        display: inline-block;
        width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`

const StyledPlusIcon = styled(FaPlus)`
    ${CommonButtonStyles}
    color: grey;
    font-size: 16px;
    cursor: pointer;
    position: absolute;
    right: 32px;

    ${({ disabled }) =>
        disabled &&
        css`
            opacity: 0.5;
            cursor: not-allowed;
        `}
`

const CollapseExpandIconContainer = styled.div`
display: flex,
cursor: pointer,
position: absolute,
right: 32px
`

const CollapseIcon = styled(IoIosArrowDown)`
    ${CommonButtonStyles}
    color: grey;
    font-size: 16px;
`
const ExpandIcon = styled(IoIosArrowUp)`
    ${CommonButtonStyles}
    color: grey;
    font-size: 16px;
`

const DeleteButtonContainer = styled(MdDelete)`
    position: absolute;
    right: 16px;
    display: flex;
`
export {
    ScribblesContainer,
    ScribblesHeadingWrapper,
    ScribblesListWrapper,
    ListItemNameHover,
    ContentEditableScribbleName,
    StyledPlusIcon,
    CollapseIcon,
    ExpandIcon,
    CollapseExpandIconContainer,
    DeleteButtonContainer
}
