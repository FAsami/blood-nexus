import { GeocoderAddressComponent, PlaceDetailsResponse } from '@/types/place'
import { AddressInput } from '@/types/place'
import { AddressType } from '@prisma/client'

const normalizeAddress = (result: PlaceDetailsResponse): AddressInput => {
  const address: AddressInput = {
    label: result.name ?? result.formatted_address ?? '',
    type: result.types?.find((type) => type === 'hospital')
      ? AddressType.HOSPITAL
      : result.types?.find((type) => type === 'blood_bank')
        ? AddressType.BLOOD_BANK
        : AddressType.OTHER,
    division: '',
    district: '',
    upazila: '',
    streetAddress: '',
    postalCode: '',
    landmark: result.name ?? '',
    instructions: ''
  }

  result.address_components?.forEach((component: GeocoderAddressComponent) => {
    const types = component.types[0]
    switch (types) {
      case 'route':
        address.streetAddress = component.long_name
        break
      case 'administrative_area_level_2':
        address.district = component.long_name
        break
      case 'administrative_area_level_1':
        address.division = component.long_name
        break
      case 'sublocality_level_1':
        address.upazila = component.long_name
        break
      case 'postal_code':
        address.postalCode = component.long_name
        break
    }
  })

  return address
}

export default normalizeAddress
