import { NextRequest, NextResponse } from 'next/server'
import { prismaClient } from '@/lib/prismaClient'
import { auth } from '@/auth'
import { createResponse } from '@/utils/apiResponse'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.roles.includes('ADMIN')) {
      return NextResponse.json(
        createResponse(null, {
          status: 401,
          code: 'UNAUTHORIZED',
          message: 'Unauthorized access'
        }),
        { status: 401 }
      )
    }

    const request = await prismaClient.bloodDonationRequest.findUnique({
      where: { id: params.id }
    })

    if (!request) {
      return NextResponse.json(
        createResponse(null, {
          status: 404,
          code: 'NOT_FOUND',
          message: 'Blood donation request not found'
        }),
        { status: 404 }
      )
    }

    await prismaClient.bloodDonationRequest.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      createResponse({ message: 'Blood donation request deleted successfully' })
    )
  } catch (error) {
    console.error('[BLOOD_DONATION_DELETE_ERROR]:', error)
    return NextResponse.json(
      createResponse(null, {
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete blood donation request'
      }),
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.roles.includes('ADMIN')) {
      return NextResponse.json(
        createResponse(null, {
          status: 401,
          code: 'UNAUTHORIZED',
          message: 'Unauthorized access'
        }),
        { status: 401 }
      )
    }

    const request = await prismaClient.bloodDonationRequest.findUnique({
      where: { id: params.id }
    })

    if (!request) {
      return NextResponse.json(
        createResponse(null, {
          status: 404,
          code: 'NOT_FOUND',
          message: 'Blood donation request not found'
        }),
        { status: 404 }
      )
    }

    const body = await req.json()
    const { status } = body

    if (!['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'].includes(status)) {
      return NextResponse.json(
        createResponse(null, {
          status: 400,
          code: 'INVALID_STATUS',
          message: 'Invalid status provided'
        }),
        { status: 400 }
      )
    }

    const updatedRequest = await prismaClient.bloodDonationRequest.update({
      where: { id: params.id },
      data: { status },
      include: {
        requester: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        donor: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        address: {
          select: {
            division: true,
            district: true,
            upazila: true,
            streetAddress: true,
            postalCode: true
          }
        }
      }
    })

    return NextResponse.json(createResponse({ data: updatedRequest }))
  } catch (error) {
    console.error('[BLOOD_DONATION_UPDATE_ERROR]:', error)
    return NextResponse.json(
      createResponse(null, {
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update blood donation request'
      }),
      { status: 500 }
    )
  }
}
