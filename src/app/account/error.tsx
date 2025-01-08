'use client'

import Link from 'next/link'
import { BiSolidHome } from 'react-icons/bi'
import { MdErrorOutline } from 'react-icons/md'
import { useEffect } from 'react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

const Error = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center gap-6">
          <MdErrorOutline className="text-red-500 text-7xl" />

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong!
            </h1>
            <p className="text-gray-600 mb-6">
              {error.message ||
                'An unexpected error occurred. Please try again later.'}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={reset}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              Try again
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <BiSolidHome className="text-xl" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error
