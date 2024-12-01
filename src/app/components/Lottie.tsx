import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export type LottieIdentifier = 'blood-donation'

const LOTTIE_MAPPINGS: Record<LottieIdentifier, string> = {
  'blood-donation': '/lottie/blood-donation.lottie'
}

const Lottie = ({ identifier = '' as LottieIdentifier }) => {
  if (!identifier) return null

  const lottieSource = LOTTIE_MAPPINGS[identifier]
  if (!lottieSource) return null

  return <DotLottieReact src={lottieSource} loop autoplay />
}

export { Lottie }
