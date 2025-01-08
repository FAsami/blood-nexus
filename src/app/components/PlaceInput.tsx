'use client'
import { GooglePlaceSuggestion } from '@/types/place'
import { CircularProgress } from '@mui/material'
import axios, { CancelTokenSource } from 'axios'
import clsx from 'clsx'
import { useState, useRef, useEffect } from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { IoInformationCircleOutline, IoSearchOutline } from 'react-icons/io5'

interface PlaceInputProps {
  startTransition: (callback: () => void) => void
  onPlaceSelect: (place: GooglePlaceSuggestion) => void
  variant?: 'default' | 'input-field'
  isPending?: boolean
}

const PlaceInput = ({
  startTransition,
  onPlaceSelect,
  isPending,
  variant = 'default'
}: PlaceInputProps) => {
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<GooglePlaceSuggestion[]>([])
  const debounceTimerRef = useRef<NodeJS.Timeout>()
  const cancelTokenRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Component unmounted')
      }
    }
  }, [])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('New request initiated')
    }

    if (value.length > 2) {
      debounceTimerRef.current = setTimeout(() => {
        startTransition(async () => {
          try {
            cancelTokenRef.current = axios.CancelToken.source()
            const { data } = await axios.get('/api/places/suggestions', {
              params: { input: value },
              cancelToken: cancelTokenRef.current.token
            })
            setSuggestions(data.predictions || [])
          } catch (error) {
            if (!axios.isCancel(error)) {
              console.error('Error fetching suggestions:', error)
              setSuggestions([])
            }
          }
        })
      }, 300)
    } else {
      setSuggestions([])
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (input.length > 2 && suggestions.length === 0) {
      handleInputChange({
        target: { value: input }
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false)
    }, 200)
  }

  return (
    <div className="relative">
      {variant === 'input-field' && (
        <>
          <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          {isPending ? (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
              <CircularProgress size={24} color="inherit" />
            </div>
          ) : (
            <IoSearchOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          )}
        </>
      )}
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Type hospital name or location ... "
        className={clsx(
          'w-full p-4 pl-12 pr-16 rounded-full border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none',
          variant === 'input-field' && 'rounded-md'
        )}
      />
      {isFocused && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <div
                key={suggestion.place_id}
                className="p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setInput(suggestion.description)
                  setSuggestions([])
                  setIsFocused(false)
                  onPlaceSelect(suggestion)
                }}
              >
                <p className="text-sm text-gray-800">
                  {suggestion.description}
                </p>
              </div>
            ))
          ) : (
            <div className="p-3 text-sm text-gray-500 text-center flex items-center justify-center gap-2 min-h-48">
              {input.length > 2 ? (
                <>
                  <IoSearchOutline className="text-lg" />
                  <span>No suggestions found</span>
                </>
              ) : (
                <>
                  <IoInformationCircleOutline className="text-lg" />
                  <span>Type at least 3 characters to search</span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PlaceInput
