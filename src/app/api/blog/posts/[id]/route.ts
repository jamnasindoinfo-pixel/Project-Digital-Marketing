import { NextRequest, NextResponse } from 'next/server'
import { blogApi } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = await blogApi.getPostBySlug(id)

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error in GET /api/blog/posts/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, content, excerpt, meta_title, meta_description, featured_image, category_id, status } = body

    const updatedPost = await blogApi.updatePost(id, {
      title,
      content,
      excerpt,
      meta_title,
      meta_description,
      featured_image,
      category_id,
      status,
      published_at: status === 'published' && !body.published_at
        ? new Date().toISOString()
        : body.published_at
    })

    return NextResponse.json({ post: updatedPost })
  } catch (error) {
    console.error('Error in PUT /api/blog/posts/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await blogApi.deletePost(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/blog/posts/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}