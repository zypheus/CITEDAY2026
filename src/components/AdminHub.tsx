'use client'

import { useState } from 'react'
import type { EventWithParticipants } from '@/lib/events'
import { EventRosterManager } from './EventRosterManager'
import { CsvUploader } from './CsvUploader'

interface AdminHubProps {
  events: EventWithParticipants[]
}

export function AdminHub({ events }: AdminHubProps) {
  const [activeTab, setActiveTab] = useState<'per-event' | 'master-csv'>('per-event')

  return (
    <div className="admin-hub-wrapper">
      <div className="hub-mode-selector" role="tablist" aria-label="Management Mode">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'per-event'}
          onClick={() => setActiveTab('per-event')}
          className={`hub-mode-btn ${activeTab === 'per-event' ? 'hub-mode-active' : ''}`}
        >
          1. MANAGE BY EVENT (MANUAL / BULK / CSV)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'master-csv'}
          onClick={() => setActiveTab('master-csv')}
          className={`hub-mode-btn ${activeTab === 'master-csv' ? 'hub-mode-active' : ''}`}
        >
          2. MASTER ALL-IN-ONE CSV UPLOADER
        </button>
      </div>

      {activeTab === 'per-event' ? (
        <EventRosterManager events={events} />
      ) : (
        <CsvUploader />
      )}
    </div>
  )
}
