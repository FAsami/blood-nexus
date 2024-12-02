import { NextResponse } from 'next/server'
import { prismaClient } from '@/lib/prismaClient'
import { BloodGroup } from '@prisma/client'

const allowedOrigins = ['http://localhost:3000']

export async function POST(request: Request) {
  const origin = request.headers.get('origin')

  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json(
      { error: 'Unauthorized origin' },
      {
        status: 403,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigins[0]
        }
      }
    )
  }

  try {
    const { bloodGroup, placeId } = await request.json()

    if (!bloodGroup || !placeId) {
      return NextResponse.json(
        { error: 'Blood group and location are required' },
        { status: 400 }
      )
    }

    const placeDetailsResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    )
    const placeDetails = await placeDetailsResponse.json()

    if (!placeDetailsResponse.ok || placeDetails.status !== 'OK') {
      throw new Error('Failed to fetch place details')
    }

    const place = placeDetails.result
    const addressComponents = place.address_components

    const location = await prismaClient.location.upsert({
      where: { placeId },
      create: {
        placeId,
        name: place.name,
        formattedAddress: place.formatted_address,
        area:
          addressComponents.find((c: any) => c.types.includes('sublocality'))
            ?.long_name || null,
        city:
          addressComponents.find((c: any) => c.types.includes('locality'))
            ?.long_name || '',
        district:
          addressComponents.find((c: any) =>
            c.types.includes('administrative_area_level_2')
          )?.long_name || null,
        division:
          addressComponents.find((c: any) =>
            c.types.includes('administrative_area_level_1')
          )?.long_name || null,
        country:
          addressComponents.find((c: any) => c.types.includes('country'))
            ?.long_name || '',
        postalCode:
          addressComponents.find((c: any) => c.types.includes('postal_code'))
            ?.long_name || null,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        phoneNumber: place.formatted_phone_number || null
      },
      update: {}
    })

    const patient = await prismaClient.patient.create({
      data: {
        name: '',
        age: 21,
        bloodGroup: bloodGroup as BloodGroup
      }
    })

    const donationRequest = await prismaClient.donationRequest.create({
      data: {
        patientId: patient.id,
        unitsNeeded: 1,
        locationId: location.id,
        userId: 'temp-user-id',
        requiredBefore: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        reason: 'Blood donation request'
      }
    })

    const responseData = NextResponse.json({ requestId: donationRequest.id })

    if (origin) {
      responseData.headers.set('Access-Control-Allow-Origin', origin)
      responseData.headers.set('Access-Control-Allow-Methods', 'POST')
      responseData.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
      )
    }

    return responseData
  } catch (error) {
    console.error('Error creating donation request:', error)
    return NextResponse.json(
      { error: 'Failed to create donation request' },
      { status: 500 }
    )
  }
}
