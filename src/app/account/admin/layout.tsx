import { auth } from '@/auth'
import { notFound } from 'next/navigation'

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  if (!session?.user.roles.includes('ADMIN')) {
    return notFound()
  }
  return children
}

export default AdminLayout
