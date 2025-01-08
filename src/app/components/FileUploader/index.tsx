'use client'
import { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material'
import { Upload as UploadIcon, Close as CloseIcon } from '@mui/icons-material'
import axios from 'axios'
import { VideoPlayer } from './VideoPlayer'
import { FileIcon } from './FileIcon'

interface UploadFile {
  uid: string
  name: string
  status: string
  url?: string
  type?: string
}

interface FileUploaderProps {
  onUploadComplete?: (assets: UploadFile[]) => void
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadComplete
}: FileUploaderProps) => {
  const [loading, setLoading] = useState(false)
  const [assets, setAssets] = useState<UploadFile[]>([])
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success'
  })

  const getSignature = async () => {
    try {
      const response = await axios.post('/api/media/cloudinary-sign')
      return response.data
    } catch (error) {
      console.error('Error getting signature:', error)
      return null
    }
  }

  const handleUpload = async (file: File) => {
    const signatureData = await getSignature()
    if (!signatureData) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    )
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!)
    formData.append('timestamp', signatureData.timestamp)
    formData.append('signature', signatureData.signature)

    setLoading(true)
    const URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`

    try {
      const response = await axios.post(URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setSnackbar({
        open: true,
        message: 'Upload successful!',
        severity: 'success'
      })

      const uniqueUid = `${file.name}-${new Date().getTime()}`

      const newAsset: UploadFile = {
        uid: uniqueUid,
        name: file.name,
        status: 'done',
        url: response.data.secure_url,
        type: file.type
      }

      const updatedAssets = [...assets, newAsset]
      setAssets(updatedAssets)

      if (onUploadComplete) {
        onUploadComplete(updatedAssets)
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Upload failed.',
        severity: 'error'
      })
      console.error('Upload error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = (uid: string) => {
    const updatedAssets = assets.filter((file) => file.uid !== uid)
    setAssets(updatedAssets)

    if (onUploadComplete) {
      onUploadComplete(updatedAssets)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length) {
      handleUpload(files[0])
    }
  }

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files?.length) {
      handleUpload(files[0])
    }
  }

  return (
    <Box>
      <Box
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          bgcolor: 'background.paper',
          '&:hover': {
            border: '2px dashed #999'
          }
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          accept=".pdf,video/*,image/*,.fig,.md,.xlsx,.xls,.doc,.docx"
          onChange={handleFileInput}
          style={{ display: 'none' }}
          id="file-input"
        />
        <UploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
        <Typography variant="body1" sx={{ mb: 2 }}>
          Click or drag file to this area to upload
        </Typography>
        <label htmlFor="file-input">
          <Button
            variant="contained"
            component="span"
            startIcon={<UploadIcon />}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </label>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
        {assets.map((node) => {
          if (!node.url) return null
          return (
            <Box key={node.uid} sx={{ position: 'relative' }}>
              {node.type?.includes('image') ? (
                <Box
                  component="img"
                  src={node.url}
                  alt="Image"
                  sx={{
                    height: 96,
                    width: 96,
                    borderRadius: 1,
                    border: '1px solid #eee'
                  }}
                />
              ) : node.type?.includes('video') ? (
                <VideoPlayer name={node.name} url={node.url} />
              ) : (
                <Box
                  component="a"
                  href={node.url}
                  download={node.name}
                  sx={{
                    height: 96,
                    width: 96,
                    border: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1
                  }}
                >
                  <FileIcon fileType={node.name.split('.').pop() || ''} />
                </Box>
              )}
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  px: 1
                }}
                title={node.name}
              >
                {node.name}
              </Typography>

              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  '&:hover': {
                    bgcolor: 'background.paper'
                  }
                }}
                onClick={() => handleRemove(node.uid)}
              >
                <CloseIcon sx={{ fontSize: 16, color: 'error.main' }} />
              </IconButton>
            </Box>
          )
        })}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export { FileUploader }
