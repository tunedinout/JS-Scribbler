import React, { useState } from 'react'

export default function GoogleDrive({ accessToken }) {
        const [files, setFiles] = useState([])
        const fetchFiles = async () => {

            try {
                const response = await fetch(
                    `https://www.googleapis.com/drive/v3/files`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                )
    
                const data = await response.json()
                console.log(`data received from drive `, data)
                setFiles(data.files)    
            } catch (error) {
                console.error(error);
            }
        }
   
    return (
        <div>
            <h2>Google Drive Files</h2>
            <button onClick={fetchFiles}>Fetch Files</button>
            {/* <ul>
        {files.map((file) => (
          <li key={file.id}>{file.name}</li>
        ))}
      </ul> */}
        </div>
    )
}
