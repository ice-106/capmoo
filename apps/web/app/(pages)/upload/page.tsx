'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useAxios } from '~/_lib/axios'

const UploadPage: React.FC = () => {
  const axios = useAxios()
  const [files, setFiles] = useState<FileList | null>(null)
  const [message, setMessage] = useState<string>('')

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()
    if (files) {
      Array.from(files).forEach((file) => {
        formData.append('images', file) // Match Go handler: form.File["images"]
      })
    }

    try {
      const res = await axios.post('/v1/activities/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log(res.data)
    } catch (error: any) {
      console.error('Upload failed:', error)
      setMessage('Upload failed')
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Upload Images</h1>
      <form onSubmit={handleSubmit}>
        <input type='file' name='images' multiple onChange={handleFileChange} />
        <br />
        <br />
        <button type='submit'>Upload</button>
      </form>
      {message && (
        <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>
      )}
    </div>
  )
}

export default UploadPage
