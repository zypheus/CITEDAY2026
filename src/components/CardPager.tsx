import Link from 'next/link'
import { pageHref, type SearchParamsRecord } from '@/lib/pagination'

interface CardPagerProps {
  slug: string
  eventName: string
  page: number
  totalPages: number
  start: number
  end: number
  total: number
  searchParams: SearchParamsRecord
}

export function CardPager({
  slug,
  eventName,
  page,
  totalPages,
  start,
  end,
  total,
  searchParams,
}: CardPagerProps) {
  if (totalPages <= 1) {
    return null
  }

  const hasPrev = page > 1
  const hasNext = page < totalPages

  return (
    <nav className="card-pager" aria-label={`${eventName} roster pages`}>
      <span className="pager-range">
        {start + 1}-{end} of {total}
      </span>

      <div className="pager-controls">
        {hasPrev ? (
          <Link
            href={pageHref(searchParams, slug, page - 1)}
            scroll={false}
            rel="prev"
            className="pager-btn"
            aria-label={`Previous page of ${eventName}`}
          >
            Prev
          </Link>
        ) : (
          <span className="pager-btn pager-btn-disabled" aria-hidden="true">
            Prev
          </span>
        )}

        <span className="pager-status">
          {page} / {totalPages}
        </span>

        {hasNext ? (
          <Link
            href={pageHref(searchParams, slug, page + 1)}
            scroll={false}
            rel="next"
            className="pager-btn"
            aria-label={`Next page of ${eventName}`}
          >
            Next
          </Link>
        ) : (
          <span className="pager-btn pager-btn-disabled" aria-hidden="true">
            Next
          </span>
        )}
      </div>
    </nav>
  )
}
