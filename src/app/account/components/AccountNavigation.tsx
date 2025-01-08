'use client'
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Divider
} from '@mui/material'
import {
  ChevronLeft,
  ChevronRight,
  LogoutOutlined,
  Close,
  MenuOpenOutlined
} from '@mui/icons-material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { NavigationItem } from '@/types/account'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import clsx from 'clsx'

interface AccountNavigationProps {
  menu: NavigationItem[]
  session: Session
}

export const AccountNavigation = ({
  menu,
  session
}: AccountNavigationProps) => {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  const navigationContent = (
    <div className="h-full flex flex-col justify-between">
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <div className="text-lg font-semibold">Settings</div>
        <IconButton onClick={handleDrawerToggle} edge="end">
          <Close />
        </IconButton>
      </div>

      <List className="pt-2">
        <ListItem
          sx={{
            cursor: 'pointer',
            pb: 1.5,
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
          }}
          onClick={handleCollapseToggle}
        >
          {!isCollapsed && (
            <div className="text-base font-semibold">Settings</div>
          )}
          <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 2 }}>
            {isCollapsed ? (
              <ChevronRight color="primary" />
            ) : (
              <ChevronLeft color="primary" />
            )}
          </ListItemIcon>
        </ListItem>

        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ListItem
              sx={{
                minHeight: 48,
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.12)'
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 2,
                  color: pathname === item.href ? 'primary.main' : 'inherit'
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.label}
                  sx={{
                    color: pathname === item.href ? 'primary.main' : 'inherit'
                  }}
                />
              )}
            </ListItem>
          </Link>
        ))}
      </List>

      <div className="mt-auto mb-0">
        <List>
          <ListItem sx={{ py: 2 }}>
            <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 2 }}>
              <Avatar
                src={session.user?.image ?? undefined}
                alt={session.user?.name ?? ''}
                sx={{ width: 32, height: 32 }}
              />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary={session.user?.name}
                secondary={session.user?.roles.join(', ')}
                primaryTypographyProps={{
                  variant: 'subtitle2',
                  noWrap: true
                }}
                secondaryTypographyProps={{
                  variant: 'caption',
                  noWrap: true
                }}
              />
            )}
          </ListItem>
        </List>
        <List>
          <Divider />
          <ListItem
            onClick={handleLogout}
            sx={{
              cursor: 'pointer',
              minHeight: 48,
              px: 2.5,
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              '&:hover': {
                backgroundColor: 'rgba(239, 68, 68, 0.08)'
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isCollapsed ? 0 : 2,
                color: 'error.main'
              }}
            >
              <LogoutOutlined />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
            )}
          </ListItem>
        </List>
      </div>
    </div>
  )

  return (
    <>
      <div
        className="md:hidden fixed bottom-4 right-4 flex flex-col items-center gap-1 z-50"
        onClick={handleDrawerToggle}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          sx={{
            padding: 1,
            backgroundColor: 'background.paper',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          <MenuOpenOutlined />
        </IconButton>
        <span className="text-sm text-gray-600">Menu</span>
      </div>
      <div className="md:hidden">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: '100%',
              boxSizing: 'border-box'
            }
          }}
        >
          {navigationContent}
        </Drawer>
      </div>

      <div className="hidden md:block h-full">
        <div
          className={clsx(
            'h-full',
            isCollapsed ? 'w-16' : 'w-64',
            'transition-width duration-200'
          )}
        >
          {navigationContent}
        </div>
      </div>
    </>
  )
}
