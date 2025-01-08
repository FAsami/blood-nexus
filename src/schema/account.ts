import { z } from 'zod'
import { BloodGroup, Gender, AddressType } from '@prisma/client'
import parsePhoneNumberFromString from 'libphonenumber-js'
import dayjs from 'dayjs'

const passwordChangeSchema = z
  .object({
    currentPassword: z
      .string({
        required_error: 'Current password is required'
      })
      .min(1, {
        message: 'Current password is required'
      }),
    newPassword: z
      .string({
        required_error: 'New password is required'
      })
      .min(8, {
        message: 'New password must be at least 8 characters long'
      }),
    confirmPassword: z.string({
      required_error: 'Confirm password is required'
    })
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password can't be the same as the current password",
    path: ['newPassword']
  })

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => {
        if (!value) return true
        return parsePhoneNumberFromString(value)?.isValid()
      },
      {
        message: 'Invalid phone number'
      }
    ),
  bloodGroup: z.nativeEnum(BloodGroup).nullable().optional(),
  gender: z.nativeEnum(Gender).nullable().optional(),
  dateOfBirth: z.any().refine(
    (date) => {
      const dateObj = dayjs.isDayjs(date) ? date : dayjs(date)
      return !date || dateObj.isBefore(dayjs())
    },
    {
      message: 'Date of birth must be in the past'
    }
  ),
  lastDonatedOn: z.any().refine(
    (date) => {
      const dateObj = dayjs.isDayjs(date) ? date : dayjs(date)
      return !date || dateObj.isBefore(dayjs())
    },
    {
      message: 'Last donated date must be in the past'
    }
  ),
  isAvailableForDonation: z.boolean().optional(),
  image: z.string().url().nullable().optional(),
  address: z
    .object({
      label: z.string(),
      type: z.nativeEnum(AddressType).default('OTHER'),
      division: z.string(),
      district: z.string(),
      upazila: z.string(),
      streetAddress: z.string().nullable().optional(),
      postalCode: z.string().nullable().optional(),
      landmark: z.string().nullable().optional(),
      latitude: z.number().nullable().optional(),
      longitude: z.number().nullable().optional(),
      instructions: z.string().nullable().optional()
    })
    .optional()
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export { passwordChangeSchema }
