import { auth } from '@/auth'
import { SetPasswordForm } from './SetPasswordForm'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

const SetPasswordPage = async () => {
  const session = await auth()
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetPasswordForm />
    </Suspense>
  )
}

export default SetPasswordPage
