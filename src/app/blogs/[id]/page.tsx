import { prismaClient } from '@/lib/prismaClient'

const BlogPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params

  const blog = await prismaClient.blogPost.findUnique({
    where: {
      id
    }
  })

  if (!blog) return <div>Blog not found</div>

  return <div>{blog.title}</div>
}

export default BlogPage
