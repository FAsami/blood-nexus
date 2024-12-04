const normalizeAddress = (result: PlaceDetailsResponse): Place => {
  const address: Place = {
    formattedAddress: result.formatted_address ?? '',
    placeId: result.place_id ?? '',
    type: result.types ?? [],
    name: result.name ?? '',
    vicinity: result.vicinity ?? '',
    landmark: result.name ?? ''
  }

  result.address_components?.forEach((component: GeocoderAddressComponent) => {
    const types = component.types[0]
    switch (types) {
      case 'street_number':
        address.streetNumber = component.long_name
        break
      case 'route':
        address.streetAddress = component.long_name
        break
      case 'locality':
        address.city = component.long_name
        break
      case 'administrative_area_level_2':
        address.district = component.long_name
        break
      case 'administrative_area_level_1':
        address.state = component.long_name
        break
      case 'country':
        address.country = component.long_name
        address.countryCode = component.short_name
        break
      case 'postal_code':
        address.postalCode = component.long_name
        break
    }
  })
  return Object.fromEntries(
    Object.entries(address).filter(([, value]) => value !== undefined)
  ) as Place
}

export default normalizeAddress
