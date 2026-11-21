import { createClient } from './supabase/server'
import { CATEGORY_LABELS } from './constants'

export { CATEGORY_LABELS }

export type Participant = {
  id: string
  full_name: string
  created_at?: string
}

export type EventWithParticipants = {
  id: string
  slug: string
  name: string
  category: string
  division: string
  sort_order: number
  participants: Participant[]
}

export async function fetchEventsWithParticipants(): Promise<EventWithParticipants[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('id, slug, name, category, division, sort_order, participants(id, full_name, created_at)')
    .order('sort_order', { ascending: true })
    .order('full_name', { referencedTable: 'participants', ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as EventWithParticipants[]
}
