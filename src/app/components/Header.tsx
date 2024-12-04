import { auth } from '@/auth'
import Link from 'next/link'
import { FaFacebook, FaWhatsapp } from 'react-icons/fa'
import { FaEnvelope } from 'react-icons/fa'
import Image from 'next/image'
import { Person } from '@mui/icons-material'

const Header = async () => {
  const session = await auth()
  return (
    <div className="sticky top-0 z-50">
      <div className="bg-red-500 py-1 md:py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs md:text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-1 sm:mb-0 w-full sm:w-auto">
              <div className="flex items-center text-white t">
                <FaEnvelope className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span>contact@roktodan.org</span>
              </div>
            </div>
            <div className="flex space-x-3 self-end sm:self-center">
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
      <nav className="bg-white relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 md:py-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Roktodan"
                width={120}
                height={40}
                className="h-8 md:h-12 w-auto"
              />
              <span className="text-lg md:text-xl font-medium text-red-500 font-bengali hidden sm:block">
                Roktodan
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-red-500 font-medium text-sm md:text-base"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-red-500 font-medium text-sm md:text-base"
              >
                About
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-red-500 font-medium text-sm md:text-base"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-red-500 font-medium text-sm md:text-base"
              >
                Contact
              </Link>
            </div>
            <div>
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
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Header
