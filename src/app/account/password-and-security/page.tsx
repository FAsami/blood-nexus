'use client'

import { useState, useTransition } from 'react'
import {
  Button,
  TextField,
  Alert,
  IconButton,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { passwordChangeSchema } from '../../../schema/account'
import axios from 'axios'
import { ChangePasswordResponse } from '@/types/api'

const commonTextFieldProps = {
  fullWidth: true,
  slotProps: {
    input: {
      style: { fontSize: '14px' }
    },
    inputLabel: {
      shrink: true
    }
  }
}

const AccountPasswordAndSecurityPage = () => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema)
  })

  const onSubmit = async (data: z.infer<typeof passwordChangeSchema>) => {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      try {
        const response = await axios.post<ChangePasswordResponse>(
          '/api/account/change-password',
          data
        )
        console.log(response.data)

        if (response.data.success && response.data.error === null) {
          setSuccess(true)
          setError(null)
          reset()
        } else {
          setError(response.data.error?.message || 'An unknown error occurred')
        }
      } catch (err: unknown | Error) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
        setSuccess(false)
      }
    })
  }

  return (
    <div className="max-w-md">
      <Tabs value="change-password">
        <Tab value="change-password" label="Change Password" />
      </Tabs>

      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('currentPassword')}
            {...commonTextFieldProps}
            label="Current Password"
            type={showCurrentPassword ? 'text' : 'password'}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
            placeholder="Enter current password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            {...register('newPassword')}
            {...commonTextFieldProps}
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            placeholder="Enter new password"
            sx={{ mt: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            {...register('confirmPassword')}
            {...commonTextFieldProps}
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            placeholder="Confirm new password"
            sx={{ mt: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 3 }}>
              Password changed successfully!
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            className="py-3"
            sx={{ mt: 3 }}
            disabled={isPending}
          >
            {isPending ? 'Changing Password...' : 'Change Password'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default AccountPasswordAndSecurityPage
