import { BloodDonationRequest, Patient } from '@prisma/client'

export type DonationRequestInfo = BloodDonationRequest & {
  patient: Patient
  address: Address
}
