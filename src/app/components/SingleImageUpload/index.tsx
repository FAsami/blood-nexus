'use client'
import { useState } from 'react'
import {
  Box,
  IconButton,
  Modal,
  Typography,
  Button,
  CircularProgress,
  Divider
} from '@mui/material'
import {
  Upload as UploadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import axios from 'axios'
import Image from 'next/image'

export interface UploadFile {
  uid: string
  name: string
  status: string
  url?: string
  type?: string
}

const SingleImageUpload = ({
  initialImage,
  onUploadComplete
}: {
  initialImage?: string | null
  onUploadComplete: (image: UploadFile) => void
}) => {
  const [currentImage, setCurrentImage] = useState<string>(initialImage || '')
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

      const uniqueUid = `${file.name}-${new Date().getTime()}`
      const newImage: UploadFile = {
        uid: uniqueUid,
        name: file.name,
        status: 'done',
        url: response.data.secure_url,
        type: file.type
      }

      setCurrentImage(response.data.secure_url)
      onUploadComplete(newImage)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length && files[0].type.startsWith('image/')) {
      handleUpload(files[0])
    }
  }

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files?.length && files[0].type.startsWith('image/')) {
      handleUpload(files[0])
    }
  }

  const handleDelete = () => {
    setCurrentImage('')
    onUploadComplete({
      uid: '',
      name: '',
      status: 'removed'
    })
  }

  const UploadArea = () => (
    <Box
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        id="image-input"
      />
      <UploadIcon className="text-gray-400 w-12 h-12 mx-auto mb-4" />
      <Typography variant="body1" className="mb-8">
        Drag and drop an image here or
      </Typography>
      <label className="cursor-pointer inline-block mt-8" htmlFor="image-input">
        <Button
          variant="contained"
          component="span"
          startIcon={<UploadIcon />}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </label>
    </Box>
  )

  if (!currentImage) {
    return <UploadArea />
  }

  return (
    <div className="relative inline-block border-2 border-gray-300 rounded-lg p-1">
      <Image
        src={currentImage}
        alt="Uploaded image"
        width={100}
        height={100}
        className="rounded-lg max-w-xs object-cover"
      />

      <div className="absolute top-0 bg-red-500 right-0 flex gap-0.5 rounded-bl-sm px-1 py-0.5">
        <IconButton
          size="small"
          className="p-0.5"
          onClick={() => setIsModalOpen(true)}
        >
          <EditIcon className="text-white !w-3 !h-3" />
        </IconButton>
        <Divider orientation="vertical" flexItem className="mx-0.5" />
        <IconButton size="small" className="p-0.5" onClick={handleDelete}>
          <DeleteIcon className="text-white !w-3 !h-3" />
        </IconButton>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="flex items-center justify-center"
      >
        <Box className="bg-white rounded-lg max-w-md w-full gap-4 mx-4 relative">
          <div className="flex justify-between items-center px-4 py-2">
            <Typography variant="h6" className="mb-4">
              Update Image
            </Typography>
            <IconButton
              className="absolute right-2 top-2"
              onClick={() => setIsModalOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center p-8">
                <CircularProgress />
              </div>
            ) : (
              <UploadArea />
            )}
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export { SingleImageUpload }
