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
  },
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow:
            '0 3px 5px -2px rgba(239, 68, 68, 0.1), 0 2px 3px -1px rgba(239, 68, 68, 0.06)'
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f3f4f6'
          }
        }
      }
    }
  }
})

export default theme
