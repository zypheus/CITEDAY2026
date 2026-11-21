import { CATEGORY_LABELS } from '@/lib/constants'
import type { EventWithParticipants } from '@/lib/events'

interface EventCardProps {
  event: EventWithParticipants
}

export function EventCard({ event }: EventCardProps) {
  const categoryLabel = CATEGORY_LABELS[event.category] ?? event.category
  const count = event.participants.length
  const badgeClass = `badge badge-${event.category}`
  const eventCode = `OP-${String(event.sort_order).padStart(2, '0')}`

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
            {event.participants.map((participant, index) => (
              <li key={participant.id} className="name-item">
                <span className="name-num">{String(index + 1).padStart(2, '0')}</span>
                <span className="name-text">{participant.full_name}</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Card Foot Code */}
      <div className="card-foot-code">
        <span>{eventCode}</span>
        <span>MARINES BATTALION</span>
      </div>
    </article>
  )
}
