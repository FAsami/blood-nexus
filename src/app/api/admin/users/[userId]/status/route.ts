import { NextResponse } from 'next/server'
import { prismaClient } from '@/lib/prismaClient'
import { auth } from '@/auth'
import { createResponse } from '@/utils/apiResponse'

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.roles.includes('ADMIN')) {
      return NextResponse.json(
        createResponse({
          error: {
            message: 'Unauthorized',
            status: 401
          }
        })
      )
    }

    // Prevent self-deactivation
    if (session.user.id === params.userId) {
      return NextResponse.json(
        createResponse({
          error: {
            message: 'Cannot modify your own status',
            status: 400
          }
        })
      )
    }

    const body = await request.json()
    const { isActive } = body

    const user = await prismaClient.user.update({
      where: { id: params.userId },
      data: { isActive }
    })

    return NextResponse.json(
      createResponse({
        success: true,
        user
      })
    )
  } catch (error) {
    console.error('Error updating user status:', error)
    return NextResponse.json(
      createResponse({
        error: {
          message: 'Internal server error',
          status: 500
        }
      })
    )
  }
}
