'use client'

import { Suspense, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SendTokenInput, SendTokenSchema } from '@/schema/auth'
import { Box, Paper, Typography, Button, Alert } from '@mui/material'
import { TextFieldElement } from 'react-hook-form-mui'
import { Phone, LockReset } from '@mui/icons-material'
import { InputAdornment } from '@mui/material'
import Link from 'next/link'
import { forgotPassword } from '../actions/forgotPassword'
import { useReCaptcha } from '@/hooks/useRecaptcha'
import { useSearchParams } from 'next/navigation'

const ForgotPasswordPageContent = () => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { verifyReCaptcha } = useReCaptcha()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<SendTokenInput>({
    resolver: zodResolver(SendTokenSchema),
    defaultValues: {
      email: '',
      phone: '+880',
      type: 'OTP'
    }
  })

  const onSubmit = async (data: SendTokenInput) => {
    setError(null)
    setSuccess(null)

    startTransition(async () => {
      try {
        const isVerified = await verifyReCaptcha('forgot_password')
        if (!isVerified) {
          setError('Failed to verify reCAPTCHA. Please try again.')
          return
        }
        const result = await forgotPassword(data, { callbackUrl, token: '' })
        if (!result?.success) {
          setError(
            result?.error ?? 'Failed to process request. Please try again.'
          )
        }
      } catch (err) {
        console.error(err)
        setError('Failed to process request. Please try again.')
      }
    })
  }

  return (
    <Box className="flex items-center justify-center p-4" component="main">
      <Paper className="w-full max-w-md p-8 space-y-6">
        <Typography variant="h5" component="h1" className="text-center pb-1">
          <LockReset fontSize="small" color="primary" /> Forgot Password
        </Typography>
        <Typography variant="body2" component="p" className="text-center pb-2">
          Enter your phone number to reset your password
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" className="mb-4">
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TextFieldElement
            name="phone"
            control={control}
            label="Phone Number"
            fullWidth
            placeholder="Enter your phone number"
            helperText={errors.phone?.message}
            slotProps={{
              input: {
                style: { fontSize: '14px' },
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="primary" fontSize="small" />
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
            {isPending ? 'Sending...' : 'Send OTP'}
          </Button>

          <Typography variant="body2" className="text-center">
            Remember your password?{' '}
            <Link
              href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="text-red-500"
            >
              Sign in
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  )
}

const ForgotPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordPageContent />
    </Suspense>
  )
}

export default ForgotPasswordPage
