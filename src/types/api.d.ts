export type ApiError = {
  status: number
  code: string
  message: string
  details?: unknown
}

export type ApiResponse<T> = {
  success: boolean
  data: T | null
  error: ApiError | null
  timestamp: string
}

export type CreateBloodDonationRequestResponse = ApiResponse<{
  requestId: string
}>

export type SubmitBloodDonationRequestResponse = ApiResponse<{
  requestId: string
}>

export type ChangePasswordResponse = ApiResponse<{
  message: string
}>
