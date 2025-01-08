import { NextRequest, NextResponse } from 'next/server'
import { hash, compare } from 'bcryptjs'
import { auth } from '@/auth'
import { prismaClient } from '@/lib/prismaClient'
import { z } from 'zod'
import { ChangePasswordResponse } from '@/types/api'
import { createResponse } from '@/utils/apiResponse'
import { passwordChangeSchema } from '@/schema/account'

export async function POST(
  req: NextRequest
): Promise<NextResponse<ChangePasswordResponse>> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        data: null,
        error: {
          status: 401,
          code: 'UNAUTHORIZED',
          message: 'Unauthorized'
        },
        timestamp: new Date().toISOString()
      })
    }

    const body = await req.json()
    const validatedData = passwordChangeSchema.parse(body)

    const user = await prismaClient.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true }
    })

    if (!user?.password) {
      return NextResponse.json({
        success: false,
        data: null,
        error: {
          status: 404,
          code: 'NOT_FOUND',
          message: 'User not found'
        },
        timestamp: new Date().toISOString()
      })
    }

    const isValidPassword = await compare(
      validatedData.currentPassword,
      user.password
    )

    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        data: null,
        error: {
          status: 400,
          code: 'BAD_REQUEST',
          message: 'Current password is incorrect'
        },
        timestamp: new Date().toISOString()
      })
    }

    const hashedPassword = await hash(validatedData.newPassword, 12)

    await prismaClient.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    return NextResponse.json(
      createResponse<{ message: string }>({
        message: 'Password updated successfully'
      }),
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        createResponse<{ message: string; errors: z.ZodIssue[] }>({
          message: 'Invalid input data',
          errors: error.errors
        }),
        { status: 400 }
      )
    }

    return NextResponse.json(
      createResponse<{ message: string }>({
        message: 'Internal server error'
      }),
      { status: 500 }
    )
  }
}
