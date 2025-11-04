import { NextRequest, NextResponse } from 'next/server'
import { blogApi } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const posts = await blogApi.searchPosts(query)

    return NextResponse.json({
      posts,
      query,
      total: posts.length
    })
  } catch (error) {
    console.error('Error in GET /api/blog/search:', error)
    return NextResponse.json(
      { error: 'Failed to search posts' },
      { status: 500 }
    )
  }
}