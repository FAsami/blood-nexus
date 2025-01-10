import { NextResponse } from 'next/server'
import { prismaClient } from '@/lib/prismaClient'
import { auth } from '@/auth'
import { createResponse } from '@/utils/apiResponse'

export async function GET() {
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

    const users = await prismaClient.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
        userRoles: {
          select: {
            role: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(
      createResponse({
        users
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
