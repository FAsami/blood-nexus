import { prismaClient } from '@/lib/prismaClient'
import { auth } from '@/auth'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Box,
  Chip,
  Typography,
  CircularProgress
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { format } from 'date-fns'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

type Blog = {
  id: string
  title: string
  published: boolean
  createdAt: Date
  categories: {
    category: {
      name: string
    }
  }[]
}

function LoadingState() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  )
}

function EmptyState() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        gap: 2
      }}
    >
      <Typography variant="h6" color="text.secondary">
        No blog posts yet
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Create your first blog post to get started
      </Typography>
      <Link href="/account/blogs/create" passHref>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component="a"
          color="primary"
        >
          Create New Post
        </Button>
      </Link>
    </Box>
  )
}

async function BlogTable({ blogs }: { blogs: Blog[] }) {
  const session = await auth()
  async function handleDelete(id: string) {
    'use server'

    await prismaClient.blogPost.delete({
      where: {
        id: id,
        authorId: session?.user?.id
      }
    })
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="blog posts table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Categories</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow
              key={blog.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {blog.title}
              </TableCell>
              <TableCell>
                <Chip
                  label={blog.published ? 'Published' : 'Draft'}
                  color={blog.published ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {blog.categories.map(
                  (cat: { category: { name: string } }, index: number) => (
                    <Chip
                      key={index}
                      label={cat.category.name}
                      size="small"
                      sx={{ mr: 0.5 }}
                    />
                  )
                )}
              </TableCell>
              <TableCell>
                {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell align="right">
                <Link href={`/account/blogs/edit/${blog.id}`} passHref>
                  <IconButton color="primary" component="a">
                    <EditIcon />
                  </IconButton>
                </Link>
                <form action={handleDelete.bind(null, blog.id)}>
                  <IconButton type="submit" color="error">
                    <DeleteIcon />
                  </IconButton>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default async function AccountBlogsPage() {
  const session = await auth()

  if (!session?.user) {
    return redirect('/auth/login')
  }

  const blogs = await prismaClient.blogPost.findMany({
    where: {
      authorId: session.user.id
    },
    include: {
      categories: {
        include: {
          category: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <Box sx={{ p: 4 }}>
      {blogs.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4
          }}
        >
          <Link href="/account/blogs/create" passHref>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component="a"
              color="primary"
            >
              Create New Post
            </Button>
          </Link>
        </Box>
      )}

      <Suspense fallback={<LoadingState />}>
        {blogs.length === 0 ? <EmptyState /> : <BlogTable blogs={blogs} />}
      </Suspense>
    </Box>
  )
}
