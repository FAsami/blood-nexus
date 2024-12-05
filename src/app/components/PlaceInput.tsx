'use client'
import { GooglePlaceSuggestion } from '@/types/place'
import axios, { CancelTokenSource } from 'axios'
import { useState } from 'react'
import { IoInformationCircleOutline, IoSearchOutline } from 'react-icons/io5'

interface PlaceInputProps {
  startTransition: (callback: () => void) => void
  onPlaceSelect: (place: GooglePlaceSuggestion) => void
}

const PlaceInput = ({ startTransition, onPlaceSelect }: PlaceInputProps) => {
  const [input, setInput] = useState('')
  let debounceTimer: NodeJS.Timeout
  let cancelTokenSource: CancelTokenSource | null = null
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<GooglePlaceSuggestion[]>([])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)

    clearTimeout(debounceTimer)
    if (cancelTokenSource) {
      cancelTokenSource.cancel('New request initiated')
    }

    if (value.length > 2) {
      debounceTimer = setTimeout(() => {
        startTransition(async () => {
          try {
            cancelTokenSource = axios.CancelToken.source()
            const { data } = await axios.get('/api/places/suggestions', {
              params: { input: value },
              cancelToken: cancelTokenSource.token
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
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Type hospital name or location ... "
        className="w-full p-4 pl-12 pr-16 rounded-full border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none"
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
