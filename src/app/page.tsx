import { Suspense } from 'react'
import { connection } from 'next/server'
import Link from 'next/link'
import { fetchEventsWithParticipants } from '@/lib/events'
import { CATEGORY_LABELS } from '@/lib/constants'
import { Hero } from '@/components/Hero'
import { EventCard } from '@/components/EventCard'
import { CategoryFilter } from '@/components/CategoryFilter'
import { SearchBox } from '@/components/SearchBox'
import { firstParam, type SearchParamsRecord } from '@/lib/pagination'

interface PageProps {
  searchParams: Promise<SearchParamsRecord>
}

export default async function HomePage({ searchParams }: PageProps) {
  // The roster is live data and the Supabase client reads the session cookie,
  // so render per request instead of baking a timestamp into a prerender.
  await connection()

  const params = await searchParams
  const category = firstParam(params.category)
  const search = firstParam(params.search)
  const allEvents = await fetchEventsWithParticipants()

  const totalParticipants = allEvents.reduce(
    (sum, event) => sum + event.participants.length,
    0
  )

  let filteredEvents = allEvents

  // Filter by category if specified
  if (category && Object.keys(CATEGORY_LABELS).includes(category)) {
    filteredEvents = filteredEvents.filter((event) => event.category === category)
  }

  // Filter by search query if provided
  if (search && search.trim()) {
    const query = search.trim().toLowerCase()
    filteredEvents = filteredEvents.filter((event) => {
      const matchesEventName = event.name.toLowerCase().includes(query)
      const matchesParticipant = event.participants.some((p) =>
        p.full_name.toLowerCase().includes(query)
      )
      return matchesEventName || matchesParticipant
    })
  }

  return (
    <div className="site-wrapper">
      <Hero totalParticipants={totalParticipants} />

      <div className="wave-divider" aria-hidden="true" />

      <main className="roster-main-container">
        <div className="controls-bar">
          <Suspense fallback={<div className="filter-fallback">Loading units...</div>}>
            <CategoryFilter />
          </Suspense>

          <Suspense fallback={<div className="search-fallback">Search...</div>}>
            <SearchBox />
          </Suspense>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="no-results-box" role="status">
            <p className="no-results-title">NO MATCHING SQUADS FOUND</p>
            <p className="no-results-desc">
              Try adjusting your category filter or search query.
            </p>
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} searchParams={params} />
            ))}
          </div>
        )}
      </main>

      <footer className="site-footer">
        <p className="footer-title">CITE DAY 2026: TEAM MARINES HEADQUARTERS</p>
        <p className="footer-tagline">ABSOLUTE JUSTICE: UNITED WE CONQUER</p>
        <Link href="/admin/login" className="admin-link">
          Admin Login
        </Link>
      </footer>
    </div>
  )
}
