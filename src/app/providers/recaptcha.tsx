'use client'
import React from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

const ReCaptchaProvider = ({ children }: { children: React.ReactNode }) => {
  const key: string | undefined = process?.env?.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  return (
    <GoogleReCaptchaProvider reCaptchaKey={key ?? 'NOT DEFINED'}>
      {children}
    </GoogleReCaptchaProvider>
  )
}
export { ReCaptchaProvider }
