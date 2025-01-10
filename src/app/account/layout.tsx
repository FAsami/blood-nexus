import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AccountNavigation } from './components/AccountNavigation'
import {
  Bloodtype,
  Article,
  Person,
  Security,
  Dashboard
} from '@mui/icons-material'
import { NavigationItem } from '@/types/account'
import { FaUsers } from 'react-icons/fa'

const AccountLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()

  if (!session?.user) {
    redirect(
      `/auth/login?callbackUrl=${encodeURIComponent('/account/profile')}`
    )
  }
  const navigationItems = session.user.roles.includes('ADMIN')
    ? adminNavigationItems.concat(userNavigationItems)
    : userNavigationItems

  return (
    <div className="flex h-[calc(100vh-var(--header-height))]">
      <div className="h-full border-r border-gray-100 md:relative fixed z-50">
        <AccountNavigation session={session} menu={navigationItems} />
      </div>
      <div className="flex-1 h-full overflow-y-auto pt-0">{children}</div>
    </div>
  )
}
export default AccountLayout

const adminNavigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    icon: <Dashboard />,
    href: '/account/admin/dashboard'
  },
  {
    label: 'Manage requests',
    icon: <Bloodtype />,
    href: '/account/admin/manage-requests'
  },
  {
    label: 'Manage users',
    icon: <FaUsers />,
    href: '/account/admin/manage-users'
  }
]

const userNavigationItems: NavigationItem[] = [
  {
    label: 'Profile',
    icon: <Person />,
    href: '/account/profile'
  },
  {
    label: 'Blood Donations',
    icon: <Bloodtype />,
    href: '/account/blood-donations'
  },
  {
    label: 'Blogs',
    icon: <Article />,
    href: '/account/blogs'
  },
  {
    label: 'Password & Security',
    icon: <Security />,
    href: '/account/password-and-security'
  }
]
