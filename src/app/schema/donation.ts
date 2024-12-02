import { z } from 'zod'

export const donationRequestSchema = z.object({
  patientName: z.string().min(2, 'Patient name is required'),
  patientAge: z.number().min(0).max(150),
  bloodGroup: z.enum([
    'A_POSITIVE',
    'A_NEGATIVE',
    'B_POSITIVE',
    'B_NEGATIVE',
    'O_POSITIVE',
    'O_NEGATIVE',
    'AB_POSITIVE',
    'AB_NEGATIVE'
  ] as const),
  unitsNeeded: z.number().min(1).max(10),
  hospitalName: z.string().min(2, 'Hospital name is required'),
  hospitalAddress: z.string().min(5, 'Hospital address is required'),
  placeId: z.string().min(1, 'Place ID is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  contactPhone: z.string().regex(/^\+?[\d\s-]{8,}$/, 'Invalid phone number'),
  contactEmail: z.string().email().optional().nullable(),
  urgency: z.enum(['NORMAL', 'URGENT', 'EMERGENCY'] as const),
  requiredBefore: z.string().transform((str) => new Date(str)),
  medicalNotes: z.string().optional().nullable(),
  reason: z.string().min(10, 'Please provide a reason for the donation request')
})
