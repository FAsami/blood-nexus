import { auth } from '@/auth'
import { prismaClient } from '@/lib/prismaClient'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const userWithRoles = await prismaClient.user.findUnique({
      where: { id: session.user.id },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    })

    const isAdmin = userWithRoles?.userRoles.some(
      (userRole) => userRole.role.name === 'ADMIN'
    )

    const blog = await prismaClient.blogPost.findUnique({
      where: {
        id: params.id
      }
    })

    if (!blog || (!isAdmin && blog.authorId !== session.user.id)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await prismaClient.blogPost.delete({
      where: {
        id: params.id
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const blog = await prismaClient.blogPost.findUnique({
      where: {
        id: params.id
      },
      include: {
        author: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    if (!blog) {
      return new NextResponse('Blog not found', { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error('Error fetching blog:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const existingBlog = await prismaClient.blogPost.findUnique({
      where: {
        id: params.id
      }
    })

    if (!existingBlog || existingBlog.authorId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { title, content, excerpt, featuredImage, published, categories } =
      body

    const updatedBlog = await prismaClient.blogPost.update({
      where: {
        id: params.id
      },
      data: {
        title,
        content,
        excerpt,
        featuredImage,
        published,
        ...(categories && {
          categories: {
            deleteMany: {},
            create: categories.map((categoryId: string) => ({
              categoryId
            }))
          }
        })
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

    return NextResponse.json(updatedBlog)
  } catch (error) {
    console.error('Error updating blog:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
