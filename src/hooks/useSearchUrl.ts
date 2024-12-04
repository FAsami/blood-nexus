'use client'

import { useSearchParams } from 'next/navigation'

type QueryParams = Record<string, string | number | boolean | null | undefined>

export const useSearchUrl = () => {
  const searchParams = useSearchParams()

  const createUrl = (
    pathname: string,
    newParams?: QueryParams,
    options = {
      skipNull: true,
      skipEmptyString: true
    }
  ): string => {
    const currentParams = new URLSearchParams()

    searchParams.forEach((value, key) => {
      currentParams.append(key, encodeURIComponent(value))
    })

    if (newParams) {
      Object.entries(newParams).forEach(([key, value]) => {
        if (options.skipNull && value === null) return
        if (options.skipEmptyString && value === '') return
        if (value !== undefined) {
          currentParams.set(key, encodeURIComponent(String(value)))
        }
      })
    }

    const search = currentParams.toString()
    return search ? `${pathname}?${search}` : pathname
  }

  return createUrl
}
