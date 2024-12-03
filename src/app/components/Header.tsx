'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaPinterest,
  FaEnvelope,
  FaPhone,
  FaBars,
  FaTimes
} from 'react-icons/fa'
import { BloodtypeSharp } from '@mui/icons-material'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button, Menu, MenuItem, Avatar } from '@mui/material'
import { Person as PersonIcon } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

const Header = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  const controlHeader = () => {
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader)
      return () => {
        window.removeEventListener('scroll', controlHeader)
      }
    }
  }, [lastScrollY])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleMenuClose()
    signOut()
  }

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-transform duration-300',
        isVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className="bg-red-500 py-1 md:py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs md:text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-1 sm:mb-0 w-full sm:w-auto">
              <div className="flex font-bold items-center text-white text-sm mb-1 sm:mb-0">
                <FaPhone className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span>+1 (454) 556-5656</span>
              </div>
              <div className="flex items-center text-white t">
                <FaEnvelope className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span>contact@roktodan.com</span>
              </div>
            </div>
            <div className="flex space-x-3 self-end sm:self-center">
              <Link
                href="#"
                className="text-white hover:text-red-500 h-3 w-3 md:h-4 md:w-4"
              >
                <FaFacebook className="h-3 w-3 md:h-4 md:w-4" />
              </Link>
              <Link
                href="#"
                className="text-white hover:text-red-500 h-3 w-3 md:h-4 md:w-4"
              >
                <FaTwitter className="h-3 w-3 md:h-4 md:w-4" />
              </Link>
              <Link
                href="#"
                className="text-white hover:text-red-500 h-3 w-3 md:h-4 md:w-4"
              >
                <FaLinkedin className="h-3 w-3 md:h-4 md:w-4" />
              </Link>
              <Link
                href="#"
                className="text-white hover:text-red-500 h-3 w-3 md:h-4 md:w-4"
              >
                <FaPinterest className="h-3 w-3 md:h-4 md:w-4" />
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

              <Link
                href="/donate"
                className="bg-red-500 text-white px-5 py-2 whitespace-nowrap rounded-full hover:bg-red-700 transition-colors font-medium text-sm md:text-base"
              >
                Donate Blood
              </Link>
              <div className="w-[120px] ">
                {session ? (
                  <Button
                    onClick={handleMenuOpen}
                    startIcon={
                      session.user?.image ? (
                        <Avatar
                          src={session.user.image}
                          sx={{ width: 24, height: 24 }}
                        />
                      ) : (
                        <PersonIcon />
                      )
                    }
                    className="text-gray-700 hover:text-red-500 font-medium text-sm md:text-base normal-case w-full truncate"
                  >
                    <span className="truncate">
                      {session.user?.name || 'Account'}
                    </span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => signIn()}
                    startIcon={<PersonIcon />}
                    className="text-gray-700 hover:text-red-500 font-medium text-sm md:text-base normal-case w-full"
                  >
                    Login
                  </Button>
                )}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuClose()
                      router.push('/profile')
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <span className="text-red-500">Logout</span>
                  </MenuItem>
                </Menu>
              </div>
            </div>

            <div className="flex  overflow-hidden items-center space-x-2 md:hidden">
              <div className="w-[120px] flex-shrink-0">
                {session ? (
                  <Button
                    onClick={handleMenuOpen}
                    startIcon={
                      session.user?.image ? (
                        <Avatar
                          src={session.user.image}
                          sx={{ width: 20, height: 20 }}
                        />
                      ) : (
                        <PersonIcon className="h-5 w-5" />
                      )
                    }
                    className="text-gray-700 hover:text-red-500 font-medium text-sm normal-case p-0 w-full truncate"
                  >
                    <span className="truncate">
                      {session.user?.name || 'Profile'}
                    </span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => signIn()}
                    startIcon={<PersonIcon className="h-5 w-5" />}
                    className="text-gray-700 hover:text-red-500 font-medium text-sm normal-case p-0 w-full"
                  >
                    Login
                  </Button>
                )}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuClose()
                      router.push('/profile')
                    }}
                  >
                    Account
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <span className="text-red-500">Logout</span>
                  </MenuItem>
                </Menu>
              </div>
              <Link
                href="/donate"
                className="bg-red-500 text-white px-3 py-1.5 rounded-full hover:bg-red-700 transition-colors font-medium text-sm"
              >
                Donate Blood
              </Link>
              <button
                className="text-gray-700 p-1"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <FaTimes className="h-5 w-5 text-red-400" />
                ) : (
                  <FaBars className="h-5 w-5 text-red-400" />
                )}
              </button>
            </div>
          </div>

          <div
            className={clsx(
              'md:hidden absolute top-full left-0 right-0 bg-white transition-all duration-300',
              isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            )}
          >
            <div className="flex flex-col">
              <Link
                href="/"
                className="px-4 py-2.5 text-gray-700 hover:text-red-500 hover:bg-gray-50 text-base"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="px-4 py-2.5 text-gray-700 hover:text-red-500 hover:bg-gray-50 text-base"
              >
                About
              </Link>
              <Link
                href="/blog"
                className="px-4 py-2.5 text-gray-700 hover:text-red-500 hover:bg-gray-50 text-base"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2.5 text-gray-700 hover:text-red-500 hover:bg-gray-50 text-base"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
