import { prismaClient } from '@/lib/prismaClient'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import {
  People as PeopleIcon,
  Bloodtype as BloodtypeIcon,
  Article as ArticleIcon,
  LocalHospital as HospitalIcon
} from '@mui/icons-material'

async function DashboardMetrics() {
  const [userCount, pendingRequests, publishedBlogs, totalDonations] =
    await Promise.all([
      prismaClient.user.count(),
      prismaClient.bloodDonationRequest.count({
        where: { status: 'PENDING' }
      }),
      prismaClient.blogPost.count({
        where: { published: true }
      }),
      prismaClient.bloodDonationRequest.count({
        where: {
          status: {
            in: ['ACCEPTED', 'COMPLETED']
          }
        }
      })
    ])

  const metrics = [
    {
      title: 'Pending Requests',
      value: pendingRequests,
      icon: <BloodtypeIcon sx={{ fontSize: 40, color: 'error.main' }} />
    },
    {
      title: 'Total Donations',
      value: totalDonations,
      icon: <HospitalIcon sx={{ fontSize: 40, color: 'info.main' }} />
    },
    {
      title: 'Total Users',
      value: userCount,
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
    },

    {
      title: 'Published Blogs',
      value: publishedBlogs,
      icon: <ArticleIcon sx={{ fontSize: 40, color: 'success.main' }} />
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 flex flex-col items-center"
        >
          <div className="text-center text-3xl font-semibold text-gray-900">
            {metric.value}
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="text-xs">{metric.icon}</div>
            <div className="text-center text-xs font-medium text-gray-700 mt-2">
              {metric.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function RecentRequests() {
  const requests = await prismaClient.bloodDonationRequest.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      requester: {
        select: { name: true }
      },
      address: {
        select: { division: true, district: true }
      }
    }
  })

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Requester</TableCell>
            <TableCell>Blood Group</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Required On</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.requester?.name || 'Anonymous'}</TableCell>
              <TableCell>{request.bloodGroup.replace('_', ' ')}</TableCell>
              <TableCell>
                {request.address.division}, {request.address.district}
              </TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>
                {new Date(request.requiredOn).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default async function Dashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }
  const userRole = await prismaClient.userRole.findFirst({
    where: {
      userId: session.user.id,
      role: {
        name: 'ADMIN'
      }
    }
  })

  if (!userRole) {
    redirect('/account')
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <DashboardMetrics />

      <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>
        Recent Blood Requests
      </Typography>

      <RecentRequests />
    </Box>
  )
}
