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

    // First, check if the request exists and get its current state
    const existingRequest = await prismaClient.bloodDonationRequest.findUnique({
      where: {
        id: params.id
      },
      include: {
        requestedDonors: {
          where: {
            userId: session.user.id
          }
        }
      }
    })

    if (!existingRequest) {
      throw new Error('Blood donation request not found')
    }

    // Check if user is allowed to update the status
    if (status === 'ACCEPTED' && existingRequest.requestedDonors.length === 0) {
      throw new Error('You are not invited to this donation request')
    }

    // Update the blood donation request
    const updatedRequest = await prismaClient.bloodDonationRequest.update({
      where: {
        id: params.id
      },
      data: {
        status,
        donorId: ['ACCEPTED', 'COMPLETED'].includes(status)
          ? session.user.id
          : undefined,
        updatedAt: new Date()
      }
    })

    // Handle additional updates based on status
    if (status === 'COMPLETED') {
      await prismaClient.user.update({
        where: { id: session.user.id },
        data: { lastDonatedOn: new Date() }
      })

      await prismaClient.requestedDonor.update({
        where: {
          bloodDonationRequestId_userId: {
            bloodDonationRequestId: params.id,
            userId: session.user.id
          }
        },
        data: { status: 'COMPLETED' }
      })
    }

    if (status === 'ACCEPTED') {
      // Update the current user's request status
      await prismaClient.requestedDonor.update({
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

      // Reject other requests
      await prismaClient.requestedDonor.updateMany({
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
