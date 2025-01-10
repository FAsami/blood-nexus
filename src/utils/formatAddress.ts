import { Address } from '@prisma/client'

const formatAddress = (address: Address): string => {
  const components = [
    address.streetAddress,
    address.upazila,
    address.district,
    address.division,
    address.postalCode
  ]

  return components.filter(Boolean).join(', ')
}

export { formatAddress }
