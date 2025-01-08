import { NextRequest, NextResponse } from 'next/server'
import { prismaClient } from '@/lib/prismaClient'
import { ApiResponse } from '@/types/api'
import { BloodDonationRequest } from '@prisma/client'

async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  const type = request.nextUrl.searchParams.get('type') || 'donations'
  console.log(userId, type)
  if (!userId) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      data: null,
      error: {
        status: 401,
        code: 'MISSING_USER_ID',
        message: 'Unauthorized'
      },
      timestamp: new Date().toISOString()
    }
    return NextResponse.json(errorResponse, {
      status: 401
    })
  }

  const bloodDonations = await prismaClient.bloodDonationRequest.findMany({
    where: {
      ...(type === 'donations'
        ? {
            donorId: userId
          }
        : {
            requesterId: userId
          })
    },
    include: {
      requester: true,
      address: true
    }
  })

  return NextResponse.json<ApiResponse<BloodDonationRequest[]>>({
    success: true,
    data: bloodDonations,
    error: null,
    timestamp: new Date().toISOString()
  })
}

export { GET }
