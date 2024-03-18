import React, { useEffect, useMemo, useRef, useState } from 'react'
import Editor from '../../editor/JS/Editor-JS'
import './TabJavascript.css'
import FileExplorer from '../../../core-components/file-explorer/FileExplorer'
import { FaToggleOn, FaToggleOff } from 'react-icons/fa6'
import {
    createJSFileObject,
    dataURLToString,
    generateUUID,
    getAllFiles,
    getLastUsedFile,
    loadLastUsedFile,
    removeFile,
    storeFile,
} from '../../../util'
import { defaultJSFileName } from '../../../constants'

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
 * @returns {JSX.Element}
 */
export default function TabJavascript({ onCodeChange, code }) {
    const [existingFiles, setExistingFiles] = useState([])
    const [currentFile, setCurrentFile] = useState(null)
    const initRef = useRef(null)

    const loadFiles = () =>
        getAllFiles().then((files) => {
            console.log(`the data has been loaded`, files)

            if (files.length) {
                // LOAD LAST USED FILE
                const lastUsedFile = getLastUsedFile(files)
                // SET CURRENT FILE
                setCurrentFile(lastUsedFile)
                setExistingFiles(files)
                onCodeChange(dataURLToString(lastUsedFile.data), false)
            } else {
                // NEW FILE OBJ
                const newFile = {
                    name: defaultJSFileName,
                    id: generateUUID(),
                    data: '',
                    timestamp: new Date().getTime(),
                }

                // CREATE NEW FILE
                storeFile(createJSFileObject(newFile)).then((file) => {
                    if (file) {
                        // SET CURRENT FILE
                        setCurrentFile(file)
                        // SET EXISTING FILES
                        setExistingFiles([file])
                        onCodeChange(dataURLToString(file.data), false)
                    }
                })
            }
        })

    useEffect(() => {
        if (!initRef.current) initRef.current = 'init'
        else {
            // INIT
            // LOAD ALL FILES
            loadFiles()
        }
    }, [initRef])

    useEffect(() => {
        // save to current file

        const saveCurrentFile = async () => {
            console.log(`Current file saved`)
            await storeFile(
                createJSFileObject({
                    name: currentFile?.name,
                    data: code,
                    id: currentFile?.id,
                    timestamp: new Date().getTime(),
                })
            )
        }
        if (currentFile) saveCurrentFile()
    }, [code])

    // wehn renaming do not update timestamp
    const renameHandler = (oldFileName, newFileName) => {
        if (oldFileName === newFileName) return
        console.log(`called renameHandler(${oldFileName}, ${newFileName})`)
        // since rename has happened its already in existing files
        const orgFileObj = existingFiles.find(
            (file) => file.name === oldFileName
        )
        const { id, data, timestamp } = orgFileObj

        const asynFn = async () => {
            if (oldFileName != newFileName) {
                console.log(`rename storing in db...`)
                await storeFile(
                    createJSFileObject({
                        id,
                        name: newFileName,
                        // latest code ### can memoize it but Is that over optimsation ?
                        data: code,
                        timestamp,
                    })
                )
            }
            //TODO: handle the user enters empty filename use case
        }
        // update indb
        asynFn()
        // initite load file flow
        loadFiles()
    }
    // update current file
    // passed to file explorer
    const onFileSelect = ({ id, name, data }) => {
        setCurrentFile({ id, name, data })
    }
    const deleteFileHandler = async ({ id, name }) => {
        console.log(`file ${name} to be deleted with id = ${id}`)

        await removeFile(id);
        await loadFiles();

    }

    const createFileHandler = async ({ name }, cb) => {
        // NOTE: Executed cb only after all async processes finish
        const newName = name.includes('.js') ? name : `${name}.js`
        console.log(`file to be created ${newName}`)
        await storeFile(createJSFileObject({name: newName , data: '', id: generateUUID()}));
        await loadFiles();
        cb();
    }

    return (
        <div className="esfiddle-js-tab-container">
            <div className="esfiddle-js-tab-container__file-explorer">
                {/* 
            TODO: To have onFileSelect method which will use the currentFile - state variable
            also takes the currentFile
        */}
                <FileExplorer
                    {...{
                        createFileHandler,
                        deleteHandler: deleteFileHandler,
                        renameHandler,
                        label: 'Files',
                        files: existingFiles.map(({ id, name, data }) => ({
                            id,
                            name,
                            data,
                        })),
                    }}
                />
            </div>
            <Editor {...{ onChange: onCodeChange, code }} />
        </div>
    )
}
