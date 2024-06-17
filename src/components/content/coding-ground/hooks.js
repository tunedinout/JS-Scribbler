import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
    createJSFileObject,
    generateUUID,
    getAllFiles,
    getLastUsedFile,
    storeFile,
    removeFile,
    getExistingSesionObjects,
} from '../../../indexedDB.util'
import { defaultJSFileName } from '../../../constants'
import { debounce, getLogger } from '../../../util'

export function useTabJS({ onCodeChange, onFileChange, code, driveFolderId }) {
    const logger = getLogger(`hooks.js | useTabJS`)
    const log = logger(`userTabJS`)
    const [existingFiles, setExistingFiles] = useState([])
    const [currentFile, setCurrentFile] = useState(null)
    const initRef = useRef(null)
    const [focusInEditor, setFocusInEditor] = useState(false);
    const [isUploading, setIsUploading] = useState(false)

    // unused function
    async function loadFilesFromDrive(folderId) {
        const log = logger(`loadFiles`);
        log(`folderId`, folderId)
        const result = await getExistingSesionObjects();
        const { accessToken } = result[0];
        const response = await fetch(`http://localhost:3000/drive/load-files`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accessToken,
                folderId
            })
        });
        const filesData = await response.json();
        log(`filesdata`, filesData);

    }

    const loadFiles = () =>
        getAllFiles().then((files) => {
            console.log(`the data has been loaded`, files)
            if (files.length) {
                // LOAD LAST USED FILE
                const lastUsedFile = getLastUsedFile(files)
                // SET CURRENT FILE
                // data uRL
                setCurrentFile(lastUsedFile)
                setExistingFiles(files)
                onCodeChange(lastUsedFile.data, false)
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
                        onCodeChange(file.data, false)
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

    // useEffect(() => {
    //     console.log('currentFile', currentFile.data)
    // },[currentFile])

    const saveCurrentFile = debounce(useCallback(async () => {
        if (isUploading) return;
        const log = logger(`saveCurrentFile`)
        console.log(`Current file saved`)
        const fileObj = createJSFileObject({
            name: currentFile?.name,
            data: code,
            id: currentFile?.id,
            timestamp: new Date().getTime(),
        })
        log('fileObj', fileObj)
        const obj = await storeFile(fileObj)
        const formData = new FormData()
        formData.append('file', fileObj)
        // formData.append('value', 'dfdfdfd')
        log(`formData`, formData.get('file'))
        formData.append('folderId', driveFolderId)
        const result = await getExistingSesionObjects()
        const accessToken = result[0]?.accessToken || ''
        // if its not uploading upload 
        // which means an infinite loop
        if (accessToken && driveFolderId) {
            formData.append('accessToken', accessToken)
            try {
                // check if already one promise of this is not pending 
                setIsUploading(true)
                await fetch(`http://localhost:3000/drive/file/upload`, {
                    method: 'POST',
                    body: formData,
                })

            } catch (error) {
                log(error);
            }
            finally {
                setIsUploading(false);
            }
        }

        // check if the user is logged in

        if (obj) setCurrentFile(obj)
    }, [isUploading, code, currentFile, storeFile, getExistingSesionObjects]), 500)

    useEffect(() => {

        // current file must not be null / undefined
        if (currentFile) {
            logger(`[code, currentFile] =>`);
            log(`inside current file`)
            saveCurrentFile();
            // replace in existing files
            const newExistingFiles = existingFiles.map((file) => {
                if (file.id === currentFile.id) {
                    file.data = code
                }

                return file
            })
            setExistingFiles([...newExistingFiles])
            // save current file to drive
        }
        return () => {
            saveCurrentFile.cleanUp()
        }
        // do not include current file
        // causes infinite loop
    }, [code])

    useEffect(() => {
        // if drives files are diffrent 
        const loadFilesFromDrive = async () => {
            const log = logger(`loadFilesFromDrive`)
            if (driveFolderId && existingFiles.length) {
                const response = await loadFilesFromDrive(driveFolderId);
                const jsonResponse = await response.json();
                log(`jsonResponse`, jsonResponse);
            }
        }

    }, [driveFolderId, existingFiles])

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
                        data,
                        timestamp,
                    })
                )
            }
            //TODO: handle the user enters empty filename use case
        }
        // update indb
        asynFn()
        // initite load file flow
        // loadFiles()
        // find the file in existing
        const newExistingFiles = existingFiles.map((file) => {
            if (file.name === oldFileName) {
                file.name = newFileName
            }
            return file
        })
        setExistingFiles([...newExistingFiles])
    }
    const deleteFileHandler = async ({ id, name }) => {
        console.log(`file ${name} to be deleted with id = ${id}`)
        if (await removeFile(id)) {
            const toBeDeletedIndex = existingFiles.findIndex(
                ({ id: fileId }) => fileId !== id
            )
            const filteredFiles = existingFiles.filter(
                ({ id: fileId }) => fileId !== id
            )
            setExistingFiles(filteredFiles)
            // currentFile ?
            if (currentFile.id === id) {
                if (filteredFiles.length) {
                    setCurrentFile(existingFiles[0])
                    onCodeChange(existingFiles[0].data, false)
                } else {
                    const countFiles = existingFiles.length
                    const newCurrentFile =
                        existingFiles[(toBeDeletedIndex + 1) % countFiles]
                    setCurrentFile(newCurrentFile)
                    onCodeChange(newCurrentFile.data, false)
                }
            }
        }
    }

    const createFileHandler = async ({ name }, cb) => {
        // NOTE: Executed cb only after all async processes finish
        const newName = name.includes('.js') ? name : `${name}.js`
        console.log(`file to be created ${newName}`)
        const returnedFile = await storeFile(
            createJSFileObject({ name: newName, data: '', id: generateUUID() })
        )
        // add this to existing files
        setExistingFiles([...existingFiles, returnedFile])
        // newly create file becomes the current file
        setCurrentFile(returnedFile)
        onCodeChange(returnedFile.data, false)
        // await loadFiles()
        cb()
        // focus in the editor
        setFocusInEditor(true)
    }

    const selectFileHandler = (file, event) => {
        event.preventDefault()
        if (file.id === currentFile.id) return
        console.log('selectFileHandler', file)
        const { data } = file
        setCurrentFile(file)
        onCodeChange(data, false)
        onFileChange()
    }

    const onChangeHandler = (newStringData, _) => {
        onCodeChange(newStringData, false)
    }

    return {
        currentFile,
        createFileHandler,
        deleteHandler: deleteFileHandler,
        renameHandler,
        selectFileHandler,
        files: existingFiles,
        focus: focusInEditor,
        doUnfocus: () => setFocusInEditor(false),
        onChange: onChangeHandler,
    }
}
