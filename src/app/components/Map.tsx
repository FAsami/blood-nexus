'use client'
import { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
interface MapProps {
  onLocationSelect: (latitude: number, longitude: number) => void
  initialLatitude?: number
  initialLongitude?: number
  height?: string
}

const Map = ({
  onLocationSelect,
  initialLatitude = 23.8103,
  initialLongitude = 90.4125,
  height = '400px'
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly'
    })

    loader.load().then(() => {
      if (!mapRef.current) return

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: initialLatitude, lng: initialLongitude },
        zoom: 15
      })

      markerRef.current = new google.maps.Marker({
        map,
        draggable: true,
        position: { lat: initialLatitude, lng: initialLongitude }
      })

      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        const lat = e.latLng?.lat()
        const lng = e.latLng?.lng()
        if (lat && lng) {
          markerRef.current?.setPosition({ lat, lng })
          onLocationSelect(lat, lng)
        }
      })

      markerRef.current.addListener('dragend', () => {
        const position = markerRef.current?.getPosition()
        if (position) {
          onLocationSelect(position.lat(), position.lng())
        }
      })
    })
  }, [initialLatitude, initialLongitude, onLocationSelect])

  return <div ref={mapRef} style={{ width: '100%', height }} />
}

export default Map
