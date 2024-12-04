import { ApiResponse, ApiError } from '@/types/api'

const createResponse = <T>(
  data: T | null = null,
  error: ApiError | null = null,
  success: boolean = error === null
): ApiResponse<T> => {
  return {
    success,
    data,
    error,
    timestamp: new Date().toISOString()
  }
}

export { createResponse }
