import Papa from 'papaparse'

export type ValidRow = {
  event_slug: string
  event_name: string
  full_name: string
}

export type ErrorRow = {
  line: number
  event: string
  name: string
  reason: string
}

export type ParseResult = {
  validRows: ValidRow[]
  errorRows: ErrorRow[]
  countsByEvent: Record<string, number>
}

const EVENT_DEFINITIONS: Array<{ slug: string; name: string; aliases: string[] }> = [
  { slug: 'cheering', name: 'Cheering', aliases: ['cheering'] },
  { slug: 'street-dance', name: 'Street Dance', aliases: ['street dance', 'street-dance'] },
  { slug: 'cosplay', name: 'Cosplay', aliases: ['cosplay'] },
  { slug: 'tech-talk', name: 'Tech Talk', aliases: ['tech talk', 'tech-talk'] },
  { slug: 'start-up-pitching', name: 'Start Up Pitching', aliases: ['start up pitching', 'start-up-pitching', 'startup pitching'] },
  { slug: 'programming', name: 'Programming', aliases: ['programming'] },
  { slug: 'hackathon', name: 'Hackathon', aliases: ['hackathon'] },
  { slug: 'typing-master', name: 'Typing Master', aliases: ['typing master', 'typing-master'] },
  { slug: 'logo-making', name: 'Logo Making', aliases: ['logo making', 'logo-making'] },
  { slug: 'video-editing', name: 'Video Editing', aliases: ['video editing', 'video-editing'] },
  { slug: 'artistic-photography', name: 'Artistic Photography', aliases: ['artistic photography', 'artistic-photography', 'photography'] },
  { slug: 'mobile-legends-male', name: 'Mobile Legends (Male)', aliases: ['mobile legends (male)', 'mobile legends male', 'mobile-legends-male', 'mlbb male', 'ml male'] },
  { slug: 'mobile-legends-female', name: 'Mobile Legends (Female)', aliases: ['mobile legends (female)', 'mobile legends female', 'mobile-legends-female', 'mlbb female', 'ml female'] },
  { slug: 'codm-male', name: 'CODM (Male)', aliases: ['codm (male)', 'codm male', 'codm-male', 'call of duty mobile male'] },
  { slug: 'codm-female', name: 'CODM (Female)', aliases: ['codm (female)', 'codm female', 'codm-female', 'call of duty mobile female'] },
  { slug: 'crossfire-mix', name: 'Crossfire (Mix)', aliases: ['crossfire (mix)', 'crossfire mix', 'crossfire-mix', 'crossfire'] },
  { slug: 'block-blast', name: 'Block Blast', aliases: ['block blast', 'block-blast'] },
  { slug: 'amazing-race', name: 'Amazing Race', aliases: ['amazing race', 'amazing-race'] },
  { slug: 'squid-game', name: 'Squid Game', aliases: ['squid game', 'squid-game'] },
  { slug: 'sack-race', name: 'Sack Race', aliases: ['sack race', 'sack-race'] },
  { slug: 'big-volleyball', name: 'Big Volleyball', aliases: ['big volleyball', 'big-volleyball', 'volleyball'] },
]

const EVENT_LOOKUP = new Map<string, { slug: string; name: string }>()

EVENT_DEFINITIONS.forEach((def) => {
  EVENT_LOOKUP.set(def.slug.toLowerCase(), { slug: def.slug, name: def.name })
  EVENT_LOOKUP.set(def.name.toLowerCase(), { slug: def.slug, name: def.name })
  def.aliases.forEach((alias) => {
    EVENT_LOOKUP.set(alias.toLowerCase(), { slug: def.slug, name: def.name })
  })
})

export function normalizeSpaces(str: string): string {
  return str.replace(/\s+/g, ' ').trim()
}

export function parseCSV(csvText: string): ParseResult {
  // Strip UTF-8 Byte Order Mark (BOM) if present
  const cleanedText = csvText.replace(/^\uFEFF/, '')

  const parsed = Papa.parse<Record<string, string>>(cleanedText, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header: string) => header.trim().toLowerCase(),
  })

  const validRows: ValidRow[] = []
  const errorRows: ErrorRow[] = []
  const seen = new Set<string>()
  const countsByEvent: Record<string, number> = {}

  parsed.data.forEach((row, index) => {
    const lineNumber = index + 2 // 1-based, accounts for header row
    const rawEvent = (row['event'] ?? row['event_name'] ?? row['event name'] ?? '').trim()
    const rawName = normalizeSpaces(row['name'] ?? row['participant'] ?? row['full_name'] ?? row['full name'] ?? '')

    // Skip entirely empty row
    if (!rawEvent && !rawName) {
      return
    }

    if (!rawEvent) {
      errorRows.push({
        line: lineNumber,
        event: '',
        name: rawName,
        reason: 'Event column is empty',
      })
      return
    }

    if (!rawName) {
      errorRows.push({
        line: lineNumber,
        event: rawEvent,
        name: '',
        reason: 'Participant name is empty',
      })
      return
    }

    const matched = EVENT_LOOKUP.get(rawEvent.toLowerCase())
    if (!matched) {
      errorRows.push({
        line: lineNumber,
        event: rawEvent,
        name: rawName,
        reason: `Unknown event: "${rawEvent}"`,
      })
      return
    }

    const dedupeKey = `${matched.slug}::${rawName.toLowerCase()}`
    if (seen.has(dedupeKey)) {
      return // duplicate within CSV, safely collapsed
    }
    seen.add(dedupeKey)

    validRows.push({
      event_slug: matched.slug,
      event_name: matched.name,
      full_name: rawName,
    })

    countsByEvent[matched.name] = (countsByEvent[matched.name] ?? 0) + 1
  })

  return {
    validRows,
    errorRows,
    countsByEvent,
  }
}
