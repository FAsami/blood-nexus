/// <reference types="google.maps" />

type GooglePlaceSuggestion = google.maps.places.AutocompletePrediction
type GeocoderAddressComponent = google.maps.GeocoderAddressComponent
type PlaceDetailsResponse = google.maps.places.PlaceResult

type Place = {
  formattedAddress: string
  placeId: string
  type: string[]
  name: string
  streetNumber?: string
  streetAddress?: string
  city?: string
  district?: string
  state?: string
  country?: string
  countryCode?: string
  postalCode?: string
  landmark?: string
  vicinity?: string
}
