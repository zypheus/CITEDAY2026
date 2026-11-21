'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Fleet Communication Error:', error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0B1F3A',
        color: '#F4EFE0',
        padding: '2rem',
        textAlign: 'center',
        gap: '1.25rem',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-press-start), monospace',
          fontSize: '1rem',
          color: '#C8312B',
          lineHeight: '1.4',
        }}
      >
        COMMUNICATION JAMMED: ERROR ENCOUNTERED
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-vt323), monospace',
          fontSize: '1.4rem',
          maxWidth: '600px',
          color: '#E8D9B0',
        }}
      >
        {error.message || 'An unexpected disturbance disrupted headquarters communications.'}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="btn-primary"
      >
        RE-ESTABLISH LINK
      </button>
    </div>
  )
}
