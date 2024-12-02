'use client'
import { useTransition, useState } from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { IoSearchOutline } from 'react-icons/io5'
import { CgSpinner } from 'react-icons/cg'
import PlaceInput from './PlaceInput'
import { useRouter } from 'next/navigation'

const SearchDonors = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedPlace, setSelectedPlace] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!selectedPlace) {
      setError('Please select a valid location')
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/donations/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            placeId: selectedPlace,
            bloodGroup: 'O_POSITIVE'
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create request')
        }

        router.push(`/blood-donation-request?id=${data.requestId}`)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
        console.error('Error:', err)
      }
    })
  }

  const handlePlaceSelect = (place: any) => {
    setSelectedPlace(place)
  }

  return (
    <div className="relative">
      <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
      <PlaceInput
        startTransition={startTransition}
        onPlaceSelect={handlePlaceSelect}
      />
      <button
        onClick={handleSearch}
        className="absolute flex items-center gap-1 px-4 right-2 top-1/2 -translate-y-1/2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200 disabled:opacity-50"
        aria-label="Search"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <CgSpinner className="text-2xl md:text-3xl animate-spin" />
            <span className="hidden md:inline">Searching...</span>
          </>
        ) : (
          <>
            <IoSearchOutline className="text-2xl md:text-3xl" />
            <span className="hidden md:inline">Search Donors</span>
          </>
        )}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}

export { SearchDonors }
