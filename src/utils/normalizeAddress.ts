import { GeocoderAddressComponent, PlaceDetailsResponse } from '@/types/place'
import { AddressInput } from '@/types/place'
import { AddressType } from '@prisma/client'
import { divisions, districts, upazillas } from 'bd-geojs'

type NormalizedAddress = AddressInput & {
  divisionId: string
  districtId: string
  upazilaId: string
}

const normalizeAddress = (result: PlaceDetailsResponse): NormalizedAddress => {
  const address: NormalizedAddress = {
    label: result.name ?? result.formatted_address ?? '',
    type: result.types?.find((type) => type === 'hospital')
      ? AddressType.HOSPITAL
      : result.types?.find((type) => type === 'blood_bank')
        ? AddressType.BLOOD_BANK
        : AddressType.OTHER,
    division: '',
    divisionId: '',
    district: '',
    districtId: '',
    upazila: '',
    upazilaId: '',
    streetAddress: '',
    postalCode: '',
    landmark: result.name ?? '',
    instructions: ''
  }

  result.address_components?.forEach((component: GeocoderAddressComponent) => {
    console.log(component.long_name)
    if (
      component.long_name.includes('Division') ||
      component.types.includes('administrative_area_level_1')
    ) {
      address.divisionId =
        divisions.find((division) =>
          component.long_name.includes(division.name)
        )?.id ?? ''
      address.division = component.long_name.replace('Division', '').trim()
    } else if (
      component.long_name.includes('District') ||
      component.types.includes('administrative_area_level_2')
    ) {
      address.districtId =
        districts.find((district) =>
          component.long_name.includes(district.name)
        )?.id ?? ''
      address.district = component.long_name.replace('District', '').trim()
    } else if (
      component.long_name.includes('Upazila') ||
      component.types.includes('sublocality')
    ) {
      address.upazilaId =
        upazillas.find((upazila) => component.long_name.includes(upazila.name))
          ?.id ?? ''
      if (address.upazilaId) {
        address.upazila = component.long_name.replace('Upazila', '').trim()
      }
    } else if (
      component.long_name.includes('Postal Code') ||
      component.types.includes('postal_code')
    ) {
      address.postalCode = component.long_name.replace('Postal Code', '').trim()
    } else if (
      component.long_name.includes('Street') ||
      component.types.includes('route') ||
      component.types.includes('locality') ||
      component.types.includes('fom')
    ) {
      address.streetAddress = component.long_name.replace('Street', '').trim()
    }
  })

  return address
}

export default normalizeAddress
