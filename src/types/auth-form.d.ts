import { ReactNode } from 'react'
import * as z from 'zod'

export interface AuthFormField {
  type: 'text' | 'password' | 'phone' | 'email'
  name: string
  label: string
  placeholder: string
  icon?: JSX.Element
  initialValue: string
  hidden?: boolean
}

export type AuthPageIdentifier =
  | 'login'
  | 'register'
  | 'forgotPassword'
  | 'setPassword'
  | 'verify'
  | 'changePassword'

export type AuthResponse = {
  success: boolean
  error?: string
  message?: string
}

export type AuthAction<T extends z.ZodType<unknown>> = (
  values: z.infer<T>,
  options: { callbackUrl: string; token: string; redirect?: boolean }
) => Promise<AuthResponse | void>

export interface AuthFormProps<TSchema extends z.ZodType<unknown>> {
  onFormSubmit: AuthAction<TSchema>
  identifier: AuthPageIdentifier
  fields: AuthFormField[]
  schema: TSchema
  resendButton?: ReactNode
}
