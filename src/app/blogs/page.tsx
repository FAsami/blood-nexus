import Image from 'next/image'
import Link from 'next/link'
import { prismaClient } from '@/lib/prismaClient'

const BlogsPage = async () => {
  const [blogPosts, categories] = await Promise.all([
    prismaClient.blogPost.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true }
        },
        categories: {
          include: {
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prismaClient.blogCategory.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {blogPosts.map((blog) => (
            <div key={blog.id} className="mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  {blog.featuredImage && (
                    <Image
                      src={blog.featuredImage}
                      alt={blog.title}
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-[200px]"
                    />
                  )}
                </div>
                <div className="w-full md:w-2/3">
                  <div className="flex items-center gap-4 mb-2">
                    {blog.categories.map(({ category }) => (
                      <span
                        key={category.id}
                        className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm"
                      >
                        {category.name}
                      </span>
                    ))}
                    <span className="text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Link href={`/blogs/${blog.slug}`}>
                    <h2 className="text-2xl font-bold mb-3 hover:text-red-500">
                      {blog.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600">{blog.excerpt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Categories</h2>
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between py-2 border-b border-gray-200"
              >
                <Link href={`/blogs/category/${category.slug}`}>
                  <span className="hover:text-red-500">{category.name}</span>
                </Link>
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                  {category._count.posts}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogsPage
