'use client'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-primary), var(--font-bengali)'
  },
  palette: {
    primary: {
      main: '#ef4444'
    }
  }
})

export default theme
