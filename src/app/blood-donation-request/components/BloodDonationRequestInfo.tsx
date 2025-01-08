import Form from './Form'
import { DonationRequestInfo } from '@/types/donation-request'
import { Session } from 'next-auth'

const BloodDonationRequestInfo = ({
  requestInfo,
  user
}: {
  requestInfo: DonationRequestInfo
  user: Session['user']
}) => {
  return (
    <div className="bg-white max-w-2xl mx-auto">
      <Form requestInfo={requestInfo} user={user} />
    </div>
  )
}

export default BloodDonationRequestInfo
