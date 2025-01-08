import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prismaClient } from '@/lib/prismaClient'
import { z } from 'zod'
import { createResponse } from '@/utils/apiResponse'
import { updateProfileSchema } from '@/schema/account'

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        data: null,
        error: {
          status: 401,
          code: 'UNAUTHORIZED',
          message: 'Unauthorized'
        },
        timestamp: new Date().toISOString()
      })
    }

    const body = await req.json()
    const validatedData = updateProfileSchema.parse(body)
    const user = await prismaClient.user.findUnique({
      where: {
        id: session.user.id,
        isActive: true
      },
      include: {
        address: true
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        data: null,
        error: {
          status: 404,
          code: 'NOT_FOUND',
          message: 'User not found'
        },
        timestamp: new Date().toISOString()
      })
    }

    let addressId = user.addressId
    if (validatedData.address) {
      if (addressId) {
        await prismaClient.address.update({
          where: { id: addressId },
          data: validatedData.address
        })
      } else {
        const newAddress = await prismaClient.address.create({
          data: validatedData.address
        })
        addressId = newAddress.id
      }
    }

    const userData = Object.fromEntries(
      Object.entries(validatedData).filter(([key]) => key !== 'address')
    )

    const updatedUser = await prismaClient.user.update({
      where: { id: user.id },
      data: {
        ...userData,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bloodGroup: true,
        gender: true,
        dateOfBirth: true,
        lastDonatedOn: true,
        isAvailableForDonation: true,
        image: true,
        address: true,
        updatedAt: true
      }
    })

    return NextResponse.json(
      createResponse({
        message: 'Profile updated successfully',
        user: updatedUser
      }),
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        data: null,
        error: {
          status: 400,
          code: 'BAD_REQUEST',
          message: 'Invalid request data'
        },
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: false,
      data: null,
      error: {
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error'
      },
      timestamp: new Date().toISOString()
    })
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        data: null,
        error: {
          status: 401,
          code: 'UNAUTHORIZED',
          message: 'Unauthorized'
        }
      })
    }

    const user = await prismaClient.user.findUnique({
      where: { id: session.user.id },
      include: { address: true }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        data: null,
        error: {
          status: 404,
          code: 'NOT_FOUND',
          message: 'User not found'
        }
      })
    }

    return NextResponse.json(
      createResponse({
        message: 'Account details fetched successfully',
        user
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      success: false,
      data: null,
      error: {
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error'
      }
    })
  }
}
