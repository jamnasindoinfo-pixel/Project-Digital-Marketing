import { NextRequest, NextResponse } from 'next/server'
import { jwtUtils, DEFAULT_ADMIN, getHashedAdminPassword } from '@/lib/jwt'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Check credentials (in production, use database)
    if (username !== DEFAULT_ADMIN.username) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await jwtUtils.comparePassword(password, getHashedAdminPassword())

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwtUtils.generateToken({
      id: '1',
      username: DEFAULT_ADMIN.username,
      role: DEFAULT_ADMIN.role
    })

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    })

    return NextResponse.json({
      success: true,
      user: {
        id: '1',
        username: DEFAULT_ADMIN.username,
        name: DEFAULT_ADMIN.name,
        role: DEFAULT_ADMIN.role
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    // Clear the token cookie
    const cookieStore = await cookies()
    cookieStore.delete('admin-token')

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}