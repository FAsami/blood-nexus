import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prismaClient } from '@/lib/prismaClient'
import BloodDonationRequestInfo from './components/BloodDonationRequestInfo'
import { DonationRequestInfo } from '@/types/donation-request'

const BloodDonationRequestPage = async ({
  searchParams
}: {
  searchParams: { id: string }
}) => {
  const session = await auth()
  if (!session) {
    return redirect('/auth/login')
  }
  const requestInfo = (await prismaClient.bloodDonationRequest.findFirst({
    where: {
      id: searchParams.id
    },
    include: {
      address: true,
      patient: true
    }
  })) as DonationRequestInfo
  if (!requestInfo) {
    return redirect('/')
  }
  return (
    <div className="container mx-auto overflow-hidden">
      <BloodDonationRequestInfo user={session.user} requestInfo={requestInfo} />
    </div>
  )
}

export default BloodDonationRequestPage
