import { SubmitBloodDonationRequestResponse } from '@/types/api'
import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prismaClient } from '@/lib/prismaClient'
import { BloodDonationRequestFormInput } from '@/schema/donation-request'
import { auth } from '@/auth'

const POST = async (
  req: NextRequest
): Promise<NextResponse<SubmitBloodDonationRequestResponse>> => {
  try {
    const session = await auth()
    if (!session) {
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

    const data: BloodDonationRequestFormInput & {
      donationRequestId: string
    } = await req.json()

    if (!data.donationRequestId) {
      return NextResponse.json({
        success: false,
        data: null,
        error: {
          status: 400,
          code: 'BAD_REQUEST',
          message: 'Donation request ID is required'
        },
        timestamp: new Date().toISOString()
      })
    }

    const bloodDonationRequest =
      await prismaClient.bloodDonationRequest.findUnique({
        where: {
          id: data.donationRequestId
        }
      })

    if (!bloodDonationRequest) {
      return NextResponse.json({
        success: false,
        data: null,
        error: {
          status: 404,
          code: 'NOT_FOUND',
          message: 'Blood donation request not found'
        },
        timestamp: new Date().toISOString()
      })
    }

    if (!data.address) {
      return NextResponse.json({
        success: false,
        data: null,
        error: {
          status: 400,
          code: 'BAD_REQUEST',
          message: 'Address data is required'
        },
        timestamp: new Date().toISOString()
      })
    }

    await prismaClient.address.update({
      where: {
        id: bloodDonationRequest.addressId
      },
      data: data.address
    })

    if (!data.patient) {
      return NextResponse.json({
        success: false,
        data: null,
        error: {
          status: 400,
          code: 'BAD_REQUEST',
          message: 'Patient data is required'
        },
        timestamp: new Date().toISOString()
      })
    }
    let patient
    if (!bloodDonationRequest.patientId) {
      patient = await prismaClient.patient.create({
        data: data.patient
      })
    } else {
      patient = await prismaClient.patient.update({
        where: {
          id: bloodDonationRequest.patientId
        },
        data: data.patient
      })
    }

    const result = await prismaClient.bloodDonationRequest.update({
      where: {
        id: data.donationRequestId
      },
      data: {
        userId: session.user.id,
        status: 'PENDING',
        requiredOn: data.donationRequest.requiredOn,
        phone: data.donationRequest.phone,
        unit: data.donationRequest.unit,
        priority: data.donationRequest.priority,
        notes: data.donationRequest.notes,
        patientId: patient.id,
        bloodGroup: data.donationRequest.bloodGroup
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        requestId: result.id
      },
      error: null,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to create blood donation request:', error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: {
          status: 500,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create blood donation request'
        },
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export { POST }
