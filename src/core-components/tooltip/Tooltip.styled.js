// does not need a react component
import styled from "styled-components"
const Tooltip = styled.div`
    content: attr(title);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    visibility: hidden;
    opacity: 0;

    &::before {
      content: attr(title);
  }

  /* Show the tooltip on hover */
  &:hover {
      visibility: visible;
      opacity: 1;
  }
`;

export {Tooltip};