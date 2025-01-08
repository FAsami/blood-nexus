'use client'

import { useState, useEffect } from 'react'
import { Box, Button, AppBar, Toolbar } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { BlogForm, BlogFormData } from '@/app/components/BlogForm'

const CreateBlogPage = () => {
  const router = useRouter()
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/blogs/categories')
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const onSubmit = async (data: BlogFormData) => {
    setIsLoading(true)
    try {
      await axios.post('/api/blogs', data)
      router.push('/account/blogs')
    } catch (error) {
      console.error('Error creating blog post:', error)
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
            <h1 className="text-xl font-semibold">Create New Blog Post</h1>
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
                {isLoading ? 'Creating...' : 'Create Post'}
              </Button>
            </div>
          </div>
        </Toolbar>
      </AppBar>

      <Box className="container mx-auto px-4 py-8">
        <BlogForm
          onSubmit={onSubmit}
          categories={categories}
          isLoading={isLoading}
          isEditMode={false}
        />
      </Box>
    </Box>
  )
}

export default CreateBlogPage
