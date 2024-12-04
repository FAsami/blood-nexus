'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TokenType, VerifyOTPInput, VerifyOTPSchema } from '@/schema/auth'
import { Box, Paper, Typography, Button, Alert } from '@mui/material'
import { TextFieldElement } from 'react-hook-form-mui'
import { LockReset } from '@mui/icons-material'
import { InputAdornment } from '@mui/material'
import { verifyOTP } from '../actions/verifyOTP'
import { useReCaptcha } from '@/hooks/useRecaptcha'
import { useSearchParams } from 'next/navigation'
import { sendToken } from '../actions/sendToken'
import { z } from 'zod'

interface VerifyOTPFormProps {
  name: string
  phone: string
  email: string
  scope: z.infer<typeof TokenType>
}

const VerifyOTPForm: React.FC<VerifyOTPFormProps> = ({
  phone,
  email,
  scope
}) => {
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { verifyReCaptcha } = useReCaptcha()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'
  const token = searchParams.get('token') ?? ''

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<VerifyOTPInput>({
    resolver: zodResolver(VerifyOTPSchema),
    defaultValues: {
      email: email || undefined,
      phone: phone || undefined,
      otp: '',
      type: scope
    }
  })

  const onSubmit = async (data: VerifyOTPInput) => {
    setError(null)
    setMessage(null)

    startTransition(async () => {
      try {
        const isVerified = await verifyReCaptcha('verify_otp')
        if (!isVerified) {
          setError('Failed to verify reCAPTCHA. Please try again.')
          return
        }
        const result = await verifyOTP(data, { callbackUrl, token })
        if (!result?.success) {
          setError(result?.error ?? 'Failed to verify OTP. Please try again.')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to verify OTP. Please try again.')
      }
    })
  }

  const handleResendOTP = async () => {
    setError(null)
    setMessage(null)

    startTransition(async () => {
      try {
        const result = await sendToken({
          email,
          phone,
          type:
            scope === TokenType.Enum.RESET_PASSWORD
              ? TokenType.Enum.RESET_PASSWORD
              : TokenType.Enum.OTP
        })
        if (result.success) {
          setMessage(result?.message ?? 'OTP sent successfully!')
        } else {
          setError(result?.error ?? 'Failed to resend OTP. Please try again.')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to resend OTP. Please try again.')
      }
    })
  }

  return (
    <Box className="flex items-center justify-center p-4" component="main">
      <Paper className="w-full max-w-md p-8 space-y-6">
        <Typography variant="h5" component="h1" className="text-center pb-1">
          <LockReset fontSize="small" color="primary" /> Verify OTP
        </Typography>
        <Typography variant="body2" component="p" className="text-center pb-2">
          Please enter the verification code sent to your{' '}
          {email ? 'email' : 'phone number'}
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {message && (
          <Alert severity="success" className="mb-4">
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TextFieldElement
            name="otp"
            control={control}
            label="OTP"
            fullWidth
            placeholder="Enter 6-digit OTP"
            helperText={errors.otp?.message}
            slotProps={{
              input: {
                style: { fontSize: '14px' },
                startAdornment: (
                  <InputAdornment position="start">
                    <LockReset color="primary" fontSize="small" />
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
            disabled={isPending}
          >
            {isPending ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <Button
            type="button"
            variant="text"
            fullWidth
            size="small"
            onClick={handleResendOTP}
            disabled={isPending}
          >
            Resend OTP
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default VerifyOTPForm
