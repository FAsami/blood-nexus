import React, { useState } from 'react'
import { Dialog, DialogTitle, Box } from '@mui/material'
import ReactPlayer from 'react-player'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'

interface VideoPlayerProps {
  url: string
  name: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, name }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div>
      <Box
        onClick={() => setIsDialogOpen(true)}
        position="relative"
        sx={{ cursor: 'pointer' }}
      >
        <Box
          component="img"
          height={96}
          width={96}
          src="/logo-sm-black-and-white.png"
          alt="Image"
          sx={{
            border: 1,
            borderRadius: 1,
            opacity: 0.6
          }}
        />

        <PlayCircleIcon
          sx={{
            color: 'primary.main',
            fontSize: '2.5rem',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </Box>
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{name}</DialogTitle>
        <Box sx={{ p: 2 }}>
          <ReactPlayer
            url={url}
            controls={true}
            playing={true}
            width="100%"
            height="100%"
          />
        </Box>
      </Dialog>
    </div>
  )
}

export { VideoPlayer }
