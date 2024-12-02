import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as z from 'zod'

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
      .max(64, 'Password should not exceed 64 characters')
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
    })
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

export const SendOTPSchema = z
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
      )
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

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(64, 'Password should not exceed 64 characters'),
    confirmPassword: z.string(),
    token: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

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
