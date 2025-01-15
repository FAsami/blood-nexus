import { NextRequest, NextResponse } from 'next/server'
import { prismaClient } from '@/lib/prismaClient'
import { ApiResponse } from '@/types/api'
import { BloodDonationRequest } from '@prisma/client'
import { auth } from '@/auth'

async function GET(request: NextRequest) {
  const session = await auth()
  const type = request.nextUrl.searchParams.get('type') || 'donations'
  if (!session?.user.id) {
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
            donorId: session?.user.id
          }
        : {
            requesterId: session?.user.id
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
