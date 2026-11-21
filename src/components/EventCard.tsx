import { CATEGORY_LABELS } from '@/lib/constants'
import type { EventWithParticipants } from '@/lib/events'

interface EventCardProps {
  event: EventWithParticipants
}

export function EventCard({ event }: EventCardProps) {
  const categoryLabel = CATEGORY_LABELS[event.category] ?? event.category
  const count = event.participants.length

  return (
    <article className="event-card" aria-labelledby={`event-${event.slug}`}>
      <div className="card-inner-frame">
        <div className="card-header">
          <span className="badge category-badge">{categoryLabel}</span>
          {event.division !== 'open' && (
            <span className="badge division-badge">{event.division.toUpperCase()}</span>
          )}
        </div>

        <h2 id={`event-${event.slug}`} className="card-event-name">
          {event.name}
        </h2>

        <div className="card-count-bar">
          <span className="count-label">BATTALION STRENGTH:</span>
          <span className="count-number">{count}</span>
        </div>

        <div className="card-participants">
          {count === 0 ? (
            <p className="no-participants">No participants yet</p>
          ) : (
            <ol className="names-list">
              {event.participants.map((participant, index) => (
                <li key={participant.id} className="name-item">
                  <span className="name-num">{String(index + 1).padStart(2, '0')}.</span>
                  <span className="name-text">{participant.full_name}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </article>
  )
}
