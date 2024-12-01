'use client'
import { useState, useTransition } from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { IoSearchOutline } from 'react-icons/io5'
import { CgSpinner } from 'react-icons/cg'
import PlaceInput from './PlaceInput'

const SearchDonors = () => {
  const [isPending, startTransition] = useTransition()
  const [input, setInput] = useState('')

  const handleSearch = () => {
    startTransition(() => {
      console.log('Searching for:', input)
    })
  }

  return (
    <div className="relative">
      <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
      <PlaceInput
        input={input}
        setInput={setInput}
        startTransition={startTransition}
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
  )
}

export { SearchDonors }
