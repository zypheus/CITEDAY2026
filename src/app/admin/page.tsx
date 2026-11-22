import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { fetchEventsWithParticipants } from '@/lib/events'
import { VALID_EVENT_NAMES } from '@/lib/constants'
import { AdminHub } from '@/components/AdminHub'
import { logoutAction } from './actions'

/**
 * Static placeholder shown while the auth-gated dashboard streams in.
 * It must not read cookies, the clock, or any other uncached data, otherwise
 * the route loses its instant-navigation shell.
 */
function AdminDashboardLoading() {
  return (
    <main className="admin-dashboard-layout">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          minHeight: '60vh',
          padding: '3rem 1.25rem',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-oswald), sans-serif',
            fontSize: '1.1rem',
            fontStyle: 'italic',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'var(--tcg-gold)',
            textTransform: 'uppercase',
          }}
        >
          Marines HQ
        </span>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '0.9rem',
            color: 'var(--tcg-text-dim)',
          }}
        >
          Establishing secure uplink...
        </p>
      </div>
    </main>
  )
}

async function AdminDashboard() {
  // Auth-gated live dashboard: always render per request. Without this the
  // route is prerendered, and session/timestamp reads are not allowed there.
  await connection()

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch events with participants for live management
  const events = await fetchEventsWithParticipants()

  const totalParticipants = events.reduce(
    (sum, event) => sum + event.participants.length,
    0
  )

  // Get latest created_at timestamp
  const { data: latestParticipant } = await supabase
    .from('participants')
    .select('created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const lastUploadFormatted = latestParticipant?.created_at
    ? new Date(latestParticipant.created_at).toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'No uploads yet'

  return (
    <main className="admin-dashboard-layout">
      <header className="admin-topbar">
        <div className="admin-branding">
          <span className="login-badge">COMMAND POST // LEVEL 4</span>
          <h1 className="admin-heading">MARINES HQ ADMINISTRATION</h1>
          <p className="admin-officer-info">Signed in as: {user.email}</p>
        </div>
        <div className="admin-topbar-actions">
          <Link href="/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            View Public Roster
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="btn-secondary btn-danger-hover">
              Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* Metrics Row */}
      <section className="metrics-grid" aria-label="Roster metrics">
        <div className="metric-card">
          <span className="metric-label">TOTAL ENLISTED MARINES</span>
          <span className="metric-value">{totalParticipants}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">LAST ROSTER DEPLOYMENT</span>
          <span className="metric-value metric-date">{lastUploadFormatted}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">ACTIVE OPERATIONS</span>
          <span className="metric-value">{events.length} Events</span>
        </div>
      </section>

      {/* Interactive Admin Hub (per-event roster manager) */}
      <AdminHub events={events} />

      {/* Reference Section: Valid Event Names */}
      <section className="events-reference-card" aria-labelledby="reference-title">
        <h3 id="reference-title" className="reference-title">
          OFFICIAL EVENT OPERATIONS DIRECTORY
        </h3>
        <p className="reference-desc">
          These are the {events.length} official event titles. Pick one from the dropdown above to manage its roster.
        </p>
        <ul className="reference-events-grid">
          {VALID_EVENT_NAMES.map((name, i) => (
            <li key={name} className="reference-event-item">
              <span className="event-num">{String(i + 1).padStart(2, '0')}.</span> {name}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default function AdminDashboardPage() {
  // Keep the uncached auth/data reads inside a Suspense boundary so the route
  // keeps a prerendered shell and navigations to /admin stay instant.
  return (
    <Suspense fallback={<AdminDashboardLoading />}>
      <AdminDashboard />
    </Suspense>
  )
}
