'use client'

import { useState, useEffect } from 'react'
import { Box, Button, AppBar, Toolbar } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { BlogForm, BlogFormData } from '@/app/components/BlogForm'

const EditBlogPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(false)
  const [initialValues, setInitialValues] = useState<Partial<BlogFormData>>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, blogRes] = await Promise.all([
          axios.get('/api/blogs/categories'),
          axios.get(`/api/blogs/${params.id}`)
        ])

        setCategories(categoriesRes.data)
        setInitialValues(blogRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
        router.push('/account/blogs')
      }
    }

    fetchData()
  }, [params.id, router])

  const onSubmit = async (data: BlogFormData) => {
    setIsLoading(true)
    try {
      await axios.put(`/api/blogs/${params.id}`, data)
      router.push('/account/blogs')
    } catch (error) {
      console.error('Error updating blog post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/account/blogs')
  }

  return (
    <Box>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        className="border-b"
      >
        <Toolbar>
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold">Edit Blog Post</h1>
            <div className="space-x-4">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                form="blog-form"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Update Post'}
              </Button>
            </div>
          </div>
        </Toolbar>
      </AppBar>

      <Box className="container mx-auto px-4 py-8">
        {initialValues && (
          <BlogForm
            initialValues={initialValues}
            onSubmit={onSubmit}
            categories={categories}
            isLoading={isLoading}
            isEditMode={true}
          />
        )}
      </Box>
    </Box>
  )
}

export default EditBlogPage
