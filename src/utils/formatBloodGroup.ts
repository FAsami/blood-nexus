import { BloodGroup } from '@prisma/client'

const formatBloodGroup = (bloodGroup: BloodGroup): string => {
  return bloodGroupMap[bloodGroup]
}

export { formatBloodGroup }

const bloodGroupMap: Record<BloodGroup, string> = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-'
}
