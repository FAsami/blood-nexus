'use client'

import Link from 'next/link'
import { useState } from 'react'
import { IconButton, Menu, MenuItem } from '@mui/material'
import { MdMenu, MdClose } from 'react-icons/md'

const NavigationMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const menuItems = [
    { href: '/about', label: 'About' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/contact', label: 'Contact' }
  ]

  return (
    <div>
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <IconButton
          onClick={handleClick}
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          {open ? (
            <MdClose className="h-6 w-6" />
          ) : (
            <MdMenu className="h-6 w-6" />
          )}
        </IconButton>
      </div>

      {/* Mobile Menu */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="md:hidden"
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        variant="menu"
        slotProps={{
          paper: {
            style: {
              width: '200px',
              marginTop: '8px'
            }
          }
        }}
      >
        {menuItems.map((item) => (
          <MenuItem key={item.href} onClick={handleClose}>
            <Link
              href={item.href}
              className="text-gray-700 hover:text-red-500 w-full"
            >
              {item.label}
            </Link>
          </MenuItem>
        ))}
      </Menu>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-gray-700 hover:text-red-500 font-medium text-sm md:text-base"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export { NavigationMenu }
