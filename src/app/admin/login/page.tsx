'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { loginAction } from '../actions'

export default function AdminLoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await loginAction(formData)
      if (result?.error) {
        setErrorMessage(result.error)
      }
    })
  }

  return (
    <main className="admin-login-layout">
      <div className="login-box">
        <div className="login-header">
          <span className="badge category-badge">RESTRICTED AREA</span>
          <h1 className="login-title">MARINES HEADQUARTERS</h1>
          <p className="login-subtitle">AUTHORIZED PERSONNEL ONLY</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label htmlFor="admin-email" className="field-label">
              Officer Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@marines.cite"
              className="text-input"
            />
          </div>

          <div className="form-field">
            <label htmlFor="admin-password" className="field-label">
              Security Cipher
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="text-input"
            />
          </div>

          {errorMessage && (
            <div className="form-error-banner" role="alert">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn-primary submit-btn"
          >
            {isPending ? 'AUTHENTICATING...' : 'ENTER HEADQUARTERS'}
          </button>
        </form>

        <div className="login-footer">
          <Link href="/" className="back-link">
            Back to Public Roster
          </Link>
        </div>
      </div>
    </main>
  )
}
