export const NAMES_PER_PAGE = 10

/** Prefix for per-event page params in the URL, e.g. `p-cheering=2`. */
export const PAGE_PARAM_PREFIX = 'p-'

export type SearchParamsRecord = Record<string, string | string[] | undefined>

export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export function pageParamKey(slug: string): string {
  return `${PAGE_PARAM_PREFIX}${slug}`
}

export function parsePageNumber(raw: string | string[] | undefined): number {
  const value = Number.parseInt(firstParam(raw) ?? '', 10)
  return Number.isFinite(value) && value > 0 ? value : 1
}

export interface PageSlice<T> {
  items: T[]
  page: number
  totalPages: number
  start: number
  end: number
}

export function pageSlice<T>(items: T[], requestedPage: number, perPage = NAMES_PER_PAGE): PageSlice<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage))
  const page = Math.min(Math.max(1, requestedPage), totalPages)
  const start = (page - 1) * perPage

  return {
    items: items.slice(start, start + perPage),
    page,
    totalPages,
    start,
    end: Math.min(start + perPage, items.length),
  }
}

/** Builds a `/` href with the given page applied for one event, keeping every other param. */
export function pageHref(
  searchParams: SearchParamsRecord,
  slug: string,
  page: number
): string {
  const params = new URLSearchParams()
  const currentKey = pageParamKey(slug)

  for (const [key, value] of Object.entries(searchParams)) {
    if (key === currentKey || value === undefined) continue
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item))
    } else {
      params.append(key, value)
    }
  }

  if (page > 1) {
    params.set(currentKey, String(page))
  }

  const queryString = params.toString()
  return queryString ? `/?${queryString}` : '/'
}

/** Drops every per-event page param so a new filter or search starts on page 1. */
export function clearPageParams(params: URLSearchParams): void {
  Array.from(params.keys())
    .filter((key) => key.startsWith(PAGE_PARAM_PREFIX))
    .forEach((key) => params.delete(key))
}
