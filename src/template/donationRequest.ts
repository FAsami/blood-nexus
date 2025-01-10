import { BloodGroup } from '@prisma/client'

interface DonationRequestMessageProps {
  bloodGroup: BloodGroup
  location: {
    district: string
    division: string
    upazila?: string
  }
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
  requiredOn,
  confirmationUrl,
  distance,
  duration,
  unit,
  priority
}: DonationRequestMessageProps) => {
  const formattedBloodGroup = bloodGroup.replace('_', ' ')
  const formattedLocation = [location.district, location.division]
    .filter(Boolean)
    .join(', ')
  const formattedDate = new Date(requiredOn).toLocaleDateString()

  let message = `Urgent ${priority.toLowerCase()} priority blood donation request!

Required: ${unit} unit(s) of ${formattedBloodGroup} blood
Location: ${formattedLocation}`

  if (distance && duration) {
    message += `\nDistance: ${Math.round(distance * 10) / 10}km (${Math.round(duration)} mins away)`
  }

  message += `\nRequired on: ${formattedDate}

Click to confirm your availability: ${confirmationUrl}

- Blood Nexus`

  return message
}
