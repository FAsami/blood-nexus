'use client'

import {
  Typography,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert
} from '@mui/material'
import { format } from 'date-fns'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import {
  User,
  Address,
  BloodDonationRequestStatus,
  BloodDonationRequestPriority,
  RequestedDonorStatus,
  BloodDonationRequest
} from '@prisma/client'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import PhoneIcon from '@mui/icons-material/Phone'

type PendingRequestWithRelations = {
  id: string
  userId: string
  status: RequestedDonorStatus
  bloodDonationRequestId: string
  bloodDonationRequest: BloodDonationRequest & {
    requester: User
    address: Address
    requestedDonors: Array<{
      user: User
      status: RequestedDonorStatus
    }>
  }
}

const PendingRequests = () => {
  const queryClient = useQueryClient()

  const {
    data: requests,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['pending-request'],
    queryFn: async () => {
      const response = await axios.get('/api/blood-donations/pending-request')
      console.log('response', response)
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'An error occurred')
      }
      return response.data.data.data as PendingRequestWithRelations[]
    }
  })

  console.log('requests', requests)

  const updateRequestStatus = useMutation({
    mutationFn: async ({
      requestId,
      status
    }: {
      requestId: string
      status: BloodDonationRequestStatus
    }) => {
      const response = await axios.patch(
        `/api/blood-donations/${requestId}/status`,
        { status }
      )
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'An error occurred')
      }
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-request'] })
    }
  })

  const handleStatusUpdate = (
    requestId: string,
    status: BloodDonationRequestStatus
  ) => {
    updateRequestStatus.mutate({ requestId, status })
  }

  const getPriorityChip = (priority: BloodDonationRequestPriority) => {
    const color = {
      HIGH: 'error',
      MEDIUM: 'warning',
      LOW: 'info'
    }[priority] as 'error' | 'warning' | 'info'

    return (
      <Chip
        label={priority}
        color={color}
        size="small"
        sx={{ fontWeight: 'medium' }}
      />
    )
  }

  const isUpdating = updateRequestStatus.isPending

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading requests
      </Alert>
    )
  }

  if (!requests?.length) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No pending requests found
      </Alert>
    )
  }

  return (
    <div>
      {requests.map((request) => (
        <div key={request.id} className="m-2 p-4 border rounded-md">
          <div>
            <div className="flex justify-end w-full">
              {getPriorityChip(request.bloodDonationRequest.priority)}
            </div>

            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <LocalHospitalIcon color="error" />
              <Typography variant="body1">
                {request.bloodDonationRequest.unit} unit(s) of{' '}
                {request.bloodDonationRequest.bloodGroup.replace('_', ' ')}{' '}
                blood needed
              </Typography>
            </Box>

            <div className="flex items-center gap-1 mb-1">
              <LocationOnIcon color="action" />
              <Typography variant="body1">
                {request.bloodDonationRequest.address.division},{' '}
                {request.bloodDonationRequest.address.district}
              </Typography>
            </div>

            <div className="flex items-center gap-1 mb-1">
              <CalendarTodayIcon color="action" />
              <Typography variant="body1">
                Required by:{' '}
                {format(
                  new Date(request.bloodDonationRequest.requiredOn),
                  'PPP'
                )}
              </Typography>
            </div>

            {request.bloodDonationRequest.phone && (
              <div className="flex items-center gap-1 mb-2">
                <PhoneIcon color="action" />
                <Typography variant="body1">
                  {request.bloodDonationRequest.phone}
                </Typography>
              </div>
            )}

            {request.bloodDonationRequest.notes && (
              <div className="text-sm text-gray-500 mb-3">
                Note: {request.bloodDonationRequest.notes}
              </div>
            )}

            <Box display="flex" gap={2} mt={2}>
              {request.status === 'PENDING' && (
                <>
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() =>
                      handleStatusUpdate(
                        request.bloodDonationRequestId,
                        'ACCEPTED'
                      )
                    }
                    disabled={isUpdating}
                    disableElevation
                  >
                    {isUpdating ? 'Accepting...' : 'Accept'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() =>
                      handleStatusUpdate(
                        request.bloodDonationRequestId,
                        'REJECTED'
                      )
                    }
                    disabled={isUpdating}
                    disableElevation
                  >
                    {isUpdating ? 'Rejecting...' : 'Reject'}
                  </Button>
                </>
              )}
              {request.status === 'ACCEPTED' && (
                <>
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() =>
                      handleStatusUpdate(
                        request.bloodDonationRequestId,
                        'COMPLETED'
                      )
                    }
                    disabled={isUpdating}
                    disableElevation
                  >
                    {isUpdating ? 'Completing...' : 'Mark as Completed'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() =>
                      handleStatusUpdate(
                        request.bloodDonationRequestId,
                        'REJECTED'
                      )
                    }
                    disabled={isUpdating}
                    disableElevation
                  >
                    {isUpdating ? 'Rejecting...' : 'Reject'}
                  </Button>
                </>
              )}
            </Box>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PendingRequests
