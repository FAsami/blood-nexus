import { prismaClient } from '@/lib/prismaClient'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { format } from 'date-fns'

interface BlogPageProps {
  params: {
    slug: string
  }
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await prismaClient.blogPost.findMany({
    select: { slug: true }
  })
  return posts.map((post) => ({ slug: post.slug }))
}

// Generate metadata for SEO
export async function generateMetadata({
  params
}: BlogPageProps): Promise<Metadata> {
  const blog = await prismaClient.blogPost.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      excerpt: true,
      featuredImage: true
    }
  })

  if (!blog) return { title: 'Blog Not Found' }

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: blog.featuredImage
      ? {
          images: [{ url: blog.featuredImage }]
        }
      : undefined
  }
}

const BlogPage = async ({ params }: BlogPageProps) => {
  const blog = await prismaClient.blogPost.findUnique({
    where: {
      slug: params.slug,
      published: true
    },
    include: {
      author: {
        select: {
          name: true,
          image: true
        }
      },
      categories: {
        include: {
          category: true
        }
      }
    }
  })

  if (!blog) {
    notFound()
  }

  // Get related posts from the same categories
  const relatedPosts = await prismaClient.blogPost.findMany({
    where: {
      published: true,
      id: { not: blog.id },
      categories: {
        some: {
          categoryId: {
            in: blog.categories.map((cat) => cat.categoryId)
          }
        }
      }
    },
    include: {
      author: {
        select: { name: true }
      }
    },
    take: 3
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Featured Image */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        {blog.featuredImage ? (
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-red-500 to-red-600" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            {/* Author and Meta Info */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
              {blog.author.image && (
                <Image
                  src={blog.author.image}
                  alt={blog.author.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{blog.author.name}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.categories.map(({ category }) => (
                <Link
                  key={category.id}
                  href={`/blogs/category/${category.slug}`}
                  className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm hover:bg-red-100 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Blog Content */}
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Related Posts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Related Posts</h2>
              <div className="space-y-4">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blogs/${post.slug}`}
                    className="block group"
                  >
                    <div className="relative h-40 mb-2">
                      {post.featuredImage && (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="rounded object-cover"
                        />
                      )}
                    </div>
                    <h3 className="font-medium group-hover:text-red-500 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      By {post.author.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default BlogPage
