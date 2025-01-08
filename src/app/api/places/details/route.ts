import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/types/api'
import axios from 'axios'
import normalizeAddress from '@/utils/normalizeAddress'

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000']

const corsHeaders = {
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Origin': allowedOrigins[0]
      }
    }
  )
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')

  // Set CORS headers for all responses
  const responseHeaders = {
    ...corsHeaders,
    'Access-Control-Allow-Origin':
      origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
  }

  // Check origin
  if (origin && !allowedOrigins.includes(origin)) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      data: null,
      error: {
        status: 403,
        code: 'UNAUTHORIZED_ORIGIN',
        message: 'Unauthorized origin'
      },
      timestamp: new Date().toISOString()
    }
    return NextResponse.json(errorResponse, {
      status: 403,
      headers: responseHeaders
    })
  }

  const { searchParams } = new URL(request.url)
  const placeId = searchParams.get('placeId')

  if (!placeId) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      data: null,
      error: {
        status: 400,
        code: 'MISSING_PLACE_ID',
        message: 'Place ID is required'
      },
      timestamp: new Date().toISOString()
    }
    return NextResponse.json(errorResponse, {
      status: 400,
      headers: responseHeaders
    })
  }

  try {
    const { data } = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    )
    if (data.status !== 'OK') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        data: null,
        error: {
          status: 400,
          code: 'INVALID_PLACE_ID',
          message: 'Invalid place ID'
        },
        timestamp: new Date().toISOString()
      }
      return NextResponse.json(errorResponse, {
        status: 400,
        headers: responseHeaders
      })
    }
    const address = normalizeAddress(data.result)

    const apiResponse: ApiResponse<typeof data> = {
      success: true,
      data: address,
      error: null,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(apiResponse, {
      headers: responseHeaders
    })
  } catch (error) {
    console.error(error)
    const errorResponse: ApiResponse<null> = {
      success: false,
      data: null,
      error: {
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch place details',
        details: axios.isAxiosError(error) ? error.response?.data : undefined
      },
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: responseHeaders
    })
  }
}
