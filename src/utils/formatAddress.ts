import { Address } from '@prisma/client'

const formatAddress = (address: Address): string => {
  const components = [
    address.label,
    address.streetAddress,
    address.upazila,
    address.district,
    address.division,
    address.postalCode
  ]

  return components
    .filter(Boolean)
    .filter((component) => component !== '')
    .join(', ')
}

export { formatAddress }
