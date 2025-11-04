import { NextRequest, NextResponse } from 'next/server'
import { jwtUtils } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      )
    }

    const payload = jwtUtils.verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    if (payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: payload.id,
        username: payload.username,
        name: 'Administrator',
        role: payload.role
      }
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Authentication verification failed' },
      { status: 500 }
    )
  }
}