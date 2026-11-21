'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ValidRow } from '@/lib/csv'

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect('/admin')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export async function addSingleParticipantAction(eventId: string, fullName: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized: Admin session required.' }
  }

  const cleanName = fullName.replace(/\s+/g, ' ').trim()
  if (!cleanName) {
    return { error: 'Participant name cannot be empty.' }
  }

  const { error } = await supabase
    .from('participants')
    .insert({ event_id: eventId, full_name: cleanName })

  if (error) {
    if (error.code === '23505') {
      return { error: `"${cleanName}" is already enrolled in this event.` }
    }
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteParticipantAction(participantId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized: Admin session required.' }
  }

  const { error } = await supabase
    .from('participants')
    .delete()
    .eq('id', participantId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

export async function updateEventRosterAction(
  eventId: string,
  rawNames: string[],
  mode: 'append' | 'replace'
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized: Admin session required.' }
  }

  const cleanNames = Array.from(
    new Set(
      rawNames
        .map((name) => name.replace(/\s+/g, ' ').trim())
        .filter((name) => name.length > 0)
    )
  )

  if (cleanNames.length === 0) {
    return { error: 'No valid participant names found.' }
  }

  if (mode === 'replace') {
    const { error: deleteError } = await supabase
      .from('participants')
      .delete()
      .eq('event_id', eventId)

    if (deleteError) {
      return { error: deleteError.message }
    }
  }

  const insertPayload = cleanNames.map((name) => ({
    event_id: eventId,
    full_name: name,
  }))

  const { error: insertError } = await supabase
    .from('participants')
    .upsert(insertPayload, { onConflict: 'event_id,full_name', ignoreDuplicates: true })

  if (insertError) {
    return { error: insertError.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true, count: cleanNames.length }
}

export async function uploadRosterAction(rowsJson: string): Promise<{ success: boolean; count?: number; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized: Admin session required.' }
  }

  let rows: ValidRow[]
  try {
    rows = JSON.parse(rowsJson) as ValidRow[]
  } catch {
    return { success: false, error: 'Malformed JSON payload.' }
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    return { success: false, error: 'No valid rows provided for import.' }
  }

  // Server-side validation against actual events in database
  const { data: dbEvents, error: eventsError } = await supabase
    .from('events')
    .select('id, slug, name')

  if (eventsError || !dbEvents) {
    return { success: false, error: 'Failed to verify events in database.' }
  }

  const validEventKeys = new Set<string>()
  dbEvents.forEach((e) => {
    validEventKeys.add(e.slug.toLowerCase().trim())
    validEventKeys.add(e.name.toLowerCase().trim())
  })

  const validatedRows: ValidRow[] = []
  const dedupeSet = new Set<string>()

  for (const row of rows) {
    const rawName = String(row.full_name ?? '').replace(/\s+/g, ' ').trim()
    const slugKey = String(row.event_slug ?? '').toLowerCase().trim()
    const nameKey = String(row.event_name ?? '').toLowerCase().trim()

    if (!rawName) continue
    if (!validEventKeys.has(slugKey) && !validEventKeys.has(nameKey)) continue

    const dedupeKey = `${slugKey}::${rawName.toLowerCase()}`
    if (dedupeSet.has(dedupeKey)) continue
    dedupeSet.add(dedupeKey)

    validatedRows.push({
      event_slug: row.event_slug,
      event_name: row.event_name,
      full_name: rawName,
    })
  }

  if (validatedRows.length === 0) {
    return { success: false, error: 'Zero valid rows remained after server validation.' }
  }

  const { error: rpcError } = await supabase.rpc('replace_roster', {
    rows: validatedRows,
  })

  if (rpcError) {
    return { success: false, error: rpcError.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true, count: validatedRows.length }
}
