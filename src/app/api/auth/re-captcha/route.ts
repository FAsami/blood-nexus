import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
  const { gRecaptchaToken } = await request.json()

  try {
    const res = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${gRecaptchaToken}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    if (res && res.data?.success && res.data?.score > 0.5) {
      return NextResponse.json({
        success: true,
        score: res.data.score
      })
    } else {
      return NextResponse.json({ success: false })
    }
  } catch (error) {
    console.log('[CAPTCHA FAILED]', error)
    return NextResponse.json({ success: false })
  }
}
