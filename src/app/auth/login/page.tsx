'use client'
import { Suspense, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginInput, LoginSchema } from '@/schema/auth'
import { Box, Paper, Typography, Button, Alert } from '@mui/material'
import { TextFieldElement } from 'react-hook-form-mui'
import { Phone, Lock, BloodtypeSharp } from '@mui/icons-material'
import { InputAdornment } from '@mui/material'
import Link from 'next/link'
import { loginUser } from '../actions/loginUser'
import { useReCaptcha } from '@/hooks/useRecaptcha'
import { useSearchParams } from 'next/dist/client/components/navigation'

const LoginPageContent = () => {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { verifyReCaptcha } = useReCaptcha()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      phone: '+880',
      password: ''
    }
  })

  const onSubmit = async (data: LoginInput) => {
    setError(null)

    startTransition(async () => {
      try {
        const isVerified = await verifyReCaptcha('login')
        if (!isVerified) {
          setError('Failed to verify reCAPTCHA. Please try again.')
          return
        }
        const result = await loginUser(data, {
          callbackUrl
        })
        if (!result?.success) {
          setError(result?.error ?? 'Failed to login. Please try again.')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to login. Please try again.')
      }
    })
  }

  return (
    <Box className="flex items-center justify-center p-4" component="main">
      <Paper className="w-full max-w-md p-8 space-y-6">
        <Typography variant="h5" component="h1" className="text-center pb-1">
          <BloodtypeSharp fontSize="small" color="primary" /> Login to continue
        </Typography>
        <Typography variant="body2" component="p" className="text-center pb-2">
          Don&apos;t have an account?{' '}
          <Link
            href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="text-red-500"
          >
            Sign up
          </Link>
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
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
                style: {
                  fontSize: '14px'
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="primary" fontSize="small" />
                  </InputAdornment>
                )
              }
            }}
          />

          <TextFieldElement
            name="password"
            control={control}
            label="Password"
            type="password"
            fullWidth
            placeholder="Enter your password"
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            className="mt-6"
            disabled={isPending}
          >
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="flex items-center justify-end mt-4">
          <Link
            href={`/auth/forgot-password?callbackUrl=${encodeURIComponent(
              callbackUrl
            )}`}
            className="text-sm text-red-500 border-b border-red-500"
          >
            Forgot password?
          </Link>
        </div>
      </Paper>
    </Box>
  )
}

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}

export default LoginPage
