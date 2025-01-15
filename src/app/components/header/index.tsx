import { auth } from '@/auth'
import Link from 'next/link'
import { FaFacebook, FaWhatsapp } from 'react-icons/fa'
import { FaEnvelope } from 'react-icons/fa'
import { Bloodtype, Person } from '@mui/icons-material'
import { NavigationMenu } from './NavigationMenu'
import { Righteous } from 'next/font/google'
import clsx from 'clsx'

const righteous = Righteous({
  subsets: ['latin'],
  weight: ['400']
})

const Header = async () => {
  const session = await auth()

  return (
    <div className="sticky bg-white top-0 z-50 border-b border-red-100">
      <div className="bg-red-500 py-1 md:py-2">
        <div className="container mx-auto px-4">
          <div className="flex  justify-between items-center text-xs md:text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-1 sm:mb-0 w-full sm:w-auto">
              <div className="flex items-center text-white t">
                <FaEnvelope className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <Link href="mailto:blood.nexus.org@gmail.com">
                  blood.nexus.org@gmail.com
                </Link>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                href="#"
                className="text-white hover:text-white h-3 w-3 md:h-4 md:w-4"
              >
                <FaFacebook className="h-3 w-3 md:h-4 md:w-4" />
              </Link>
              <Link
                href="#"
                className="text-white hover:text-white h-3 w-3 md:h-4 md:w-4"
              >
                <FaWhatsapp className="h-3 w-3 md:h-4 md:w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <nav className="relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 md:py-4">
            <Link href="/" className="flex items-center gap-2">
              <Bloodtype sx={{ fontSize: 40 }} className="text-red-500" />
              <span
                className={clsx(
                  'text-lg md:text-xl font-medium text-red-500 font-bengali hidden sm:block',
                  righteous.className
                )}
              >
                Blood Nexus
              </span>
            </Link>

            <div className="flex items-center md:gap-12">
              <div className="order-first md:order-last">
                {session?.user.id ? (
                  <Link href="/account/profile">
                    <button className="text-red-500 truncate w-24">
                      <Person sx={{ fontSize: 16 }} />{' '}
                      {session.user.name?.split(' ')[0]}
                    </button>
                  </Link>
                ) : (
                  <div>
                    <Link
                      href="/auth/login"
                      className="flex items-center space-x-1"
                    >
                      <button className="bg-red-500 rounded-full text-white px-4 py-2 font-medium">
                        Sign in
                      </button>
                    </Link>
                  </div>
                )}
              </div>
              <NavigationMenu />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Header
