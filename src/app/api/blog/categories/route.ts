import { NextRequest, NextResponse } from 'next/server'
import { blogApi } from '@/lib/supabase'

export async function GET() {
  try {
    const categories = await blogApi.getCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error in GET /api/blog/categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, meta_title, meta_description } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug' },
        { status: 400 }
      )
    }

    const category = await blogApi.createCategory({
      name,
      slug,
      description,
      meta_title,
      meta_description
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error in POST /api/blog/categories:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}