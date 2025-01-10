import { NextRequest, NextResponse } from 'next/server'
import { prismaClient } from '@/lib/prismaClient'
import { auth } from '@/auth'
import { createResponse } from '@/utils/apiResponse'
import {
  Prisma,
  BloodDonationRequest,
  BloodDonationRequestStatus,
  BloodGroup,
  BloodDonationRequestPriority
} from '@prisma/client'
import { ApiResponse } from '@/types/api'

type RequesterDonorSelect = {
  name: string
  email: string | null
  phone: string | null
}

type AddressSelect = {
  division: string
  district: string
  upazila: string
  streetAddress: string | null
  postalCode: string | null
}

type BloodDonationRequestWithRelations = Omit<
  BloodDonationRequest,
  'requester' | 'donor' | 'address'
> & {
  requester: RequesterDonorSelect | null
  donor: RequesterDonorSelect | null
  address: AddressSelect
}

type PaginatedResponse = {
  data: BloodDonationRequestWithRelations[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse<PaginatedResponse | null>>> {
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

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const bloodGroup = searchParams.get('bloodGroup')
    const priority = searchParams.get('priority')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build where clause
    const where: Prisma.BloodDonationRequestWhereInput = {}
    if (status) where.status = status as BloodDonationRequestStatus
    if (bloodGroup) where.bloodGroup = bloodGroup as BloodGroup
    if (priority) where.priority = priority as BloodDonationRequestPriority
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }
    const total = await prismaClient.bloodDonationRequest.count({ where })
    const requests = await prismaClient.bloodDonationRequest.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    return NextResponse.json(
      createResponse({
        data: requests,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      })
    )
  } catch (error) {
    console.error('[BLOOD_DONATIONS_FETCH_ERROR]:', error)
    return NextResponse.json(
      createResponse(null, {
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch blood donation requests'
      }),
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest
): Promise<NextResponse<ApiResponse<{ message: string } | null>>> {
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

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        createResponse(null, {
          status: 400,
          code: 'BAD_REQUEST',
          message: 'Request ID is required'
        }),
        { status: 400 }
      )
    }

    await prismaClient.bloodDonationRequest.delete({
      where: { id }
    })

    return NextResponse.json(
      createResponse({
        message: 'Blood donation request deleted successfully'
      })
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
