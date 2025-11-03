'use client'

import React from 'react'
import { Button } from './button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} reset={this.reset} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-6">
            Maaf, terjadi kesalahan yang tidak terduga. Silakan refresh halaman atau coba lagi.
          </p>
          {error && process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="text-sm text-gray-500 cursor-pointer mb-2">
                Detail Error (Dev Mode)
              </summary>
              <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto text-red-600">
                {error.message}
              </pre>
            </details>
          )}
          <div className="space-y-3">
            <Button onClick={reset} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Coba Lagi
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
              Refresh Halaman
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Masih mengalami masalah?{' '}
            <a
              href="https://wa.me/628123456789"
              className="text-brand-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hubungi kami
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}