import {
  Inter,
  Montserrat,
  Noto_Sans_Bengali,
  Poppins,
  Roboto
} from 'next/font/google'

const primary = Montserrat({
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
