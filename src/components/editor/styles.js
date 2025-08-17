import { Theme } from '@src/constants'
import styled from 'styled-components'

export const EditorContainer = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 2rem;

  background-color: ${Theme.codeEditor.editorBgColor};
  textarea {
    width: 100%;
    height: 100%;
    padding: 8px;
    font-size: 14px;
    border: none;
    resize: none;
    margin-bottom: 8px;
    outline: none;
    // color: white;
    font-family: ${Theme.fontFamily};
  }

  button {
    padding: 10px 20px; /* Adjust padding as needed */
    font-size: 16px; /* Increase font size for better readability */
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s; /* Smooth transition on hover */
  }

  button:hover {
    background-color: #0056b3;
  }

  .highlighted-keyword {
    color: #bc70fd;
  }
  .ace_content {
    font-family: ${Theme.fontFamily};
  }
  .ace_gutter {
    background: none;
  }
  .ace-github-dark {
    background-color: ${Theme.codeEditor.editorBgColor};
  }
  .ace_tooltip {
    background-color: ${Theme.HighlightColor} !important;
    font-family: ${Theme.fontFamily} !important;
    border-radius: 4px;
    border: none;
    padding: 4px 8px !important;
    color: ${Theme.fontColor};
  }
`
