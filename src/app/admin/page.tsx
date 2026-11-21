import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { VALID_EVENT_NAMES } from '@/lib/constants'
import { CsvUploader } from '@/components/CsvUploader'
import { logoutAction } from './actions'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Get total count of participants
  const { count: totalParticipants } = await supabase
    .from('participants')
    .select('*', { count: 'exact', head: true })

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
          <span className="badge category-badge">COMMAND POST</span>
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
          <span className="metric-value">{totalParticipants ?? 0}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">LAST ROSTER DEPLOYMENT</span>
          <span className="metric-value metric-date">{lastUploadFormatted}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">ACTIVE OPERATIONS</span>
          <span className="metric-value">21 Events</span>
        </div>
      </section>

      {/* CSV Uploader */}
      <CsvUploader />

      {/* Reference Section: Valid Event Names */}
      <section className="events-reference-card" aria-labelledby="reference-title">
        <h3 id="reference-title" className="reference-title">
          OFFICIAL EVENT OPERATIONS DIRECTORY
        </h3>
        <p className="reference-desc">
          When authoring CSV manifests, the event column must match one of these 21 official titles:
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
