import { prismaClient } from '@/lib/prismaClient'
import normalizeAddress from '@/utils/normalizeAddress'
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import { CreateBloodDonationRequestResponse } from '@/types/api'
import { createResponse } from '@/utils/apiResponse'

const POST = async (
  req: NextRequest
): Promise<NextResponse<CreateBloodDonationRequestResponse>> => {
  const { placeId, bloodGroup } = await req.json()
  if (!placeId || !bloodGroup) {
    return NextResponse.json(
      createResponse<null>(null, {
        status: 400,
        code: 'MISSING_FIELDS',
        message: 'Missing required fields'
      }),
      { status: 400 }
    )
  }

  const { data } = await axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  )
  const locationDetails =
    data.status === 'OK' ? normalizeAddress(data.result) : null

  const bloodDonationRequest = await prismaClient.bloodDonationRequest.create({
    data: {
      locationId: placeId,
      bloodGroup,
      locationDetails: locationDetails
        ? JSON.parse(JSON.stringify(locationDetails))
        : null
    }
  })

  return NextResponse.json(
    createResponse<{ requestId: string }>({
      requestId: bloodDonationRequest.id
    }),
    { status: 201 }
  )
}

export { POST }
