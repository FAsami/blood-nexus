import { Noto_Sans, Noto_Sans_Bengali } from 'next/font/google'

const primary = Noto_Sans({
  weight: ['400', '700', '500', '900'],
  subsets: ['latin'],
  variable: '--font-primary'
})

const bengali = Noto_Sans_Bengali({
  weight: ['400', '700', '500', '900'],
  subsets: ['bengali'],
  variable: '--font-bengali'
})
const fonts = [primary, bengali]

export { fonts }
