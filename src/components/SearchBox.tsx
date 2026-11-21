'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { clearPageParams } from '@/lib/pagination'

export function SearchBox() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const currentSearch = searchParams.get('search') ?? ''

  function handleChange(term: string) {
    const params = new URLSearchParams(searchParams.toString())
    clearPageParams(params)
    if (term.trim()) {
      params.set('search', term.trim())
    } else {
      params.delete('search')
    }
    startTransition(() => {
      const queryString = params.toString()
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    })
  }

  return (
    <div className="search-container">
      <div className="search-icon-wrap" aria-hidden="true">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <label htmlFor="search-input" className="sr-only">
        Search Marines by name or event
      </label>
      <input
        id="search-input"
        type="search"
        defaultValue={currentSearch}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="SEARCH MARINE OR OPERATION..."
        className="search-input"
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  )
}
