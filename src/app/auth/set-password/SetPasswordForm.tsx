'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ResetPasswordInput, ResetPasswordSchema } from '@/schema/auth'
import { Box, Paper, Typography, Button, Alert } from '@mui/material'
import { TextFieldElement } from 'react-hook-form-mui'
import { Lock, BloodtypeSharp } from '@mui/icons-material'
import { InputAdornment } from '@mui/material'
import { setPassword } from '../actions/setPassword'
import { useRouter, useSearchParams } from 'next/navigation'

export const SetPasswordForm = () => {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: ResetPasswordInput) => {
    setError(null)

    startTransition(async () => {
      try {
        const result = await setPassword(data, {
          callbackUrl,
          token
        })
        if (result?.success) {
          router.push('/')
          router.refresh()
        } else {
          setError(result?.error ?? 'Failed to set password. Please try again.')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to set password. Please try again.')
      }
    })
  }

  return (
    <Box className="flex items-center justify-center p-4" component="main">
      <Paper className="w-full max-w-md p-8 space-y-6">
        <Typography variant="h5" component="h1" className="text-center pb-1">
          <BloodtypeSharp fontSize="small" color="primary" /> Set Your Password
        </Typography>
        <Typography variant="body2" component="p" className="text-center pb-2">
          Please set a password to secure your account
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TextFieldElement
            name="password"
            control={control}
            label="New Password"
            type="password"
            fullWidth
            placeholder="Enter your new password"
            helperText={errors.password?.message}
            slotProps={{
              input: {
                style: {
                  fontSize: '14px'
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" fontSize="small" />
                  </InputAdornment>
                )
              }
            }}
          />

          <TextFieldElement
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            type="password"
            fullWidth
            placeholder="Confirm your new password"
            helperText={errors.confirmPassword?.message}
            slotProps={{
              input: {
                style: {
                  fontSize: '14px'
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" fontSize="small" />
                  </InputAdornment>
                )
              }
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            className="mt-6"
            disabled={isPending}
          >
            {isPending ? 'Setting Password...' : 'Set Password'}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}
