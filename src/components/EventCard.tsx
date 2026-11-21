import { CATEGORY_LABELS } from '@/lib/constants'
import type { EventWithParticipants } from '@/lib/events'
import {
  pageParamKey,
  pageSlice,
  parsePageNumber,
  type SearchParamsRecord,
} from '@/lib/pagination'
import { CardPager } from './CardPager'

interface EventCardProps {
  event: EventWithParticipants
  searchParams: SearchParamsRecord
}

export function EventCard({ event, searchParams }: EventCardProps) {
  const categoryLabel = CATEGORY_LABELS[event.category] ?? event.category
  const count = event.participants.length
  const badgeClass = `badge badge-${event.category}`
  const eventCode = `OP-${String(event.sort_order).padStart(2, '0')}`

  const { items, page, totalPages, start, end } = pageSlice(
    event.participants,
    parsePageNumber(searchParams[pageParamKey(event.slug)])
  )

  return (
    <article className="event-card" aria-labelledby={`event-${event.slug}`}>
      {/* Top Card Bar: Attribute Badge & Power Medallion */}
      <div className="card-header-bar">
        <div className="card-tags">
          <span className={badgeClass}>{categoryLabel}</span>
          {event.division !== 'open' && (
            <span className="badge badge-division">{event.division.toUpperCase()}</span>
          )}
        </div>

        <div className="power-medallion" title={`Battalion Power: ${count}`}>
          <span className="power-label">PWR</span>
          <span className="power-value">{count}</span>
        </div>
      </div>

      {/* Event Title */}
      <h2 id={`event-${event.slug}`} className="card-event-name">
        {event.name}
      </h2>

      {/* Roster Well */}
      <div className="card-roster-well">
        <div className="roster-header">
          <span>ENLISTED MARINES ({count})</span>
        </div>

        {count === 0 ? (
          <p className="no-participants">No participants yet</p>
        ) : (
          <ol className="names-list">
            {items.map((participant, index) => (
              <li key={participant.id} className="name-item">
                <span className="name-num">{String(start + index + 1).padStart(2, '0')}</span>
                <span className="name-text">{participant.full_name}</span>
              </li>
            ))}
          </ol>
        )}

        <CardPager
          slug={event.slug}
          eventName={event.name}
          page={page}
          totalPages={totalPages}
          start={start}
          end={end}
          total={count}
          searchParams={searchParams}
        />
      </div>

      {/* Card Foot Code */}
      <div className="card-foot-code">
        <span>{eventCode}</span>
        <span>MARINES BATTALION</span>
      </div>
    </article>
  )
}
