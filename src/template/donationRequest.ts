import { formatAddress } from '@/utils/formatAddress'
import { BloodGroup, Address } from '@prisma/client'

interface DonationRequestMessageProps {
  bloodGroup: BloodGroup
  location: Address
  requiredOn: Date
  confirmationUrl: string
  distance?: number
  duration?: number
  unit: number
  priority: string
}

export const donationRequestMessage = ({
  bloodGroup,
  location,
  requiredOn
}: DonationRequestMessageProps) => {
  const formattedBloodGroup = bloodGroup.replace('_', ' ')
  const formattedLocation = formatAddress(location)
  const formattedDate = new Date(requiredOn).toLocaleDateString()

  let message = `Need ${formattedBloodGroup} blood in ${formattedLocation} by ${formattedDate}.`

  message += `\n\nThank you for your support, Blood Nexus`

  return message
}
