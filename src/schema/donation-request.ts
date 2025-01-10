import * as z from 'zod'
import {
  BloodGroup,
  Gender,
  AddressType,
  BloodDonationRequestPriority
} from '@prisma/client'
import dayjs from 'dayjs'
import parsePhoneNumberFromString from 'libphonenumber-js'

export const DonationRequestSchema = z.object({
  bloodGroup: z.nativeEnum(BloodGroup, {
    required_error: 'Blood group is required'
  }),
  phone: z
    .string({
      required_error: 'Phone number is required'
    })
    .refine((value) => parsePhoneNumberFromString(value)?.isValid(), {
      message: 'Invalid phone number'
    }),
  unit: z.number().min(1, 'At least 1 unit is required'),
  requiredOn: z.any().refine(
    (date) => {
      const dateObj = dayjs.isDayjs(date) ? date : dayjs(date)
      return !date || dateObj.isAfter(dayjs())
    },
    {
      message: 'Required date must be in the future'
    }
  ),
  priority: z.nativeEnum(BloodDonationRequestPriority).default('MEDIUM'),
  notes: z.string().optional()
})

export const PatientSchema = z.object({
  name: z.string({
    required_error: 'Patient name is required'
  }),
  gender: z.nativeEnum(Gender).optional(),
  age: z.number().optional(),
  bloodGroup: z.nativeEnum(BloodGroup).optional(),
  disease: z.string().optional()
})

export const AddressSchema = z.object({
  label: z.string({
    required_error: 'Label is required'
  }),
  type: z.nativeEnum(AddressType).default('OTHER'),
  division: z.string({
    required_error: 'Division is required'
  }),
  district: z.string({
    required_error: 'District is required'
  }),
  upazila: z.string({
    required_error: 'Upazila is required'
  }),
  streetAddress: z.string().optional(),
  postalCode: z.string().optional(),
  landmark: z.string().optional(),
  instructions: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
})

export const BloodDonationRequestFormSchema = z.object({
  donationRequest: DonationRequestSchema,
  patient: PatientSchema,
  address: AddressSchema
})

export type DonationRequestInput = z.infer<typeof DonationRequestSchema>
export type PatientInput = z.infer<typeof PatientSchema>
export type BloodDonationRequestFormInput = z.infer<
  typeof BloodDonationRequestFormSchema
>
export type AddressInput = z.infer<typeof AddressSchema>
