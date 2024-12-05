/// <reference types="google.maps" />
import { AddressType } from '@prisma/client'
export type GooglePlaceSuggestion = google.maps.places.AutocompletePrediction
export type GeocoderAddressComponent = google.maps.GeocoderAddressComponent
export type PlaceDetailsResponse = google.maps.places.PlaceResult

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

type AddressInput = {
  label: string
  type: AddressType
  division: string
  district: string
  upazila: string
  streetAddress: string
  postalCode: string
  landmark: string
  instructions: string
}
