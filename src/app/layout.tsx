import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../theme'
import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'
import { fonts } from './fonts/font'
import clsx from 'clsx'
import { ReCaptchaProvider } from './providers/recaptcha'
import { SessionProvider } from 'next-auth/react'
export const metadata: Metadata = {
  title: 'রক্তদান - রক্তদান প্ল্যাটফর্ম | Roktodan - Blood Donation Platform',
  description:
    'রক্তদানের মাধ্যমে জীবন বাঁচান | Save lives through blood donation'
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
        <ReCaptchaProvider>
          <SessionProvider>
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>
                <Header />
                {children}
              </ThemeProvider>
            </AppRouterCacheProvider>
          </SessionProvider>
        </ReCaptchaProvider>
      </body>
    </html>
  )
}

export default RootLayout
