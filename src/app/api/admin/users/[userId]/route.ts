import { NextRequest, NextResponse } from 'next/server'
import { prismaClient } from '@/lib/prismaClient'
import { auth } from '@/auth'
import { createResponse } from '@/utils/apiResponse'

export async function DELETE(
  req: NextRequest,
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

    await prismaClient.user.update({
      where: {
        id: params.userId
      },
      data: {
        isActive: false
      }
    })

    return NextResponse.json(
      createResponse({
        message: 'User deleted successfully'
      })
    )
  } catch (error: unknown) {
    console.log('error', error)
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

export async function POST(
  req: NextRequest,
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

    const updatedUser = await prismaClient.user.update({
      where: {
        id: params.userId
      },
      data: {
        isActive: false
      }
    })

    if (!updatedUser) {
      return NextResponse.json(
        createResponse({
          error: {
            message: 'User not found',
            status: 404
          }
        })
      )
    }

    return NextResponse.json(
      createResponse({
        message: 'User deactivated successfully'
      })
    )
  } catch (error: unknown) {
    console.log('error', error)
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
