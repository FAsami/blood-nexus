'use client'

import {
  Card,
  CardContent,
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
  BloodDonationRequest,
  User,
  Address,
  BloodDonationRequestStatus,
  BloodDonationRequestPriority,
  RequestedDonorStatus
} from '@prisma/client'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import PhoneIcon from '@mui/icons-material/Phone'

type BloodDonationWithRelations = BloodDonationRequest & {
  requester: Pick<User, 'name'> | null
  donor: Pick<User, 'name'> | null
  address: Pick<Address, 'division' | 'district'>
  requestedDonors: Array<{
    id: string
    requestedAt: Date
    status: RequestedDonorStatus
    user: Pick<User, 'name'>
  }>
}

const PendingRequests = () => {
  const queryClient = useQueryClient()

  const {
    data: request,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['pending-request'],
    queryFn: async () => {
      const response = await axios.get('/api/blood-donations/pending-request')

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'An error occurred')
      }
      return response.data.data.data as BloodDonationWithRelations
    }
  })

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
      return response.data.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-request'] })
    }
  })

  const handleStatusUpdate = (status: BloodDonationRequestStatus) => {
    if (!request) return
    updateRequestStatus.mutate({ requestId: request.id, status })
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
        Error loading request
      </Alert>
    )
  }

  if (!request) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No pending requests found
      </Alert>
    )
  }

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" component="div">
            Blood Donation Request
          </Typography>
          {getPriorityChip(request.priority)}
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <LocalHospitalIcon color="error" />
          <Typography variant="body1">
            {request.unit} unit(s) of {request.bloodGroup.replace('_', ' ')}{' '}
            blood needed
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <LocationOnIcon color="action" />
          <Typography variant="body1">
            {request.address.division}, {request.address.district}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <CalendarTodayIcon color="action" />
          <Typography variant="body1">
            Required by: {format(new Date(request.requiredOn), 'PPP')}
          </Typography>
        </Box>

        {request.phone && (
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <PhoneIcon color="action" />
            <Typography variant="body1">{request.phone}</Typography>
          </Box>
        )}

        {request.notes && (
          <Typography variant="body2" color="text.secondary" mb={3}>
            Note: {request.notes}
          </Typography>
        )}

        <Box display="flex" gap={2} mt={2}>
          {request.status === 'PENDING' && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => handleStatusUpdate('ACCEPTED')}
                disabled={isUpdating}
              >
                {isUpdating ? 'Accepting...' : 'Accept Request'}
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => handleStatusUpdate('REJECTED')}
                disabled={isUpdating}
              >
                {isUpdating ? 'Rejecting...' : 'Reject Request'}
              </Button>
            </>
          )}
          {request.status === 'ACCEPTED' && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => handleStatusUpdate('COMPLETED')}
                disabled={isUpdating}
              >
                {isUpdating ? 'Completing...' : 'Mark as Completed'}
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => handleStatusUpdate('REJECTED')}
                disabled={isUpdating}
              >
                {isUpdating ? 'Rejecting...' : 'Reject Request'}
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default PendingRequests
