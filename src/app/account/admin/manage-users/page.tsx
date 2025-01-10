'use client'

import { useState } from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TablePagination,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Block as DeactivateIcon,
  CheckCircle as ActivateIcon
} from '@mui/icons-material'
import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User, UserRole, Role } from '@prisma/client'

type ExtendedUser = User & {
  isCurrentUser: boolean
  userRoles: (UserRole & { role: Role })[]
}

const ManageUsers = () => {
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const {
    data: users = [],
    isLoading,
    error
  } = useQuery<ExtendedUser[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/users')
      const currentUserId = response.data.data.currentUserId
      return response.data.data.users.map((user: ExtendedUser) => ({
        ...user,
        isCurrentUser: user.id === currentUserId,
        userRoles: user.userRoles.map((role: UserRole & { role: Role }) => ({
          ...role,
          role: role.role
        }))
      }))
    }
  })

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => axios.delete(`/api/admin/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setDeleteDialogOpen(false)
      setSelectedUser(null)
    }
  })

  const toggleUserStatusMutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      axios.patch(`/api/admin/users/${userId}/status`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const handleDeleteUser = (user: ExtendedUser) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedUser) return
    deleteUserMutation.mutate(selectedUser.id)
  }

  const handleToggleUserStatus = (user: ExtendedUser) => {
    toggleUserStatusMutation.mutate({
      userId: user.id,
      isActive: !user.isActive
    })
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
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
        Manage Users
      </Typography>

      {(error ||
        deleteUserMutation.error ||
        toggleUserStatusMutation.error) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.message || 'An error occurred'}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email/Phone</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user: ExtendedUser) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.name}
                      {user.isCurrentUser && (
                        <Chip
                          label="You"
                          size="small"
                          color="primary"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {user.email || user.phone || 'Not provided'}
                    </TableCell>
                    <TableCell>
                      {user.userRoles.map(
                        (userRole: UserRole & { role: Role }) => (
                          <Chip
                            key={userRole.role.name}
                            label={userRole.role.name}
                            size="small"
                            sx={{ mr: 0.5 }}
                            color={
                              userRole.role.name === 'ADMIN'
                                ? 'secondary'
                                : 'default'
                            }
                          />
                        )
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? 'Active' : 'Inactive'}
                        color={user.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleToggleUserStatus(user)}
                        title={
                          user.isActive ? 'Deactivate User' : 'Activate User'
                        }
                        disabled={
                          toggleUserStatusMutation.isPending ||
                          user.isCurrentUser
                        }
                      >
                        {user.isActive ? <DeactivateIcon /> : <ActivateIcon />}
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteUser(user)}
                        title="Delete User"
                        disabled={
                          deleteUserMutation.isPending || user.isCurrentUser
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
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
          Are you sure you want to delete user {selectedUser?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            disabled={deleteUserMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ManageUsers
