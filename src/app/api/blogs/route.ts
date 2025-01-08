import { prismaClient } from '@/lib/prismaClient'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const blogPost = await prismaClient.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        featuredImage: body.featuredImage,
        published: body.published,
        authorId: session.user.id,
        categories: {
          create: body.categories.map((categoryId: string) => ({
            category: {
              connect: {
                id: categoryId
              }
            }
          }))
        }
      }
    })

    return NextResponse.json(blogPost)
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
