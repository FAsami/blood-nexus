'use server'

import { SendTokenSchema } from '@/schema/auth'
import { AuthAction } from '@/types/auth-form'
import { prismaClient } from '@/lib/prismaClient'
import { encrypt } from '@/utils/crypto'
import { sendToken } from './sendToken'
import { redirect } from 'next/navigation'
import { isEmpty } from 'lodash'

const forgotPassword: AuthAction<typeof SendTokenSchema> = async (
  values,
  { callbackUrl }
) => {
  let token = ''

  try {
    const validatedFields = SendTokenSchema.safeParse(values)
    if (!validatedFields.success) {
      return { success: false, error: 'Invalid fields!' }
    }

    const { email, phone } = validatedFields.data

    const user = await prismaClient.user.findFirst({
      where: {
        OR: [{ email: email || undefined }, { phone: phone || undefined }]
      }
    })

    if (!user) {
      return {
        success: false,
        error: `No account found with this ${phone ? 'phone number' : 'email'}`
      }
    }

    // Generate token for verification
    token = await encrypt({
      email: user.email,
      phone: user.phone,
      name: user.name,
      scope: 'FORGOT_PASSWORD'
    })

    // Send OTP
    const result = await sendToken({ email, phone, type: 'FORGOT_PASSWORD' })
    if (!result.success) {
      return result
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: 'Something went wrong!'
    }
  }

  if (!isEmpty(token)) {
    redirect(
      `/auth/verify?token=${encodeURIComponent(
        token
      )}&callbackUrl=${encodeURIComponent(callbackUrl)}`
    )
  }

  return { success: false, error: 'Failed to process request' }
}

export { forgotPassword }
