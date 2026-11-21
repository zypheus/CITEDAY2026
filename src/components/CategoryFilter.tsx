'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { CATEGORY_LABELS } from '@/lib/constants'

export function CategoryFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') ?? ''

  function handleFilterClick(categoryKey: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryKey) {
      params.set('category', categoryKey)
    } else {
      params.delete('category')
    }
    const queryString = params.toString()
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
  }

  const filterOptions = [
    { key: '', label: 'All Units' },
    ...Object.entries(CATEGORY_LABELS).map(([key, label]) => ({ key, label })),
  ]

  return (
    <nav className="category-filter" aria-label="Event category filter">
      {filterOptions.map(({ key, label }) => {
        const isActive = currentCategory === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => handleFilterClick(key)}
            className={`filter-btn ${isActive ? 'filter-btn-active' : ''}`}
            aria-pressed={isActive}
          >
            {label}
          </button>
        )
      })}
    </nav>
  )
}
