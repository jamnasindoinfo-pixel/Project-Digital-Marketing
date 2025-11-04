import { NextRequest, NextResponse } from 'next/server'
import { jwtUtils } from './jwt'

export async function verifyAdminAuth(request: NextRequest): Promise<{ user: any } | { error: string }> {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return { error: 'No authentication token provided' }
    }

    const payload = jwtUtils.verifyToken(token)

    if (!payload) {
      return { error: 'Invalid or expired token' }
    }

    if (payload.role !== 'admin') {
      return { error: 'Insufficient permissions' }
    }

    return {
      user: {
        id: payload.id,
        username: payload.username,
        role: payload.role
      }
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return { error: 'Authentication verification failed' }
  }
}

export function createUnauthorizedResponse(): NextResponse {
  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3009'))
}