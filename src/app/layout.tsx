import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'
import { fonts } from './fonts/font'
import clsx from 'clsx'

export const metadata: Metadata = {
  title: 'Roktodan - Blood Donation Platform',
  description: 'Save lives through blood donation'
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={clsx(
          fonts.map((font) => font.variable),
          'font-primary'
        )}
      >
        <Header />
        {children}
      </body>
    </html>
  )
}

export default RootLayout
