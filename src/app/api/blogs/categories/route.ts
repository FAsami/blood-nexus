import { prismaClient } from '@/lib/prismaClient'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const categories = await prismaClient.blogCategory.findMany({
      select: {
        id: true,
        name: true
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
