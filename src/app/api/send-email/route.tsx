import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createResponse } from '@/utils/apiResponse'

const emailSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required')
})

type EmailInput = z.infer<typeof emailSchema>

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json()
    const validatedData = emailSchema.parse(body)

    await sendEmail(validatedData)

    return NextResponse.json(
      createResponse({
        message: 'Email sent successfully'
      }),
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        createResponse<null>(null, {
          status: 400,
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors
        }),
        { status: 400 }
      )
    }

    console.error('Failed to send email:', error)
    return NextResponse.json(
      createResponse<null>(null, {
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to send email'
      }),
      { status: 500 }
    )
  }
}

async function sendEmail(data: EmailInput) {
  // Implement your email sending logic here
  // This is just a placeholder function
  console.log('Sending email:', data)
  // Throw error if email sending fails
  // await emailService.send(data)
}
