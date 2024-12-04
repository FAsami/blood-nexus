import * as z from 'zod'

export type AuthResponse = {
  success: boolean
  error?: string
  message?: string
}

export type AuthAction<T extends z.ZodType<unknown>> = (
  values: z.infer<T>,
  options: { callbackUrl: string; token?: string; redirect?: boolean }
) => Promise<AuthResponse | void>
