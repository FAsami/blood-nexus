'use server'

import { prismaClient } from '@/lib/prismaClient'
import { TokenType, VerifyOTPSchema } from '@/schema/auth'
import { AuthAction } from '@/types/auth-form'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { signIn } from '@/auth'

const verifyOTP: AuthAction<typeof VerifyOTPSchema> = async (
  values,
  { callbackUrl }
) => {
  let isVerified = false
  let isPasswordReset = false

  try {
    const validatedFields = VerifyOTPSchema.safeParse(values)
    if (!validatedFields.success) {
      return { success: false, error: 'Invalid fields!' }
    }

    const { otp, email, phone, type } = validatedFields.data

    const user = await prismaClient.user.findFirst({
      where: {
        OR: [{ email: email || undefined }, { phone: phone || undefined }]
      }
    })

    if (!user) {
      return { success: false, error: 'User not found!' }
    }

    const latestToken = await prismaClient.token.findFirst({
      where: {
        userId: user.id,
        type,
        token: otp
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!latestToken) {
      return { success: false, error: 'Invalid OTP!' }
    }

    const tokenAge = Date.now() - new Date(latestToken.createdAt).getTime()
    if (tokenAge > 15 * 60 * 1000) {
      return { success: false, error: 'OTP has expired!' }
    }

    isPasswordReset =
      (await prismaClient.token.findFirst({
        where: {
          userId: user.id,
          type: TokenType.Enum.RESET_PASSWORD,
          expiresAt: { gt: new Date() }
        }
      })) !== null

    await prismaClient.user.update({
      where: { id: user.id },
      data: { phoneVerified: new Date() }
    })

    await prismaClient.token.delete({
      where: { id: latestToken.id }
    })
    if (user.phone) {
      await signIn('verify_otp', {
        phone,
        redirect: false
      })
    } else if (user.email) {
      await signIn('verify_otp', {
        email,
        redirect: false
      })
    }

    isVerified = true
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: 'Something went wrong!'
    }
  }

  if (isVerified) {
    revalidatePath('/', 'layout')
    if (isPasswordReset) {
      redirect(
        `/auth/set-password?callbackUrl=${encodeURIComponent(callbackUrl)}`
      )
    }
    redirect(decodeURIComponent(callbackUrl))
  }

  return { success: false, error: 'Verification failed!' }
}

export { verifyOTP }
