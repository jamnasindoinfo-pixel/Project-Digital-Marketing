import { NextRequest, NextResponse } from 'next/server'
import { blogApi } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category') || undefined
    const tag = searchParams.get('tag') || undefined
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') as 'draft' | 'published' | 'archived' | undefined

    const posts = await blogApi.getPosts({
      limit,
      offset,
      category,
      tag,
      search,
      status
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error in GET /api/blog/posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, content, excerpt, meta_title, meta_description, featured_image, category_id, status } = body

    // Validate required fields
    if (!title || !slug || !content || !category_id) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content, category_id' },
        { status: 400 }
      )
    }

    const post = await blogApi.createPost({
      title,
      slug,
      content,
      excerpt,
      meta_title,
      meta_description,
      featured_image,
      category_id,
      status: status || 'draft',
      author_id: 'anonymous', // TODO: Get from auth context
      published_at: status === 'published' ? new Date().toISOString() : undefined
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error in POST /api/blog/posts:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}