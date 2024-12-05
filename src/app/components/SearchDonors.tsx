'use client'

import axios from 'axios'
import { useTransition, useState } from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { IoSearchOutline } from 'react-icons/io5'
import { CgSpinner } from 'react-icons/cg'
import PlaceInput from './PlaceInput'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { BiErrorCircle } from 'react-icons/bi'
import { BloodGroup } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { BloodGroupSelect } from './BloodGroupSelect'
import { CreateBloodDonationRequestResponse } from '@/types/api'
import { useSearchUrl } from '@/hooks/useSearchUrl'
import { GooglePlaceSuggestion } from '@/types/place'

const SearchDonors = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedPlace, setSelectedPlace] =
    useState<GooglePlaceSuggestion | null>(null)
  const [error, setError] = useState<{
    type: 'invalid-location' | 'unknown-error'
    message: string
  } | null>(null)
  const [selectedBlood, setSelectedBlood] = useState<BloodGroup>('O_POSITIVE')

  const session = useSession()
  const searchUrl = useSearchUrl()

  const handleBloodTypeChange = (value: BloodGroup) => {
    setSelectedBlood(value)
  }

  const handleSearch = async () => {
    if (!selectedPlace) {
      setError({
        type: 'invalid-location',
        message: 'Please select a valid location'
      })
      return
    }
    startTransition(async () => {
      try {
        const { data } = await axios.post<CreateBloodDonationRequestResponse>(
          '/api/blood-donations/create-request',
          {
            placeId: selectedPlace.place_id,
            bloodGroup: selectedBlood
          }
        )

        if (!data.success) {
          setError({
            type: 'unknown-error',
            message: data.error?.message || 'Failed to create request'
          })
          return
        }

        if (session.status === 'authenticated') {
          router.push(
            searchUrl(`/blood-donation-request`, { id: data.data?.requestId })
          )
        } else {
          router.push(
            searchUrl(`/auth/login`, {
              callbackUrl: searchUrl('/blood-donation-request', {
                id: data.data?.requestId
              })
            })
          )
        }
      } catch (err) {
        console.error('Error:', err)
        setError({
          type: 'unknown-error',
          message: 'Something went wrong!'
        })
      }
    })
  }

  const handlePlaceSelect = (place: GooglePlaceSuggestion) => {
    setSelectedPlace(place)
    setError(null)
  }

  return (
    <div className="space-y-4">
      <div className="w-full flex flex-col justify-center">
        <div className="text-neutral-500 text-center font-light text-sm mb-1">
          Select your Blood group
        </div>
        <div className="flex justify-center">
          <BloodGroupSelect
            options={[
              { id: 'B_POSITIVE', label: 'B+' },
              { id: 'A_POSITIVE', label: 'A+' },
              { id: 'O_POSITIVE', label: 'O+' },
              { id: 'AB_POSITIVE', label: 'AB+' },
              { id: 'B_NEGATIVE', label: 'B-' },
              { id: 'A_NEGATIVE', label: 'A-' },
              { id: 'O_NEGATIVE', label: 'O-' },
              { id: 'AB_NEGATIVE', label: 'AB-' }
            ]}
            value={selectedBlood}
            onChange={handleBloodTypeChange}
            color="red"
          />
        </div>
      </div>

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
      </div>
      <Dialog open={!!error} onClose={() => setError(null)}>
        <DialogTitle className="text-red-500 flex items-center gap-2">
          <BiErrorCircle className="text-3xl" />
          <span>
            {error?.type === 'invalid-location'
              ? 'Invalid Location'
              : 'Failed to search donors'}
          </span>
        </DialogTitle>
        <DialogContent className="min-w-[300px] md:min-w-[600px] py-4 md:py-8">
          <p className="text-gray-600">
            {error?.type === 'invalid-location'
              ? 'Please enter and select a location to find donors near you.'
              : error?.message}
          </p>
          <div className="flex justify-end mt-auto">
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { SearchDonors }
