'use server'

import bcrypt from 'bcryptjs'
import { signIn } from '@/auth'
import { RegisterSchema, TokenType } from '@/schema/auth'
import { AuthAction } from '@/types/auth-form'
import { prismaClient } from '@/lib/prismaClient'
import { isEmpty } from 'lodash'
import { redirect } from 'next/navigation'
import { encrypt } from '@/utils/crypto'
import { sendToken } from './sendToken'

const registerUser: AuthAction<typeof RegisterSchema> = async (
  values,
  { callbackUrl }
) => {
  let token = ''

  try {
    const validatedFields = RegisterSchema.safeParse(values)
    if (!validatedFields.success) {
      return { success: false, error: 'Invalid fields!' }
    }

    const { email, password, firstName, lastName, phone } = validatedFields.data

    const existingUser = await prismaClient.user.findFirst({
      where: {
        OR: [{ email: email || undefined }, { phone: phone || undefined }]
      }
    })

    if (existingUser) {
      if (existingUser.phone === phone) {
        return { success: false, error: 'Phone number already exists!' }
      }
      if (existingUser.email === email) {
        return { success: false, error: 'Email already exists!' }
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prismaClient.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: email || null,
        phone: phone || null,
        password: hashedPassword,
        userRoles: {
          create: {
            role: {
              connect: {
                name: 'USER'
              }
            }
          }
        }
      }
    })

    if (user) {
      if (user.phone) {
        await signIn('phone_password', {
          phone,
          password,
          redirect: false
        })
      } else if (user.email) {
        await signIn('email_password', {
          email,
          password,
          redirect: false
        })
      }

      token = await encrypt({
        email: user.email,
        phone: user.phone,
        name: user.name,
        scope: user.phone
          ? TokenType.Enum.PHONE_VERIFICATION
          : TokenType.Enum.EMAIL_VERIFICATION
      })

      await sendToken({
        email,
        phone,
        type: user.phone
          ? TokenType.Enum.PHONE_VERIFICATION
          : TokenType.Enum.EMAIL_VERIFICATION
      })
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: 'Something went wrong!'
    }
  }

  /**
   * In Server Actions and Route Handlers, redirect should be called after the try/catch block.
   * Token will be populated if authentication and user creating is successful and then we will redirect
   * */
  if (!isEmpty(token)) {
    redirect(
      `/auth/verify?token=${encodeURIComponent(
        token
      )}&callbackUrl=${encodeURIComponent(callbackUrl)}`
    )
  }
}

export { registerUser }
