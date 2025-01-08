'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormHelperText,
  Switch,
  FormControlLabel
} from '@mui/material'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import { SingleImageUpload } from '@/app/components/SingleImageUpload'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export const blogPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  slug: z.string().min(3, 'Slug must be at least 3 characters long'),
  content: z.string().min(10, 'Content must be at least 10 characters long'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters long'),
  featuredImage: z.string().url('Must be a valid URL').optional().nullable(),
  published: z.boolean(),
  categories: z.array(z.string()).min(1, 'Select at least one category')
})

export type BlogFormData = z.infer<typeof blogPostSchema>

interface BlogFormProps {
  initialValues?: Partial<BlogFormData>
  onSubmit: (data: BlogFormData) => Promise<void>
  categories: { id: string; name: string }[]
  isLoading?: boolean
  isEditMode?: boolean
}

export const BlogForm = ({
  initialValues,
  onSubmit,
  categories,
  isEditMode = false
}: BlogFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      published: false,
      categories: [],
      featuredImage: null,
      ...initialValues
    }
  })

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
      id="blog-form"
    >
      <Controller
        name="featuredImage"
        control={control}
        render={({ field }) => (
          <SingleImageUpload
            initialImage={field.value}
            onUploadComplete={(image) => {
              setValue('featuredImage', image.url)
            }}
          />
        )}
      />

      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Title"
            fullWidth
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        )}
      />

      <Controller
        name="slug"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Slug"
            fullWidth
            error={!!errors.slug}
            helperText={errors.slug?.message}
            disabled={isEditMode}
          />
        )}
      />

      <Controller
        name="excerpt"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Excerpt"
            fullWidth
            multiline
            rows={3}
            error={!!errors.excerpt}
            helperText={errors.excerpt?.message}
          />
        )}
      />

      <FormControl fullWidth error={!!errors.categories}>
        <InputLabel>Categories</InputLabel>
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              multiple
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const category = categories.find((c) => c.id === value)
                    return (
                      <Chip
                        key={value}
                        label={category?.name}
                        className="bg-red-100 text-red-600"
                      />
                    )
                  })}
                </Box>
              )}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.categories && (
          <FormHelperText>{errors.categories.message}</FormHelperText>
        )}
      </FormControl>

      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <Box>
            <ReactQuill
              theme="snow"
              value={field.value}
              onChange={field.onChange}
              className="h-64 mb-12"
            />
            {errors.content && (
              <FormHelperText error>{errors.content.message}</FormHelperText>
            )}
          </Box>
        )}
      />

      <Controller
        name="published"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
            label="Publish immediately"
          />
        )}
      />
    </form>
  )
}
