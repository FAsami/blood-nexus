import { auth } from '@/auth'
import { redirect } from 'next/navigation'

const BloodDonationRequestPage = async () => {
  const session = await auth()
  if (!session) {
    return redirect('/auth/login')
  }
  return <div>BloodDonationRequestPage</div>
}

export default BloodDonationRequestPage
