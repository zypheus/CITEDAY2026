'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'

export function SearchBox() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const currentSearch = searchParams.get('search') ?? ''

  function handleChange(term: string) {
    const params = new URLSearchParams(searchParams.toString())
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
      <label htmlFor="search-input" className="sr-only">
        Search Marines by name
      </label>
      <input
        id="search-input"
        type="search"
        defaultValue={currentSearch}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search Marine or Event..."
        className="search-input"
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  )
}
