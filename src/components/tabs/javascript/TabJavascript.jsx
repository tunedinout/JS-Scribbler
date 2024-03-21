import Editor from '../../editor/JS/Editor-JS'
import './TabJavascript.css'
import FileExplorer from '../../../core-components/file-explorer/FileExplorer'
import { useTabJS } from './hooks'

/**
 * @component
 * loads everything on the javascript tab
 *
 * local state:
 *      1. list of existing files from the user indexedDB
 *      2. Current selected file
 *      2. show/hide file
 * effects:
 *       1. onMount effect to load all existing files
 * handlers:
 *      1. file name change handler
 *      2. selected file change handler
 *
 * @param {object} props - component props
 * @param {Function} props.onCodeChange
 * @param {Function} props.onFileChange
 * @param {String} props.code
 * @param {Error} Props.runtimeError
 * @returns {JSX.Element}
 */
export default function TabJavascript({
    onCodeChange,
    onFileChange,
    // code from app
    code,
    runtimeError,
}) {
    const {
        currentFile,
        createFileHandler,
        deleteHandler,
        renameHandler,
        selectFileHandler,
        files,
        focus,
        doUnfocus,
        onChange,
    } = useTabJS({ onCodeChange, onFileChange, code })

    return (
        <div className="esfiddle-js-tab-container">
            <div className="esfiddle-js-tab-container__file-explorer">
                <FileExplorer
                    {...{
                        currentFile,
                        createFileHandler,
                        deleteHandler,
                        renameHandler,
                        selectFileHandler,
                        label: 'Files',
                        files,
                    }}
                />
            </div>
            {currentFile && (
                <Editor
                    {...{
                        focus,
                        doUnfocus,
                        onChange: onCodeChange,
                        code,
                        runtimeError,
                    }}
                />
            )}
        </div>
    )
}
