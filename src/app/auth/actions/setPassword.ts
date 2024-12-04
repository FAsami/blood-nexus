'use server'

import bcrypt from 'bcryptjs'
import { ResetPasswordSchema } from '@/schema/auth'
import { AuthAction } from '@/types/auth-form'
import { prismaClient } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

const setPassword: AuthAction<typeof ResetPasswordSchema> = async (
  values,
  { callbackUrl }
) => {
  let isPasswordReset = false
  try {
    const session = await auth()

    const validatedFields = ResetPasswordSchema.safeParse(values)
    if (!validatedFields.success) {
      return { success: false, error: 'Invalid fields!' }
    }

    const { password } = validatedFields.data

    const hashedPassword = await bcrypt.hash(password, 10)

    await prismaClient.user.update({
      where: { id: session?.user?.id },
      data: { password: hashedPassword }
    })

    revalidatePath('/', 'layout')
    isPasswordReset = true
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: 'Something went wrong!'
    }
  }
  if (isPasswordReset) {
    redirect(decodeURIComponent(callbackUrl))
  }

  return { success: isPasswordReset }
}

export { setPassword }
