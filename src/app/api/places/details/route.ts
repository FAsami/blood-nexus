import { NextResponse } from 'next/server'

const allowedOrigins = ['http://localhost:3000']

export async function GET(request: Request) {
  const origin = request.headers.get('origin')

  // Check for allowed origins
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

  const { searchParams } = new URL(request.url)
  const placeId = searchParams.get('placeId')

  if (!placeId) {
    return NextResponse.json({ error: 'Place ID is required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    )
    const data = await response.json()

    const responseData = NextResponse.json(data)

    if (origin) {
      responseData.headers.set('Access-Control-Allow-Origin', origin)
      responseData.headers.set('Access-Control-Allow-Methods', 'GET')
      responseData.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
      )
    }

    return responseData
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch place details' },
      { status: 500 }
    )
  }
}
