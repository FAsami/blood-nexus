'use server'

import { prismaClient } from '@/lib/prismaClient'
import { VerifyOTPSchema } from '@/schema/auth'
import { AuthAction } from '@/types/auth-form'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

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

    const { otp, email, phone } = validatedFields.data

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
        type: 'OTP',
        token: otp
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!latestToken) {
      return { success: false, error: 'Invalid OTP!' }
    }

    // Check if OTP is expired (15 minutes)
    const tokenAge = Date.now() - new Date(latestToken.createdAt).getTime()
    if (tokenAge > 15 * 60 * 1000) {
      return { success: false, error: 'OTP has expired!' }
    }

    // Check if this is a password reset flow
    isPasswordReset =
      (await prismaClient.token.findFirst({
        where: {
          userId: user.id,
          type: 'RESET_PASSWORD',
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
    // Redirect to set-password page if this is a password reset flow
    if (isPasswordReset) {
      redirect('/auth/set-password')
    }
    redirect(callbackUrl)
  }

  return { success: false, error: 'Verification failed!' }
}

export { verifyOTP }
