import type { EventWithParticipants } from '@/lib/events'
import { EventRosterManager } from './EventRosterManager'

interface AdminHubProps {
  events: EventWithParticipants[]
}

export function AdminHub({ events }: AdminHubProps) {
  return (
    <div className="admin-hub-wrapper">
      <EventRosterManager events={events} />
    </div>
  )
}
