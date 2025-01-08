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

const Donations = () => {
  const { data: session } = useSession()
  const {
    data: donations,
    isLoading: donationsLoading,
    isError: donationsError
  } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const response = await axios.get('/api/blood-donations/history', {
        params: {
          type: 'donations',
          userId: session?.user?.id
        }
      })
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'An error occurred')
      }

      return response.data.data as BloodDonationWithRelations[]
    }
  })
  console.log(donations, donationsLoading, donationsError)
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

  if (donationsLoading) {
    return <Typography>Loading...</Typography>
  }

  if (donationsError) {
    return <Typography color="error">Error loading donations</Typography>
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
      {donations && donations.length > 0 ? (
        <TableBody>
          {donations?.map((donation) => (
            <TableRow key={donation.id}>
              <TableCell>{donation.bloodGroup.replace('_', ' ')}</TableCell>
              <TableCell>
                {format(new Date(donation.requiredOn), 'PPP')}
              </TableCell>
              <TableCell>{donation.unit}</TableCell>
              <TableCell>
                <Typography variant="body2">
                  {donation.address.division}, {donation.address.district},{' '}
                  {donation.address.upazila}, {donation.address.streetAddress},{' '}
                  {donation.address.postalCode}, {donation.address.landmark}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={donation.status}
                  color={getStatusColor(donation.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={donation.priority}
                  color={getPriorityColor(donation.priority)}
                  size="small"
                />
              </TableCell>
              <TableCell>{donation.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      ) : (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} align="center">
              <div className="flex flex-col items-center justify-center h-full">
                <Typography variant="body1">
                  Donations will appear here
                </Typography>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      )}
    </Table>
  )
}

export { Donations }
