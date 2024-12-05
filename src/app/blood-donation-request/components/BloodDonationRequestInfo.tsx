import Form from './Form'
import { DonationRequestInfo } from '@/types/donation-request'

const BloodDonationRequestInfo = ({
  requestInfo
}: {
  requestInfo: DonationRequestInfo
}) => {
  return (
    <div className="bg-white max-w-2xl mx-auto">
      <Form requestInfo={requestInfo} />
    </div>
  )
}

export default BloodDonationRequestInfo
