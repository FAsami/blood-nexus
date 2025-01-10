import { prismaClient } from '@/lib/prismaClient'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export async function generateStaticParams() {
  const categories = await prismaClient.blogCategory.findMany({
    select: { slug: true }
  })
  return categories.map((category) => ({ slug: category.slug }))
}

const CategoryPage = async ({ params }: { params: { slug: string } }) => {
  const category = await prismaClient.blogCategory.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        include: {
          post: {
            include: {
              author: {
                select: { name: true }
              }
            }
          }
        }
      }
    }
  })

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>
      <div className="grid gap-8">
        {category.posts.map(({ post }) => (
          <div key={post.id} className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              {post.featuredImage && (
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={300}
                  height={200}
                  className="rounded-lg object-cover w-full h-[200px]"
                />
              )}
            </div>
            <div className="w-full md:w-2/3">
              <Link href={`/blogs/${post.slug}`}>
                <h2 className="text-2xl font-bold mb-3 hover:text-red-500">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{post.author.name}</span>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryPage
