'use client'

import { useTransition, useState } from 'react'
import {
  Button,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  CircularProgress,
  Box
} from '@mui/material'
import { ProfileInformationForm } from './ProfileInformationForm'
import { UpdateProfileInput } from '@/schema/account'
import axios, { AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import AddressForm from './AddressForm'
import { AddressInput } from '@/schema/donation-request'

const ProfilePage = () => {
  const [isPending, startTransition] = useTransition()
  const [selectedTab, setSelectedTab] = useState(0)
  const [notification, setNotification] = useState<{
    open: boolean
    message: string
    type: 'success' | 'error'
  }>({ open: false, message: '', type: 'success' })

  const handleSubmit = async (data: UpdateProfileInput | AddressInput) => {
    console.log('data', data)
    startTransition(async () => {
      try {
        await axios.put('/api/account/profile', data)
        setNotification({
          open: true,
          message: 'Profile updated successfully',
          type: 'success'
        })
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          setNotification({
            open: true,
            message: error.response?.data?.message || 'Something went wrong',
            type: 'error'
          })
        } else {
          setNotification({
            open: true,
            message: 'Something went wrong',
            type: 'error'
          })
        }
      }
    })
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await axios.get('/api/account/profile')
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'An error occurred')
      }
      return response.data.data
    }
  })

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress />
      </Box>
    )
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="max-w-2xl">
      <div className="sticky top-0 z-10 bg-white py-3">
        <div className="flex justify-between items-center shadow-sm">
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            aria-label="profile sections"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Profile Information" />
            <Tab label="Address" />
          </Tabs>

          <div className="flex">
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="medium"
              sx={{
                borderRadius: '24px',
                boxShadow: 'none',
                width: 'fit-content',
                whiteSpace: 'nowrap',
                px: 2,
                py: 1
              }}
              disabled={isPending}
              form={selectedTab === 0 ? 'profile-form' : 'address-form'}
            >
              {isPending ? 'Updating Profile...' : 'Update Profile'}
            </Button>
          </div>
        </div>
      </div>

      {selectedTab === 0 && (
        <ProfileInformationForm
          initial={data.user}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      )}
      {selectedTab === 1 && (
        <AddressForm initial={data.user.address} onSubmit={handleSubmit} />
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={notification.type}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default ProfilePage
