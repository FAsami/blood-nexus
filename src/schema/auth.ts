import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as z from 'zod'

export const TokenType = z.enum([
  'OTP',
  'RESET_PASSWORD',
  'EMAIL_VERIFICATION',
  'PHONE_VERIFICATION'
])

export const LoginSchema = z
  .object({
    phone: z
      .string()
      .refine(
        (value) => {
          if (!value) return true
          const phoneNumber = parsePhoneNumberFromString(value)
          return phoneNumber?.isValid()
        },
        {
          message: 'Invalid phone number'
        }
      )
      .optional(),
    email: z
      .string()
      .optional()
      .refine(
        (value) => !value || z.string().email().safeParse(value).success,
        {
          message: 'Invalid email'
        }
      ),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(64, 'Password should not be exceed 64 characters')
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Phone number is required',
        path: ['email']
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Phone number is required',
        path: ['phone']
      })
    }
  })

export type LoginInput = z.infer<typeof LoginSchema>

export const RegisterSchema = z
  .object({
    firstName: z.string().min(1, {
      message: 'First name is required'
    }),
    lastName: z.string().min(1, {
      message: 'Last name is required'
    }),
    phone: z
      .string()
      .refine(
        (value) => {
          if (!value) return true
          const phoneNumber = parsePhoneNumberFromString(value)
          return phoneNumber?.isValid()
        },
        {
          message: 'Invalid phone number'
        }
      )
      .optional(),
    email: z
      .string()
      .optional()
      .refine(
        (value) => !value || z.string().email().safeParse(value).success,
        {
          message: 'Invalid email'
        }
      ),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(64, 'Password should not exceed 64 characters'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either email or phone number is required',
        path: ['email']
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either email or phone number is required',
        path: ['phone']
      })
    }
  })
export type RegisterInput = z.infer<typeof RegisterSchema>

export const VerifyOTPSchema = z
  .object({
    phone: z
      .string()
      .refine(
        (value) => {
          if (!value) return true
          const phoneNumber = parsePhoneNumberFromString(value)
          return phoneNumber?.isValid()
        },
        {
          message: 'Invalid phone number'
        }
      )
      .optional(),
    email: z
      .string()
      .optional()
      .refine(
        (value) => !value || z.string().email().safeParse(value).success,
        {
          message: 'Invalid email'
        }
      ),
    otp: z.string().length(6, {
      message: 'OTP must be exactly 6 digits'
    }),
    type: TokenType
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either email or phone number is required',
        path: ['email']
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either email or phone number is required',
        path: ['phone']
      })
    }
  })

export type VerifyOTPInput = z.infer<typeof VerifyOTPSchema>

export const SendTokenSchema = z
  .object({
    phone: z
      .string()
      .refine(
        (value) => {
          if (!value) return true
          const phoneNumber = parsePhoneNumberFromString(value)
          return phoneNumber?.isValid()
        },
        {
          message: 'Invalid phone number'
        }
      )
      .optional(),
    email: z
      .string()
      .optional()
      .refine(
        (value) => !value || z.string().email().safeParse(value).success,
        {
          message: 'Invalid email'
        }
      ),
    type: TokenType
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either email or phone number is required',
        path: ['email']
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either email or phone number is required',
        path: ['phone']
      })
    }
  })

export type SendTokenInput = z.infer<typeof SendTokenSchema>

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(64, 'Password should not exceed 64 characters'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>

export const ChangePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(64, 'Password should not exceed 64 characters'),
    oldPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(64, 'Password should not exceed 64 characters'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>
