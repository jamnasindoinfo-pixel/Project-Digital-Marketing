import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '24h'

export interface JWTPayload {
  id: string
  username: string
  role: string
}

export const jwtUtils = {
  generateToken: (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  },

  verifyToken: (token: string): JWTPayload | null => {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch (error) {
      return null
    }
  },

  hashPassword: async (password: string): Promise<string> => {
    return bcrypt.hash(password, 12)
  },

  comparePassword: async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword)
  }
}

// Default admin credentials (in production, store these in a database)
export const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123', // This will be hashed on first run
  name: 'Administrator',
  role: 'admin'
}

export const getHashedAdminPassword = (): string => {
  // In production, this should be stored securely in a database
  // For demo purposes, we'll use a pre-hashed password
  return '$2b$12$SpRRERy8TfYHi.S0SomO0O7eFbATDn2B/UcWhEskaNEhw3K6GWTYW' // Hash of "admin123"
}