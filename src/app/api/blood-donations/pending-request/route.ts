import { NextResponse } from 'next/server'
import { prismaClient } from '@/lib/prismaClient'
import { auth } from '@/auth'
import { createResponse } from '@/utils/apiResponse'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        createResponse(null, {
          status: 401,
          code: 'UNAUTHORIZED',
          message: 'Unauthorized'
        }),
        { status: 401 }
      )
    }

    const pendingRequest = await prismaClient.bloodDonationRequest.findFirst({
      where: {
        donorId: session.user.id,
        status: {
          in: ['PENDING', 'ACCEPTED']
        }
      },
      include: {
        requester: {
          select: {
            name: true
          }
        },
        address: {
          select: {
            division: true,
            district: true
          }
        },
        requestedDonors: {
          include: {
            user: {
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
    console.log(pendingRequest)

    return NextResponse.json(
      createResponse({
        data: pendingRequest
      })
    )
  } catch (error) {
    console.error('Error fetching pending request:', error)
    return NextResponse.json(
      createResponse(null, {
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error'
      }),
      { status: 500 }
    )
  }
}
