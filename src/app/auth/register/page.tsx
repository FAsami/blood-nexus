'use client'

import { Suspense, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterInput, RegisterSchema } from '@/schema/auth'
import { Box, Paper, Typography, Button, Alert } from '@mui/material'
import { TextFieldElement } from 'react-hook-form-mui'
import { Email, Phone, Lock, Person, BloodtypeSharp } from '@mui/icons-material'
import { InputAdornment } from '@mui/material'
import Link from 'next/link'
import { registerUser } from '../actions/registerUser'
import { useReCaptcha } from '@/hooks/useRecaptcha'
import { useSearchParams } from 'next/navigation'

const RegisterPageContent = () => {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { verifyReCaptcha } = useReCaptcha()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'
  const token = searchParams.get('token') ?? ''

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '+880',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: RegisterInput) => {
    setError(null)

    startTransition(async () => {
      try {
        const isVerified = await verifyReCaptcha('register')
        if (!isVerified) {
          setError('Failed to verify reCAPTCHA. Please try again.')
          return
        }
        const result = await registerUser(data, { callbackUrl, token })
        if (!result?.success) {
          setError(result?.error ?? 'Failed to register. Please try again.')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to register. Please try again.')
      }
    })
  }

  return (
    <Box className="flex items-center justify-center p-4" component="main">
      <Paper className="w-full max-w-md p-8 space-y-6">
        <Typography variant="h5" component="h1" className="text-center pb-1">
          <BloodtypeSharp fontSize="small" color="primary" /> Create an account
        </Typography>
        <Typography variant="body2" component="p" className="text-center pb-2">
          Already have an account?{' '}
          <Link
            href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="text-red-500"
          >
            Sign in
          </Link>
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TextFieldElement
            name="firstName"
            control={control}
            label="First Name"
            fullWidth
            placeholder="Enter your first name"
            helperText={errors.firstName?.message}
            slotProps={{
              input: {
                style: { fontSize: '14px' },
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" fontSize="small" />
                  </InputAdornment>
                )
              }
            }}
          />
          <TextFieldElement
            name="lastName"
            control={control}
            label="Last Name"
            fullWidth
            placeholder="Enter your last name"
            helperText={errors.lastName?.message}
            slotProps={{
              input: {
                style: { fontSize: '14px' },
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" fontSize="small" />
                  </InputAdornment>
                )
              }
            }}
          />

          <TextFieldElement
            name="email"
            control={control}
            label="Email"
            type="email"
            fullWidth
            placeholder="Enter your email address"
            helperText={errors.email?.message}
            slotProps={{
              input: {
                style: { fontSize: '14px' },
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" fontSize="small" />
                  </InputAdornment>
                )
              }
            }}
          />

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

          <TextFieldElement
            name="password"
            control={control}
            label="Password"
            type="password"
            fullWidth
            placeholder="Create a password"
            helperText={errors.password?.message}
            slotProps={{
              input: {
                style: { fontSize: '14px' },
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
            placeholder="Confirm your password"
            helperText={errors.confirmPassword?.message}
            slotProps={{
              input: {
                style: { fontSize: '14px' },
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
            {isPending ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

const RegisterPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  )
}

export default RegisterPage
