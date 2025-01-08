import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Typography
} from '@mui/material'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { BloodDonationRequest, User, Address } from '@prisma/client'

type BloodDonationWithRelations = BloodDonationRequest & {
  requester: User | null
  donor: User | null
  address: Pick<
    Address,
    | 'division'
    | 'district'
    | 'upazila'
    | 'streetAddress'
    | 'postalCode'
    | 'landmark'
  >
}

const Requests = () => {
  const { data: session } = useSession()
  const {
    data: requests,
    isLoading: requestsLoading,
    isError: requestsError
  } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const response = await axios.get('/api/blood-donations/history', {
        params: {
          type: 'requests',
          userId: session?.user?.id
        }
      })
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'An error occurred')
      }

      return response.data.data as BloodDonationWithRelations[]
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning'
      case 'ACCEPTED':
        return 'success'
      case 'REJECTED':
        return 'error'
      default:
        return 'default'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'error'
      case 'MEDIUM':
        return 'warning'
      case 'LOW':
        return 'info'
      default:
        return 'default'
    }
  }

  if (requestsLoading) {
    return <Typography>Loading...</Typography>
  }

  if (requestsError) {
    return <Typography color="error">Error loading requests</Typography>
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Blood Group</TableCell>
          <TableCell>Required On</TableCell>
          <TableCell>Units</TableCell>
          <TableCell>Location</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Priority</TableCell>
          <TableCell>Contact</TableCell>
        </TableRow>
      </TableHead>
      {requests && requests.length > 0 ? (
        <TableBody>
          {requests?.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.bloodGroup.replace('_', ' ')}</TableCell>
              <TableCell>
                {format(new Date(request.requiredOn), 'PPP')}
              </TableCell>
              <TableCell>{request.unit}</TableCell>
              <TableCell>
                <Typography variant="body2">
                  {request.address.division}, {request.address.district},{' '}
                  {request.address.upazila}, {request.address.streetAddress},{' '}
                  {request.address.postalCode}, {request.address.landmark}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={request.status}
                  color={getStatusColor(request.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={request.priority}
                  color={getPriorityColor(request.priority)}
                  size="small"
                />
              </TableCell>
              <TableCell>{request.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      ) : (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} align="center">
              <div className="flex flex-col items-center justify-center h-full">
                <Typography variant="body1">
                  Requests will appear here
                </Typography>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      )}
    </Table>
  )
}

export { Requests }
