import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../theme'
import type { Metadata } from 'next'
import './globals.css'
import Header from './components/header'
import { fonts } from './fonts/font'
import clsx from 'clsx'
import { ReCaptchaProvider } from './providers/recaptcha'
import { SessionProvider } from 'next-auth/react'
import { QueryProvider } from './providers/query-client'

export const metadata: Metadata = {
  title: 'Blood Nexus',
  description: 'Blood Nexus - A platform for blood donation and management'
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={clsx(
          fonts.map((font) => font.variable),
          'font-primary overflow-hidden'
        )}
      >
        <QueryProvider>
          <ReCaptchaProvider>
            <SessionProvider>
              <AppRouterCacheProvider>
                <ThemeProvider theme={theme}>
                  <Header />
                  <main className="h-[calc(100vh-var(--header-height))] overflow-y-auto">
                    {children}
                  </main>
                </ThemeProvider>
              </AppRouterCacheProvider>
            </SessionProvider>
          </ReCaptchaProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

export default RootLayout
