'use client'

import {
  Box,
  Typography,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { format } from 'date-fns'
import { BloodDonationRequest, User, Address } from '@prisma/client'

type ExtendedBloodDonationRequest = BloodDonationRequest & {
  requester: Pick<User, 'name' | 'email' | 'phone'> | null
  donor: Pick<User, 'name' | 'email' | 'phone'> | null
  address: Pick<
    Address,
    'division' | 'district' | 'upazila' | 'streetAddress' | 'postalCode'
  >
}

type PaginatedResponse = {
  data: {
    data: ExtendedBloodDonationRequest[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

const ManageRequests = () => {
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] =
    useState<ExtendedBloodDonationRequest | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const {
    data: paginatedData,
    isLoading,
    error
  } = useQuery<PaginatedResponse>({
    queryKey: ['blood-donation-requests', page + 1, rowsPerPage],
    queryFn: async () => {
      const response = await axios.get('/api/admin/blood-donations', {
        params: {
          page: page + 1,
          limit: rowsPerPage
        }
      })
      return response.data
    }
  })

  const requests = paginatedData?.data.data ?? []
  const totalCount = paginatedData?.data.pagination.total ?? 0

  const deleteRequestMutation = useMutation({
    mutationFn: (requestId: string) =>
      axios.delete(`/api/admin/blood-donations/${requestId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blood-donation-requests'] })
      setDeleteDialogOpen(false)
      setSelectedRequest(null)
    }
  })

  const updateRequestStatusMutation = useMutation({
    mutationFn: ({
      requestId,
      status
    }: {
      requestId: string
      status: string
    }) => axios.patch(`/api/admin/blood-donations/${requestId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blood-donation-requests'] })
    }
  })

  const handleDeleteRequest = (request: ExtendedBloodDonationRequest) => {
    setSelectedRequest(request)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedRequest) return
    deleteRequestMutation.mutate(selectedRequest.id)
  }

  const handleStatusUpdate = (requestId: string, status: string) => {
    updateRequestStatusMutation.mutate({ requestId, status })
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage)
    setPage(0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning'
      case 'ACCEPTED':
        return 'success'
      case 'REJECTED':
        return 'error'
      case 'COMPLETED':
        return 'success'
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

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Manage Blood Donation Requests
      </Typography>

      {(error || deleteRequestMutation.error) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.message || 'An error occurred'}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Blood Group</TableCell>
                <TableCell>Required On</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Requester</TableCell>
                <TableCell>Donor</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.bloodGroup.replace('_', ' ')}</TableCell>
                  <TableCell>
                    {format(new Date(request.requiredOn), 'PPP')}
                  </TableCell>
                  <TableCell>
                    {request.address.division}, {request.address.district}
                  </TableCell>
                  <TableCell>
                    {request.requester?.name || 'Anonymous'}
                    {request.requester?.phone && (
                      <Typography variant="caption" display="block">
                        {request.requester.phone}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {request.donor?.name || 'Not assigned'}
                    {request.donor?.phone && (
                      <Typography variant="caption" display="block">
                        {request.donor.phone}
                      </Typography>
                    )}
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
                  <TableCell>
                    {request.status !== 'COMPLETED' && (
                      <>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() =>
                            handleStatusUpdate(request.id, 'COMPLETED')
                          }
                          sx={{ mr: 1 }}
                        >
                          Complete
                        </Button>
                        {request.status === 'PENDING' && (
                          <>
                            <Button
                              size="small"
                              color="success"
                              onClick={() =>
                                handleStatusUpdate(request.id, 'ACCEPTED')
                              }
                              sx={{ mr: 1 }}
                            >
                              Accept
                            </Button>
                            <Button
                              size="small"
                              color="warning"
                              onClick={() =>
                                handleStatusUpdate(request.id, 'REJECTED')
                              }
                              sx={{ mr: 1 }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </>
                    )}
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteRequest(request)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this blood donation request?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            disabled={deleteRequestMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ManageRequests
