import { prismaClient } from '@/lib/prismaClient'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types/api'
import { BloodDonationRequest } from '@prisma/client'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<BloodDonationRequest | null>>> {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            status: 401,
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to perform this action'
          },
          data: null,
          timestamp: new Date().toISOString()
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status } = body

    if (!['ACCEPTED', 'REJECTED', 'IGNORED', 'COMPLETED'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            status: 400,
            code: 'INVALID_INPUT',
            message: 'Invalid status provided'
          },
          data: null,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    const updatedRequest = await prismaClient.$transaction(async (tx) => {
      const request = await tx.bloodDonationRequest.update({
        where: {
          id: params.id,
          OR: [{ requesterId: session.user.id }, { donorId: session.user.id }]
        },
        data: {
          status,
          donorId: status === 'ACCEPTED' ? session.user.id : undefined,
          updatedAt: new Date()
        }
      })

      if (status === 'COMPLETED') {
        await tx.user.update({
          where: { id: session.user.id },
          data: { lastDonatedOn: new Date() }
        })
      }

      if (status === 'ACCEPTED') {
        await tx.requestedDonor.update({
          where: {
            bloodDonationRequestId_userId: {
              bloodDonationRequestId: params.id,
              userId: session.user.id
            }
          },
          data: {
            status: 'ACCEPTED'
          }
        })

        await tx.requestedDonor.updateMany({
          where: {
            bloodDonationRequestId: params.id,
            userId: {
              not: session.user.id
            }
          },
          data: {
            status: 'REJECTED'
          }
        })
      }

      return request
    })

    return NextResponse.json({
      success: true,
      data: updatedRequest,
      error: null,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[BLOOD_DONATION_STATUS_UPDATE_ERROR]:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            status: 500,
            code: 'DATABASE_ERROR',
            message: 'Failed to update blood donation request'
          },
          data: null,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          status: 500,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        },
        data: null,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
