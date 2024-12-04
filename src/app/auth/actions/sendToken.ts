'use server'
import { prismaClient } from '@/lib/prismaClient'
import crypto from 'crypto'
import { SendTokenSchema } from '@/schema/auth'
import { sendMessage } from '@/utils/sendMessage'
import { phoneOTP } from '@/template/phoneOTP'
import { emailOTP } from '@/template/emailOTP'
import { sendEmail } from '@/utils/sendEmail'
import * as z from 'zod'

type SendTokenAction = (values: z.infer<typeof SendTokenSchema>) => Promise<{
  success: boolean
  message?: string
  error?: string
}>

const TOKEN_RESEND_INTERVAL = 2 * 60 * 1000

const sendToken: SendTokenAction = async (values) => {
  try {
    const validatedFields = SendTokenSchema.safeParse(values)
    if (!validatedFields.success) {
      return { success: false, error: 'Invalid fields!' }
    }
    const { email, phone, type } = validatedFields.data
    const user = await prismaClient.user.findFirst({
      where: {
        OR: [{ email: email || undefined }, { phone: phone || undefined }]
      }
    })

    if (user?.id && user.name) {
      const latestToken = await prismaClient.token.findFirst({
        where: {
          userId: user.id,
          type
        },
        orderBy: { createdAt: 'desc' }
      })

      const token = latestToken?.token
        ? latestToken?.token
        : crypto.randomInt(100_000, 1_000_000).toString()

      if (latestToken) {
        const timeSinceLastToken =
          Date.now() - new Date(latestToken.createdAt).getTime()

        if (timeSinceLastToken < TOKEN_RESEND_INTERVAL) {
          return {
            success: false,
            error: 'Token can only be resent after 2 minutes'
          }
        }
      }

      await prismaClient.token.create({
        data: {
          userId: user.id,
          token,
          type
        }
      })

      if (user.phone) {
        await sendMessage({
          phone: user.phone,
          message: phoneOTP(token)
        })
        return {
          success: true,
          message: 'Token sent successfully'
        }
      } else if (user.email) {
        await sendEmail({
          from: {
            email: process.env.NO_REPLY_EMAIL!,
            name: 'noreply'
          },
          to: {
            email: user.email,
            name: user.name
          },
          subject: 'Your Token',
          htmlbody: emailOTP({ name: user.name, otp: token })
        })
        return {
          success: true,
          message: 'Token sent successfully'
        }
      }
    }
    return {
      success: false,
      error: `No user is associated with ${
        values.phone ? 'phone number' : 'email'
      }`
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: 'Something went wrong !'
    }
  }
}
export { sendToken }
