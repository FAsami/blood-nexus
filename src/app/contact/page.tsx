'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextFieldElement } from 'react-hook-form-mui'
import { z } from 'zod'
import { Button, Snackbar, Alert } from '@mui/material'
import { useState, useTransition } from 'react'
import axios, { AxiosError } from 'axios'
import { motion } from 'framer-motion'

// Define the schema for contact form
const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters long')
})

type ContactInput = z.infer<typeof ContactSchema>

const contactFields = [
  {
    name: 'name' as const,
    type: 'text',
    label: 'Name',
    placeholder: 'Your full name'
  },
  {
    name: 'email' as const,
    type: 'email',
    label: 'Email',
    placeholder: 'your.email@example.com'
  },
  {
    name: 'subject' as const,
    type: 'text',
    label: 'Subject',
    placeholder: 'What is this regarding?'
  },
  {
    name: 'message' as const,
    type: 'text',
    label: 'Message',
    placeholder: 'Your message here',
    multiline: true,
    rows: 4
  }
]

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

const ContactPage = () => {
  const [isPending, startTransition] = useTransition()
  const [notification, setNotification] = useState<{
    open: boolean
    message: string
    type: 'success' | 'error'
  }>({ open: false, message: '', type: 'success' })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema)
  })

  const onSubmit = async (data: ContactInput) => {
    startTransition(async () => {
      try {
        await axios.post('/api/send-email', data)
        setNotification({
          open: true,
          message: 'Message sent successfully',
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

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Illustration Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block"
        >
          <svg
            width="100%"
            height="400"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Shadow effect */}
            <rect
              x="50"
              y="90"
              width="320"
              height="240"
              rx="16"
              fill="#e5e5e5"
            />

            {/* Main Envelope Base */}
            <rect
              x="40"
              y="80"
              width="320"
              height="240"
              rx="16"
              fill="#ffffff"
              stroke="#e0e0e0"
              strokeWidth="2"
            />

            {/* Envelope Top Flap */}
            <motion.path
              initial={{ rotateX: 0 }}
              animate={{ rotateX: [0, 30, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              d="M40 120 L200 240 L360 120"
              stroke="#2563eb"
              strokeWidth="3"
              fill="#f0f7ff"
            />

            {/* Bottom Flap Shadow */}
            <path
              d="M40 120 L200 240 L360 120"
              stroke="#2563eb"
              strokeWidth="1"
              fill="#e6eeff"
              opacity="0.5"
            />

            {/* Mail Lines with gradient */}
            <motion.g
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <line
                x1="100"
                y1="180"
                x2="300"
                y2="180"
                stroke="url(#blueGradient)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <line
                x1="100"
                y1="220"
                x2="260"
                y2="220"
                stroke="url(#blueGradient)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <line
                x1="100"
                y1="260"
                x2="220"
                y2="260"
                stroke="url(#blueGradient)"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </motion.g>

            {/* Decorative Elements */}
            <motion.circle
              cx="60"
              cy="60"
              r="20"
              fill="#2563eb"
              opacity="0.2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="340"
              cy="340"
              r="30"
              fill="#2563eb"
              opacity="0.2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />

            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#2563eb" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Form Side */}
        <div className="lg:max-w-xl">
          <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {contactFields.map((field) => (
              <TextFieldElement
                key={field.name}
                {...field}
                control={control}
                helperText={errors[field.name]?.message}
                {...commonTextFieldProps}
              />
            ))}

            <div className="flex justify-end">
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
              >
                {isPending ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </div>
      </div>

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

export default ContactPage
