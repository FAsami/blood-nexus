import { NextResponse } from 'next/server'

const allowedOrigins = ['http://localhost:3000']

export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url)
  const input = searchParams.get('input')

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${process.env.GOOGLE_MAPS_API_KEY}`
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
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { status: 500 }
    )
  }
}
