'use client'

import { useState } from 'react'
import {
  TextField,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SingleImageUpload } from '@/app/components/SingleImageUpload'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { UpdateProfileInput, updateProfileSchema } from '@/schema/account'

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

const profileFields = [
  {
    name: 'name',
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter your full name'
  },
  {
    name: 'phone',
    type: 'text',
    label: 'Phone',
    placeholder: 'Enter your phone number'
  },
  {
    name: 'bloodGroup',
    type: 'select',
    label: 'Blood Group',
    options: [
      { value: 'A_POSITIVE', label: 'A+' },
      { value: 'A_NEGATIVE', label: 'A-' },
      { value: 'B_POSITIVE', label: 'B+' },
      { value: 'B_NEGATIVE', label: 'B-' },
      { value: 'O_POSITIVE', label: 'O+' },
      { value: 'O_NEGATIVE', label: 'O-' },
      { value: 'AB_POSITIVE', label: 'AB+' },
      { value: 'AB_NEGATIVE', label: 'AB-' }
    ]
  },
  {
    name: 'gender',
    type: 'select',
    label: 'Gender',
    options: [
      { value: 'MALE', label: 'Male' },
      { value: 'FEMALE', label: 'Female' },
      { value: 'OTHER', label: 'Other' },
      { value: 'UNDISCLOSED', label: 'Prefer not to say' }
    ]
  }
] as const

interface ProfileInformationFormProps {
  onSubmit: (data: Omit<UpdateProfileInput, 'address'>) => Promise<void>
  isPending: boolean
  initial: Omit<UpdateProfileInput, 'address'>
}

export const ProfileInformationForm = ({
  onSubmit,
  initial
}: ProfileInformationFormProps) => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue
  } = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema)
  })

  const handleFormSubmit = async (
    data: z.infer<typeof updateProfileSchema>
  ) => {
    setError(null)
    setSuccess(false)
    try {
      await onSubmit(data)
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  return (
    <div className="max-w-xl">
      <div className="p-6 space-y-6">
        <div className="flex justify-center mb-6">
          <SingleImageUpload
            initialImage={initial.image || null}
            onUploadComplete={(image) => {
              setValue('image', image.url)
            }}
          />
        </div>
        <div className="text-sm text-gray-500 text-center">
          Upload your avatar
        </div>

        <form
          id="profile-form"
          className="space-y-4"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          {profileFields.map((field) =>
            field.type === 'select' ? (
              <FormControl key={field.name} fullWidth>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  {...register(field.name)}
                  label={field.label}
                  defaultValue={initial[field.name]}
                >
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                key={field.name}
                {...register(field.name)}
                {...commonTextFieldProps}
                label={field.label}
                defaultValue={initial[field.name]}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
                placeholder={field.placeholder}
              />
            )
          )}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label="Date of Birth"
                  value={value ? dayjs(value) : null}
                  onChange={onChange}
                  maxDate={dayjs().subtract(18, 'year')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dateOfBirth,
                      helperText: (
                        <span className="text-red-500">
                          {String(errors.dateOfBirth?.message || '')}
                        </span>
                      )
                    }
                  }}
                />
              )}
            />

            <Controller
              name="lastDonatedOn"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label="Last Blood Donation Date"
                  value={value ? dayjs(value) : null}
                  onChange={onChange}
                  maxDate={dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.lastDonatedOn,
                      helperText: (
                        <span className="text-red-500">
                          {String(errors.lastDonatedOn?.message || '')}
                        </span>
                      )
                    }
                  }}
                />
              )}
            />
          </LocalizationProvider>

          <FormControlLabel
            control={
              <Switch
                {...register('isAvailableForDonation')}
                defaultChecked={initial.isAvailableForDonation || false}
                color="primary"
              />
            }
            label="Available for Blood Donation"
          />

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 3 }}>
              Profile updated successfully!
            </Alert>
          )}
        </form>
      </div>
    </div>
  )
}
